
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

export const fetchDesviosByCompany = async (filters?: FilterParams) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        empresa_id,
        data_desvio,
        cca_id,
        disciplina_id,
        empresas:empresa_id(nome)
      `)
      .not('empresa_id', 'is', null);

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by company:', error);
      return [];
    }

    // Count occurrences by company
    const companyCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const empresa = desvio.empresas?.nome || "OUTROS";
      companyCounts[empresa] = (companyCounts[empresa] || 0) + 1;
    });

    // Convert to array format for the chart
    return Object.entries(companyCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by company:', error);
    return [];
  }
};
