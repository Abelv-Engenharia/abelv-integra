
import { supabase } from '@/integrations/supabase/client';

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

export const desviosCompletosService = {
  async getAll() {
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
    return data;
  },

  async getById(id: string) {
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
    return data;
  },

  async create(desvio: Omit<DesvioCompleto, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('desvios_completos')
      .insert(desvio)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<DesvioCompleto>) {
    const { data, error } = await supabase
      .from('desvios_completos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('desvios_completos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateFuncionariosAndAcoes(id: string, funcionarios_envolvidos: any[], acoes: any[]) {
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
    return data;
  }
};
