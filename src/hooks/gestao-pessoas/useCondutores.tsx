import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCondutores = () => {
  return useQuery({
    queryKey: ['condutores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('veiculos_condutores')
        .select('*')
        .eq('ativo', true)
        .order('nome_condutor', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });
};

export const useCondutoresComCNHVencendo = (diasLimite: number = 30) => {
  return useQuery({
    queryKey: ['condutores-cnh-vencendo', diasLimite],
    queryFn: async () => {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + diasLimite);
      
      const { data, error } = await supabase
        .from('veiculos_condutores')
        .select('*')
        .eq('ativo', true)
        .lte('validade_cnh', dataLimite.toISOString().split('T')[0])
        .gte('validade_cnh', new Date().toISOString().split('T')[0]);

      if (error) throw error;
      return data || [];
    }
  });
};
