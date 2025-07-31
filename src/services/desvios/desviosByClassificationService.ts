
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";

export const fetchDesviosByClassification = async (filters?: FilterParams) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        classificacao_risco,
        data_desvio,
        cca_id,
        disciplina_id,
        empresa_id
      `)
      .not('classificacao_risco', 'is', null);

    // Apply filters if provided
    if (filters) {
      // Apply CCA filter if provided
      if (filters.ccaIds && filters.ccaIds.length > 0) {
        query = query.in('cca_id', filters.ccaIds.map(id => parseInt(id)));
      }
      
      // Apply specific CCA filter if provided
      if (filters.ccaId && filters.ccaId !== "todos") {
        query = query.eq('cca_id', parseInt(filters.ccaId));
      }
      
      // Apply year filter if provided
      if (filters.year && filters.year !== "todos") {
        query = query.gte('data_desvio', `${filters.year}-01-01`)
                    .lte('data_desvio', `${filters.year}-12-31`);
      }
      
      // Apply month filter if provided
      if (filters.month && filters.month !== "todos") {
        const year = filters.year && filters.year !== "todos" ? filters.year : new Date().getFullYear();
        const monthStr = filters.month.padStart(2, '0');
        query = query.gte('data_desvio', `${year}-${monthStr}-01`)
                    .lte('data_desvio', `${year}-${monthStr}-31`);
      }
      
      // Apply disciplina filter if provided
      if (filters.disciplinaId && filters.disciplinaId !== "todos") {
        query = query.eq('disciplina_id', parseInt(filters.disciplinaId));
      }
      
      // Apply empresa filter if provided
      if (filters.empresaId && filters.empresaId !== "todos") {
        query = query.eq('empresa_id', parseInt(filters.empresaId));
      }
    }

    const { data, error } = await query;
    
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
