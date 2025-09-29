import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type DbDesvioCompleto = Database['public']['Tables']['desvios_completos']['Row'];

export interface DesvioCompleto {
  id?: string;
  data_desvio: string;
  hora_desvio?: string;
  responsavel_inspecao: string;
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
        ccas (id, codigo, nome),
        empresas (id, nome),
        disciplinas (id, nome),
        causas_provaveis (id, nome),
        eventos_identificados (id, nome),
        processos (id, codigo, nome),
        tipos_registro (id, codigo, nome),
        base_legal_opcoes (id, codigo, nome),
        supervisores:supervisor_responsavel_id (id, nome, matricula, funcao),
        encarregados:encarregado_responsavel_id (id, nome, matricula, funcao),
        engenheiros:engenheiro_responsavel_id (id, nome, matricula, funcao)
      `)
      .order('created_at', { ascending: false })
      .range(0, 99999);

    if (error) throw error;
    return (data || []).map(convertDbToDesvio);
  },

  async getById(id: string): Promise<DesvioCompleto> {
    const { data, error } = await supabase
      .from('desvios_completos')
      .select(`
        *,
        ccas (id, codigo, nome),
        empresas (id, nome),
        disciplinas (id, nome),
        causas_provaveis (id, nome),
        eventos_identificados (id, nome),
        processos (id, codigo, nome),
        tipos_registro (id, codigo, nome),
        base_legal_opcoes (id, codigo, nome),
        supervisores:supervisor_responsavel_id (id, nome, matricula, funcao),
        encarregados:encarregado_responsavel_id (id, nome, matricula, funcao),
        engenheiros:engenheiro_responsavel_id (id, nome, matricula, funcao)
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
      console.log('🗑️ Iniciando exclusão do desvio ID:', id);
      
      // Primeira tentativa de exclusão direta
      const { error: deleteError } = await supabase
        .from('desvios_completos')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('❌ Erro direto na exclusão:', deleteError);
        return false;
      }

      console.log('✅ Comando de exclusão executado');

      // Verificar se realmente foi excluído
      const { data: verifyData, error: verifyError } = await supabase
        .from('desvios_completos')
        .select('id')
        .eq('id', id)
        .maybeSingle();

      if (verifyError) {
        console.error('❌ Erro na verificação:', verifyError);
        return false;
      }

      if (verifyData) {
        console.error('❌ Desvio ainda existe após exclusão:', verifyData);
        return false;
      }

      console.log('✅ Desvio excluído com sucesso - verificado');
      return true;

    } catch (error) {
      console.error('❌ Exceção durante exclusão:', error);
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
