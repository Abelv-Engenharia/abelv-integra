
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

const COLOR_MAP: Record<string, string> = {
  TRIVIAL: "#60a5fa",
  TOLERÁVEL: "#4ade80",
  TOLERAVEL: "#4ade80",
  MODERADO: "#facc15",
  SUBSTANCIAL: "#f97316",
  INTOLERÁVEL: "#ef4444",
  INTOLERAVEL: "#ef4444",
};

export const fetchDesviosByClassification = async (filters?: FilterParams) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        classificacao_risco,
        data_desvio,
        cca_id,
        disciplina_id,
        empresa_id
      `)
      .not('classificacao_risco', 'is', null)
      .range(0, 99999); // Remove o limite padrão de 1000 registros

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by classification:', error);
      return [];
    }

    // Count occurrences by classification
    const classificationCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const key = String(desvio.classificacao_risco ?? "TRIVIAL").trim().toUpperCase();
      classificationCounts[key] = (classificationCounts[key] || 0) + 1;
    });

    // Convert to array format for the chart
    return Object.entries(classificationCounts)
      .map(([name, value]) => ({
        name,
        value,
        color: COLOR_MAP[name] ?? "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by classification:', error);
    return [];
  }
};
