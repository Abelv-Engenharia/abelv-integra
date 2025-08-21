
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "../types/dashboardTypes";

export const applyFiltersToQuery = (query: any, filters: FilterParams) => {
  let filteredQuery = query;

  // Aplicar filtros de data com lógica corrigida
  if (filters.year && filters.year !== "todos" && filters.month && filters.month !== "todos") {
    // Quando temos ano e mês específicos
    const year = parseInt(filters.year);
    const month = parseInt(filters.month);
    
    // Criar data de início e fim do mês corretamente
    const startDate = new Date(year, month - 1, 1); // mês - 1 porque Date usa mês 0-indexado
    const endDate = new Date(year, month, 0); // último dia do mês
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    console.log(`Filtrando por mês ${month}/${year}: ${startDateStr} até ${endDateStr}`);
    
    filteredQuery = filteredQuery
      .gte('data_desvio', startDateStr)
      .lte('data_desvio', endDateStr);
      
  } else if (filters.year && filters.year !== "todos") {
    // Apenas ano específico
    const year = parseInt(filters.year);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    
    console.log(`Filtrando por ano ${year}: ${startDate} até ${endDate}`);
    
    filteredQuery = filteredQuery
      .gte('data_desvio', startDate)
      .lte('data_desvio', endDate);
      
  } else if (filters.month && filters.month !== "todos") {
    // Apenas mês específico (ano atual)
    const currentYear = new Date().getFullYear();
    const month = parseInt(filters.month);
    
    const startDate = new Date(currentYear, month - 1, 1);
    const endDate = new Date(currentYear, month, 0);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    console.log(`Filtrando por mês ${month} do ano atual (${currentYear}): ${startDateStr} até ${endDateStr}`);
    
    filteredQuery = filteredQuery
      .gte('data_desvio', startDateStr)
      .lte('data_desvio', endDateStr);
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
