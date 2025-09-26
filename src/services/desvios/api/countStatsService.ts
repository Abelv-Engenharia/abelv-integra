import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "../types/dashboardTypes";
import { applyFiltersToQuery } from "../utils/filterUtils";

export const countAcoesCompletas = async (filters?: FilterParams): Promise<number> => {
  let query = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true })
    .eq('situacao', 'TRATADO');

  if (filters) {
    query = applyFiltersToQuery(query, filters);
  }

  console.log('🔍 Contando ações completas...');
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
  
  let query = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true })
    .in('situacao', ['EM ANDAMENTO', 'EM TRATATIVA'])
    .not('prazo_conclusao', 'is', null)
    .gte('prazo_conclusao', hoje);

  if (filters) {
    query = applyFiltersToQuery(query, filters);
  }

  console.log('🔍 Contando ações em andamento (situacao IN EM ANDAMENTO/EM TRATATIVA + prazo >= hoje)...');
  const { count, error } = await query;
  
  if (error) {
    console.error('❌ Erro ao contar ações em andamento:', error);
    return 0;
  }

  console.log('✅ Ações em andamento encontradas:', count);
  return count || 0;
};

export const countAcoesPendentes = async (filters?: FilterParams): Promise<number> => {
  // Para pendentes, fazemos duas consultas:
  // 1. Situações EM ANDAMENTO/EM TRATATIVA com prazo vencido ou sem prazo
  // 2. Outras situações que não são TRATADO nem EM ANDAMENTO/EM TRATATIVA

  const hoje = new Date().toISOString().split('T')[0];
  
  console.log('🔍 Contando ações pendentes...');
  
  // Query 1: EM ANDAMENTO/EM TRATATIVA com prazo vencido ou sem prazo
  let query1 = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true })
    .in('situacao', ['EM ANDAMENTO', 'EM TRATATIVA'])
    .or(`prazo_conclusao.lt.${hoje},prazo_conclusao.is.null`);

  if (filters) {
    query1 = applyFiltersToQuery(query1, filters);
  }

  // Query 2: Outras situações (não TRATADO, não EM ANDAMENTO, não EM TRATATIVA)
  let query2 = supabase
    .from('desvios_completos')
    .select('id', { count: 'exact', head: true })
    .not('situacao', 'in', '(TRATADO,EM ANDAMENTO,EM TRATATIVA)');

  if (filters) {
    query2 = applyFiltersToQuery(query2, filters);
  }

  console.log('🔍 Executando queries de ações pendentes...');
  const [result1, result2] = await Promise.all([query1, query2]);

  if (result1.error) {
    console.error('❌ Erro ao contar ações pendentes (query 1):', result1.error);
  }
  
  if (result2.error) {
    console.error('❌ Erro ao contar ações pendentes (query 2):', result2.error);
  }

  const count1 = result1.count || 0;
  const count2 = result2.count || 0;
  
  console.log('📊 Ações pendentes:', { 
    prazoVencidoOuSemPrazo: count1, 
    outrasSituacoes: count2, 
    total: count1 + count2 
  });

  return count1 + count2;
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