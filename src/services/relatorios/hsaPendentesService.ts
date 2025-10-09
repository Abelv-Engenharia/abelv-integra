import { supabase } from '@/integrations/supabase/client';

export interface HSAPendenteFilters {
  dataInicio?: Date;
  dataFim?: Date;
  ccaId?: string;
  status?: string;
  responsavel?: string;
}

export interface HSAPendente {
  id: string;
  data: string;
  cca_id: number;
  responsavel_inspecao: string;
  funcao: string;
  status: string;
  desvios_identificados: number;
  observacao?: string;
  ccas?: {
    codigo: string;
    nome: string;
  };
}

export async function fetchHSASemRelatorio(filters: HSAPendenteFilters = {}) {
  let query = supabase
    .from('execucao_hsa')
    .select(`
      id,
      data,
      cca_id,
      responsavel_inspecao,
      funcao,
      status,
      desvios_identificados,
      observacao,
      ccas:cca_id (
        codigo,
        nome
      )
    `)
    .is('relatorio_url', null)
    .order('data', { ascending: false });

  if (filters.dataInicio) {
    query = query.gte('data', filters.dataInicio.toISOString().split('T')[0]);
  }

  if (filters.dataFim) {
    query = query.lte('data', filters.dataFim.toISOString().split('T')[0]);
  }

  if (filters.ccaId) {
    query = query.eq('cca_id', parseInt(filters.ccaId));
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.responsavel) {
    query = query.ilike('responsavel_inspecao', `%${filters.responsavel}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar HSA sem relatório:', error);
    throw error;
  }

  return (data || []) as HSAPendente[];
}

export async function fetchHSAPendentesPorStatus() {
  const { data, error } = await supabase
    .from('execucao_hsa')
    .select('status')
    .is('relatorio_url', null);

  if (error) {
    console.error('Erro ao buscar contadores por status:', error);
    throw error;
  }

  const countByStatus = (data || []).reduce((acc: Record<string, number>, curr: any) => {
    const status = curr.status || 'Não definido';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(countByStatus).map(([status, count]) => ({
    status,
    count
  }));
}
