
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, parseISO } from 'date-fns';
import { OcorrenciasTimeline } from './types';

export async function fetchOcorrenciasByMonth(): Promise<OcorrenciasTimeline[]> {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('data')
      .order('data');

    if (error) throw error;

    // Agrupar por mês
    const mesesContagem: Record<string, number> = {};
    
    // Inicializar com os últimos 6 meses
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthKey = format(date, 'yyyy-MM');
      const monthDisplay = format(date, 'MMM/yyyy');
      mesesContagem[monthKey] = 0;
    }
    
    // Contar ocorrências por mês
    data?.forEach(ocorrencia => {
      const date = parseISO(ocorrencia.data);
      const monthKey = format(date, 'yyyy-MM');
      if (monthKey in mesesContagem) {
        mesesContagem[monthKey] += 1;
      }
    });

    // Converter para array no formato esperado pelo componente de gráfico
    return Object.entries(mesesContagem).map(([monthKey, quantidade]) => {
      const date = parseISO(`${monthKey}-01`);
      return {
        month: format(date, 'MMM/yyyy'),
        ocorrencias: quantidade
      };
    });
  } catch (error) {
    console.error('Erro ao buscar ocorrências por mês:', error);
    return [];
  }
}

export async function fetchOcorrenciasTimeline(): Promise<OcorrenciasTimeline[]> {
  return fetchOcorrenciasByMonth();
}
