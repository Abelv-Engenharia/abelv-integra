
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
      // Retornar dados simulados se a função não existir
      return [{
        tipo: "Não Programada", 
        quantidade: 0
      }, {
        tipo: "Programada", 
        quantidade: 0
      }];
    }

    // Se não houver dados, retornar array simulado
    if (!data || !data.length) {
      return [{
        tipo: "Não Programada", 
        quantidade: 0
      }, {
        tipo: "Programada", 
        quantidade: 0
      }];
    }

    return data as InspecoesByTipo[];
  } catch (error) {
    console.error("Exceção ao buscar inspeções por tipo:", error);
    return [{
      tipo: "Não Programada", 
      quantidade: 0
    }, {
      tipo: "Programada", 
      quantidade: 0
    }];
  }
}
