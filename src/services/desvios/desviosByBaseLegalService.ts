
import { supabase } from "@/integrations/supabase/client";

export const fetchDesviosByBaseLegal = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios_completos')
      .select(`
        base_legal_opcao_id,
        base_legal_opcoes:base_legal_opcao_id(codigo, nome)
      `)
      .not('base_legal_opcao_id', 'is', null);
    
    if (error) {
      console.error('Error fetching desvios by base legal:', error);
      return [];
    }

    // Count occurrences by base legal
    const baseLegalCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const baseLegal = desvio.base_legal_opcoes?.nome || "OUTROS";
      baseLegalCounts[baseLegal] = (baseLegalCounts[baseLegal] || 0) + 1;
    });

    // Convert to array format for the chart
    return Object.entries(baseLegalCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by base legal:', error);
    return [];
  }
};
