
import { supabase } from "@/integrations/supabase/client";
import { InspecoesSummary } from "@/types/users";

/**
 * Fetch summary of inspections
 */
export async function fetchInspecoesSummary(): Promise<InspecoesSummary> {
  try {
    // Tentar buscar resumo das inspeções
    const { data, error } = await supabase.rpc('get_inspecoes_summary');

    if (error) {
      console.error("Erro ao buscar resumo das inspeções:", error);
      // Retornar objeto vazio se a função não existir
      return {
        totalInspecoes: 0,
        programadas: 0,
        naoProgramadas: 0,
        desviosIdentificados: 0
      };
    }

    // Se não houver dados, retornar objeto vazio
    if (!data || data.length === 0) {
      return {
        totalInspecoes: 0,
        programadas: 0,
        naoProgramadas: 0,
        desviosIdentificados: 0
      };
    }

    // Retornar os dados
    return data[0] as InspecoesSummary;
  } catch (error) {
    console.error("Exceção ao buscar resumo das inspeções:", error);
    return {
      totalInspecoes: 0,
      programadas: 0,
      naoProgramadas: 0,
      desviosIdentificados: 0
    };
  }
}

/**
 * Alias function for fetchInspecoesSummary
 */
export async function fetchInspectionsSummary(): Promise<InspecoesSummary> {
  return fetchInspecoesSummary();
}
