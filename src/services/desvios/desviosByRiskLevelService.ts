
import { supabase } from "@/integrations/supabase/client";

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
