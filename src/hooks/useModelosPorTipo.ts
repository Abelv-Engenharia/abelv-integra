import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useModelosPorTipo = (tipo: string | undefined) => {
  return useQuery({
    queryKey: ['modelos-tipo', tipo],
    queryFn: async () => {
      if (!tipo) return [];
      
      const { data, error } = await supabase
        .from('documentacao_modelos')
        .select('*')
        .eq('tipo', tipo)
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!tipo,
  });
};
