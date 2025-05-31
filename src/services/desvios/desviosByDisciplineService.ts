
import { supabase } from "@/integrations/supabase/client";

export const fetchDesviosByDiscipline = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios_completos')
      .select(`
        disciplina_id,
        disciplinas:disciplina_id(codigo, nome)
      `)
      .not('disciplina_id', 'is', null);
    
    if (error) {
      console.error('Error fetching desvios by discipline:', error);
      return [];
    }

    // Count occurrences by discipline
    const disciplineCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const disciplina = desvio.disciplinas?.codigo || "OUTROS";
      disciplineCounts[disciplina] = (disciplineCounts[disciplina] || 0) + 1;
    });

    // Convert to array format for the chart
    return Object.entries(disciplineCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by discipline:', error);
    return [];
  }
};
