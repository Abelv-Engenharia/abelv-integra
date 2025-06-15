
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
    let completasQuery = createBaseQuery().in('status', ['Fechado', 'CONCLUÍDO', 'TRATADO']);
    completasQuery = applyFiltersToQuery(completasQuery, filters);
    const { count: acoesCompletas } = await completasQuery;

    // Buscar ações em andamento filtradas
    let andamentoQuery = createBaseQuery()
      .eq('status', 'EM TRATATIVA')
      .gt('prazo_conclusao', new Date().toISOString());
    andamentoQuery = applyFiltersToQuery(andamentoQuery, filters);
    const { count: acoesAndamento } = await andamentoQuery;

    // Buscar ações pendentes filtradas (status 'Aberto')
    let pendentesAbertoQuery = createBaseQuery().eq('status', 'Aberto');
    pendentesAbertoQuery = applyFiltersToQuery(pendentesAbertoQuery, filters);
    const { count: pendentesAberto } = await pendentesAbertoQuery;

    // Buscar ações pendentes filtradas ('EM TRATATIVA' com prazo vencido/nulo)
    let pendentesAtrasadoQuery = createBaseQuery()
      .eq('status', 'EM TRATATIVA')
      .or(`prazo_conclusao.is.null,prazo_conclusao.lte.${new Date().toISOString()}`);
    pendentesAtrasadoQuery = applyFiltersToQuery(pendentesAtrasadoQuery, filters);
    const { count: pendentesAtrasado } = await pendentesAtrasadoQuery;

    const acoesPendentes = (pendentesAberto || 0) + (pendentesAtrasado || 0);

    // Calcular percentuais
    const percentages = calculatePercentages(
      acoesCompletas || 0,
      acoesAndamento || 0,
      acoesPendentes,
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
      acoesPendentes: acoesPendentes,
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
