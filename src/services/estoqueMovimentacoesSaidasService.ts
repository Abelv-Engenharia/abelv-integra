import { supabase } from '@/integrations/supabase/client';

export interface EstoqueMovimentacaoSaida {
  id: string;
  numero: number;
  cca_id: number;
  requisitante: string;
  data_movimento: string;
  almoxarifado_id: string;
  apropriacao_id: string;
  observacao?: string;
  created_at: string;
  updated_at: string;
}

export interface EstoqueMovimentacaoSaidaItem {
  id: string;
  movimentacao_saida_id: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  unitario?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMovimentacaoSaidaInput {
  cca_id: number;
  requisitante: string;
  data_movimento: string;
  almoxarifado_id: string;
  apropriacao_id: string;
  observacao?: string;
}

export interface CreateMovimentacaoSaidaItemInput {
  descricao: string;
  unidade: string;
  quantidade: number;
  unitario?: number;
}

export const estoqueMovimentacoesSaidasService = {
  async create(
    input: CreateMovimentacaoSaidaInput,
    itens: CreateMovimentacaoSaidaItemInput[]
  ): Promise<EstoqueMovimentacaoSaida> {
    // Criar a movimentação de saída principal
    const { data: movimentacao, error: movError } = await supabase
      .from('estoque_movimentacoes_saidas')
      .insert({
        cca_id: input.cca_id,
        requisitante: input.requisitante,
        data_movimento: input.data_movimento,
        almoxarifado_id: input.almoxarifado_id,
        apropriacao_id: input.apropriacao_id,
        observacao: input.observacao,
      })
      .select()
      .single();

    if (movError) throw movError;
    if (!movimentacao) throw new Error('Erro ao criar requisição');

    // Criar os itens da movimentação
    const itensMovimentacao = itens.map(item => ({
      movimentacao_saida_id: movimentacao.id,
      descricao: item.descricao,
      unidade: item.unidade,
      quantidade: item.quantidade,
      unitario: item.unitario,
    }));

    const { error: itensError } = await supabase
      .from('estoque_movimentacoes_saidas_itens')
      .insert(itensMovimentacao);

    if (itensError) throw itensError;

    return movimentacao;
  },

  async getByAlmoxarifado(almoxarifadoId: string): Promise<EstoqueMovimentacaoSaida[]> {
    const { data, error } = await supabase
      .from('estoque_movimentacoes_saidas')
      .select('*')
      .eq('almoxarifado_id', almoxarifadoId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<EstoqueMovimentacaoSaida | null> {
    const { data, error } = await supabase
      .from('estoque_movimentacoes_saidas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getItensByMovimentacaoId(movimentacaoId: string): Promise<EstoqueMovimentacaoSaidaItem[]> {
    const { data, error } = await supabase
      .from('estoque_movimentacoes_saidas_itens')
      .select('*')
      .eq('movimentacao_saida_id', movimentacaoId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};
