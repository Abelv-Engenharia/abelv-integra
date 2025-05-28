
import { supabase } from "@/integrations/supabase/client";
import { TreinamentoNormativo } from "@/types/treinamentos";

export const treinamentosNormativosService = {
  async getAll(): Promise<TreinamentoNormativo[]> {
    try {
      const { data, error } = await supabase
        .from('treinamentos_normativos')
        .select(`
          *,
          treinamentos(nome)
        `)
        .order('data_realizacao', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar treinamentos normativos:', error);
        return [];
      }
      
      return (data || []).map(item => ({
        ...item,
        data_realizacao: typeof item.data_realizacao === 'string' ? item.data_realizacao : item.data_realizacao.toISOString().split('T')[0],
        data_validade: typeof item.data_validade === 'string' ? item.data_validade : item.data_validade.toISOString().split('T')[0],
        treinamentoNome: item.treinamentos?.nome || 'N/A'
      }));
    } catch (error) {
      console.error('Exceção ao buscar treinamentos normativos:', error);
      return [];
    }
  },

  async create(treinamento: Omit<TreinamentoNormativo, 'id' | 'created_at' | 'updated_at'>): Promise<TreinamentoNormativo | null> {
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
      
      return {
        ...data,
        data_realizacao: typeof data.data_realizacao === 'string' ? data.data_realizacao : data.data_realizacao.toISOString().split('T')[0],
        data_validade: typeof data.data_validade === 'string' ? data.data_validade : data.data_validade.toISOString().split('T')[0],
      };
    } catch (error) {
      console.error('Exceção ao criar treinamento normativo:', error);
      return null;
    }
  }
};
