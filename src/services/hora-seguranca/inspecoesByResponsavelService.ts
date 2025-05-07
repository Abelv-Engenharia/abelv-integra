
import { supabase } from "@/integrations/supabase/client";
import { InspecoesByResponsavel } from "./types";

/**
 * Fetch inspections grouped by responsible person
 */
export async function fetchInspecoesByResponsavel(): Promise<InspecoesByResponsavel[]> {
  try {
    // Tentar buscar inspeções por responsável
    const { data, error } = await supabase.rpc('get_inspecoes_by_responsavel');

    if (error) {
      console.error("Erro ao buscar inspeções por responsável:", error);
      // Retornar array vazio se a função não existir
      return [];
    }

    // Se não houver dados, retornar array vazio
    if (!data || !data.length) {
      return [];
    }

    return data as InspecoesByResponsavel[];
  } catch (error) {
    console.error("Exceção ao buscar inspeções por responsável:", error);
    return [];
  }
}
