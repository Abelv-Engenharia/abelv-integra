
import { supabase } from '@/integrations/supabase/client';

export async function fetchHSAPercentage(ccaIds?: number[], filters?: { year?: string; month?: string }): Promise<number> {
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
      return 0;
    }

    // Contar por status específico
    const aRealizar = data.filter(r => (r.status || '').toUpperCase() === 'A REALIZAR').length;
    const realizadas = data.filter(r => (r.status || '').toUpperCase() === 'REALIZADA').length;
    const naoRealizadas = data.filter(r => (r.status || '').toUpperCase() === 'NÃO REALIZADA').length;
    const realizadasNaoProgramadas = data.filter(r => (r.status || '').toUpperCase() === 'REALIZADA (NÃO PROGRAMADA)').length;

    // Totais para aderência ajustada
    const programadas = aRealizar + realizadas + naoRealizadas; // A REALIZAR + REALIZADA + NÃO REALIZADA
    const realizadasAjustadas = realizadas + realizadasNaoProgramadas;

    // Calcular aderência ajustada = (REALIZADA + REALIZADA NÃO PROGRAMADA) / PROGRAMADAS * 100
    const aderenciaAjustada = programadas > 0 ? (realizadasAjustadas / programadas) * 100 : 0;
    
    console.log('HSA Stats with filters:', {
      filters,
      ccaIds,
      total: data.length,
      aderenciaAjustada
    });
    
    return Math.round(aderenciaAjustada * 100) / 100; // Arredondar para 2 casas decimais
  } catch (error) {
    console.error('Erro ao buscar dados do HSA:', error);
    return 0;
  }
}
