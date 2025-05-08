
import { supabase } from '@/integrations/supabase/client';
import { InspecoesStats, RPCInspecoesStatsResult } from './types';

/**
 * Fetch inspeções statistics by month
 */
export async function fetchInspecoesStatsByMonth(): Promise<InspecoesStats[]> {
  try {
    const { data, error } = await supabase.rpc<RPCInspecoesStatsResult>(
      'get_inspecoes_by_month'
    );

    if (error) {
      console.error("Erro ao buscar estatísticas de inspeções por mês:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || data.length === 0) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Exceção ao buscar estatísticas de inspeções por mês:", error);
    return [];
  }
}

// Legacy alias for backward compatibility
export const fetchInspecoesByMonth = fetchInspecoesStatsByMonth;
export const fetchInspecoesStats = fetchInspecoesStatsByMonth;
