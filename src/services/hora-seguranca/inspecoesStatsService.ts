
import { supabase } from "@/integrations/supabase/client";
import { InspecoesStatsByMonth } from "./types";

/**
 * Fetch statistics about inspections
 */
export async function fetchInspecoesStats(): Promise<InspecoesStatsByMonth[]> {
  try {
    // Tentar buscar estatísticas de inspeções
    const { data, error } = await supabase.rpc('get_inspecoes_stats');

    if (error) {
      console.error("Erro ao buscar estatísticas de inspeções:", error);
      // Retornar array vazio se a função não existir
      return [];
    }

    // Se não houver dados, retornar array vazio
    if (!data || data.length === 0) {
      return [];
    }

    return data as InspecoesStatsByMonth[];
  } catch (error) {
    console.error("Exceção ao buscar estatísticas de inspeções:", error);
    return [];
  }
}

/**
 * Fetch inspections by month
 */
export async function fetchInspecoesByMonth(): Promise<InspecoesStatsByMonth[]> {
  // Essa função é um alias para fetchInspecoesStats
  return fetchInspecoesStats();
}
