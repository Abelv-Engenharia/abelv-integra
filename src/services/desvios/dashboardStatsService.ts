
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "./types";

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Contar total de desvios
    const { count: totalCount, error: totalError } = await supabase
      .from('desvios')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) {
      console.error('Erro ao contar desvios:', totalError);
    }

    // Contar desvios deste mês
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const { count: monthlyCount, error: monthlyError } = await supabase
      .from('desvios')
      .select('*', { count: 'exact', head: true })
      .gte('data', firstDayOfMonth.toISOString())
      .lte('data', lastDayOfMonth.toISOString());
    
    if (monthlyError) {
      console.error('Erro ao contar desvios do mês:', monthlyError);
    }

    // Contar ações pendentes
    const { count: pendingCount, error: pendingError } = await supabase
      .from('desvios')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pendente');
    
    if (pendingError) {
      console.error('Erro ao contar ações pendentes:', pendingError);
    }

    // Determinar nível de risco médio
    const { data: riskData, error: riskError } = await supabase
      .from('desvios')
      .select('classificacao');
    
    if (riskError) {
      console.error('Erro ao buscar classificações de risco:', riskError);
    }
    
    let riskLevel = "Baixo";
    if (riskData && riskData.length > 0) {
      const riskLevels = {
        "Trivial": 1,
        "Tolerável": 2,
        "Moderado": 3,
        "Substancial": 4,
        "Intolerável": 5
      };
      
      const riskValues = riskData
        .filter(item => item.classificacao)
        .map(item => riskLevels[item.classificacao as keyof typeof riskLevels] || 0);
      
      if (riskValues.length > 0) {
        const avgRisk = riskValues.reduce((sum, val) => sum + val, 0) / riskValues.length;
        
        if (avgRisk >= 4) riskLevel = "Alto";
        else if (avgRisk >= 3) riskLevel = "Moderado";
        else if (avgRisk >= 2) riskLevel = "Baixo";
      }
    }

    return {
      totalDesvios: totalCount || 0,
      desviosThisMonth: monthlyCount || 0,
      pendingActions: pendingCount || 0,
      riskLevel: riskLevel
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    return {
      totalDesvios: 0,
      desviosThisMonth: 0,
      pendingActions: 0,
      riskLevel: "Baixo"
    };
  }
};

export const fetchFilteredDashboardStats = async (year: string, month: string): Promise<DashboardStats> => {
  try {
    // Placeholder for filtered stats - implement actual filtering here
    console.log(`Fetching filtered stats for ${month}/${year}`);
    
    // For now, return the general stats
    return await fetchDashboardStats();
  } catch (error) {
    console.error('Erro ao buscar estatísticas filtradas:', error);
    return {
      totalDesvios: 0,
      desviosThisMonth: 0,
      pendingActions: 0,
      riskLevel: "Baixo"
    };
  }
};
