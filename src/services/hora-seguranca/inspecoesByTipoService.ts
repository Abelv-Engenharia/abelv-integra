
import { supabase } from "@/integrations/supabase/client";
import { InspecoesByTipo } from "./types";

/**
 * Fetch inspections grouped by type
 */
export async function fetchInspecoesByTipo(): Promise<InspecoesByTipo[]> {
  try {
    // Tentar buscar inspeções por tipo
    const { data, error } = await supabase.rpc('get_inspecoes_by_tipo');

    if (error) {
      console.error("Erro ao buscar inspeções por tipo:", error);
      // Retornar array vazio se a função não existir
      return [];
    }

    // Se não houver dados, retornar array vazio
    if (!data || data.length === 0) {
      return [];
    }

    return data as InspecoesByTipo[];
  } catch (error) {
    console.error("Exceção ao buscar inspeções por tipo:", error);
    return [];
  }
}
