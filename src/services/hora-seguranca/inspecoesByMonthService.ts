
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch inspeções by month from execucao_hsa
 */
export async function fetchInspecoesByMonth(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('execucao_hsa')
      .select('mes, ano, status');

    if (error) throw error;

    // Agrupa por mês/ano (exibe apenas ano vigente se desejar)
    const grouped: Record<string, { ACC_REAL: number, ACC_PREV: number }> = {};
    for (const row of data) {
      const mesAno = `${row.mes < 10 ? '0' : ''}${row.mes}/${row.ano}`;
      if (!grouped[mesAno]) grouped[mesAno] = { ACC_REAL: 0, ACC_PREV: 0 };
      if ((row.status || '').toUpperCase().includes('REALIZADA')) grouped[mesAno].ACC_REAL += 1;
      if ((row.status || '').toUpperCase().includes('PROGRAMADA')) grouped[mesAno].ACC_PREV += 1;
    }
    return Object.entries(grouped).map(([name, values]) => ({
      name,
      'ACC PREV': values.ACC_PREV,
      'ACC REAL': values.ACC_REAL,
    }));
  } catch (error) {
    console.error("Erro ao buscar inspeções por mês:", error);
    return [];
  }
}
