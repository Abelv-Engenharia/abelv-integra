
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

type TypeItem = { name: string; value: number };

/**
 * Usa `tipo_registro_id` e relaciona com `tipos_registro (nome)`.
 * Soma e devolve pares { name: 'Desvios' | 'OM' | <outro nome>, value }.
 */
export const fetchDesviosByType = async (filters?: FilterParams): Promise<TypeItem[]> => {
  try {
    // join correto: tipos_registro:tipo_registro_id(nome)
    let q = supabase
      .from("desvios_completos")
      .select(`tipo_registro_id, data_desvio, cca_id, disciplina_id, empresa_id, tipos_registro:tipo_registro_id ( nome )`)
      .not("tipo_registro_id", "is", null);

    // Apply standardized filters
    if (filters) {
      q = applyFiltersToQuery(q, filters);
    }

    const { data, error } = await q;
    if (error) {
      console.error("[type] supabase error:", error);
      return [];
    }

    const counts: Record<string, number> = {};
    (data ?? []).forEach((row: any) => {
      const nome = row?.tipos_registro?.nome?.toString().trim();
      // normaliza nomes comuns (se seu banco usa "Desvio" / "OM")
      let label = nome || (row?.tipo_registro_id ? `ID ${row.tipo_registro_id}` : "OUTROS");
      const up = (label || "").toUpperCase();
      if (up.includes("DESVIO")) label = "Desvios";
      else if (up === "OM" || up.includes("OPORTUNIDADE")) label = "OM";
      counts[label] = (counts[label] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (err) {
    console.error("[type] exception:", err);
    return [];
  }
};
