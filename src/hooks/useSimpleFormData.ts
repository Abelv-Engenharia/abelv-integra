
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSimpleFormData = () => {
  // CCAs
  const { data: ccas = [] } = useQuery({
    queryKey: ['ccas-simple'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true)
        .order('codigo');
      return data || [];
    },
  });

  // Empresas
  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas-simple'],
    queryFn: async () => {
      const { data } = await supabase
        .from('empresas')
        .select('id, nome, cnpj')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    },
  });

  // Disciplinas
  const { data: disciplinas = [] } = useQuery({
    queryKey: ['disciplinas-simple'],
    queryFn: async () => {
      const { data } = await supabase
        .from('disciplinas')
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
  };
};
