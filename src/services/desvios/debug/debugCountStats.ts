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
  
  // 2. Verificar distribuição por situação
  let situacaoQuery = supabase
    .from('desvios_completos')
    .select('situacao')
    .limit(1000);
    
  if (filters) {
    situacaoQuery = applyFiltersToQuery(situacaoQuery, filters);
  }
  
  const { data: situacaoData, error: situacaoError } = await situacaoQuery;
  
  if (!situacaoError && situacaoData) {
    const situacaoCount = situacaoData.reduce((acc: Record<string, number>, item) => {
      const situacao = item.situacao || 'NULL';
      acc[situacao] = (acc[situacao] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📋 Distribuição por situação:', situacaoCount);
  } else {
    console.error('❌ Erro ao buscar situações:', situacaoError);
  }
  
  // 3. Testar query específica para TRATADO
  let tratadoQuery = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true })
    .eq('situacao', 'TRATADO');
    
  if (filters) {
    tratadoQuery = applyFiltersToQuery(tratadoQuery, filters);
  }
  
  const { count: tratadoCount, error: tratadoError } = await tratadoQuery;
  console.log('✅ Count TRATADO:', tratadoCount, tratadoError ? 'Erro:' : '', tratadoError);
  
  return {
    total,
    situacaoData: situacaoData || [],
    tratadoCount
  };
};