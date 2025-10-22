import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePedagiosEstacionamentos = (filters?: {
  dataInicial?: string;
  dataFinal?: string;
  placa?: string;
}) => {
  return useQuery({
    queryKey: ['pedagogios-estacionamentos', filters],
    queryFn: async () => {
      let query = supabase
        .from('veiculos_pedagogios_estacionamentos')
        .select('*, ccas(codigo, nome)')
        .order('data_utilizacao', { ascending: false });

      if (filters?.dataInicial) {
        query = query.gte('data_utilizacao', filters.dataInicial);
      }
      if (filters?.dataFinal) {
        query = query.lte('data_utilizacao', filters.dataFinal);
      }
      if (filters?.placa) {
        query = query.eq('placa', filters.placa);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    }
  });
};
