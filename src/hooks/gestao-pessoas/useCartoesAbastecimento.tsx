import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCartoesAbastecimento = () => {
  return useQuery({
    queryKey: ['cartoes-abastecimento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos_cartoes_abastecimento')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};
