
import { supabase } from '@/integrations/supabase/client';
import { InspecoesSummary } from './types';
import { FilterOptions } from '@/pages/hora-seguranca/HoraSegurancaDashboard';

/**
 * Fetch inspeções summary with filters
 */
export async function fetchInspecoesSummary(ccaIds: number[], filters?: FilterOptions): Promise<InspecoesSummary> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select('*');

    // Aplicar filtro de CCAs
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    // Aplicar filtro de CCA específico
    if (filters?.ccaId) {
      query = query.eq('cca_id', parseInt(filters.ccaId));
    }

    // Aplicar filtro de responsável
    if (filters?.responsavel) {
      query = query.eq('responsavel_inspecao', filters.responsavel);
    }

    // Aplicar filtro de data inicial
    if (filters?.dataInicial) {
      query = query.gte('data', filters.dataInicial.toISOString().split('T')[0]);
    }

    // Aplicar filtro de data final
    if (filters?.dataFinal) {
      query = query.lte('data', filters.dataFinal.toISOString().split('T')[0]);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Inicializar contadores
    const summary: InspecoesSummary = {
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

    // Processar dados
    data.forEach((row: any) => {
      summary.totalInspecoes++;
      
      const status = (row.status || '').toLowerCase();
      const inspecaoProgramada = (row.inspecao_programada || '').toLowerCase();
      
      // Contar desvios
      summary.desviosIdentificados += row.desvios_identificados || 0;
      
      // Classificar por status
      if (status === 'a realizar') {
        summary.aRealizar++;
      } else if (status === 'realizada') {
        if (inspecaoProgramada === 'programada') {
          summary.realizadas++;
        } else {
          summary.realizadasNaoProgramadas++;
        }
      } else if (status === 'não realizada') {
        summary.naoRealizadas++;
      } else if (status === 'cancelada') {
        summary.canceladas++;
      }
    });

    // Calcular programadas e não programadas
    summary.programadas = summary.aRealizar + summary.realizadas + summary.naoRealizadas;
    summary.naoProgramadas = summary.realizadasNaoProgramadas;

    return summary;
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
