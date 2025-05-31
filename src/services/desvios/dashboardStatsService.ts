
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalDesvios: number;
  desviosThisMonth: number;
  pendingActions: number;
  riskLevel: string;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Buscar total de desvios
    const { count: totalDesvios } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true });

    // Buscar desvios deste mês
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const { count: desviosThisMonth } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .eq('created_at', `${currentYear}-${currentMonth.toString().padStart(2, '0')}`);

    // Buscar ações pendentes (status diferente de 'Fechado')
    const { count: pendingActions } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'Fechado');

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
      desviosThisMonth: desviosThisMonth || 0,
      pendingActions: pendingActions || 0,
      riskLevel,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    return {
      totalDesvios: 0,
      desviosThisMonth: 0,
      pendingActions: 0,
      riskLevel: "Baixo",
    };
  }
};

export const fetchFilteredDashboardStats = async (year: string, month: string): Promise<DashboardStats> => {
  try {
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = `${year}-${month.padStart(2, '0')}-31`;

    // Buscar desvios do período filtrado
    const { count: desviosFiltered } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .gte('data_desvio', startDate)
      .lte('data_desvio', endDate);

    // Buscar ações pendentes do período
    const { count: pendingFiltered } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .gte('data_desvio', startDate)
      .lte('data_desvio', endDate)
      .neq('status', 'Fechado');

    // Buscar total geral
    const { count: totalDesvios } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true });

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
      desviosThisMonth: desviosFiltered || 0,
      pendingActions: pendingFiltered || 0,
      riskLevel,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas filtradas:', error);
    return {
      totalDesvios: 0,
      desviosThisMonth: 0,
      pendingActions: 0,
      riskLevel: "Baixo",
    };
  }
};
