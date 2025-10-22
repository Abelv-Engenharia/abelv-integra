import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useVeiculos = () => {
  return useQuery({
    queryKey: ['veiculos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos')
        .select(`
          *,
          locadora:veiculos_locadoras(id, nome),
          condutor:veiculos_condutores(id, nome_condutor)
        `)
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};

export const useVeiculosAtivos = () => {
  return useQuery({
    queryKey: ['veiculos-ativos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos')
        .select(`
          *,
          locadora:veiculos_locadoras(id, nome),
          condutor:veiculos_condutores(id, nome_condutor)
        `)
        .eq('ativo', true)
        .eq('status', 'Ativo')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};
