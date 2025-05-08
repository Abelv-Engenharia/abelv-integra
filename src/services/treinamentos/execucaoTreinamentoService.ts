
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
    // Ensure all required fields are present to prevent TypeScript errors
    const requiredFields = {
      carga_horaria: treinamento.carga_horaria || 0,
      cca: treinamento.cca || '',
      processo_treinamento: treinamento.processo_treinamento || '',
      tipo_treinamento: treinamento.tipo_treinamento || '',
    };
    
    // Extract the month and year from the date for easier querying
    let mes = 1;
    let ano = new Date().getFullYear();
    
    if (treinamento.data) {
      const date = new Date(treinamento.data);
      mes = date.getMonth() + 1; // JavaScript months are 0-indexed
      ano = date.getFullYear();
    }

    // Calculate horas_totais client-side to ensure accuracy
    const efetivo_mod = Number(treinamento.efetivo_mod) || 0;
    const efetivo_moi = Number(treinamento.efetivo_moi) || 0;
    const carga_horaria = Number(treinamento.carga_horaria) || 0;
    const horas_totais = carga_horaria * (efetivo_mod + efetivo_moi);

    // Prepare the data for insertion
    const treinamentoData = {
      ...treinamento,
      ...requiredFields,
      mes,
      ano,
      horas_totais,
      efetivo_mod,
      efetivo_moi
    };

    const { data, error } = await supabase
      .from('execucao_treinamentos')
      .insert(treinamentoData)
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
