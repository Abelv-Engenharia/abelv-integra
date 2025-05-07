
import { supabase } from "@/integrations/supabase/client";
import { InspecoesSummary } from "@/types/users";

/**
 * Fetch inspeções summary
 */
export async function fetchInspecoesSummary(): Promise<InspecoesSummary> {
  try {
    const { data, error } = await supabase.rpc('get_inspecoes_summary');

    if (error) {
      console.error("Erro ao buscar resumo de inspeções:", error);
      return {
        totalInspecoes: 0,
        programadas: 0,
        naoProgramadas: 0,
        desviosIdentificados: 0
      };
    }

    // Verificar se há dados
    if (!data || data.length === 0) {
      return {
        totalInspecoes: 0,
        programadas: 0,
        naoProgramadas: 0,
        desviosIdentificados: 0
      };
    }

    return data[0] as InspecoesSummary;
  } catch (error) {
    console.error("Exceção ao buscar resumo de inspeções:", error);
    return {
      totalInspecoes: 0,
      programadas: 0,
      naoProgramadas: 0,
      desviosIdentificados: 0
    };
  }
}
