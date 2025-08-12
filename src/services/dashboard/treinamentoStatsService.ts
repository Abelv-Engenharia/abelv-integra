
import { supabase } from '@/integrations/supabase/client';

export async function fetchTreinamentoInvestmentPercentage(ccaIds?: number[], filters?: { year?: string; month?: string }): Promise<number> {
  try {
    const yearFilter = filters?.year && filters.year !== "todos" ? parseInt(filters.year) : undefined;

    let query = supabase
      .from('execucao_treinamentos')
      .select('horas_totais');

    if (yearFilter !== undefined) {
      query = query.eq('ano', yearFilter);
    }

    // Aplicar filtro de mês se especificado
    if (filters?.month && filters.month !== "todos") {
      query = query.eq('mes', parseInt(filters.month));
    }

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    const { data: treinamentos, error: treinamentosError } = await query;

    if (treinamentosError || !treinamentos) {
      return 0;
    }

    // Calcular total de horas de treinamento
    const totalHorasTreinamento = treinamentos.reduce(
      (acc, item) => acc + (item.horas_totais || 0), 
      0
    );

    // Buscar total de horas trabalhadas do mesmo período
    let queryHHT = supabase
      .from('horas_trabalhadas')
      .select('horas_trabalhadas');

    if (yearFilter !== undefined) {
      queryHHT = queryHHT.eq('ano', yearFilter);
    }

    // Aplicar filtro de mês se especificado
    if (filters?.month && filters.month !== "todos") {
      queryHHT = queryHHT.eq('mes', parseInt(filters.month));
    }

    if (ccaIds && ccaIds.length > 0) {
      queryHHT = queryHHT.in('cca_id', ccaIds);
    }

    const { data: horasTrabalhadas, error: hhtError } = await queryHHT;

    if (hhtError || !horasTrabalhadas || horasTrabalhadas.length === 0) {
      return 0;
    }

    const totalHorasTrabalhadas = horasTrabalhadas.reduce(
      (acc, item) => acc + (item.horas_trabalhadas || 0), 
      0
    );

    if (totalHorasTrabalhadas === 0) {
      return 0;
    }

    // Calcular percentual investido em treinamentos
    const percentual = (Number(totalHorasTreinamento) / Number(totalHorasTrabalhadas)) * 100;
    
    return Math.round(percentual * 100) / 100; // Arredondar para 2 casas decimais
  } catch (error) {
    console.error('Erro ao buscar dados de investimento em treinamento:', error);
    return 0;
  }
}
