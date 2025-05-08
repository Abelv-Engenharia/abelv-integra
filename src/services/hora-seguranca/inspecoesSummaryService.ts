
import { supabase } from '@/integrations/supabase/client';
import { InspecoesSummary } from '@/types/treinamentos';

/**
 * Fetch inspeções summary data
 */
export async function fetchInspecoesSummary(): Promise<InspecoesSummary> {
  try {
    // For now, we'll simulate the response until the RPC or view is set up in Supabase
    const { data, error } = await supabase.rpc('get_inspecoes_summary');

    if (error) {
      console.error("Erro ao buscar resumo de inspeções:", error);
      return {
        totalInspecoes: 0,
        programadas: 0,
        naoProgramadas: 0,
        desviosIdentificados: 0,
        realizadas: 0,
        canceladas: 0
      };
    }

    // Verificar se há dados
    if (!data || !data.length) {
      return {
        totalInspecoes: 0,
        programadas: 0,
        naoProgramadas: 0,
        desviosIdentificados: 0,
        realizadas: 0,
        canceladas: 0
      };
    }

    return {
      totalInspecoes: data[0].total_inspecoes || 0,
      programadas: data[0].programadas || 0,
      naoProgramadas: data[0].nao_programadas || 0,
      desviosIdentificados: data[0].desvios_identificados || 0,
      realizadas: data[0].realizadas || 0,
      canceladas: data[0].canceladas || 0
    };
  } catch (error) {
    console.error("Exceção ao buscar resumo de inspeções:", error);
    return {
      totalInspecoes: 0,
      programadas: 0,
      naoProgramadas: 0,
      desviosIdentificados: 0,
      realizadas: 0,
      canceladas: 0
    };
  }
}
