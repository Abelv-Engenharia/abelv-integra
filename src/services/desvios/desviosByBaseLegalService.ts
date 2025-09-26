
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

type ChartItem = { name: string; fullName: string; value: number };

export const fetchDesviosByBaseLegal = async (filters?: FilterParams): Promise<ChartItem[]> => {
  try {
    // Use optimized query with range to get all records
    let query = supabase
      .from('desvios_completos')
      .select(`
        base_legal_opcoes:base_legal_opcao_id(codigo, nome)
      `)
      .not('base_legal_opcao_id', 'is', null)
      .range(0, 10000); // Ensure we get all records, not just 1000

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by base legal:', error);
      return [];
    }

    // Count occurrences by base legal
    const baseLegalCounts: Record<string, { fullName: string; count: number }> = {};
    data?.forEach(desvio => {
      const codigo = desvio.base_legal_opcoes?.codigo || "OUTROS";
      const nome = desvio.base_legal_opcoes?.nome || "OUTROS";
      
      if (!baseLegalCounts[codigo]) {
        baseLegalCounts[codigo] = { fullName: nome, count: 0 };
      }
      baseLegalCounts[codigo].count++;
    });

    // Convert to array format for the chart - show all results
    return Object.entries(baseLegalCounts)
      .map(([name, data]) => ({ 
        name, 
        fullName: data.fullName, 
        value: data.count 
      }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by base legal:', error);
    return [];
  }
};
