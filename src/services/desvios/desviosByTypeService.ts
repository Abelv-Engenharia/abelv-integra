
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

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
        tipos_registro:tipo_registro_id(nome)
      `)
      .not('tipo_registro_id', 'is', null)
      .limit(50000); // Força um limite maior explicitamente

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by type:', error);
      return [];
    }

    // Count occurrences by type
    const typeCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const tipo = desvio.tipos_registro?.nome || "OUTROS";
      let label = tipo;
      const up = (label || "").toUpperCase();
      if (up.includes("DESVIO")) label = "Desvios";
      else if (up === "OM" || up.includes("OPORTUNIDADE")) label = "OM";
      typeCounts[label] = (typeCounts[label] || 0) + 1;
    });

    // Convert to array format for the chart
    return Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by type:', error);
    return [];
  }
};
