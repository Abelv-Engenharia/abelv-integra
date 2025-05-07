
import { supabase } from "@/integrations/supabase/client";
import { InspecoesByStatus } from "./types";

/**
 * Fetch data about deviations by inspection type
 */
export async function fetchDesviosByInspectionType(): Promise<InspecoesByStatus[]> {
  try {
    const { data, error } = await supabase.rpc('get_desvios_by_inspection_type');

    if (error) {
      console.error("Erro ao buscar desvios por tipo de inspeção:", error);
      // Retornar dados simulados
      return [
        { name: "Programada", value: 0 },
        { name: "Não Programada", value: 0 }
      ];
    }

    if (!data || !data.length) {
      return [
        { name: "Programada", value: 0 },
        { name: "Não Programada", value: 0 }
      ];
    }

    return data as InspecoesByStatus[];
  } catch (error) {
    console.error("Exceção ao buscar desvios por tipo de inspeção:", error);
    return [
      { name: "Programada", value: 0 },
      { name: "Não Programada", value: 0 }
    ];
  }
}
