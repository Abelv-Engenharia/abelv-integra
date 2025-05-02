
import { supabase } from "@/integrations/supabase/client";

// Fetch inspecoes by status for donut chart
export const fetchInspecoesByStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('hora_seguranca')
      .select('status')
      .limit(500);

    if (error) throw error;

    // Group by status
    const counts = (data || []).reduce((acc: Record<string, number>, item) => {
      const status = item.status || 'Não definido';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Format data for chart
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  } catch (error) {
    console.error("Error fetching inspecoes by status:", error);
    return [];
  }
};

// Fetch inspecoes by month for bar chart
export const fetchInspecoesByMonth = async () => {
  try {
    const { data, error } = await supabase
      .from('hora_seguranca')
      .select('data, tipo')
      .order('data', { ascending: true })
      .limit(500);

    if (error) throw error;

    // Group by month and count
    const monthlyData = (data || []).reduce((acc: Record<string, any>, item) => {
      if (!item.data) return acc;
      
      const date = new Date(item.data);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const monthYear = `${month}/${year}`;

      if (!acc[monthYear]) {
        acc[monthYear] = {
          name: monthYear,
          programadas: 0,
          naoProgramadas: 0,
        };
      }

      if (item.tipo === 'Programada') {
        acc[monthYear].programadas += 1;
      } else {
        acc[monthYear].naoProgramadas += 1;
      }

      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(monthlyData).sort((a, b) => {
      const [aMonth, aYear] = a.name.split('/').map(Number);
      const [bMonth, bYear] = b.name.split('/').map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });
  } catch (error) {
    console.error("Error fetching inspecoes by month:", error);
    return [];
  }
};

// Fetch desvios by inspection type
export const fetchDesviosByInspectionType = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios')
      .select('tipo_inspecao, id')
      .limit(500);

    if (error) throw error;

    // Count desvios by inspection type
    const counts = (data || []).reduce((acc: Record<string, number>, item) => {
      const tipo = item.tipo_inspecao || 'Não definido';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    // Format data for chart
    return Object.entries(counts).map(([name, value]) => ({ name, value: Number(value) }));
  } catch (error) {
    console.error("Error fetching desvios by inspection type:", error);
    return [];
  }
};

// Fetch desvios by responsavel
export const fetchDesviosByResponsavel = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios')
      .select('responsavel, id')
      .limit(500);

    if (error) throw error;

    // Count desvios by responsavel
    const counts = (data || []).reduce((acc: Record<string, number>, item) => {
      const responsavel = item.responsavel || 'Não atribuído';
      acc[responsavel] = (acc[responsavel] || 0) + 1;
      return acc;
    }, {});

    // Format data for chart and sort
    const chartData = Object.entries(counts)
      .map(([name, value]) => ({ name, value: Number(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Get top 10 responsáveis

    return chartData;
  } catch (error) {
    console.error("Error fetching desvios by responsavel:", error);
    return [];
  }
};

// Fetch recent inspections
export const fetchRecentInspections = async () => {
  try {
    const { data, error } = await supabase
      .from('hora_seguranca')
      .select('*')
      .order('data', { ascending: false })
      .limit(5);

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching recent inspections:", error);
    return [];
  }
};

// Fetch inspection stats summary
export const fetchInspectionsSummary = async () => {
  try {
    // Get total inspections
    const { count: totalInspecoes } = await supabase
      .from('hora_seguranca')
      .select('*', { count: 'exact', head: true });
    
    // Get programmed inspections
    const { count: programadas } = await supabase
      .from('hora_seguranca')
      .select('*', { count: 'exact', head: true })
      .eq('tipo', 'Programada');
    
    // Get non-programmed inspections
    const { count: naoProgramadas } = await supabase
      .from('hora_seguranca')
      .select('*', { count: 'exact', head: true })
      .eq('tipo', 'Não Programada');
    
    // Get deviations identified
    const { count: desviosIdentificados } = await supabase
      .from('desvios')
      .select('*', { count: 'exact', head: true })
      .not('tipo_inspecao', 'is', null);
    
    // Get completed inspections
    const { count: realizadas } = await supabase
      .from('hora_seguranca')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Realizada');
    
    // Get canceled inspections
    const { count: canceladas } = await supabase
      .from('hora_seguranca')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Cancelada');
    
    return {
      totalInspecoes: totalInspecoes || 0,
      programadas: programadas || 0,
      naoProgramadas: naoProgramadas || 0,
      desviosIdentificados: desviosIdentificados || 0,
      realizadas: realizadas || 0,
      canceladas: canceladas || 0
    };
  } catch (error) {
    console.error("Error fetching inspections summary:", error);
    return {
      totalInspecoes: 0,
      programadas: 0,
      naoProgramadas: 0,
      desviosIdentificados: 0,
      realizadas: 0,
      canceladas: 0
    };
  }
};
