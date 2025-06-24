
import { supabase } from '@/integrations/supabase/client';
import { InspecoesSummary } from './types';

/**
 * Fetch inspeções summary data from execucao_hsa
 */
export async function fetchInspecoesSummary(ccaIds?: number[]): Promise<InspecoesSummary> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select('id, inspecao_programada, desvios_identificados, status');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    const { data: rows, error } = await query;

    if (error || !rows) throw error;

    // Totais
    const totalInspecoes = rows.length;
    const programadas = rows.filter(r => (r.inspecao_programada || '').toUpperCase() === 'PROGRAMADA').length;
    const naoProgramadas = rows.filter(r => (r.inspecao_programada || '').toUpperCase() !== 'PROGRAMADA').length;
    const desviosIdentificados = rows.reduce((acc, r) => acc + (r.desvios_identificados || 0), 0);
    const realizadas = rows.filter(r => (r.status || '').toUpperCase().includes('REALIZADA')).length;
    const canceladas = rows.filter(r => (r.status || '').toUpperCase().includes('CANCELADA')).length;
    
    return {
      totalInspecoes,
      programadas,
      naoProgramadas,
      desviosIdentificados,
      realizadas,
      canceladas
    };
  } catch (error) {
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
}
