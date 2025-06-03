
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOcorrenciasPersonnelData = () => {
  // Empresas com CCAs
  const { data: allEmpresas = [] } = useQuery({
    queryKey: ['empresas-ccas-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('empresa_ccas')
        .select(`
          empresa_id,
          cca_id,
          empresas!inner(id, nome, cnpj, ativo)
        `)
        .eq('empresas.ativo', true);
      
      console.log('Raw empresas data from query:', data);
      return data || [];
    },
  });

  // Engenheiros com CCAs
  const { data: allEngenheiros = [] } = useQuery({
    queryKey: ['engenheiros-ccas-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('engenheiro_ccas')
        .select(`
          engenheiro_id,
          cca_id,
          engenheiros!inner(id, nome, funcao, matricula, email, ativo)
        `)
        .eq('engenheiros.ativo', true);
      
      console.log('Raw engenheiros data from query:', data);
      return data || [];
    },
  });

  // Supervisores com CCAs
  const { data: allSupervisores = [] } = useQuery({
    queryKey: ['supervisores-ccas-ocorrencias'],
    queryFn: async () => {
      const { data } = await supabase
        .from('supervisor_ccas')
        .select(`
          supervisor_id,
          cca_id,
          supervisores!inner(id, nome, funcao, matricula, email, ativo)
        `)
        .eq('supervisores.ativo', true);
      
      console.log('Raw supervisores data from query:', data);
      return data || [];
    },
  });

  // Encarregados
  const { data: allEncarregados = [] } = useQuery({
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
  const { data: allFuncionarios = [] } = useQuery({
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

  return {
    allEmpresas,
    allEngenheiros,
    allSupervisores,
    allEncarregados,
    allFuncionarios,
  };
};
