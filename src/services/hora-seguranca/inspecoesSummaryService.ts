
import { supabase } from '@/integrations/supabase/client';
import { InspecoesSummary } from './types';

/**
 * Fetch inspeções summary data from execucao_hsa
 */
export async function fetchInspecoesSummary(): Promise<InspecoesSummary> {
  try {
    // Puxa todos dados da tabela execucao_hsa
    const { data: rows, error } = await supabase
      .from('execucao_hsa')
      .select('id, inspecao_programada, desvios_identificados, status, canceladas=eq.status')
    
    if (error) throw error;

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
