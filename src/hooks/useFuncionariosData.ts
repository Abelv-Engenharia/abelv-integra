
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFuncionariosData = () => {
  return useQuery({
    queryKey: ['funcionarios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funcionarios')
        .select(`
          id,
          nome,
          funcao,
          matricula,
          foto,
          ativo,
          cca_id,
          data_admissao
        `)
        .eq('ativo', true)
        .order('nome');
        
      if (error) {
        console.error('Erro ao buscar funcionários:', error);
        throw error;
      }
      
      return data || [];
    }
  });
};
