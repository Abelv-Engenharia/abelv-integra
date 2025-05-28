
import { supabase } from "@/integrations/supabase/client";

export interface DesvioCompleto {
  id?: string;
  created_at?: string;
  updated_at?: string;
  data_desvio: string;
  hora_desvio?: string;
  local: string;
  cca_id?: number;
  empresa_id?: number;
  base_legal_opcao_id?: number;
  engenheiro_responsavel_id?: string;
  supervisor_responsavel_id?: string;
  encarregado_responsavel_id?: string;
  funcionarios_envolvidos?: any;
  tipo_registro_id?: number;
  processo_id?: number;
  evento_identificado_id?: number;
  causa_provavel_id?: number;
  disciplina_id?: number;
  descricao_desvio: string;
  acao_imediata?: string;
  imagem_url?: string;
  exposicao?: number;
  controle?: number;
  deteccao?: number;
  efeito_falha?: number;
  impacto?: number;
  probabilidade?: number;
  severidade?: number;
  classificacao_risco?: string;
  acoes?: any;
  status?: string;
  responsavel_id?: string;
  prazo_conclusao?: string;
}

export const desviosCompletosService = {
  async getAll(): Promise<DesvioCompleto[]> {
    try {
      const { data, error } = await supabase
        .from('desvios_completos')
        .select(`
          *,
          ccas:cca_id(id, codigo, nome),
          empresas:empresa_id(id, nome),
          base_legal_opcoes:base_legal_opcao_id(id, codigo, nome),
          engenheiros:engenheiro_responsavel_id(id, nome),
          supervisores:supervisor_responsavel_id(id, nome),
          encarregados:encarregado_responsavel_id(id, nome),
          tipos_registro:tipo_registro_id(id, codigo, nome),
          processos:processo_id(id, codigo, nome),
          eventos_identificados:evento_identificado_id(id, codigo, nome),
          causas_provaveis:causa_provavel_id(id, codigo, nome),
          disciplinas:disciplina_id(id, codigo, nome)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar desvios completos:', error);
        return [];
      }
      
      return (data || []).map(item => ({
        ...item,
        funcionarios_envolvidos: Array.isArray(item.funcionarios_envolvidos) ? item.funcionarios_envolvidos : [],
        acoes: Array.isArray(item.acoes) ? item.acoes : []
      }));
    } catch (error) {
      console.error('Exceção ao buscar desvios completos:', error);
      return [];
    }
  },

  async getById(id: string): Promise<DesvioCompleto | null> {
    try {
      const { data, error } = await supabase
        .from('desvios_completos')
        .select(`
          *,
          ccas:cca_id(id, codigo, nome),
          empresas:empresa_id(id, nome),
          base_legal_opcoes:base_legal_opcao_id(id, codigo, nome),
          engenheiros:engenheiro_responsavel_id(id, nome),
          supervisores:supervisor_responsavel_id(id, nome),
          encarregados:encarregado_responsavel_id(id, nome),
          tipos_registro:tipo_registro_id(id, codigo, nome),
          processos:processo_id(id, codigo, nome),
          eventos_identificados:evento_identificado_id(id, codigo, nome),
          causas_provaveis:causa_provavel_id(id, codigo, nome),
          disciplinas:disciplina_id(id, codigo, nome)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Erro ao buscar desvio por ID:', error);
        return null;
      }
      
      return {
        ...data,
        funcionarios_envolvidos: Array.isArray(data.funcionarios_envolvidos) ? data.funcionarios_envolvidos : [],
        acoes: Array.isArray(data.acoes) ? data.acoes : []
      };
    } catch (error) {
      console.error('Exceção ao buscar desvio por ID:', error);
      return null;
    }
  },

  async create(desvio: Omit<DesvioCompleto, 'id' | 'created_at' | 'updated_at'>): Promise<DesvioCompleto | null> {
    try {
      const { data, error } = await supabase
        .from('desvios_completos')
        .insert(desvio)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar desvio:', error);
        return null;
      }
      
      return {
        ...data,
        funcionarios_envolvidos: Array.isArray(data.funcionarios_envolvidos) ? data.funcionarios_envolvidos : [],
        acoes: Array.isArray(data.acoes) ? data.acoes : []
      };
    } catch (error) {
      console.error('Exceção ao criar desvio:', error);
      return null;
    }
  },

  async update(id: string, updates: Partial<DesvioCompleto>): Promise<DesvioCompleto | null> {
    try {
      const { data, error } = await supabase
        .from('desvios_completos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar desvio:', error);
        return null;
      }
      
      return {
        ...data,
        funcionarios_envolvidos: Array.isArray(data.funcionarios_envolvidos) ? data.funcionarios_envolvidos : [],
        acoes: Array.isArray(data.acoes) ? data.acoes : []
      };
    } catch (error) {
      console.error('Exceção ao atualizar desvio:', error);
      return null;
    }
  }
};
