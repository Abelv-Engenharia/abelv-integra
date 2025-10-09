import { useQuery } from "@tanstack/react-query";
import {
  fetchTiposRegistro,
  fetchProcessos,
  fetchEventosIdentificados,
  fetchCausasProvaveis,
  fetchDisciplinas,
  fetchBaseLegalOpcoes,
} from "@/services/desviosService";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "./useUserCCAs";

export const useFormData = () => {
  const { data: userCCAs = [], isLoading: ccasLoading } = useUserCCAs();
  const allowedCcaIds = userCCAs.map(cca => cca.id);

  console.log('useFormData - CCAs do usuário:', userCCAs.length, userCCAs.map(c => c.codigo));

  const { data: tiposRegistro = [] } = useQuery({
    queryKey: ['tipos-registro'],
    queryFn: fetchTiposRegistro,
  });

  const { data: processos = [] } = useQuery({
    queryKey: ['processos'],
    queryFn: fetchProcessos,
  });

  const { data: eventosIdentificados = [] } = useQuery({
    queryKey: ['eventos-identificados'],
    queryFn: fetchEventosIdentificados,
  });

  const { data: causasProvaveis = [] } = useQuery({
    queryKey: ['causas-provaveis'],
    queryFn: fetchCausasProvaveis,
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas-with-ccas', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) {
        console.log('useFormData - Nenhum CCA permitido para empresas');
        return [];
      }
      
      console.log('useFormData - Buscando empresas para CCAs:', allowedCcaIds);
      const { data } = await supabase
        .from('empresa_ccas')
        .select(`
          cca_id,
          empresas!inner(id, nome, cnpj, ativo)
        `)
        .eq('empresas.ativo', true)
        .in('cca_id', allowedCcaIds);
      
      console.log('useFormData - Registros empresa_ccas:', data?.length || 0);
      
      // Agrupar empresas com seus CCAs
      const empresasMap = new Map();
      data?.forEach(item => {
        const empresa = item.empresas;
        if (!empresasMap.has(empresa.id)) {
          empresasMap.set(empresa.id, {
            ...empresa,
            empresa_ccas: [{ cca_id: item.cca_id }]
          });
        } else {
          empresasMap.get(empresa.id).empresa_ccas.push({ cca_id: item.cca_id });
        }
      });
      
      const empresasArray = Array.from(empresasMap.values()).sort((a, b) => 
        a.nome.localeCompare(b.nome)
      );
      
      console.log('useFormData - Empresas únicas:', empresasArray.length);
      return empresasArray;
    },
    enabled: allowedCcaIds.length > 0 && !ccasLoading,
  });

  const { data: disciplinas = [] } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: fetchDisciplinas,
  });

  const { data: engenheiros = [] } = useQuery({
    queryKey: ['engenheiros-with-ccas', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) {
        console.log('useFormData - Nenhum CCA permitido para engenheiros');
        return [];
      }
      
      console.log('useFormData - Buscando engenheiros para CCAs:', allowedCcaIds);
      const { data } = await supabase
        .from('engenheiro_ccas')
        .select(`
          cca_id,
          engenheiros!inner(id, nome, funcao, matricula, email, ativo)
        `)
        .eq('engenheiros.ativo', true)
        .in('cca_id', allowedCcaIds);
      
      console.log('useFormData - Registros engenheiro_ccas:', data?.length || 0);
      
      const engenheirosMap = new Map();
      data?.forEach(item => {
        const engenheiro = item.engenheiros;
        if (!engenheirosMap.has(engenheiro.id)) {
          engenheirosMap.set(engenheiro.id, {
            ...engenheiro,
            engenheiro_ccas: [{ cca_id: item.cca_id }]
          });
        } else {
          engenheirosMap.get(engenheiro.id).engenheiro_ccas.push({ cca_id: item.cca_id });
        }
      });
      
      const engenheirosArray = Array.from(engenheirosMap.values()).sort((a, b) => 
        a.nome.localeCompare(b.nome)
      );
      
      console.log('useFormData - Engenheiros únicos:', engenheirosArray.length);
      return engenheirosArray;
    },
    enabled: allowedCcaIds.length > 0 && !ccasLoading,
  });

  const { data: baseLegalOpcoes = [] } = useQuery({
    queryKey: ['base-legal-opcoes'],
    queryFn: fetchBaseLegalOpcoes,
  });

  const { data: supervisores = [] } = useQuery({
    queryKey: ['supervisores-with-ccas', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) {
        console.log('useFormData - Nenhum CCA permitido para supervisores');
        return [];
      }
      
      console.log('useFormData - Buscando supervisores para CCAs:', allowedCcaIds);
      const { data } = await supabase
        .from('supervisor_ccas')
        .select(`
          cca_id,
          supervisores!inner(id, nome, funcao, matricula, email, ativo)
        `)
        .eq('supervisores.ativo', true)
        .in('cca_id', allowedCcaIds);
      
      console.log('useFormData - Registros supervisor_ccas:', data?.length || 0);
      
      const supervisoresMap = new Map();
      data?.forEach(item => {
        const supervisor = item.supervisores;
        if (!supervisoresMap.has(supervisor.id)) {
          supervisoresMap.set(supervisor.id, {
            ...supervisor,
            supervisor_ccas: [{ cca_id: item.cca_id }]
          });
        } else {
          supervisoresMap.get(supervisor.id).supervisor_ccas.push({ cca_id: item.cca_id });
        }
      });
      
      const supervisoresArray = Array.from(supervisoresMap.values()).sort((a, b) => 
        a.nome.localeCompare(b.nome)
      );
      
      console.log('useFormData - Supervisores únicos:', supervisoresArray.length);
      return supervisoresArray;
    },
    enabled: allowedCcaIds.length > 0 && !ccasLoading,
  });

  const { data: encarregados = [] } = useQuery({
    queryKey: ['encarregados-with-ccas', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) {
        console.log('useFormData - Nenhum CCA permitido para encarregados');
        return [];
      }
      
      console.log('useFormData - Buscando encarregados para CCAs:', allowedCcaIds);
      const { data } = await supabase
        .from('encarregado_ccas')
        .select(`
          cca_id,
          encarregados!inner(id, nome, funcao, matricula, email, ativo)
        `)
        .eq('encarregados.ativo', true)
        .in('cca_id', allowedCcaIds);
      
      console.log('useFormData - Registros encarregado_ccas:', data?.length || 0);
      
      const encarregadosMap = new Map();
      data?.forEach(item => {
        const encarregado = item.encarregados;
        if (!encarregadosMap.has(encarregado.id)) {
          encarregadosMap.set(encarregado.id, {
            ...encarregado,
            encarregado_ccas: [{ cca_id: item.cca_id }]
          });
        } else {
          encarregadosMap.get(encarregado.id).encarregado_ccas.push({ cca_id: item.cca_id });
        }
      });
      
      const encarregadosArray = Array.from(encarregadosMap.values()).sort((a, b) => 
        a.nome.localeCompare(b.nome)
      );
      
      console.log('useFormData - Encarregados únicos:', encarregadosArray.length);
      return encarregadosArray;
    },
    enabled: allowedCcaIds.length > 0 && !ccasLoading,
  });

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios-with-cca', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) {
        console.log('useFormData - Nenhum CCA permitido para funcionários');
        return [];
      }
      
      console.log('useFormData - Buscando funcionários para CCAs:', allowedCcaIds);
      const { data } = await supabase
        .from('funcionarios')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          foto,
          ativo,
          cca_id,
          ccas:cca_id(id, codigo, nome)
        `)
        .eq('ativo', true)
        .in('cca_id', allowedCcaIds)
        .order('nome');
      
      console.log('useFormData - Funcionários encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: allowedCcaIds.length > 0 && !ccasLoading,
  });

  // Ordenar CCAs do menor para o maior no retorno
  const sortedUserCCAs = [...userCCAs].sort((a, b) => 
    a.codigo.localeCompare(b.codigo, undefined, { numeric: true })
  );

  return {
    ccas: sortedUserCCAs,
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
  };
};
