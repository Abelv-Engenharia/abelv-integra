
import { supabase } from "@/integrations/supabase/client";
import { InspecoesStatsByMonth } from "./types";

/**
 * Fetch statistics about inspections by month
 */
export async function fetchInspecoesStats(): Promise<InspecoesStatsByMonth[]> {
  try {
    // Tentar buscar estatísticas por mês
    const { data, error } = await supabase.rpc('get_inspecoes_stats_by_month');

    if (error) {
      console.error("Erro ao buscar estatísticas de inspeções:", error);
      // Retornar dados simulados se a função não existir
      return Array.from({ length: 12 }, (_, i) => ({
        mes: i + 1, 
        concluidas: 0,
        programadas: 0
      }));
    }

    // Se não houver dados, retornar array vazio ou simulado
    if (!data || !data.length) {
      return Array.from({ length: 12 }, (_, i) => ({
        mes: i + 1, 
        concluidas: 0,
        programadas: 0
      }));
    }

    return data as InspecoesStatsByMonth[];
  } catch (error) {
    console.error("Exceção ao buscar estatísticas de inspeções:", error);
    return Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1, 
      concluidas: 0,
      programadas: 0
    }));
  }
}

// Alias para manter compatibilidade com componentes
export const fetchInspecoesByMonth = fetchInspecoesStats;
