
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TipoInspecao {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
}

export const useTiposInspecao = () => {
  const { data: tipos = [], isLoading } = useQuery({
    queryKey: ['tipos-inspecao-sms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipos_inspecao_sms')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) throw error;
      return data as TipoInspecao[];
    },
  });

  return {
    tipos,
    isLoading,
  };
};
