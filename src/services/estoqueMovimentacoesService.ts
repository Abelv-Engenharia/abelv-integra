import { supabase } from '@/integrations/supabase/client';

export interface EstoqueMovimentacaoEntrada {
  id: string;
  cca_id: number;
  almoxarifado_id: string;
  id_credor?: string;
  numero?: string;
  id_empresa?: number;
  id_documento?: string;
  pdf_url?: string;
  pdf_nome?: string;
  created_at: string;
  updated_at: string;
}

export interface EstoqueMovimentacaoEntradaItem {
  id: string;
  movimentacao_entrada_id: string;
  item_nfe_id?: string;
  quantidade: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMovimentacaoInput {
  cca_id: number;
  almoxarifado_id: string;
  item_nfe_id: string;
  quantidade: number;
}

export const estoqueMovimentacoesService = {
  async createFromNfeItens(
    ccaId: number,
    almoxarifadoId: string,
    nfeId: string
  ): Promise<EstoqueMovimentacaoEntrada> {
    // Buscar a NFE para obter os dados adicionais
    const { data: nfe, error: nfeError } = await supabase
      .from('nfe_compra')
      .select('id_credor, numero, id_empresa, id_documento')
      .eq('id', nfeId)
      .single();

    if (nfeError) throw nfeError;
    if (!nfe) throw new Error('NFE não encontrada');

    // Buscar os itens da NFE
    const { data: itens, error: itensError } = await supabase
      .from('nfe_compra_itens')
      .select('*')
      .eq('id_nfe', nfeId);

    if (itensError) throw itensError;
    if (!itens || itens.length === 0) {
      throw new Error('Nenhum item encontrado para esta NFE');
    }

    // Criar a movimentação de entrada principal
    const { data: movimentacao, error: movError } = await supabase
      .from('estoque_movimentacoes_entradas')
      .insert({
        cca_id: ccaId,
        almoxarifado_id: almoxarifadoId,
        id_credor: nfe.id_credor,
        numero: nfe.numero,
        id_empresa: nfe.id_empresa,
        id_documento: nfe.id_documento,
      })
      .select()
      .single();

    if (movError) throw movError;
    if (!movimentacao) throw new Error('Erro ao criar movimentação');

    // Criar os itens da movimentação
    const itensMovimentacao = itens.map(item => ({
      movimentacao_entrada_id: movimentacao.id,
      item_nfe_id: item.id,
      quantidade: item.quantidade,
    }));

    const { error: itensError2 } = await supabase
      .from('estoque_movimentacoes_entradas_itens')
      .insert(itensMovimentacao);

    if (itensError2) throw itensError2;

    // Marcar a NFE como alocada
    const { error: updateError } = await supabase
      .from('nfe_compra')
      .update({ alocada: true })
      .eq('id', nfeId);

    if (updateError) throw updateError;

    return movimentacao;
  },

  async getByAlmoxarifado(almoxarifadoId: string): Promise<EstoqueMovimentacaoEntrada[]> {
    const { data, error } = await supabase
      .from('estoque_movimentacoes_entradas')
      .select('*')
      .eq('almoxarifado_id', almoxarifadoId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getNfesAlocadas(): Promise<string[]> {
    const { data, error } = await supabase
      .from('estoque_movimentacoes_entradas_itens')
      .select('item_nfe_id');

    if (error) throw error;
    
    // Extrair os IDs das NFEs através dos itens
    const itemIds = data?.map(m => m.item_nfe_id).filter(Boolean) || [];
    
    if (itemIds.length === 0) return [];

    const { data: itens, error: itensError } = await supabase
      .from('nfe_compra_itens')
      .select('id_nfe')
      .in('id', itemIds);

    if (itensError) throw itensError;
    
    // Retornar IDs únicos das NFEs
    return [...new Set(itens?.map(i => i.id_nfe).filter(Boolean) || [])];
  }
};
