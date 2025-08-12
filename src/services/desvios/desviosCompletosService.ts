
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DbDesvioCompleto = Database['public']['Tables']['desvios_completos']['Row'];

export interface DesvioCompleto {
  id?: string;
  data_desvio: string;
  hora_desvio?: string;
  local: string;
  descricao_desvio: string;
  acao_imediata?: string;
  cca_id?: number;
  empresa_id?: number;
  funcionarios_envolvidos?: any[];
  responsavel_id?: string;
  encarregado_responsavel_id?: string;
  supervisor_responsavel_id?: string;
  engenheiro_responsavel_id?: string;
  disciplina_id?: number;
  causa_provavel_id?: number;
  evento_identificado_id?: number;
  processo_id?: number;
  tipo_registro_id?: number;
  base_legal_opcao_id?: number;
  classificacao_risco?: string;
  severidade?: number;
  probabilidade?: number;
  impacto?: number;
  efeito_falha?: number;
  deteccao?: number;
  controle?: number;
  exposicao?: number;
  situacao?: string;
  prazo_conclusao?: string;
  acoes?: any[];
  status?: string;
  imagem_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper function to convert database types to our interface
const convertDbToDesvio = (dbDesvio: any): DesvioCompleto => {
  return {
    ...dbDesvio,
    funcionarios_envolvidos: Array.isArray(dbDesvio.funcionarios_envolvidos) 
      ? dbDesvio.funcionarios_envolvidos 
      : dbDesvio.funcionarios_envolvidos 
        ? [dbDesvio.funcionarios_envolvidos] 
        : [],
    acoes: Array.isArray(dbDesvio.acoes) 
      ? dbDesvio.acoes 
      : dbDesvio.acoes 
        ? [dbDesvio.acoes] 
        : [],
  };
};

export const desviosCompletosService = {
  async getAll(): Promise<DesvioCompleto[]> {
    const { data, error } = await supabase
      .from('desvios_completos')
      .select(`
        *,
        ccas (nome),
        empresas (nome),
        disciplinas (nome),
        causas_provaveis (nome),
        eventos_identificados (nome),
        base_legal_opcoes (nome)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(convertDbToDesvio);
  },

  async getById(id: string): Promise<DesvioCompleto> {
    const { data, error } = await supabase
      .from('desvios_completos')
      .select(`
        *,
        ccas (nome),
        empresas (nome),
        disciplinas (nome),
        causas_provaveis (nome),
        eventos_identificados (nome),
        base_legal_opcoes (nome)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return convertDbToDesvio(data);
  },

  async create(desvio: Omit<DesvioCompleto, 'id' | 'created_at' | 'updated_at'>): Promise<DesvioCompleto> {
    const { data, error } = await supabase
      .from('desvios_completos')
      .insert(desvio)
      .select()
      .single();

    if (error) throw error;
    return convertDbToDesvio(data);
  },

  async update(id: string, updates: Partial<DesvioCompleto>): Promise<DesvioCompleto> {
    const { data, error } = await supabase
      .from('desvios_completos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return convertDbToDesvio(data);
  },

  async delete(id: string): Promise<boolean> {
    try {
      console.log('Iniciando exclusão do desvio com ID:', id);
      
      // Primeiro, verificar se o desvio existe
      const { data: existingDesvio, error: selectError } = await supabase
        .from('desvios_completos')
        .select('id')
        .eq('id', id)
        .single();

      if (selectError) {
        console.error('Erro ao verificar existência do desvio:', selectError);
        return false;
      }

      if (!existingDesvio) {
        console.error('Desvio não encontrado:', id);
        return false;
      }

      console.log('Desvio encontrado, prosseguindo com exclusão...');

      // Realizar a exclusão
      const { error: deleteError, count } = await supabase
        .from('desvios_completos')
        .delete()
        .eq('id', id)
        .select();

      if (deleteError) {
        console.error('Erro na exclusão do desvio:', deleteError);
        return false;
      }

      console.log('Exclusão realizada, resultado:', { count });

      // Verificar se realmente foi excluído
      const { data: verifyDeleted, error: verifyError } = await supabase
        .from('desvios_completos')
        .select('id')
        .eq('id', id)
        .single();

      if (verifyError && verifyError.code === 'PGRST116') {
        // Erro PGRST116 significa que não encontrou o registro, ou seja, foi excluído com sucesso
        console.log('Verificação confirmou: desvio foi excluído com sucesso');
        return true;
      } else if (!verifyError && verifyDeleted) {
        // Se não houve erro e ainda encontrou o registro, a exclusão falhou
        console.error('Verificação falhou: desvio ainda existe após tentativa de exclusão');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exceção durante exclusão do desvio:', error);
      return false;
    }
  },

  async updateFuncionariosAndAcoes(id: string, funcionarios_envolvidos: any[], acoes: any[]): Promise<DesvioCompleto> {
    const { data, error } = await supabase
      .from('desvios_completos')
      .update({
        funcionarios_envolvidos,
        acoes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return convertDbToDesvio(data);
  }
};
