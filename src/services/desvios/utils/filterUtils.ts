
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "../types/dashboardTypes";
import dayjs from "dayjs";

export const applyFiltersToQuery = (query: any, filters: FilterParams) => {
  let filteredQuery = query;

  // Aplicar filtros de data com lógica padronizada usando dayjs
  const DATE_COL = "data_desvio";

  if (filters.month && filters.year) {
    // Quando temos ano e mês específicos
    const start = dayjs(`${filters.year}-${filters.month}-01`).format("YYYY-MM-DD");
    const end = dayjs(start).add(1, "month").format("YYYY-MM-DD");
    
    console.log(`Filtrando por mês ${filters.month}/${filters.year}: ${start} até ${end}`);
    
    filteredQuery = filteredQuery
      .gte(DATE_COL, start)
      .lt(DATE_COL, end);
      
  } else if (filters.year) {
    // Apenas ano específico
    const start = dayjs(`${filters.year}-01-01`).format("YYYY-MM-DD");
    const end = dayjs(start).add(1, "year").format("YYYY-MM-DD");
    
    console.log(`Filtrando por ano ${filters.year}: ${start} até ${end}`);
    
    filteredQuery = filteredQuery
      .gte(DATE_COL, start)
      .lt(DATE_COL, end);
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
