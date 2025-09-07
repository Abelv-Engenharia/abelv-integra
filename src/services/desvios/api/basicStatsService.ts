
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats, FilterParams } from "../types/dashboardTypes";
import { calculatePercentages, calculateRiskLevel } from "../calculations/statsCalculator";
import { applyFiltersToQuery } from "../utils/filterUtils";
import { calculateStatusAcao } from "@/utils/desviosUtils";

export const fetchDashboardStats = async (filters?: FilterParams): Promise<DashboardStats> => {
  try {
    // Buscar todos os desvios com os campos necessários para calcular o status
    let query = supabase
      .from('desvios_completos')
      .select('id, situacao, status, prazo_conclusao, classificacao_risco');

    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }

    const { data: desviosData, error } = await query;

    if (error) {
      console.error('Erro ao buscar desvios:', error);
      throw error;
    }

    // Calcular status para cada desvio usando a nova lógica
    const desviosComStatusCalculado = (desviosData || []).map(desvio => ({
      ...desvio,
      statusCalculado: calculateStatusAcao(
        desvio.situacao || desvio.status || "", 
        desvio.prazo_conclusao || ""
      )
    }));

    const totalDesvios = desviosComStatusCalculado.length;

    // Contar ações por status calculado
    const acoesCompletas = desviosComStatusCalculado.filter(d => 
      d.statusCalculado === 'CONCLUÍDO'
    ).length;

    const acoesAndamento = desviosComStatusCalculado.filter(d => 
      d.statusCalculado === 'EM ANDAMENTO'
    ).length;

    const acoesPendentes = desviosComStatusCalculado.filter(d => 
      d.statusCalculado === 'PENDENTE'
    ).length;
      
    // Calcular percentuais
    const percentages = calculatePercentages(
      acoesCompletas,
      acoesAndamento,
      acoesPendentes,
      totalDesvios
    );

    // Calcular nível de risco médio com filtros
    const riskLevel = calculateRiskLevel(desviosComStatusCalculado.map(d => ({ classificacao_risco: d.classificacao_risco })));

    const stats = {
      totalDesvios,
      acoesCompletas,
      acoesAndamento,
      acoesPendentes,
      ...percentages,
      riskLevel,
    };

    console.log('Dashboard Stats with calculated status:', stats, filters);
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
