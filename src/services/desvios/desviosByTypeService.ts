
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";

// Function to fetch data for pie chart (desvios by type)
export const fetchDesviosByType = async (filters?: FilterParams) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        tipo_registro_id,
        data_desvio,
        cca_id,
        disciplina_id,
        empresa_id,
        tipos_registro:tipo_registro_id(codigo, nome)
      `)
      .not('tipo_registro_id', 'is', null)
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
