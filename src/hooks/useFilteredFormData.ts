
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "./useUserCCAs";

interface UseFilteredFormDataProps {
  selectedCcaId?: string;
}

export const useFilteredFormData = ({ selectedCcaId }: UseFilteredFormDataProps) => {
  const { data: userCCAs = [] } = useUserCCAs();

  // Buscar empresas filtradas por CCA
  const { data: empresas = [] } = useQuery({
    queryKey: ['filtered-empresas', selectedCcaId],
    queryFn: async () => {
      if (!selectedCcaId) return [];
      
      console.log('useFormData - Buscando empresas para CCA:', selectedCcaId);

      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('cca_id', parseInt(selectedCcaId))
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error("Erro ao buscar empresas:", error);
        return [];
      }

      console.log('useFormData - Empresas encontradas:', data?.length || 0);
      return data || [];
    },
    enabled: !!selectedCcaId,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar engenheiros filtrados por CCA
  const { data: engenheiros = [] } = useQuery({
    queryKey: ['filtered-engenheiros', selectedCcaId],
    queryFn: async () => {
      if (!selectedCcaId) return [];
      
      console.log('useFormData - Buscando engenheiros para CCA:', selectedCcaId);

      const { data, error } = await supabase
        .from('engenheiros')
        .select('*')
        .eq('cca_id', parseInt(selectedCcaId))
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error("Erro ao buscar engenheiros:", error);
        return [];
      }

      console.log('useFormData - Engenheiros encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!selectedCcaId,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar supervisores filtrados por CCA
  const { data: supervisores = [] } = useQuery({
    queryKey: ['filtered-supervisores', selectedCcaId],
    queryFn: async () => {
      if (!selectedCcaId) return [];
      
      console.log('useFormData - Buscando supervisores para CCA:', selectedCcaId);

      const { data, error } = await supabase
        .from('supervisores')
        .select('*')
        .eq('cca_id', parseInt(selectedCcaId))
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error("Erro ao buscar supervisores:", error);
        return [];
      }

      console.log('useFormData - Supervisores encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!selectedCcaId,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar encarregados filtrados por CCA
  const { data: encarregados = [] } = useQuery({
    queryKey: ['filtered-encarregados', selectedCcaId],
    queryFn: async () => {
      if (!selectedCcaId) return [];
      
      console.log('useFormData - Buscando encarregados para CCA:', selectedCcaId);

      const { data, error } = await supabase
        .from('encarregados')
        .select('*')
        .eq('cca_id', parseInt(selectedCcaId))
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error("Erro ao buscar encarregados:", error);
        return [];
      }

      console.log('useFormData - Encarregados encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!selectedCcaId,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar funcionários filtrados por CCA
  const { data: funcionarios = [] } = useQuery({
    queryKey: ['filtered-funcionarios', selectedCcaId],
    queryFn: async () => {
      if (!selectedCcaId) return [];
      
      console.log('useFormData - Buscando funcionários para CCA:', selectedCcaId);

      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('cca_id', parseInt(selectedCcaId))
        .eq('ativo', true)
        .order('nome');

      if (error) {
        console.error("Erro ao buscar funcionários:", error);
        return [];
      }

      console.log('useFormData - Funcionários encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!selectedCcaId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    empresas,
    engenheiros,
    supervisores,
    encarregados,
    funcionarios,
  };
};
