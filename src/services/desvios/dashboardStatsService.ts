
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalDesvios: number;
  acoesCompletas: number;
  acoesAndamento: number;
  acoesPendentes: number;
  percentualCompletas: number;
  percentualAndamento: number;
  percentualPendentes: number;
  riskLevel: string;
}

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
      .eq('status', 'Fechado');

    const { count: acoesAndamento } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Em Andamento');

    const { count: acoesPendentes } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Aberto');

    // Calcular percentuais
    const total = totalDesvios || 1; // Evitar divisão por zero
    const percentualCompletas = Math.round(((acoesCompletas || 0) / total) * 100);
    const percentualAndamento = Math.round(((acoesAndamento || 0) / total) * 100);
    const percentualPendentes = Math.round(((acoesPendentes || 0) / total) * 100);

    // Calcular nível de risco médio
    const { data: riskData } = await supabase
      .from('desvios_completos')
      .select('classificacao_risco')
      .not('classificacao_risco', 'is', null);

    let riskLevel = "Baixo";
    if (riskData && riskData.length > 0) {
      const riskCounts = riskData.reduce((acc: any, item: any) => {
        acc[item.classificacao_risco] = (acc[item.classificacao_risco] || 0) + 1;
        return acc;
      }, {});
      
      const maxRisk = Object.keys(riskCounts).reduce((a, b) => 
        riskCounts[a] > riskCounts[b] ? a : b
      );
      riskLevel = maxRisk || "Baixo";
    }

    return {
      totalDesvios: totalDesvios || 0,
      acoesCompletas: acoesCompletas || 0,
      acoesAndamento: acoesAndamento || 0,
      acoesPendentes: acoesPendentes || 0,
      percentualCompletas,
      percentualAndamento,
      percentualPendentes,
      riskLevel,
    };
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

export const fetchFilteredDashboardStats = async (year: string, month: string): Promise<DashboardStats> => {
  try {
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;

    // Buscar total de desvios do período
    const { count: totalDesvios } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .gte('data_desvio', startDate)
      .lte('data_desvio', endDate);

    // Buscar ações por status do período
    const { count: acoesCompletas } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .gte('data_desvio', startDate)
      .lte('data_desvio', endDate)
      .eq('status', 'Fechado');

    const { count: acoesAndamento } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .gte('data_desvio', startDate)
      .lte('data_desvio', endDate)
      .eq('status', 'Em Andamento');

    const { count: acoesPendentes } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .gte('data_desvio', startDate)
      .lte('data_desvio', endDate)
      .eq('status', 'Aberto');

    // Calcular percentuais
    const total = totalDesvios || 1; // Evitar divisão por zero
    const percentualCompletas = Math.round(((acoesCompletas || 0) / total) * 100);
    const percentualAndamento = Math.round(((acoesAndamento || 0) / total) * 100);
    const percentualPendentes = Math.round(((acoesPendentes || 0) / total) * 100);

    // Calcular nível de risco do período
    const { data: riskData } = await supabase
      .from('desvios_completos')
      .select('classificacao_risco')
      .gte('data_desvio', startDate)
      .lte('data_desvio', endDate)
      .not('classificacao_risco', 'is', null);

    let riskLevel = "Baixo";
    if (riskData && riskData.length > 0) {
      const riskCounts = riskData.reduce((acc: any, item: any) => {
        acc[item.classificacao_risco] = (acc[item.classificacao_risco] || 0) + 1;
        return acc;
      }, {});
      
      const maxRisk = Object.keys(riskCounts).reduce((a, b) => 
        riskCounts[a] > riskCounts[b] ? a : b
      );
      riskLevel = maxRisk || "Baixo";
    }

    return {
      totalDesvios: totalDesvios || 0,
      acoesCompletas: acoesCompletas || 0,
      acoesAndamento: acoesAndamento || 0,
      acoesPendentes: acoesPendentes || 0,
      percentualCompletas,
      percentualAndamento,
      percentualPendentes,
      riskLevel,
    };
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
