
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, parseISO } from 'date-fns';

export async function fetchDashboardStats() {
  try {
    const { data: allOcorrencias, error: countError } = await supabase
      .from('ocorrencias')
      .select('id, data, status, classificacao_risco');

    if (countError) throw countError;

    console.log('Todas as ocorrências para stats:', allOcorrencias);

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const ocorrenciasThisMonth = allOcorrencias
      ? allOcorrencias.filter(o => {
          const ocorrenciaDate = new Date(o.data);
          return ocorrenciaDate >= firstDayOfMonth;
        }).length
      : 0;

    const pendingActions = allOcorrencias
      ? allOcorrencias.filter(o => o.status === 'Em tratativa' || o.status === 'Aberta').length
      : 0;

    // Calcular nível de risco com base nas ocorrências recentes
    let riskLevel = 'Baixo';
    const criticasRecentes = allOcorrencias
      ? allOcorrencias.filter(o => {
          const ocorrenciaDate = new Date(o.data);
          const threeMonthsAgo = subMonths(today, 3);
          return ocorrenciaDate >= threeMonthsAgo && (o.classificacao_risco === 'INTOLERÁVEL' || o.classificacao_risco === 'SUBSTANCIAL');
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

export async function fetchLatestOcorrencias() {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('*')
      .order('data', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    console.log('Últimas ocorrências:', data);
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar ocorrências recentes:', error);
    return [];
  }
}

export async function fetchOcorrenciasByTipo() {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('classificacao_ocorrencia');

    if (error) throw error;

    console.log('Dados para gráfico por tipo:', data);

    const tipoCount = (data || []).reduce((acc: Record<string, number>, curr) => {
      const tipo = curr.classificacao_ocorrencia || 'Não definido';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(tipoCount).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por tipo:', error);
    return [];
  }
}

export async function fetchOcorrenciasByEmpresa() {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('empresa');

    if (error) throw error;

    console.log('Dados para gráfico por empresa:', data);

    const empresaCount = (data || []).reduce((acc: Record<string, number>, curr) => {
      const empresa = curr.empresa || 'Não definido';
      acc[empresa] = (acc[empresa] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(empresaCount).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por empresa:', error);
    return [];
  }
}

export async function fetchOcorrenciasByRisco() {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('classificacao_risco');

    if (error) throw error;

    console.log('Dados para gráfico por risco:', data);

    const riscoCount = (data || []).reduce((acc: Record<string, number>, curr) => {
      const risco = curr.classificacao_risco || 'Não definido';
      acc[risco] = (acc[risco] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(riscoCount).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por risco:', error);
    return [];
  }
}

export async function fetchParteCorpoData() {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('parte_corpo_atingida')
      .not('parte_corpo_atingida', 'is', null)
      .neq('parte_corpo_atingida', '');

    if (error) throw error;

    console.log('Dados para gráfico parte do corpo:', data);

    const parteCount = (data || []).reduce((acc: Record<string, number>, curr) => {
      const parte = curr.parte_corpo_atingida || 'Não definido';
      acc[parte] = (acc[parte] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(parteCount).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error('Erro ao buscar dados de partes do corpo:', error);
    return [];
  }
}

export async function fetchOcorrenciasTimeline() {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('data, mes, ano')
      .order('data', { ascending: true });

    if (error) throw error;

    console.log('Dados para timeline:', data);

    const monthlyCount = (data || []).reduce((acc: Record<string, number>, curr) => {
      if (curr.mes && curr.ano) {
        const key = `${curr.ano}-${curr.mes.toString().padStart(2, '0')}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(monthlyCount)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month,
        ocorrencias: count
      }));
  } catch (error) {
    console.error('Erro ao buscar timeline de ocorrências:', error);
    return [];
  }
}
