
import { supabase } from "@/integrations/supabase/client";

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
