
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "./useUserCCAs";

export const useFormData = () => {
  const { user } = useAuth();
  const { data: userCCAs = [] } = useUserCCAs();

  // Buscar dados básicos que não dependem de CCA
  const { data: ccas = [] } = useQuery({
    queryKey: ['form-data-ccas'],
    queryFn: async () => {
      console.log('useFormData - Buscando todos os CCAs disponíveis para o usuário');
      
      // Se não tem CCAs, retorna array vazio
      if (!userCCAs || userCCAs.length === 0) {
        return [];
      }

      const ccaIds = userCCAs.map(cca => cca.id);
      console.log('useFormData - CCAs do usuário:', ccaIds.length, ccaIds.map(id => userCCAs.find(c => c.id === id)?.codigo).sort());

      const { data, error } = await supabase
        .from('ccas')
        .select('*')
        .in('id', ccaIds)
        .eq('ativo', true)
        .order('codigo', { ascending: true });

      if (error) {
        console.error("Erro ao buscar CCAs:", error);
        return [];
      }

      // Garantir ordenação por código
      const sortedData = (data || []).sort((a, b) => 
        a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
      );

      console.log('useFormData - CCAs ordenados:', sortedData.map(c => c.codigo));
      return sortedData;
    },
    enabled: !!user?.id && userCCAs.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Buscar empresas com relacionamento aos CCAs do usuário
  const { data: empresas = [] } = useQuery({
    queryKey: ['form-data-empresas', userCCAs.map(c => c.id)],
    queryFn: async () => {
      if (!userCCAs || userCCAs.length === 0) return [];
      
      const ccaIds = userCCAs.map(cca => cca.id);
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .in('cca_id', ccaIds)
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar empresas:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id && userCCAs.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar funcionários
  const { data: funcionarios = [] } = useQuery({
    queryKey: ['form-data-funcionarios', userCCAs.map(c => c.id)],
    queryFn: async () => {
      if (!userCCAs || userCCAs.length === 0) return [];
      
      const ccaIds = userCCAs.map(cca => cca.id);
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .in('cca_id', ccaIds)
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar funcionários:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id && userCCAs.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar disciplinas
  const { data: disciplinas = [] } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disciplinas')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar disciplinas:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  return {
    ccas,
    empresas,
    disciplinas,
    funcionarios
  };
};
