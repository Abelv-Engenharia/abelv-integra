import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFuncionariosByCCA = (ccaId: number | undefined) => {
  return useQuery({
    queryKey: ['funcionarios-cca', ccaId],
    queryFn: async () => {
      if (!ccaId) return [];
      
      const { data, error } = await supabase
        .from('funcionarios')
        .select(`
          id,
          nome,
          matricula,
          cpf,
          funcao,
          foto,
          ativo,
          data_admissao,
          ccas:cca_id (
            id,
            codigo,
            nome,
            tipo
          )
        `)
        .eq('cca_id', ccaId)
        .eq('ativo', true)
        .order('nome');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!ccaId,
  });
};
