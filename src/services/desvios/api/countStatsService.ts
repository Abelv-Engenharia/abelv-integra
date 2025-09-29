import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "../types/dashboardTypes";
import { applyFiltersToQuery } from "../utils/filterUtils";

export const countAcoesCompletas = async (filters?: FilterParams): Promise<number> => {
  // Query para situacao = 'CONCLUÍDO' (agora populado pelo trigger)
  let query = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true })
    .eq('situacao', 'CONCLUÍDO');

  if (filters) {
    query = applyFiltersToQuery(query, filters);
  }

  console.log('🔍 Contando ações completas (situacao = CONCLUÍDO)...');
  const { count, error } = await query;
  
  if (error) {
    console.error('❌ Erro ao contar ações completas:', error);
    return 0;
  }

  console.log('✅ Ações completas encontradas:', count);
  return count || 0;
};

export const countAcoesAndamento = async (filters?: FilterParams): Promise<number> => {
  // Query para situacao = 'EM ANDAMENTO' (agora populado pelo trigger)
  let query = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true })
    .eq('situacao', 'EM ANDAMENTO');

  if (filters) {
    query = applyFiltersToQuery(query, filters);
  }

  console.log('🔍 Contando ações em andamento (situacao = EM ANDAMENTO)...');
  const { count, error } = await query;
  
  if (error) {
    console.error('❌ Erro ao contar ações em andamento:', error);
    return 0;
  }

  console.log('✅ Ações em andamento encontradas:', count);
  return count || 0;
};

export const countAcoesPendentes = async (filters?: FilterParams): Promise<number> => {
  // Query para situacao = 'PENDENTE' (agora populado pelo trigger)
  let query = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true })
    .eq('situacao', 'PENDENTE');

  if (filters) {
    query = applyFiltersToQuery(query, filters);
  }

  console.log('🔍 Contando ações pendentes (situacao = PENDENTE)...');
  const { count, error } = await query;
  
  if (error) {
    console.error('❌ Erro ao contar ações pendentes:', error);
    return 0;
  }

  console.log('✅ Ações pendentes encontradas:', count);
  return count || 0;
};

export const countTotalDesvios = async (filters?: FilterParams): Promise<number> => {
  let query = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true });

  if (filters) {
    query = applyFiltersToQuery(query, filters);
  }

  const { count, error } = await query;
  
  if (error) {
    console.error('Erro ao contar total de desvios:', error);
    return 0;
  }

  return count || 0;
};