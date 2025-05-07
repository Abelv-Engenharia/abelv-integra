
import { supabase } from "@/integrations/supabase/client";

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
