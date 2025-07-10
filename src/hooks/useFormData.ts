
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

  // Buscar engenheiros
  const { data: engenheiros = [] } = useQuery({
    queryKey: ['form-data-engenheiros', userCCAs.map(c => c.id)],
    queryFn: async () => {
      if (!userCCAs || userCCAs.length === 0) return [];
      
      const ccaIds = userCCAs.map(cca => cca.id);
      const { data, error } = await supabase
        .from('engenheiros')
        .select('*')
        .in('cca_id', ccaIds)
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar engenheiros:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id && userCCAs.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar supervisores
  const { data: supervisores = [] } = useQuery({
    queryKey: ['form-data-supervisores', userCCAs.map(c => c.id)],
    queryFn: async () => {
      if (!userCCAs || userCCAs.length === 0) return [];
      
      const ccaIds = userCCAs.map(cca => cca.id);
      const { data, error } = await supabase
        .from('supervisores')
        .select('*')
        .in('cca_id', ccaIds)
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar supervisores:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!user?.id && userCCAs.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Buscar encarregados
  const { data: encarregados = [] } = useQuery({
    queryKey: ['form-data-encarregados', userCCAs.map(c => c.id)],
    queryFn: async () => {
      if (!userCCAs || userCCAs.length === 0) return [];
      
      const ccaIds = userCCAs.map(cca => cca.id);
      const { data, error } = await supabase
        .from('encarregados')
        .select('*')
        .in('cca_id', ccaIds)
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar encarregados:", error);
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

  // Outros dados básicos
  const { data: tiposRegistro = [] } = useQuery({
    queryKey: ['tipos-registro'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipos_registro')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar tipos de registro:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: processos = [] } = useQuery({
    queryKey: ['processos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('processos')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar processos:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: eventosIdentificados = [] } = useQuery({
    queryKey: ['eventos-identificados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('eventos_identificados')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar eventos identificados:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: causasProvaveis = [] } = useQuery({
    queryKey: ['causas-provaveis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('causas_provaveis')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar causas prováveis:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

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

  const { data: baseLegalOpcoes = [] } = useQuery({
    queryKey: ['base-legal-opcoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('base_legal_opcoes')
        .select('*')
        .eq('ativo', true)
        .order('codigo');
      
      if (error) {
        console.error("Erro ao buscar opções de base legal:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  // Dados de classificação de risco
  const { data: exposicaoOpcoes = [] } = useQuery({
    queryKey: ['exposicao-opcoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exposicao_opcoes')
        .select('*')
        .eq('ativo', true)
        .order('valor');
      
      if (error) {
        console.error("Erro ao buscar opções de exposição:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: controleOpcoes = [] } = useQuery({
    queryKey: ['controle-opcoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('controle_opcoes')
        .select('*')
        .eq('ativo', true)
        .order('valor');
      
      if (error) {
        console.error("Erro ao buscar opções de controle:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: deteccaoOpcoes = [] } = useQuery({
    queryKey: ['deteccao-opcoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deteccao_opcoes')
        .select('*')
        .eq('ativo', true)
        .order('valor');
      
      if (error) {
        console.error("Erro ao buscar opções de detecção:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: efeitoFalhaOpcoes = [] } = useQuery({
    queryKey: ['efeito-falha-opcoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('efeito_falha_opcoes')
        .select('*')
        .eq('ativo', true)
        .order('valor');
      
      if (error) {
        console.error("Erro ao buscar opções de efeito falha:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: impactoOpcoes = [] } = useQuery({
    queryKey: ['impacto-opcoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('impacto_opcoes')
        .select('*')
        .eq('ativo', true)
        .order('valor');
      
      if (error) {
        console.error("Erro ao buscar opções de impacto:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  return {
    ccas,
    tiposRegistro,
    processos,
    eventosIdentificados,
    causasProvaveis,
    empresas,
    disciplinas,
    engenheiros,
    baseLegalOpcoes,
    supervisores,
    encarregados,
    funcionarios,
    exposicaoOpcoes,
    controleOpcoes,
    deteccaoOpcoes,
    efeitoFalhaOpcoes,
    impactoOpcoes,
  };
};
