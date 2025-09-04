
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";

export const fetchDesviosByProcesso = async (filters?: FilterParams) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        processo_id,
        data_desvio,
        cca_id,
        disciplina_id,
        empresa_id,
        processos:processo_id(codigo, nome)
      `)
      .not('processo_id', 'is', null)
      .limit(50000);

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
      console.error('Error fetching desvios by processo:', error);
      return [];
    }

    // Count occurrences by processo
    const processoCounts: Record<string, number> = {};
    data?.forEach(desvio => {
      const processo = desvio.processos?.nome || "OUTROS";
      processoCounts[processo] = (processoCounts[processo] || 0) + 1;
    });

    // Convert to array format for the chart
    return Object.entries(processoCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Limit to top 8 processes
  } catch (error) {
    console.error('Exception fetching desvios by processo:', error);
    return [];
  }
};
