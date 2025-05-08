
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
        observacoes,
        efetivo_mod,
        efetivo_moi,
        horas_totais
      `)
      .order('data', { ascending: false });

    if (error) {
      console.error("Erro ao buscar execução de treinamentos:", error);
      return [];
    }

    return data.map(item => ({
      ...item,
      data: new Date(item.data)
    })) || [];
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
    // Extract the month and year from the date for easier querying
    if (treinamento.data) {
      const date = new Date(treinamento.data);
      treinamento.mes = date.getMonth() + 1; // JavaScript months are 0-indexed
      treinamento.ano = date.getFullYear();
    }

    const { data, error } = await supabase
      .from('execucao_treinamentos')
      .insert([treinamento])
      .select();

    if (error) {
      console.error("Erro ao criar execução de treinamento:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data && data[0] };
  } catch (error) {
    console.error("Exceção ao criar execução de treinamento:", error);
    return { success: false, error: "Erro ao processar a solicitação" };
  }
}
