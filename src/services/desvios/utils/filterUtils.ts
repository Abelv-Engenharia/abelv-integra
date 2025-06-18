
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "../types/dashboardTypes";

export const applyFiltersToQuery = (query: any, filters: FilterParams) => {
  let filteredQuery = query;

  // Aplicar filtros de data
  if (filters.year && filters.year !== "todos" && filters.month && filters.month !== "todos") {
    const startDate = `${filters.year}-${filters.month.padStart(2, '0')}-01`;
    const endDate = `${filters.year}-${filters.month.padStart(2, '0')}-31`;
    filteredQuery = filteredQuery.gte('data_desvio', startDate).lte('data_desvio', endDate);
  } else if (filters.year && filters.year !== "todos") {
    const startDate = `${filters.year}-01-01`;
    const endDate = `${filters.year}-12-31`;
    filteredQuery = filteredQuery.gte('data_desvio', startDate).lte('data_desvio', endDate);
  } else if (filters.month && filters.month !== "todos") {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-${filters.month.padStart(2, '0')}-01`;
    const endDate = `${currentYear}-${filters.month.padStart(2, '0')}-31`;
    filteredQuery = filteredQuery.gte('data_desvio', startDate).lte('data_desvio', endDate);
  }

  // Aplicar filtros de CCA - support both single and multiple CCAs
  if (filters.ccaIds && filters.ccaIds.length > 0) {
    // Filter by multiple CCAs (for user access control)
    filteredQuery = filteredQuery.in('cca_id', filters.ccaIds.map(id => parseInt(id)));
  } else if (filters.ccaId && filters.ccaId !== "todos") {
    // Filter by single CCA (for user selection)
    filteredQuery = filteredQuery.eq('cca_id', parseInt(filters.ccaId));
  }
  
  if (filters.disciplinaId && filters.disciplinaId !== "todos") {
    filteredQuery = filteredQuery.eq('disciplina_id', parseInt(filters.disciplinaId));
  }
  if (filters.empresaId && filters.empresaId !== "todos") {
    filteredQuery = filteredQuery.eq('empresa_id', parseInt(filters.empresaId));
  }

  return filteredQuery;
};

export const createBaseQuery = () => {
  return supabase.from('desvios_completos').select('*', { count: 'exact', head: true });
};
