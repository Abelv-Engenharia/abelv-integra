
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo } from "react";

interface UseOcorrenciasFormDataProps {
  selectedCcaId?: string;
}

export const useOcorrenciasFormData = ({ selectedCcaId }: UseOcorrenciasFormDataProps = {}) => {
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
  const { data: allEmpresas = [] } = useQuery({
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
  const { data: allEngenheiros = [] } = useQuery({
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
  const { data: allSupervisores = [] } = useQuery({
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

  // Filtrar dados baseado no CCA selecionado
  const filteredData = useMemo(() => {
    if (!selectedCcaId) {
      return {
        empresas: [],
        engenheiros: [],
        supervisores: [],
        encarregados: [],
        funcionarios: [],
      };
    }

    const ccaIdNumber = parseInt(selectedCcaId);

    console.log('Selected CCA ID:', ccaIdNumber);
    console.log('All empresas:', allEmpresas);
    console.log('All engenheiros:', allEngenheiros);
    console.log('All supervisores:', allSupervisores);

    // Filtrar empresas que têm relacionamento com o CCA selecionado
    const filteredEmpresas = allEmpresas.filter(empresa => 
      empresa.cca_id === ccaIdNumber
    );

    // Filtrar engenheiros que têm relacionamento com o CCA selecionado
    const filteredEngenheiros = allEngenheiros.filter(engenheiro => 
      engenheiro.cca_id === ccaIdNumber
    );

    // Filtrar supervisores que têm relacionamento com o CCA selecionado
    const filteredSupervisores = allSupervisores.filter(supervisor => 
      supervisor.cca_id === ccaIdNumber
    );

    console.log('Filtered empresas:', filteredEmpresas);
    console.log('Filtered engenheiros:', filteredEngenheiros);
    console.log('Filtered supervisores:', filteredSupervisores);

    return {
      empresas: filteredEmpresas,
      engenheiros: filteredEngenheiros,
      supervisores: filteredSupervisores,
      encarregados: allEncarregados.filter(encarregado => encarregado.cca_id === ccaIdNumber),
      funcionarios: allFuncionarios.filter(funcionario => funcionario.cca_id === ccaIdNumber),
    };
  }, [allEmpresas, allEngenheiros, allSupervisores, allEncarregados, allFuncionarios, selectedCcaId]);

  return {
    ccas,
    empresas: filteredData.empresas,
    disciplinas,
    engenheiros: filteredData.engenheiros,
    supervisores: filteredData.supervisores,
    encarregados: filteredData.encarregados,
    funcionarios: filteredData.funcionarios,
    partesCorpo,
    lateralidades,
    agentesCausadores,
    situacoesGeradoras,
    naturezasLesao,
  };
};
