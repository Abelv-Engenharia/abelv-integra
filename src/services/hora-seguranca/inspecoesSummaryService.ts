
import { supabase } from "@/integrations/supabase/client";
import { InspecoesSummary } from "@/types/users";

/**
 * Fetch summary information about inspections
 */
export async function fetchInspecoesSummary(): Promise<InspecoesSummary> {
  try {
    // Consultar tabela de inspeções - verificando se existe ou criando um mock
    const { data, error } = await supabase.rpc('get_inspecoes_summary');

    if (error) {
      console.error("Erro ao buscar sumário de inspeções:", error);
      // Retornar dados simulados se a tabela ou função não existir
      return {
        totalInspecoes: 0,
        programadas: 0,
        naoProgramadas: 0,
        desviosIdentificados: 0
      };
    }

    if (!data || !data.length) {
      return {
        totalInspecoes: 0,
        programadas: 0,
        naoProgramadas: 0,
        desviosIdentificados: 0
      };
    }

    return data[0] as InspecoesSummary;
  } catch (error) {
    console.error("Exceção ao buscar sumário de inspeções:", error);
    return {
      totalInspecoes: 0,
      programadas: 0,
      naoProgramadas: 0,
      desviosIdentificados: 0
    };
  }
}

// Alias para manter compatibilidade com o nome da função usado nos componentes
export const fetchInspectionsSummary = fetchInspecoesSummary;
