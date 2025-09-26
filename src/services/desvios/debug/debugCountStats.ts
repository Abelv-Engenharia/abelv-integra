import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "../types/dashboardTypes";
import { applyFiltersToQuery } from "../utils/filterUtils";

// Função para debugar os dados e entender por que os counts estão zerados
export const debugCountStats = async (filters?: FilterParams) => {
  console.log('🔍 DEBUG: Iniciando análise detalhada dos dados...');
  
  // 1. Verificar se existem dados na tabela
  let totalQuery = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true });
    
  if (filters) {
    totalQuery = applyFiltersToQuery(totalQuery, filters);
  }
  
  const { count: total, error: totalError } = await totalQuery;
  console.log('📊 Total de registros:', total, totalError ? 'Erro:' : '', totalError);
  
  // 2. Verificar distribuição por situacao E status
  let dataQuery = supabase
    .from('desvios_completos')
    .select('situacao, status')
    .limit(1000);
    
  if (filters) {
    dataQuery = applyFiltersToQuery(dataQuery, filters);
  }
  
  const { data: dataResult, error: dataError } = await dataQuery;
  
  if (!dataError && dataResult) {
    const situacaoCount = dataResult.reduce((acc: Record<string, number>, item) => {
      const situacao = item.situacao || 'NULL';
      acc[situacao] = (acc[situacao] || 0) + 1;
      return acc;
    }, {});
    
    const statusCount = dataResult.reduce((acc: Record<string, number>, item) => {
      const status = item.status || 'NULL';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📋 Distribuição por situação:', situacaoCount);
    console.log('📋 Distribuição por status:', statusCount);
  } else {
    console.error('❌ Erro ao buscar dados:', dataError);
  }
  
  return {
    total,
    dataResult: dataResult || []
  };
};