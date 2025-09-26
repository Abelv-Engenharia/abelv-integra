
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

type ChartItem = { name: string; value: number };

export const fetchDesviosByProcesso = async (filters?: FilterParams): Promise<ChartItem[]> => {
  try {
    // Use optimized query with range to get all records
    let query = supabase
      .from('desvios_completos')
      .select(`
        processos:processo_id(nome)
      `)
      .not('processo_id', 'is', null)
      .range(0, 10000); // Ensure we get all records, not just 1000

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by processo:', error);
      return [];
    }

    // Count occurrences by processo
    const processCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const processo = desvio.processos?.nome || "OUTROS";
      processCounts[processo] = (processCounts[processo] || 0) + 1;
    });

    // Convert to array format for the chart - show all results
    return Object.entries(processCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by processo:', error);
    return [];
  }
};
