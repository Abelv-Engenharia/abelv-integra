
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOcorrenciasFormData = () => {
  // CCAs
  const { data: ccas = [] } = useQuery({
    queryKey: ['ccas-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('codigo');
      return data || [];
    },
  });

  // Empresas com CCAs
  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas-ccas-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('empresa_ccas')
        .select(`
          empresa_id,
          cca_id,
          empresas!inner(id, nome, cnpj, ativo),
          ccas!inner(id, codigo, nome)
        `)
        .eq('empresas.ativo', true)
        .order('empresas.nome');
      return data || [];
    },
  });

  // Disciplinas
  const { data: disciplinas = [] } = useQuery({
    queryKey: ['disciplinas-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('disciplinas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Engenheiros com CCAs
  const { data: engenheiros = [] } = useQuery({
    queryKey: ['engenheiros-ccas-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('engenheiro_ccas')
        .select(`
          engenheiro_id,
          cca_id,
          engenheiros!inner(id, nome, funcao, matricula, email, ativo),
          ccas!inner(id, codigo, nome)
        `)
        .eq('engenheiros.ativo', true)
        .order('engenheiros.nome');
      return data || [];
    },
  });

  // Supervisores com CCAs
  const { data: supervisores = [] } = useQuery({
    queryKey: ['supervisores-ccas-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('supervisor_ccas')
        .select(`
          supervisor_id,
          cca_id,
          supervisores!inner(id, nome, funcao, matricula, email, ativo),
          ccas!inner(id, codigo, nome)
        `)
        .eq('supervisores.ativo', true)
        .order('supervisores.nome');
      return data || [];
    },
  });

  // Encarregados
  const { data: encarregados = [] } = useQuery({
    queryKey: ['encarregados-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('encarregados')
        .select('id, nome, funcao, matricula, email, cca_id')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Funcionários
  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('funcionarios')
        .select('id, nome, funcao, matricula, cca_id')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Parte do corpo atingida
  const { data: partesCorpo = [] } = useQuery({
    queryKey: ['partes-corpo'],
    queryFn: async () => {
      const { data } = await supabase
        .from('parte_corpo_atingida')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Lateralidade
  const { data: lateralidades = [] } = useQuery({
    queryKey: ['lateralidades'],
    queryFn: async () => {
      const { data } = await supabase
        .from('lateralidade')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Agente causador
  const { data: agentesCausadores = [] } = useQuery({
    queryKey: ['agentes-causadores'],
    queryFn: async () => {
      const { data } = await supabase
        .from('agente_causador')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Situação geradora
  const { data: situacoesGeradoras = [] } = useQuery({
    queryKey: ['situacoes-geradoras'],
    queryFn: async () => {
      const { data } = await supabase
        .from('situacao_geradora')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Natureza da lesão
  const { data: naturezasLesao = [] } = useQuery({
    queryKey: ['naturezas-lesao'],
    queryFn: async () => {
      const { data } = await supabase
        .from('natureza_lesao')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  return {
    ccas,
    empresas,
    disciplinas,
    engenheiros,
    supervisores,
    encarregados,
    funcionarios,
    partesCorpo,
    lateralidades,
    agentesCausadores,
    situacoesGeradoras,
    naturezasLesao,
  };
};
