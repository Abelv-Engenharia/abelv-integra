
import { supabase } from "@/integrations/supabase/client";

export const fetchDesviosByEvent = async (ccaIds?: string[]) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        evento_identificado_id,
        eventos_identificados:evento_identificado_id(codigo, nome)
      `)
      .not('evento_identificado_id', 'is', null);

    // Apply CCA filter if provided
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds.map(id => parseInt(id)));
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by event:', error);
      return [];
    }

    // Count occurrences by event
    const eventCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const evento = desvio.eventos_identificados?.nome || "OUTROS";
      eventCounts[evento] = (eventCounts[evento] || 0) + 1;
    });

    // Convert to array format for the chart
    return Object.entries(eventCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Limit to top 10 events
  } catch (error) {
    console.error('Exception fetching desvios by event:', error);
    return [];
  }
};
