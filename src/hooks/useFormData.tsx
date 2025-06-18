
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
  const { data: userCCAs = [] } = useUserCCAs();
  const allowedCcaIds = userCCAs.map(cca => cca.id);

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
      if (allowedCcaIds.length === 0) return [];
      
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
      return data || [];
    },
    enabled: allowedCcaIds.length > 0,
  });

  const { data: disciplinas = [] } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: fetchDisciplinas,
  });

  const { data: engenheiros = [] } = useQuery({
    queryKey: ['engenheiros-with-ccas', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) return [];
      
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
      return data || [];
    },
    enabled: allowedCcaIds.length > 0,
  });

  const { data: baseLegalOpcoes = [] } = useQuery({
    queryKey: ['base-legal-opcoes'],
    queryFn: fetchBaseLegalOpcoes,
  });

  const { data: supervisores = [] } = useQuery({
    queryKey: ['supervisores-with-ccas', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) return [];
      
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
      return data || [];
    },
    enabled: allowedCcaIds.length > 0,
  });

  const { data: encarregados = [] } = useQuery({
    queryKey: ['encarregados-with-cca', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) return [];
      
      const { data } = await supabase
        .from('encarregados')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          email,
          ativo,
          cca_id,
          ccas:cca_id(id, codigo, nome)
        `)
        .eq('ativo', true)
        .in('cca_id', allowedCcaIds)
        .order('nome');
      return data || [];
    },
    enabled: allowedCcaIds.length > 0,
  });

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios-with-cca', allowedCcaIds],
    queryFn: async () => {
      if (allowedCcaIds.length === 0) return [];
      
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
      return data || [];
    },
    enabled: allowedCcaIds.length > 0,
  });

  return {
    ccas: userCCAs.sort((a, b) => a.codigo.localeCompare(b.codigo)),
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
