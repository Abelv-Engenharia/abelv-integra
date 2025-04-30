import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalDesvios: number;
  desviosThisMonth: number;
  pendingActions: number;
  riskLevel: string;
}

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

// Function to fetch data for the bar chart (desvios by month and risk level)
export const fetchDesviosByMonthAndRisk = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const { data, error } = await supabase
      .from('desvios')
      .select('data, classificacao')
      .gte('data', `${currentYear}-01-01`)
      .order('data', { ascending: true });
    
    if (error) {
      console.error('Error fetching desvios by month and risk:', error);
      return [];
    }

    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const monthData: Record<string, Record<string, number>> = {};

    // Initialize all months with zero counts for all risk levels
    monthNames.forEach(month => {
      monthData[month] = {
        "Trivial": 0,
        "Tolerável": 0,
        "Moderado": 0,
        "Substancial": 0,
        "Intolerável": 0
      };
    });

    // Count occurrences by month and risk level
    data?.forEach(desvio => {
      const date = new Date(desvio.data);
      const month = monthNames[date.getMonth()];
      const riskLevel = desvio.classificacao || "Trivial";
      
      if (monthData[month] && monthNames.includes(month)) {
        monthData[month][riskLevel] = (monthData[month][riskLevel] || 0) + 1;
      }
    });

    // Convert to the format expected by the chart
    return Object.entries(monthData)
      .map(([name, values]) => ({
        name,
        ...values
      }))
      .slice(0, 6); // Limit to 6 months for better readability
  } catch (error) {
    console.error('Exception fetching desvios by month and risk:', error);
    return [];
  }
};

// Function to fetch data for pie chart (desvios by type)
export const fetchDesviosByType = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios')
      .select('tipo, count')
      .select('tipo');
    
    if (error) {
      console.error('Error fetching desvios by type:', error);
      return [];
    }

    // Count occurrences of each type
    const typeCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const tipo = desvio.tipo || "Outros";
      typeCounts[tipo] = (typeCounts[tipo] || 0) + 1;
    });

    // Convert to array format for the pie chart
    return Object.entries(typeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Limit to top 5 types
  } catch (error) {
    console.error('Exception fetching desvios by type:', error);
    return [];
  }
};

// Function to fetch data for area chart (desvios by month)
export const fetchDesviosByMonth = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios')
      .select('data');
    
    if (error) {
      console.error('Error fetching desvios by month:', error);
      return [];
    }

    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const monthlyCounts: Record<string, number> = {};
    
    // Initialize all months with zero
    monthNames.forEach(month => {
      monthlyCounts[month] = 0;
    });

    // Count desvios by month
    data?.forEach(desvio => {
      const date = new Date(desvio.data);
      const month = monthNames[date.getMonth()];
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    // Convert to the format expected by the area chart
    return monthNames.map(name => ({
      name,
      value: monthlyCounts[name]
    }));
  } catch (error) {
    console.error('Exception fetching desvios by month:', error);
    return [];
  }
};

// Function to fetch data for risk level bar chart
export const fetchDesviosByRiskLevel = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios')
      .select('classificacao');
    
    if (error) {
      console.error('Error fetching desvios by risk level:', error);
      return [];
    }

    const riskLevels = ["Trivial", "Tolerável", "Moderado", "Substancial", "Intolerável"];
    const riskCounts: Record<string, number> = {};
    
    // Initialize all risk levels with zero
    riskLevels.forEach(risk => {
      riskCounts[risk] = 0;
    });

    // Count desvios by risk level
    data?.forEach(desvio => {
      const risk = desvio.classificacao || "Trivial";
      riskCounts[risk] = (riskCounts[risk] || 0) + 1;
    });

    // Define colors for each risk level
    const riskColors = {
      "Trivial": "#4ade80",
      "Tolerável": "#60a5fa",
      "Moderado": "#facc15",
      "Substancial": "#f97316",
      "Intolerável": "#ef4444"
    };

    // Convert to the format expected by the risk bar chart
    return riskLevels.map(name => ({
      name,
      value: riskCounts[name],
      color: riskColors[name as keyof typeof riskColors]
    }));
  } catch (error) {
    console.error('Exception fetching desvios by risk level:', error);
    return [];
  }
};
