
import { supabase } from '@/integrations/supabase/client';

export async function fetchTreinamentoInvestmentPercentage(ccaIds?: number[], filters?: { year?: string; month?: string }): Promise<number> {
  try {
    const yearFilter = filters?.year && filters.year !== "todos" ? parseInt(filters.year) : undefined;

    // Construir consultas para execução paralela
    let treinamentosQuery = supabase
      .from('execucao_treinamentos')
      .select('horas_totais');

    let hhtQuery = supabase
      .from('horas_trabalhadas')
      .select('horas_trabalhadas');

    // Aplicar filtros de ano
    if (yearFilter !== undefined) {
      treinamentosQuery = treinamentosQuery.eq('ano', yearFilter);
      hhtQuery = hhtQuery.eq('ano', yearFilter);
    }

    // Aplicar filtro de mês se especificado
    if (filters?.month && filters.month !== "todos") {
      const monthFilter = parseInt(filters.month);
      treinamentosQuery = treinamentosQuery.eq('mes', monthFilter);
      hhtQuery = hhtQuery.eq('mes', monthFilter);
    }

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      treinamentosQuery = treinamentosQuery.in('cca_id', ccaIds);
      hhtQuery = hhtQuery.in('cca_id', ccaIds);
    }

    // Executar consultas em paralelo
    const [
      { data: treinamentos, error: treinamentosError },
      { data: horasTrabalhadas, error: hhtError }
    ] = await Promise.all([
      treinamentosQuery,
      hhtQuery
    ]);

    if (treinamentosError || !treinamentos) {
      return 0;
    }

    if (hhtError || !horasTrabalhadas || horasTrabalhadas.length === 0) {
      return 0;
    }

    // Calcular total de horas de treinamento
    const totalHorasTreinamento = treinamentos.reduce(
      (acc, item) => acc + (item.horas_totais || 0), 
      0
    );

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
