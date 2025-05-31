
import { supabase } from "@/integrations/supabase/client";

export const fetchDesviosByProcesso = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios_completos')
      .select(`
        processo_id,
        processos:processo_id(codigo, nome)
      `)
      .not('processo_id', 'is', null);
    
    if (error) {
      console.error('Error fetching desvios by processo:', error);
      return [];
    }

    // Count occurrences by processo
    const processoCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const processo = desvio.processos?.nome || "OUTROS";
      processoCounts[processo] = (processoCounts[processo] || 0) + 1;
    });

    // Convert to array format for the chart
    return Object.entries(processoCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Limit to top 8 processes
  } catch (error) {
    console.error('Exception fetching desvios by processo:', error);
    return [];
  }
};
