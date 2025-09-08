
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

// Function to fetch data for the bar chart (desvios by month and risk level)
export const fetchDesviosByMonthAndRisk = async (filters?: FilterParams) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select('data_desvio, classificacao_risco')
      .order('data_desvio', { ascending: true })
      .range(0, 99999); // Remove o limite padrão de 1000 registros

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    } else {
      // Default to current year if no filters
      const currentYear = new Date().getFullYear();
      query = query.gte('data_desvio', `${currentYear}-01-01`);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by month and risk:', error);
      return [];
    }

    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const monthData: Record<string, Record<string, number>> = {};

    // Initialize all months with zero counts for all risk levels
    monthNames.forEach(month => {
      monthData[month] = {
        "TRIVIAL": 0,
        "TOLERÁVEL": 0,
        "MODERADO": 0,
        "SUBSTANCIAL": 0,
        "INTOLERÁVEL": 0
      };
    });

    // Count occurrences by month and risk level
    data?.forEach(desvio => {
      const date = new Date(desvio.data_desvio);
      const month = monthNames[date.getMonth()];
      const riskLevel = desvio.classificacao_risco || "TRIVIAL";
      
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
