import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTreinamentos = () => {
  return useQuery({
    queryKey: ['lista-treinamentos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lista_treinamentos_normativos' as any)
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) throw error;
      return data || [];
    },
  });
};
