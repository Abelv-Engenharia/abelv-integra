
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats, FilterParams } from "../types/dashboardTypes";
import { calculatePercentages, calculateRiskLevel } from "../calculations/statsCalculator";
import { applyFiltersToQuery } from "../utils/filterUtils";
import { 
  countAcoesCompletas, 
  countAcoesAndamento, 
  countAcoesPendentes, 
  countTotalDesvios 
} from "./countStatsService";

export const fetchDashboardStats = async (filters?: FilterParams): Promise<DashboardStats> => {
  try {
    console.log('Iniciando fetchDashboardStats com filtros:', filters);

    // Fazer contagens paralelas otimizadas usando COUNT direto no Supabase
    const [totalDesvios, acoesCompletas, acoesAndamento, acoesPendentes] = await Promise.all([
      countTotalDesvios(filters),
      countAcoesCompletas(filters),
      countAcoesAndamento(filters),
      countAcoesPendentes(filters)
    ]);

    console.log('Contagens obtidas:', {
      totalDesvios,
      acoesCompletas,
      acoesAndamento,
      acoesPendentes
    });

    // Buscar dados para cálculo de risco (apenas classificacao_risco)
    let riskQuery = supabase
      .from('desvios_completos')
      .select('classificacao_risco');

    if (filters) {
      riskQuery = applyFiltersToQuery(riskQuery, filters);
    }

    const { data: riskData, error: riskError } = await riskQuery;
    if (riskError) {
      console.warn('Erro ao buscar dados de risco:', riskError);
    }
      
    // Calcular percentuais
    const percentages = calculatePercentages(
      acoesCompletas,
      acoesAndamento,
      acoesPendentes,
      totalDesvios
    );

    // Calcular nível de risco médio com dados de risco
    const riskLevel = calculateRiskLevel(riskData?.map(d => ({ classificacao_risco: d.classificacao_risco })) || []);

    const stats = {
      totalDesvios,
      acoesCompletas,
      acoesAndamento,
      acoesPendentes,
      ...percentages,
      riskLevel,
    };

    console.log('Dashboard Stats otimizadas:', stats, filters);
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
