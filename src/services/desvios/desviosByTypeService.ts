
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

// Function to fetch data for pie chart (desvios by type)
export const fetchDesviosByType = async (filters?: FilterParams) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        tipo_registro_id,
        data_desvio,
        cca_id,
        disciplina_id,
        empresa_id,
        tipos_registro:tipo_registro_id(codigo, nome)
      `)
      .not('tipo_registro_id', 'is', null)
      .limit(50000);

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by type:', error);
      return [];
    }

    // Count occurrences of each type
    const typeCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const tipo = desvio.tipos_registro?.nome || "Outros";
      typeCounts[tipo] = (typeCounts[tipo] || 0) + 1;
    });

    // Convert to array format for the pie chart
    return Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Limit to top 5 types
  } catch (error) {
    console.error('Exception fetching desvios by type:', error);
    return [];
  }
};
