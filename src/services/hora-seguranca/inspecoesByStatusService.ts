
import { supabase } from "@/integrations/supabase/client";
import { InspecoesByStatus } from "./types";

/**
 * Fetch inspections grouped by status
 */
export async function fetchInspecoesByStatus(): Promise<InspecoesByStatus[]> {
  try {
    const { data, error } = await supabase.rpc('get_inspecoes_by_status');

    if (error) {
      console.error("Erro ao buscar inspeções por status:", error);
      // Retornar dados simulados
      return [
        { name: "Concluída", value: 0 },
        { name: "Pendente", value: 0 },
        { name: "Cancelada", value: 0 }
      ];
    }

    if (!data || !data.length) {
      return [
        { name: "Concluída", value: 0 },
        { name: "Pendente", value: 0 },
        { name: "Cancelada", value: 0 }
      ];
    }

    // Transformar os dados para o formato que o componente do gráfico espera
    return data.map(item => ({
      name: item.status,
      value: item.quantidade
    }));
  } catch (error) {
    console.error("Exceção ao buscar inspeções por status:", error);
    return [
      { name: "Concluída", value: 0 },
      { name: "Pendente", value: 0 },
      { name: "Cancelada", value: 0 }
    ];
  }
}
