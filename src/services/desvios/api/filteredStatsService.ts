
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats, FilterParams } from "../types/dashboardTypes";
import { applyFiltersToQuery, createBaseQuery } from "../utils/filterUtils";
import { calculatePercentages, calculateRiskLevel } from "../calculations/statsCalculator";

export const fetchFilteredDashboardStats = async (filters: FilterParams): Promise<DashboardStats> => {
  try {
    // Buscar total de desvios filtrados
    let totalQuery = createBaseQuery();
    totalQuery = applyFiltersToQuery(totalQuery, filters);
    const { count: totalDesvios } = await totalQuery;

    // Buscar ações completas filtradas
    let completasQuery = createBaseQuery().eq('status', 'Fechado');
    completasQuery = applyFiltersToQuery(completasQuery, filters);
    const { count: acoesCompletas } = await completasQuery;

    // Buscar ações em andamento filtradas
    let andamentoQuery = createBaseQuery().eq('status', 'Em Andamento');
    andamentoQuery = applyFiltersToQuery(andamentoQuery, filters);
    const { count: acoesAndamento } = await andamentoQuery;

    // Buscar ações pendentes filtradas
    let pendentesQuery = createBaseQuery().eq('status', 'Aberto');
    pendentesQuery = applyFiltersToQuery(pendentesQuery, filters);
    const { count: acoesPendentes } = await pendentesQuery;

    // Calcular percentuais
    const percentages = calculatePercentages(
      acoesCompletas || 0,
      acoesAndamento || 0,
      acoesPendentes || 0,
      totalDesvios || 0
    );

    // Calcular nível de risco do período filtrado
    let riskQuery = supabase.from('desvios_completos').select('classificacao_risco').not('classificacao_risco', 'is', null);
    riskQuery = applyFiltersToQuery(riskQuery, filters);
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

    console.log('Filtered Dashboard Stats:', stats);
    return stats;
  } catch (error) {
    console.error('Erro ao buscar estatísticas filtradas:', error);
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
