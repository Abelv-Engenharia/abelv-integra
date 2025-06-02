
import { useQuery } from "@tanstack/react-query";
import {
  fetchCCAs,
  fetchTiposRegistro,
  fetchProcessos,
  fetchEventosIdentificados,
  fetchCausasProvaveis,
  fetchEmpresas,
  fetchDisciplinas,
  fetchEngenheiros,
  fetchBaseLegalOpcoes,
  fetchSupervisores,
  fetchEncarregados,
  fetchFuncionarios,
} from "@/services/desviosService";
import { supabase } from "@/integrations/supabase/client";

export const useFormData = () => {
  const { data: ccas = [] } = useQuery({
    queryKey: ['ccas'],
    queryFn: fetchCCAs,
  });

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
    queryKey: ['empresas-with-ccas'],
    queryFn: async () => {
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
        .order('nome');
      return data || [];
    },
  });

  const { data: disciplinas = [] } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: fetchDisciplinas,
  });

  const { data: engenheiros = [] } = useQuery({
    queryKey: ['engenheiros-with-ccas'],
    queryFn: async () => {
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
        .order('nome');
      return data || [];
    },
  });

  const { data: baseLegalOpcoes = [] } = useQuery({
    queryKey: ['base-legal-opcoes'],
    queryFn: fetchBaseLegalOpcoes,
  });

  const { data: supervisores = [] } = useQuery({
    queryKey: ['supervisores-with-ccas'],
    queryFn: async () => {
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
        .order('nome');
      return data || [];
    },
  });

  const { data: encarregados = [] } = useQuery({
    queryKey: ['encarregados-with-cca'],
    queryFn: async () => {
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
        .order('nome');
      return data || [];
    },
  });

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios-with-cca'],
    queryFn: async () => {
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
        .order('nome');
      return data || [];
    },
  });

  return {
    ccas: ccas.sort((a, b) => a.codigo.localeCompare(b.codigo)),
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
