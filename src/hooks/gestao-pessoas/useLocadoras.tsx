import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLocadoras = () => {
  return useQuery({
    queryKey: ['locadoras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos_locadoras')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });
};
