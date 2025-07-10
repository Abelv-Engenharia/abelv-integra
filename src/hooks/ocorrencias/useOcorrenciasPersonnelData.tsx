
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "../useUserCCAs";

export const useOcorrenciasPersonnelData = () => {
  const { data: userCCAs = [] } = useUserCCAs();
  const allowedCcaIds = userCCAs.map(cca => cca.id);

  // Empresas com CCAs
  const { data: allEmpresas = [] } = useQuery({
    queryKey: ['empresas-ccas-ocorrencias', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) return [];
      
      const { data } = await supabase
        .from('empresa_ccas')
        .select(`
          empresa_id,
          cca_id,
          empresas!inner(id, nome, cnpj, ativo)
        `)
        .eq('empresas.ativo', true)
        .in('cca_id', allowedCcaIds);
      
      console.log('Empresas filtradas por CCA:', data);
      return data || [];
    },
    enabled: allowedCcaIds.length > 0,
  });

  // Engenheiros com CCAs
  const { data: allEngenheiros = [] } = useQuery({
    queryKey: ['engenheiros-ccas-ocorrencias', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) return [];
      
      const { data } = await supabase
        .from('engenheiro_ccas')
        .select(`
          engenheiro_id,
          cca_id,
          engenheiros!inner(id, nome, funcao, matricula, email, ativo)
        `)
        .eq('engenheiros.ativo', true)
        .in('cca_id', allowedCcaIds);
      
      console.log('Engenheiros filtrados por CCA:', data);
      return data || [];
    },
    enabled: allowedCcaIds.length > 0,
  });

  // Supervisores com CCAs
  const { data: allSupervisores = [] } = useQuery({
    queryKey: ['supervisores-ccas-ocorrencias', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) return [];
      
      const { data } = await supabase
        .from('supervisor_ccas')
        .select(`
          supervisor_id,
          cca_id,
          supervisores!inner(id, nome, funcao, matricula, email, ativo)
        `)
        .eq('supervisores.ativo', true)
        .in('cca_id', allowedCcaIds);
      
      console.log('Supervisores filtrados por CCA:', data);
      return data || [];
    },
    enabled: allowedCcaIds.length > 0,
  });

  // Encarregados com CCAs
  const { data: allEncarregados = [] } = useQuery({
    queryKey: ['encarregados-ccas-ocorrencias', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) return [];
      
      const { data } = await supabase
        .from('encarregado_ccas')
        .select(`
          encarregado_id,
          cca_id,
          encarregados!inner(id, nome, funcao, matricula, email, ativo)
        `)
        .eq('encarregados.ativo', true)
        .in('cca_id', allowedCcaIds);
      
      console.log('Encarregados filtrados por CCA:', data);
      return data || [];
    },
    enabled: allowedCcaIds.length > 0,
  });

  // Funcionários com CCAs através da nova tabela de relacionamento
  const { data: allFuncionarios = [] } = useQuery({
    queryKey: ['funcionarios-ocorrencias', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) return [];
      
      const { data } = await supabase
        .from('funcionario_ccas')
        .select(`
          funcionario_id,
          cca_id,
          funcionarios!inner(id, nome, funcao, matricula, ativo)
        `)
        .eq('funcionarios.ativo', true)
        .in('cca_id', allowedCcaIds);
      
      console.log('Funcionários filtrados por CCA:', data);
      return data || [];
    },
    enabled: allowedCcaIds.length > 0,
  });

  return {
    allEmpresas,
    allEngenheiros,
    allSupervisores,
    allEncarregados,
    allFuncionarios,
  };
};
