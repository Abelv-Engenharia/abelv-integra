
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
    queryKey: ['empresas-with-cca'],
    queryFn: async () => {
      const { data } = await import("@/integrations/supabase/client").then(m => m.supabase)
        .from('empresas')
        .select(`
          id,
          nome,
          cnpj,
          ativo,
          cca_id,
          ccas:cca_id(id, codigo, nome)
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
    queryKey: ['engenheiros-with-cca'],
    queryFn: async () => {
      const { data } = await import("@/integrations/supabase/client").then(m => m.supabase)
        .from('engenheiros')
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

  const { data: baseLegalOpcoes = [] } = useQuery({
    queryKey: ['base-legal-opcoes'],
    queryFn: fetchBaseLegalOpcoes,
  });

  const { data: supervisores = [] } = useQuery({
    queryKey: ['supervisores-with-cca'],
    queryFn: async () => {
      const { data } = await import("@/integrations/supabase/client").then(m => m.supabase)
        .from('supervisores')
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

  const { data: encarregados = [] } = useQuery({
    queryKey: ['encarregados-with-cca'],
    queryFn: async () => {
      const { data } = await import("@/integrations/supabase/client").then(m => m.supabase)
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
      const { data } = await import("@/integrations/supabase/client").then(m => m.supabase)
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
  };
};
