
import { supabase } from '@/integrations/supabase/client';

export async function fetchHSAPercentage(ccaIds?: number[]): Promise<number> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select('id, inspecao_programada, status');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
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
    const totalAjustado = programadas + realizadasNaoProgramadas;
    const realizadasAjustadas = realizadas + realizadasNaoProgramadas;

    // Calcular aderência ajustada = (REALIZADA + REALIZADA NÃO PROGRAMADA) / (PROGRAMADAS + REALIZADA NÃO PROGRAMADA) * 100
    const aderenciaAjustada = totalAjustado > 0 ? (realizadasAjustadas / totalAjustado) * 100 : 0;
    
    return Math.round(aderenciaAjustada * 100) / 100; // Arredondar para 2 casas decimais
  } catch (error) {
    console.error('Erro ao buscar dados do HSA:', error);
    return 0;
  }
}
