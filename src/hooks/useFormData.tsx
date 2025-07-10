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
        .from('empresas')
        .select(`
          id,
          nome,
          cnpj,
          ativo,
          empresa_ccas!inner(
            cca_id,
            ccas:cca_id(id, codigo, nome)
          )
        `)
        .eq('ativo', true)
        .in('empresa_ccas.cca_id', allowedCcaIds)
        .order('nome');
      
      console.log('useFormData - Empresas encontradas:', data?.length || 0);
      return data || [];
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
        .from('engenheiros')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          email,
          ativo,
          engenheiro_ccas!inner(
            cca_id,
            ccas:cca_id(id, codigo, nome)
          )
        `)
        .eq('ativo', true)
        .in('engenheiro_ccas.cca_id', allowedCcaIds)
        .order('nome');
      
      console.log('useFormData - Engenheiros encontrados:', data?.length || 0);
      return data || [];
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
        .from('supervisores')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          email,
          ativo,
          supervisor_ccas!inner(
            cca_id,
            ccas:cca_id(id, codigo, nome)
          )
        `)
        .eq('ativo', true)
        .in('supervisor_ccas.cca_id', allowedCcaIds)
        .order('nome');
      
      console.log('useFormData - Supervisores encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: allowedCcaIds.length > 0 && !ccasLoading,
  });

  const { data: encarregados = [] } = useQuery({
    queryKey: ['encarregados-with-cca', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) {
        console.log('useFormData - Nenhum CCA permitido para encarregados');
        return [];
      }
      
      console.log('useFormData - Buscando encarregados para CCAs:', allowedCcaIds);
      const { data } = await supabase
        .from('encarregados')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          email,
          ativo,
          encarregado_ccas!inner(
            cca_id,
            ccas:cca_id(id, codigo, nome)
          )
        `)
        .eq('ativo', true)
        .in('encarregado_ccas.cca_id', allowedCcaIds)
        .order('nome');
      
      console.log('useFormData - Encarregados encontrados:', data?.length || 0);
      return data || [];
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
