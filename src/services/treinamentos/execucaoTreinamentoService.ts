
import { supabase } from '@/integrations/supabase/client';

export interface ExecucaoTreinamento {
  id: string;
  treinamento_id?: string;
  treinamento_nome?: string;
  processo_treinamento: string;
  tipo_treinamento: string;
  carga_horaria: number;
  cca: string;
  cca_id?: number;
  data: Date;
  mes: number;
  ano: number;
  efetivo_mod?: number;
  efetivo_moi?: number;
  horas_totais?: number;
  observacoes?: string;
  lista_presenca_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all execucao treinamentos
 */
export async function fetchExecucaoTreinamentos(): Promise<ExecucaoTreinamento[]> {
  try {
    const { data, error } = await supabase
      .from('execucao_treinamentos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar execuções de treinamento:", error);
      return [];
    }

    // Convert string dates to Date objects
    const processedData = (data || []).map(item => ({
      ...item,
      data: new Date(item.data)
    }));

    return processedData;
  } catch (error) {
    console.error("Exceção ao buscar execuções de treinamento:", error);
    return [];
  }
}

export const execucaoTreinamentoService = {
  getAll: fetchExecucaoTreinamentos,
  
  async create(data: Omit<ExecucaoTreinamento, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data: result, error } = await supabase
        .from('execucao_treinamentos')
        .insert({
          ...data,
          data: data.data.toISOString().split('T')[0] // Convert Date to string for database
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar execução de treinamento:", error);
        throw error;
      }

      return {
        ...result,
        data: new Date(result.data)
      };
    } catch (error) {
      console.error("Exceção ao criar execução de treinamento:", error);
      throw error;
    }
  }
};
