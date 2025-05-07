
import { supabase } from "@/integrations/supabase/client";
import { InspecoesByStatus } from "./types";

/**
 * Fetch inspeções by status
 */
export async function fetchInspecoesByStatus(): Promise<InspecoesByStatus[]> {
  try {
    const { data, error } = await supabase.rpc('get_inspecoes_by_status');

    if (error) {
      console.error("Erro ao buscar inspeções por status:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || data.length === 0) {
      return [];
    }
    
    // Transforma os dados para o formato esperado pelo gráfico
    return data.map((item: any) => ({
      name: item.status || 'Sem Status',
      value: item.quantidade
    })) as InspecoesByStatus[];
  } catch (error) {
    console.error("Exceção ao buscar inspeções por status:", error);
    return [];
  }
}
