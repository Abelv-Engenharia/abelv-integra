
import { supabase } from "@/integrations/supabase/client";
import { DesviosByInspectionType } from "./types";

/**
 * Fetch desvios by inspection type
 */
export async function fetchDesviosByInspectionType(): Promise<DesviosByInspectionType[]> {
  try {
    const { data, error } = await supabase.rpc('get_desvios_by_inspection_type');

    if (error) {
      console.error("Erro ao buscar desvios por tipo de inspeção:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || data.length === 0) {
      return [];
    }

    return data as DesviosByInspectionType[];
  } catch (error) {
    console.error("Exceção ao buscar desvios por tipo de inspeção:", error);
    return [];
  }
}
