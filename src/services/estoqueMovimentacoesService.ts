import { supabase } from '@/integrations/supabase/client';

export interface EstoqueMovimentacaoEntrada {
  id: string;
  cca_id: number;
  almoxarifado_id: string;
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
  ): Promise<EstoqueMovimentacaoEntrada[]> {
    // Buscar os itens da NFE
    const { data: itens, error: itensError } = await supabase
      .from('nfe_compra_itens')
      .select('*')
      .eq('id_nfe', nfeId);

    if (itensError) throw itensError;
    if (!itens || itens.length === 0) {
      throw new Error('Nenhum item encontrado para esta NFE');
    }

    // Criar as movimentações para cada item
    const movimentacoes = itens.map(item => ({
      cca_id: ccaId,
      almoxarifado_id: almoxarifadoId,
      item_nfe_id: item.id,
      quantidade: item.quantidade,
    }));

    const { data, error } = await supabase
      .from('estoque_movimentacoes_entradas')
      .insert(movimentacoes)
      .select();

    if (error) throw error;

    // Marcar a NFE como alocada
    const { error: updateError } = await supabase
      .from('nfe_compra')
      .update({ alocada: true })
      .eq('id', nfeId);

    if (updateError) throw updateError;

    return data || [];
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
      .from('estoque_movimentacoes_entradas')
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
