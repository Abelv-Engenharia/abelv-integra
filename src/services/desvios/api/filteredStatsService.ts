
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats, FilterParams } from "../types/dashboardTypes";
import { applyFiltersToQuery } from "../utils/filterUtils";
import { calculatePercentages, calculateRiskLevel } from "../calculations/statsCalculator";
import { 
  countAcoesCompletas, 
  countAcoesAndamento, 
  countAcoesPendentes, 
  countTotalDesvios 
} from "./countStatsService";

export const fetchFilteredDashboardStats = async (filters: FilterParams): Promise<DashboardStats> => {
  try {
    console.log('fetchFilteredDashboardStats iniciado com filtros:', filters);
    
    // Fazer contagens paralelas otimizadas usando COUNT direto no Supabase
    const [totalDesvios, acoesCompletas, acoesAndamento, acoesPendentes] = await Promise.all([
      countTotalDesvios(filters),
      countAcoesCompletas(filters),
      countAcoesAndamento(filters),
      countAcoesPendentes(filters)
    ]);

    console.log('Contagens filtradas obtidas:', {
      totalDesvios,
      acoesCompletas,
      acoesAndamento,
      acoesPendentes
    });

    // Buscar dados para cálculo de risco (apenas classificacao_risco)
    let riskQuery = supabase
      .from('desvios_completos')
      .select('classificacao_risco')
      .range(0, 9999); // Limite menor para cálculo de risco
    
    riskQuery = applyFiltersToQuery(riskQuery, filters);
    
    const { data: riskData, error: riskError } = await riskQuery;
    if (riskError) {
      console.warn('Erro ao buscar dados de risco filtrados:', riskError);
    }

    // Calcular percentuais
    const percentages = calculatePercentages(
      acoesCompletas,
      acoesAndamento,
      acoesPendentes,
      totalDesvios
    );

    // Calcular nível de risco do período filtrado
    const riskLevel = calculateRiskLevel(riskData?.map(d => ({ classificacao_risco: d.classificacao_risco })) || []);

    const stats = {
      totalDesvios,
      acoesCompletas,
      acoesAndamento,
      acoesPendentes,
      ...percentages,
      riskLevel,
    };

    console.log('Filtered Dashboard Stats otimizadas:', stats);
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
