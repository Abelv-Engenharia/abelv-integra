
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

const COLOR_MAP: Record<string, string> = {
  TRIVIAL: "#4ade80",
  TOLERÁVEL: "#60a5fa",
  TOLERAVEL: "#60a5fa",
  MODERADO: "#facc15",
  SUBSTANCIAL: "#f97316",
  INTOLERÁVEL: "#ef4444",
  INTOLERAVEL: "#ef4444",
};

type ChartItem = { name: string; value: number; color: string };

export const fetchDesviosByClassification = async (filters?: FilterParams): Promise<ChartItem[]> => {
  try {
    let query = supabase
      .from("desvios_completos")
      .select(`
        classificacao_risco,
        data_desvio,
        cca_id,
        disciplina_id,
        empresa_id
      `)
      .not("classificacao_risco", "is", null)
      .limit(50000);

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching desvios by classification:", error);
      return [];
    }

    const counts: Record<string, number> = {};
    (data ?? []).forEach((row: any) => {
      const key = String(row.classificacao_risco ?? "TRIVIAL").trim().toUpperCase();
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        color: COLOR_MAP[name] ?? "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);
  } catch (err) {
    console.error("Exception fetching desvios by classification:", err);
    return [];
  }
};
