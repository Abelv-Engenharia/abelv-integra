
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "../types/dashboardTypes";
import { calculatePercentages, calculateRiskLevel } from "../calculations/statsCalculator";

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Buscar total de desvios
    const { count: totalDesvios } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true });

    // Buscar ações por status
    const { count: acoesCompletas } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .in('status', ['Fechado', 'CONCLUÍDO', 'TRATADO']);

    const { count: acoesAndamento } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'EM TRATATIVA')
      .gt('prazo_conclusao', new Date().toISOString());

    // Ações Pendentes: status 'Aberto'
    const { count: pendentesAberto } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Aberto');

    // Ações Pendentes: 'EM TRATATIVA' com prazo vencido/nulo
    const { count: pendentesAtrasado } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'EM TRATATIVA')
      .or(`prazo_conclusao.is.null,prazo_conclusao.lte.${new Date().toISOString()}`);
      
    const acoesPendentes = (pendentesAberto || 0) + (pendentesAtrasado || 0);

    // Calcular percentuais
    const percentages = calculatePercentages(
      acoesCompletas || 0,
      acoesAndamento || 0,
      acoesPendentes,
      totalDesvios || 0
    );

    // Calcular nível de risco médio
    const { data: riskData } = await supabase
      .from('desvios_completos')
      .select('classificacao_risco')
      .not('classificacao_risco', 'is', null);

    const riskLevel = calculateRiskLevel(riskData || []);

    const stats = {
      totalDesvios: totalDesvios || 0,
      acoesCompletas: acoesCompletas || 0,
      acoesAndamento: acoesAndamento || 0,
      acoesPendentes: acoesPendentes,
      ...percentages,
      riskLevel,
    };

    console.log('Dashboard Stats:', stats);
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
