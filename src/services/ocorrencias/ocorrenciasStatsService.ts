
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, parseISO } from 'date-fns';
import { OcorrenciasStats } from './types';

export async function fetchOcorrenciasStats(): Promise<OcorrenciasStats> {
  try {
    const { data: allOcorrencias, error: countError } = await supabase
      .from('ocorrencias')
      .select('id, data, status, classificacao_risco');

    if (countError) throw countError;

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const ocorrenciasMes = allOcorrencias
      ? allOcorrencias.filter(o => {
          const ocorrenciaDate = parseISO(o.data);
          return ocorrenciaDate >= firstDayOfMonth;
        }).length
      : 0;

    const ocorrenciasPendentes = allOcorrencias
      ? allOcorrencias.filter(o => o.status === 'aberta' || o.status === 'em_andamento').length
      : 0;

    // Calcular nível de risco com base nas ocorrências recentes
    let riskLevel = 'Baixo';
    const criticasRecentes = allOcorrencias
      ? allOcorrencias.filter(o => {
          const ocorrenciaDate = parseISO(o.data);
          const threeMonthsAgo = subMonths(today, 3);
          return ocorrenciaDate >= threeMonthsAgo && (o.classificacao_risco === 'Alta' || o.classificacao_risco === 'Crítica');
        }).length
      : 0;

    const riscoPercentage = allOcorrencias && allOcorrencias.length > 0
      ? Math.round((criticasRecentes / allOcorrencias.length) * 100)
      : 0;

    return {
      totalOcorrencias: allOcorrencias ? allOcorrencias.length : 0,
      ocorrenciasMes,
      ocorrenciasPendentes,
      riscoPercentage
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas de ocorrências:', error);
    return {
      totalOcorrencias: 0,
      ocorrenciasMes: 0,
      ocorrenciasPendentes: 0,
      riscoPercentage: 0
    };
  }
}
