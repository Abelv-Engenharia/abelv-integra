
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

    // Contagem por status específico
    const aRealizar = rows.filter(r => (r.status || '').toUpperCase() === 'A REALIZAR').length;
    const realizadas = rows.filter(r => (r.status || '').toUpperCase() === 'REALIZADA').length;
    const naoRealizadas = rows.filter(r => (r.status || '').toUpperCase() === 'NÃO REALIZADA').length;
    const realizadasNaoProgramadas = rows.filter(r => (r.status || '').toUpperCase() === 'REALIZADA (NÃO PROGRAMADA)').length;
    const canceladas = rows.filter(r => (r.status || '').toUpperCase() === 'CANCELADA').length;

    // Totais
    const totalInspecoes = rows.length;
    const programadas = aRealizar + realizadas + naoRealizadas; // A REALIZAR + REALIZADA + NÃO REALIZADA
    const naoProgramadas = realizadasNaoProgramadas; // REALIZADA (NÃO PROGRAMADA)
    const desviosIdentificados = rows.reduce((acc, r) => acc + (r.desvios_identificados || 0), 0);
    
    return {
      totalInspecoes,
      programadas,
      naoProgramadas,
      desviosIdentificados,
      realizadas,
      canceladas,
      aRealizar,
      naoRealizadas,
      realizadasNaoProgramadas
    };
  } catch (error) {
    console.error("Erro ao buscar resumo de inspeções:", error);
    return {
      totalInspecoes: 0,
      programadas: 0,
      naoProgramadas: 0,
      desviosIdentificados: 0,
      realizadas: 0,
      canceladas: 0,
      aRealizar: 0,
      naoRealizadas: 0,
      realizadasNaoProgramadas: 0
    };
  }
}
