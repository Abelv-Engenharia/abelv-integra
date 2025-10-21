import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAbastecimentos = (filters?: {
  dataInicial?: string;
  dataFinal?: string;
  placa?: string;
  condutorId?: string;
}) => {
  return useQuery({
    queryKey: ['abastecimentos', filters],
    queryFn: async () => {
      let query = supabase
        .from('veiculos_abastecimentos')
        .select('*')
        .order('data_hora_transacao', { ascending: false });

      if (filters?.dataInicial) {
        query = query.gte('data_hora_transacao', filters.dataInicial);
      }
      if (filters?.dataFinal) {
        query = query.lte('data_hora_transacao', filters.dataFinal);
      }
      if (filters?.placa) {
        query = query.eq('placa', filters.placa);
      }
      if (filters?.condutorId) {
        query = query.eq('condutor_id', filters.condutorId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    }
  });
};

export const useAbastecimentosPorPeriodo = (dataInicial: string, dataFinal: string) => {
  return useAbastecimentos({ dataInicial, dataFinal });
};
