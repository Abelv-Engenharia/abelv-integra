
import { supabase } from "@/integrations/supabase/client";
import { InspecoesByStatus } from "./types";

/**
 * Fetch inspections grouped by status
 */
export async function fetchInspecoesByStatus(): Promise<InspecoesByStatus[]> {
  try {
    // Tentar buscar inspeções por status
    const { data, error } = await supabase.rpc('get_inspecoes_by_status');

    if (error) {
      console.error("Erro ao buscar inspeções por status:", error);
      // Retornar array vazio se a função não existir
      return [];
    }

    // Se não houver dados, retornar array vazio
    if (!data || data.length === 0) {
      return [];
    }

    // Mapear para o formato correto
    return data.map((item: any) => ({
      name: item.status,
      value: item.quantidade
    })) as InspecoesByStatus[];
  } catch (error) {
    console.error("Exceção ao buscar inspeções por status:", error);
    return [];
  }
}
