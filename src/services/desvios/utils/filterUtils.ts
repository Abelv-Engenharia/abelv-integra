
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "../types/dashboardTypes";

export const applyFiltersToQuery = (baseQuery: any, filters: FilterParams) => {
  let query = baseQuery;

  // Aplicar filtros de data
  if (filters.year && filters.month) {
    const startDate = `${filters.year}-${filters.month.padStart(2, '0')}-01`;
    const endDate = `${filters.year}-${filters.month.padStart(2, '0')}-31`;
    query = query.gte('data_desvio', startDate).lte('data_desvio', endDate);
  } else if (filters.year) {
    const startDate = `${filters.year}-01-01`;
    const endDate = `${filters.year}-12-31`;
    query = query.gte('data_desvio', startDate).lte('data_desvio', endDate);
  } else if (filters.month) {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-${filters.month.padStart(2, '0')}-01`;
    const endDate = `${currentYear}-${filters.month.padStart(2, '0')}-31`;
    query = query.gte('data_desvio', startDate).lte('data_desvio', endDate);
  }

  // Aplicar filtros de CCA, Disciplina e Empresa
  if (filters.ccaId) {
    query = query.eq('cca_id', parseInt(filters.ccaId));
  }
  if (filters.disciplinaId) {
    query = query.eq('disciplina_id', parseInt(filters.disciplinaId));
  }
  if (filters.empresaId) {
    query = query.eq('empresa_id', parseInt(filters.empresaId));
  }

  return query;
};

export const buildFilteredQuery = (filters: FilterParams) => {
  return supabase.from('desvios_completos').select('*', { count: 'exact', head: true });
};
