import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMultas = (filters?: {
  dataInicial?: string;
  dataFinal?: string;
  placa?: string;
  statusMulta?: string;
}) => {
  return useQuery({
    queryKey: ['multas', filters],
    queryFn: async () => {
      let query = supabase
        .from('veiculos_multas')
        .select('*')
        .order('data_multa', { ascending: false });

      if (filters?.dataInicial) {
        query = query.gte('data_multa', filters.dataInicial);
      }
      if (filters?.dataFinal) {
        query = query.lte('data_multa', filters.dataFinal);
      }
      if (filters?.placa) {
        query = query.eq('placa', filters.placa);
      }
      if (filters?.statusMulta) {
        query = query.eq('status_multa', filters.statusMulta);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    }
  });
};

export const useMultasPendentes = () => {
  return useQuery({
    queryKey: ['multas-pendentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos_multas')
        .select('*')
        .neq('status_multa', 'Processo Concluído')
        .order('data_multa', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};

export const useMultasPorPeriodo = (dataInicial: string, dataFinal: string) => {
  return useMultas({ dataInicial, dataFinal });
};
