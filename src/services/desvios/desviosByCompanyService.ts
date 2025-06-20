
import { supabase } from "@/integrations/supabase/client";

export const fetchDesviosByCompany = async (ccaIds?: string[]) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        empresa_id,
        empresas:empresa_id(nome)
      `)
      .not('empresa_id', 'is', null);

    // Apply CCA filter if provided
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds.map(id => parseInt(id)));
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by company:', error);
      return [];
    }

    // Count occurrences by company
    const companyCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const empresa = desvio.empresas?.nome || "OUTROS";
      companyCounts[empresa] = (companyCounts[empresa] || 0) + 1;
    });

    // Convert to array format for the chart
    return Object.entries(companyCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by company:', error);
    return [];
  }
};
