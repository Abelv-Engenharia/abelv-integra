
import { supabase } from "@/integrations/supabase/client";

export const fetchDesviosByMonth = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios_completos')
      .select(`
        id,
        data_desvio,
        created_at
      `)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Erro ao buscar desvios por mês:', error);
      return [];
    }
    
    // Processar dados por mês
    const desviosByMonth = data?.reduce((acc: any, desvio: any) => {
      const date = new Date(desvio.data_desvio);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey]++;
      
      return acc;
    }, {});
    
    return Object.entries(desviosByMonth || {}).map(([month, count]) => ({
      month,
      count
    }));
  } catch (error) {
    console.error('Exceção ao buscar desvios por mês:', error);
    return [];
  }
};
