
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth } from "date-fns";

export const fetchInspecoesStats = async () => {
  // Get today's date
  const today = new Date();
  
  // Calculate start and end of current month
  const startMonth = startOfMonth(today);
  const endMonth = endOfMonth(today);
  
  try {
    // Fetch total inspections
    const { count: totalInspecoes } = await supabase
      .from('inspecoes')
      .select('*', { count: 'exact', head: true });
    
    // Fetch inspections this month
    const { count: inspecoesMes } = await supabase
      .from('inspecoes')
      .select('*', { count: 'exact', head: true })
      .gte('data', startMonth.toISOString())
      .lte('data', endMonth.toISOString());
    
    // Fetch pending inspections
    const { count: inspecoesPendentes } = await supabase
      .from('inspecoes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pendente');
    
    // Fetch anomalies found
    const { count: anomaliasEncontradas } = await supabase
      .from('inspecoes')
      .select('*', { count: 'exact', head: true })
      .gt('qtd_anomalias', 0);
    
    return {
      totalInspecoes: totalInspecoes || 0,
      inspecoesMes: inspecoesMes || 0,
      inspecoesPendentes: inspecoesPendentes || 0,
      anomaliasEncontradas: anomaliasEncontradas || 0
    };
  } catch (error) {
    console.error("Error fetching inspecoes stats:", error);
    return {
      totalInspecoes: 0,
      inspecoesMes: 0,
      inspecoesPendentes: 0,
      anomaliasEncontradas: 0
    };
  }
};

export const fetchInspecoesChartData = async () => {
  try {
    // Fetch inspections with date and status
    const { data } = await supabase
      .from('inspecoes')
      .select('data, status')
      .order('data', { ascending: false })
      .limit(100);
    
    // Process data for chart
    const chartData = (data || []).reduce((acc: Record<string, Record<string, number>>, inspecao) => {
      const date = new Date(inspecao.data);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthYear = `${month}/${year}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          name: monthYear,
          Concluída: 0,
          Pendente: 0,
          Cancelada: 0
        };
      }
      
      if (inspecao.status === 'Concluída') {
        acc[monthYear].Concluída += 1;
      } else if (inspecao.status === 'Pendente') {
        acc[monthYear].Pendente += 1;
      } else if (inspecao.status === 'Cancelada') {
        acc[monthYear].Cancelada += 1;
      }
      
      return acc;
    }, {});
    
    // Convert to array and sort by date
    return Object.values(chartData).sort((a, b) => {
      const [aMonth, aYear] = a.name.split('/').map(Number);
      const [bMonth, bYear] = b.name.split('/').map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });
  } catch (error) {
    console.error("Error fetching inspecoes chart data:", error);
    return [];
  }
};

export const fetchInspecoesStatusData = async () => {
  try {
    // Fetch inspections with status
    const { data } = await supabase
      .from('inspecoes')
      .select('status')
      .limit(1000);
    
    // Count inspections by status
    const statusCount = (data || []).reduce((acc: Record<string, number>, inspecao) => {
      if (!acc[inspecao.status]) {
        acc[inspecao.status] = 0;
      }
      acc[inspecao.status] += 1;
      return acc;
    }, {});
    
    // Format data for chart
    return [
      { name: "Concluída", value: statusCount["Concluída"] || 0 },
      { name: "Pendente", value: statusCount["Pendente"] || 0 },
      { name: "Cancelada", value: statusCount["Cancelada"] || 0 }
    ];
  } catch (error) {
    console.error("Error fetching inspecoes status data:", error);
    return [];
  }
};

export const fetchRecentInspections = async () => {
  try {
    // Fetch recent inspections
    const { data } = await supabase
      .from('inspecoes')
      .select('id, data, tipo, local, responsavel, status')
      .order('data', { ascending: false })
      .limit(5);
    
    return data || [];
  } catch (error) {
    console.error("Error fetching recent inspections:", error);
    return [];
  }
};

export const fetchDesviosByInspectionType = async () => {
  try {
    // Fetch desvios by inspection type
    const { data } = await supabase
      .from('inspecoes')
      .select('tipo, qtd_anomalias')
      .gt('qtd_anomalias', 0)
      .limit(100);
    
    // Group desvios by inspection type
    const desviosByType = (data || []).reduce((acc: Record<string, number>, inspecao) => {
      if (!acc[inspecao.tipo]) {
        acc[inspecao.tipo] = 0;
      }
      acc[inspecao.tipo] += inspecao.qtd_anomalias;
      return acc;
    }, {});
    
    // Format data for chart
    return Object.entries(desviosByType).map(([name, value]) => ({ name, value }));
  } catch (error) {
    console.error("Error fetching desvios by inspection type:", error);
    return [];
  }
};
