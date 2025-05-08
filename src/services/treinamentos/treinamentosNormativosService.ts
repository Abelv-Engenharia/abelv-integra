
import { supabase } from '@/integrations/supabase/client';
import { TreinamentoNormativo } from '@/types/treinamentos';

/**
 * Fetch treinamentos normativos
 */
export async function fetchTreinamentosNormativos(): Promise<TreinamentoNormativo[]> {
  try {
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .select(`
        id,
        funcionario_id,
        treinamento_id,
        data_realizacao,
        data_validade,
        tipo,
        status
      `)
      .order('data_validade', { ascending: true });

    if (error) {
      console.error("Erro ao buscar treinamentos normativos:", error);
      return [];
    }

    return data.map(item => ({
      ...item,
      data_realizacao: new Date(item.data_realizacao),
      data_validade: new Date(item.data_validade)
    })) || [];
  } catch (error) {
    console.error("Exceção ao buscar treinamentos normativos:", error);
    return [];
  }
}

/**
 * Create treinamento normativo
 */
export async function criarTreinamentoNormativo(treinamento: Partial<TreinamentoNormativo>) {
  try {
    // Convert Date objects to ISO strings for the database
    const treinamentoToInsert = {
      ...treinamento,
      data_realizacao: treinamento.data_realizacao instanceof Date 
        ? treinamento.data_realizacao.toISOString().split('T')[0] 
        : treinamento.data_realizacao,
      data_validade: treinamento.data_validade instanceof Date 
        ? treinamento.data_validade.toISOString().split('T')[0] 
        : treinamento.data_validade
    };

    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .insert(treinamentoToInsert)
      .select();

    if (error) {
      console.error("Erro ao criar treinamento normativo:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data && data[0] };
  } catch (error) {
    console.error("Exceção ao criar treinamento normativo:", error);
    return { success: false, error: "Erro ao processar a solicitação" };
  }
}
