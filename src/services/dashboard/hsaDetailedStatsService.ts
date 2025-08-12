
import { supabase } from '@/integrations/supabase/client';

interface HSADetailedStats {
  inspecoesProgramadas: number;
  inspecoesRealizadas: number;
  naoRealizadas: number;
  naoProgramadas: number;
  aderenciaReal: number;
  aderenciaAjustada: number;
}

export async function fetchHSADetailedStats(ccaIds?: number[], filters?: { year?: string; month?: string }): Promise<HSADetailedStats> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select('id, inspecao_programada, status, ano, mes');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    // Aplicar filtro de ano se fornecido
    if (filters?.year && filters.year !== "todos") {
      query = query.eq('ano', parseInt(filters.year));
    }

    // Aplicar filtro de mês se fornecido
    if (filters?.month && filters.month !== "todos") {
      query = query.eq('mes', parseInt(filters.month));
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return {
        inspecoesProgramadas: 0,
        inspecoesRealizadas: 0,
        naoRealizadas: 0,
        naoProgramadas: 0,
        aderenciaReal: 0,
        aderenciaAjustada: 0
      };
    }

    // Contar por status específico
    const aRealizar = data.filter(r => (r.status || '').toUpperCase() === 'A REALIZAR').length;
    const realizadas = data.filter(r => (r.status || '').toUpperCase() === 'REALIZADA').length;
    const naoRealizadas = data.filter(r => (r.status || '').toUpperCase() === 'NÃO REALIZADA').length;
    const realizadasNaoProgramadas = data.filter(r => (r.status || '').toUpperCase() === 'REALIZADA (NÃO PROGRAMADA)').length;

    // Calcular totais
    const inspecoesProgramadas = aRealizar + realizadas + naoRealizadas;
    const inspecoesRealizadas = realizadas;
    const totalAjustado = inspecoesProgramadas + realizadasNaoProgramadas;
    const realizadasAjustadas = realizadas + realizadasNaoProgramadas;

    // Calcular aderências
    const aderenciaReal = inspecoesProgramadas > 0 ? (realizadas / inspecoesProgramadas) * 100 : 0;
    const aderenciaAjustada = totalAjustado > 0 ? (realizadasAjustadas / totalAjustado) * 100 : 0;
    
    console.log('HSA Detailed Stats with filters:', {
      filters,
      ccaIds,
      total: data.length,
      inspecoesProgramadas,
      inspecoesRealizadas,
      naoRealizadas,
      realizadasNaoProgramadas,
      aderenciaReal,
      aderenciaAjustada
    });
    
    return {
      inspecoesProgramadas,
      inspecoesRealizadas,
      naoRealizadas,
      naoProgramadas: realizadasNaoProgramadas,
      aderenciaReal: Math.round(aderenciaReal * 100) / 100,
      aderenciaAjustada: Math.round(aderenciaAjustada * 100) / 100
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas detalhadas do HSA:', error);
    return {
      inspecoesProgramadas: 0,
      inspecoesRealizadas: 0,
      naoRealizadas: 0,
      naoProgramadas: 0,
      aderenciaReal: 0,
      aderenciaAjustada: 0
    };
  }
}
