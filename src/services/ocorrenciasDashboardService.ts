import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, parseISO } from 'date-fns';
import { OcorrenciasByRisco, OcorrenciasByTipo, OcorrenciasByEmpresa, OcorrenciasStats, OcorrenciasTimeline, ParteCorpoData } from '@/types/users';

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

export interface DashboardStats {
  totalOcorrencias: number;
  ocorrenciasThisMonth: number;
  pendingActions: number;
  riskLevel: string;
}

export async function fetchOcorrenciasByTipo(): Promise<OcorrenciasByTipo[]> {
  try {
    // Usar o campo tipo_ocorrencia em vez de tipo_acidente
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('tipo_ocorrencia')
      .order('tipo_ocorrencia');

    if (error) throw error;

    // Agrupar e contar as ocorrências por tipo
    const tiposContagem: Record<string, number> = {};
    
    data?.forEach(ocorrencia => {
      const tipo = ocorrencia.tipo_ocorrencia || 'Não classificado';
      tiposContagem[tipo] = (tiposContagem[tipo] || 0) + 1;
    });

    return Object.entries(tiposContagem).map(([tipo, quantidade]) => ({
      name: tipo,
      value: quantidade
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por tipo:', error);
    return [];
  }
}

export async function fetchOcorrenciasByRisco(): Promise<OcorrenciasByRisco[]> {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('classificacao_risco')
      .order('classificacao_risco');

    if (error) throw error;

    // Agrupar e contar as ocorrências por classificação de risco
    const riscosContagem: Record<string, number> = {};
    
    data?.forEach(ocorrencia => {
      const risco = ocorrencia.classificacao_risco || 'Não classificado';
      riscosContagem[risco] = (riscosContagem[risco] || 0) + 1;
    });

    return Object.entries(riscosContagem).map(([risco, quantidade]) => ({
      name: risco,
      value: quantidade
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por risco:', error);
    return [];
  }
}

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

export async function fetchFilteredDashboardStats(year: string, month: string): Promise<DashboardStats> {
  // Filtrar por ano e mês como foi feito acima, mas aplicando os filtros do usuário
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

// Adicionar funções que faltavam
export async function fetchOcorrenciasByEmpresa(): Promise<OcorrenciasByEmpresa[]> {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('empresa')
      .order('empresa');

    if (error) throw error;

    // Agrupar e contar as ocorrências por empresa
    const empresasContagem: Record<string, number> = {};
    
    data?.forEach(ocorrencia => {
      const empresa = ocorrencia.empresa || 'Não especificada';
      empresasContagem[empresa] = (empresasContagem[empresa] || 0) + 1;
    });

    return Object.entries(empresasContagem).map(([empresa, quantidade]) => ({
      name: empresa,
      value: quantidade
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por empresa:', error);
    return [];
  }
}

export async function fetchOcorrenciasTimeline(): Promise<OcorrenciasTimeline[]> {
  return fetchOcorrenciasByMonth();
}

export async function fetchParteCorpoData(): Promise<ParteCorpoData[]> {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('partes_corpo_afetadas')
      .not('partes_corpo_afetadas', 'is', null);

    if (error) throw error;

    // Processar arrays de partes do corpo e contabilizar
    const partesCorpoContagem: Record<string, number> = {};
    
    data?.forEach(ocorrencia => {
      if (Array.isArray(ocorrencia.partes_corpo_afetadas)) {
        ocorrencia.partes_corpo_afetadas.forEach((parte: string) => {
          partesCorpoContagem[parte] = (partesCorpoContagem[parte] || 0) + 1;
        });
      }
    });

    return Object.entries(partesCorpoContagem)
      .map(([parte, quantidade]) => ({
        name: parte,
        value: quantidade
      }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Erro ao buscar dados de partes do corpo:', error);
    return [];
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
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar ocorrências recentes:', error);
    return [];
  }
}
