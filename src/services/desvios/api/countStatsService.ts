import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "../types/dashboardTypes";
import { applyFiltersToQuery } from "../utils/filterUtils";

export const countAcoesCompletas = async (filters?: FilterParams): Promise<number> => {
  // Query para situacao = 'TRATADO' OU (situacao IS NULL E status = 'TRATADO')
  let query = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true })
    .or('situacao.eq.TRATADO,and(situacao.is.null,status.eq.TRATADO)');

  if (filters) {
    query = applyFiltersToQuery(query, filters);
  }

  console.log('🔍 Contando ações completas (TRATADO em situacao ou status)...');
  const { count, error } = await query;
  
  if (error) {
    console.error('❌ Erro ao contar ações completas:', error);
    return 0;
  }

  console.log('✅ Ações completas encontradas:', count);
  return count || 0;
};

export const countAcoesAndamento = async (filters?: FilterParams): Promise<number> => {
  const hoje = new Date().toISOString().split('T')[0];
  
  // Query para (situacao IN ('EM ANDAMENTO', 'EM TRATATIVA') OU (situacao IS NULL E status IN ('EM ANDAMENTO', 'EM TRATATIVA'))) 
  // E prazo_conclusao >= hoje E prazo_conclusao IS NOT NULL
  let query = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true })
    .or('situacao.in.(EM ANDAMENTO,EM TRATATIVA),and(situacao.is.null,status.in.(EM ANDAMENTO,EM TRATATIVA))')
    .not('prazo_conclusao', 'is', null)
    .gte('prazo_conclusao', hoje);

  if (filters) {
    query = applyFiltersToQuery(query, filters);
  }

  console.log('🔍 Contando ações em andamento (situacao/status EM ANDAMENTO/EM TRATATIVA + prazo >= hoje)...');
  const { count, error } = await query;
  
  if (error) {
    console.error('❌ Erro ao contar ações em andamento:', error);
    return 0;
  }

  console.log('✅ Ações em andamento encontradas:', count);
  return count || 0;
};

export const countAcoesPendentes = async (filters?: FilterParams): Promise<number> => {
  // Como a maioria dos registros tem situacao=null, vamos usar uma abordagem mais simples:
  // Pendentes = Total - Completas - Em Andamento
  
  console.log('🔍 Contando ações pendentes por subtração...');
  
  const [total, completas, andamento] = await Promise.all([
    countTotalDesvios(filters),
    countAcoesCompletas(filters),
    countAcoesAndamento(filters)
  ]);
  
  const pendentes = total - completas - andamento;
  
  console.log('📊 Cálculo de pendentes:', { 
    total, 
    completas, 
    andamento, 
    pendentes 
  });

  return Math.max(0, pendentes); // Garantir que não seja negativo
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