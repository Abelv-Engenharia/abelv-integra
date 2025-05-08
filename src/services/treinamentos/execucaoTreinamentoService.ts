
import { supabase } from '@/integrations/supabase/client';
import { ExecucaoTreinamento } from '@/types/treinamentos';

/**
 * Fetch execucao treinamentos
 */
export async function fetchExecucaoTreinamentos(): Promise<ExecucaoTreinamento[]> {
  try {
    const { data, error } = await supabase
      .from('execucao_treinamentos')
      .select(`
        id,
        treinamento_nome,
        processo_treinamento,
        tipo_treinamento,
        carga_horaria,
        cca,
        data,
        observacoes
      `)
      .order('data', { ascending: false });

    if (error) {
      console.error("Erro ao buscar execução de treinamentos:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exceção ao buscar execução de treinamentos:", error);
    return [];
  }
}

/**
 * Create execucao treinamento
 */
export async function criarExecucaoTreinamento(treinamento: Partial<ExecucaoTreinamento>) {
  try {
    const { data, error } = await supabase
      .from('execucao_treinamentos')
      .insert([treinamento])
      .select();

    if (error) {
      console.error("Erro ao criar execução de treinamento:", error);
      throw error;
    }

    return data && data[0];
  } catch (error) {
    console.error("Exceção ao criar execução de treinamento:", error);
    throw error;
  }
}
