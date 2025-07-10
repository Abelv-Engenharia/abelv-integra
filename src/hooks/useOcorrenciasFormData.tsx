
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseOcorrenciasFormDataProps {
  selectedCcaId?: string;
}

export const useOcorrenciasFormData = ({ selectedCcaId }: UseOcorrenciasFormDataProps = {}) => {
  // Fetch CCAs
  const { data: ccas = [] } = useQuery({
    queryKey: ['ccas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('codigo');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch empresas
  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, nome, cnpj')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch disciplinas
  const { data: disciplinas = [] } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('disciplinas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch funcionarios
  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funcionarios')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          foto,
          ativo,
          cca_id,
          data_admissao
        `)
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch tipos de ocorrência
  const { data: tiposOcorrencia = [] } = useQuery({
    queryKey: ['tipos-ocorrencia'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipos_ocorrencia')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch tipos de evento
  const { data: tiposEvento = [] } = useQuery({
    queryKey: ['tipos-evento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipos_evento')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch classificações de ocorrência
  const { data: classificacoesOcorrencia = [] } = useQuery({
    queryKey: ['classificacoes-ocorrencia'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classificacoes_ocorrencia')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch partes do corpo
  const { data: partesCorpo = [] } = useQuery({
    queryKey: ['partes-corpo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parte_corpo_atingida')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch lateralidades
  const { data: lateralidades = [] } = useQuery({
    queryKey: ['lateralidades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lateralidade')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch agentes causadores
  const { data: agentesCausadores = [] } = useQuery({
    queryKey: ['agentes-causadores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agente_causador')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch situações geradoras
  const { data: situacoesGeradoras = [] } = useQuery({
    queryKey: ['situacoes-geradoras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('situacao_geradora')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch naturezas de lesão
  const { data: naturezasLesao = [] } = useQuery({
    queryKey: ['naturezas-lesao'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('natureza_lesao')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data || [];
    }
  });

  return {
    ccas,
    empresas,
    disciplinas,
    funcionarios,
    tiposOcorrencia,
    tiposEvento,
    classificacoesOcorrencia,
    partesCorpo,
    lateralidades,
    agentesCausadores,
    situacoesGeradoras,
    naturezasLesao
  };
};

