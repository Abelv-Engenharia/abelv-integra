import { supabase } from '@/integrations/supabase/client';

export interface TreinamentoPendenteFilters {
  dataInicio?: Date;
  dataFim?: Date;
  ccaId?: string;
  processoId?: string;
  tipoId?: string;
}

export interface TreinamentoPendente {
  id: string;
  data: string;
  cca: string;
  cca_id: number;
  processo_treinamento: string;
  tipo_treinamento: string;
  treinamento_nome: string;
  carga_horaria: number;
  efetivo_mod: number;
  efetivo_moi: number;
  observacoes?: string;
}

export async function fetchTreinamentosSemAnexo(filters: TreinamentoPendenteFilters = {}) {
  let query = supabase
    .from('execucao_treinamentos')
    .select(`
      id,
      data,
      cca,
      cca_id,
      processo_treinamento,
      tipo_treinamento,
      treinamento_nome,
      carga_horaria,
      efetivo_mod,
      efetivo_moi,
      observacoes
    `)
    .is('lista_presenca_url', null)
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

  if (filters.processoId) {
    query = query.eq('processo_treinamento_id', filters.processoId);
  }

  if (filters.tipoId) {
    query = query.eq('tipo_treinamento_id', filters.tipoId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar treinamentos sem anexo:', error);
    throw error;
  }

  return data as TreinamentoPendente[];
}

export async function fetchTreinamentosPendentesPorCCA() {
  const { data, error } = await supabase
    .from('execucao_treinamentos')
    .select('cca, cca_id')
    .is('lista_presenca_url', null);

  if (error) {
    console.error('Erro ao buscar contadores por CCA:', error);
    throw error;
  }

  const countByCCA = data.reduce((acc: Record<string, number>, curr) => {
    const cca = curr.cca || 'Não definido';
    acc[cca] = (acc[cca] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(countByCCA).map(([cca, count]) => ({
    cca,
    count
  }));
}
