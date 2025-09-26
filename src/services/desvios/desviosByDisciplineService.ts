
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

export const fetchDesviosByDiscipline = async (filters?: FilterParams) => {
  try {
    // Use optimized query with range to get all records
    let query = supabase
      .from('desvios_completos')
      .select(`
        disciplinas:disciplina_id(codigo, nome)
      `)
      .not('disciplina_id', 'is', null)
      .range(0, 10000); // Ensure we get all records, not just 1000

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by discipline:', error);
      return [];
    }

    // Count occurrences by discipline
    const disciplineCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const disciplina = desvio.disciplinas?.codigo || "OUTROS";
      disciplineCounts[disciplina] = (disciplineCounts[disciplina] || 0) + 1;
    });

    // Convert to array format for the chart - show all results
    return Object.entries(disciplineCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by discipline:', error);
    return [];
  }
};
