
import { supabase } from "@/integrations/supabase/client";

export const fetchDesviosByClassification = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios_completos')
      .select('classificacao_risco')
      .not('classificacao_risco', 'is', null);
    
    if (error) {
      console.error('Error fetching desvios by classification:', error);
      return [];
    }

    // Count occurrences by classification
    const classificationCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const classificacao = desvio.classificacao_risco || "TRIVIAL";
      classificationCounts[classificacao] = (classificationCounts[classificacao] || 0) + 1;
    });

    // Convert to array format for the chart with colors
    const colors = {
      "TRIVIAL": "#4ade80",
      "TOLERÁVEL": "#60a5fa", 
      "MODERADO": "#facc15",
      "SUBSTANCIAL": "#f97316",
      "INTOLERÁVEL": "#ef4444"
    };

    return Object.entries(classificationCounts)
      .map(([name, value]) => ({ 
        name, 
        value,
        color: colors[name as keyof typeof colors] || "#94a3b8"
      }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by classification:', error);
    return [];
  }
};
