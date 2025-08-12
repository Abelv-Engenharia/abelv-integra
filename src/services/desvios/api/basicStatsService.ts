
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats, FilterParams } from "../types/dashboardTypes";
import { calculatePercentages, calculateRiskLevel } from "../calculations/statsCalculator";
import { applyFiltersToQuery } from "../utils/filterUtils";

export const fetchDashboardStats = async (filters?: FilterParams): Promise<DashboardStats> => {
  try {
    // Buscar total de desvios com filtros
    let totalQuery = supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true });

    if (filters) {
      totalQuery = applyFiltersToQuery(totalQuery, filters);
    }

    const { count: totalDesvios } = await totalQuery;

    // Buscar ações por status com filtros
    let acoesCompletasQuery = supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .in('status', ['Fechado', 'CONCLUÍDO', 'TRATADO']);

    if (filters) {
      acoesCompletasQuery = applyFiltersToQuery(acoesCompletasQuery, filters);
    }

    const { count: acoesCompletas } = await acoesCompletasQuery;

    let acoesAndamentoQuery = supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .in('status', ['EM TRATATIVA', 'EM ANDAMENTO']);

    if (filters) {
      acoesAndamentoQuery = applyFiltersToQuery(acoesAndamentoQuery, filters);
    }

    const { count: acoesAndamento } = await acoesAndamentoQuery;

    // Ações Pendentes: status 'Aberto' ou 'PENDENTE'
    let acoesPendentesQuery = supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .in('status', ['Aberto', 'PENDENTE']);

    if (filters) {
      acoesPendentesQuery = applyFiltersToQuery(acoesPendentesQuery, filters);
    }

    const { count: acoesPendentes } = await acoesPendentesQuery;
      
    // Calcular percentuais
    const percentages = calculatePercentages(
      acoesCompletas || 0,
      acoesAndamento || 0,
      acoesPendentes || 0,
      totalDesvios || 0
    );

    // Calcular nível de risco médio com filtros
    let riskQuery = supabase
      .from('desvios_completos')
      .select('classificacao_risco')
      .not('classificacao_risco', 'is', null);

    if (filters) {
      riskQuery = applyFiltersToQuery(riskQuery, filters);
    }

    const { data: riskData } = await riskQuery;

    const riskLevel = calculateRiskLevel(riskData || []);

    const stats = {
      totalDesvios: totalDesvios || 0,
      acoesCompletas: acoesCompletas || 0,
      acoesAndamento: acoesAndamento || 0,
      acoesPendentes: acoesPendentes || 0,
      ...percentages,
      riskLevel,
    };

    console.log('Dashboard Stats with filters:', stats, filters);
    return stats;
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    return {
      totalDesvios: 0,
      acoesCompletas: 0,
      acoesAndamento: 0,
      acoesPendentes: 0,
      percentualCompletas: 0,
      percentualAndamento: 0,
      percentualPendentes: 0,
      riskLevel: "Baixo",
    };
  }
};
