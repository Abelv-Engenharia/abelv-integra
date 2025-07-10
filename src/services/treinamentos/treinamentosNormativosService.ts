
import { supabase } from "@/integrations/supabase/client";
import { TreinamentoNormativo } from "@/types/treinamentos";

export const treinamentosNormativosService = {
  async getAll(): Promise<TreinamentoNormativo[]> {
    try {
      const { data, error } = await supabase
        .from('treinamentos_normativos')
        .select(`
          *,
          funcionarios:funcionario_id (
            nome,
            matricula,
            funcao,
            cca_id,
            ccas:cca_id (
              codigo,
              nome
            )
          ),
          treinamentos:treinamento_id (
            nome
          )
        `)
        .eq('arquivado', false)
        .order('data_validade', { ascending: true });

      if (error) {
        console.error('Erro ao buscar treinamentos normativos:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar treinamentos normativos:', error);
      return [];
    }
  },

  async create(treinamento: {
    funcionario_id: string;
    treinamento_id: string;
    data_realizacao: string;
    data_validade?: string;
    certificado_url?: string;
    observacoes?: string;
    status: string;
    tipo?: string;
  }): Promise<TreinamentoNormativo | null> {
    try {
      const { data, error } = await supabase
        .from('treinamentos_normativos')
        .insert(treinamento)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar treinamento normativo:', error);
        return null;
      }
      
      return data as TreinamentoNormativo;
    } catch (error) {
      console.error('Exceção ao criar treinamento normativo:', error);
      return null;
    }
  },

  async arquivar(id: string, justificativa?: string): Promise<void> {
    try {
      // No momento não existe campo para justificativa de exclusão, apenas arquiva.
      const { error } = await supabase
        .from('treinamentos_normativos')
        .update({ arquivado: true /*, justificativa_exclusao: justificativa */ })
        .eq('id', id);

      if (error) {
        console.error('Erro ao arquivar treinamento normativo:', error);
      }
    } catch (error) {
      console.error('Exceção ao arquivar treinamento normativo:', error);
    }
  }
};

