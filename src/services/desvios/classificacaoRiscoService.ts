
import { supabase } from "@/integrations/supabase/client";

export interface OpcaoClassificacao {
  id: number;
  codigo: string;
  valor: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export const classificacaoRiscoService = {
  async getExposicaoOpcoes(): Promise<OpcaoClassificacao[]> {
    const { data, error } = await supabase
      .from('exposicao_opcoes')
      .select('*')
      .eq('ativo', true)
      .order('valor');
    
    if (error) {
      console.error('Erro ao buscar opções de exposição:', error);
      return [];
    }
    
    return data || [];
  },

  async getControleOpcoes(): Promise<OpcaoClassificacao[]> {
    const { data, error } = await supabase
      .from('controle_opcoes')
      .select('*')
      .eq('ativo', true)
      .order('valor');
    
    if (error) {
      console.error('Erro ao buscar opções de controle:', error);
      return [];
    }
    
    return data || [];
  },

  async getDeteccaoOpcoes(): Promise<OpcaoClassificacao[]> {
    const { data, error } = await supabase
      .from('deteccao_opcoes')
      .select('*')
      .eq('ativo', true)
      .order('valor');
    
    if (error) {
      console.error('Erro ao buscar opções de detecção:', error);
      return [];
    }
    
    return data || [];
  },

  async getEfeitoFalhaOpcoes(): Promise<OpcaoClassificacao[]> {
    const { data, error } = await supabase
      .from('efeito_falha_opcoes')
      .select('*')
      .eq('ativo', true)
      .order('valor');
    
    if (error) {
      console.error('Erro ao buscar opções de efeito de falha:', error);
      return [];
    }
    
    return data || [];
  },

  async getImpactoOpcoes(): Promise<OpcaoClassificacao[]> {
    const { data, error } = await supabase
      .from('impacto_opcoes')
      .select('*')
      .eq('ativo', true)
      .order('valor');
    
    if (error) {
      console.error('Erro ao buscar opções de impacto:', error);
      return [];
    }
    
    return data || [];
  }
};
