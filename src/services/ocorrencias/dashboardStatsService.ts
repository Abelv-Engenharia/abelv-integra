
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, parseISO } from 'date-fns';
import { DashboardStats } from './types';

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const { data: allOcorrencias, error: countError } = await supabase
      .from('ocorrencias')
      .select('id, data, status, classificacao_risco');

    if (countError) throw countError;

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const ocorrenciasThisMonth = allOcorrencias
      ? allOcorrencias.filter(o => {
          const ocorrenciaDate = parseISO(o.data);
          return ocorrenciaDate >= firstDayOfMonth;
        }).length
      : 0;

    const pendingActions = allOcorrencias
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

    if (criticasRecentes >= 5) {
      riskLevel = 'Alto';
    } else if (criticasRecentes >= 2) {
      riskLevel = 'Médio';
    }

    return {
      totalOcorrencias: allOcorrencias ? allOcorrencias.length : 0,
      ocorrenciasThisMonth,
      pendingActions,
      riskLevel
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    return {
      totalOcorrencias: 0,
      ocorrenciasThisMonth: 0,
      pendingActions: 0,
      riskLevel: 'Baixo'
    };
  }
}

export async function fetchFilteredDashboardStats(year: string, month: string): Promise<DashboardStats> {
  try {
    const yearMonth = `${year}-${month.padStart(2, '0')}`;
    
    const { data: allOcorrencias, error: countError } = await supabase
      .from('ocorrencias')
      .select('id, data, status, classificacao_risco');

    if (countError) throw countError;

    // Filtrar por ano e mês
    const ocorrenciasFiltradas = allOcorrencias
      ? allOcorrencias.filter(o => {
          const ocorrenciaDate = parseISO(o.data);
          return format(ocorrenciaDate, 'yyyy-MM') === yearMonth;
        })
      : [];

    const pendingActions = ocorrenciasFiltradas
      ? ocorrenciasFiltradas.filter(o => o.status === 'aberta' || o.status === 'em_andamento').length
      : 0;

    // Calcular nível de risco com base nas ocorrências filtradas
    let riskLevel = 'Baixo';
    const criticas = ocorrenciasFiltradas
      ? ocorrenciasFiltradas.filter(o => o.classificacao_risco === 'Alta' || o.classificacao_risco === 'Crítica').length
      : 0;

    if (criticas >= 5) {
      riskLevel = 'Alto';
    } else if (criticas >= 2) {
      riskLevel = 'Médio';
    }

    return {
      totalOcorrencias: allOcorrencias ? allOcorrencias.length : 0,
      ocorrenciasThisMonth: ocorrenciasFiltradas.length,
      pendingActions,
      riskLevel
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas filtradas do dashboard:', error);
    return {
      totalOcorrencias: 0,
      ocorrenciasThisMonth: 0,
      pendingActions: 0,
      riskLevel: 'Baixo'
    };
  }
}
