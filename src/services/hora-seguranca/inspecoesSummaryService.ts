
import { supabase } from '@/integrations/supabase/client';
import { InspecoesSummary, RPCInspecoesSummaryResult } from './types';

/**
 * Fetch inspeções summary data for dashboard
 */
export async function fetchInspecoesSummary(): Promise<InspecoesSummary> {
  try {
    const { data, error } = await supabase.rpc<RPCInspecoesSummaryResult>(
      'get_inspecoes_summary'
    );

    if (error) {
      console.error("Erro ao buscar resumo de inspeções:", error);
      return {
        totalInspecoes: 0,
        programadas: 0,
        naoProgramadas: 0,
        desviosIdentificados: 0
      };
    }

    // Verificar se há dados
    if (!data || data.length === 0) {
      return {
        totalInspecoes: 0,
        programadas: 0,
        naoProgramadas: 0,
        desviosIdentificados: 0
      };
    }

    return data[0];
  } catch (error) {
    console.error("Exceção ao buscar resumo de inspeções:", error);
    return {
      totalInspecoes: 0,
      programadas: 0,
      naoProgramadas: 0,
      desviosIdentificados: 0
    };
  }
}

// Legacy alias for backward compatibility
export const fetchInspectionsSummary = fetchInspecoesSummary;
