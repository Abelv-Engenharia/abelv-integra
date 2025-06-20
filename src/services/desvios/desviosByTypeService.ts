
import { supabase } from "@/integrations/supabase/client";

// Function to fetch data for pie chart (desvios by type)
export const fetchDesviosByType = async (ccaIds?: string[]) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        tipo_registro_id,
        tipos_registro:tipo_registro_id(codigo, nome)
      `)
      .not('tipo_registro_id', 'is', null);

    // Apply CCA filter if provided
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds.map(id => parseInt(id)));
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by type:', error);
      return [];
    }

    // Count occurrences of each type
    const typeCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const tipo = desvio.tipos_registro?.nome || "Outros";
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
