
import { supabase } from "@/integrations/supabase/client";
import { InspecoesStatsByMonth } from "./types";

/**
 * Fetch inspeções stats by month
 */
export async function fetchInspecoesStatsByMonth(): Promise<InspecoesStatsByMonth[]> {
  try {
    const { data, error } = await supabase.rpc('get_inspecoes_stats_by_month');

    if (error) {
      console.error("Erro ao buscar estatísticas de inspeções por mês:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || data.length === 0) {
      return [];
    }

    return data as InspecoesStatsByMonth[];
  } catch (error) {
    console.error("Exceção ao buscar estatísticas de inspeções por mês:", error);
    return [];
  }
}
