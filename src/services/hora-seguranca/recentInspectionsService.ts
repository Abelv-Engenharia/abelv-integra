
import { supabase } from "@/integrations/supabase/client";
import { Inspecao } from "./types";

/**
 * Fetch recent inspections
 */
export async function fetchRecentInspections(): Promise<Inspecao[]> {
  try {
    // Verificar se a tabela de inspeções existe
    const { data, error } = await supabase.rpc('get_recent_inspecoes');

    if (error) {
      console.error("Erro ao buscar inspeções recentes:", error);
      // Retornar array vazio se a tabela não existir
      return [];
    }

    return data as Inspecao[] || [];
  } catch (error) {
    console.error("Exceção ao buscar inspeções recentes:", error);
    return [];
  }
}
