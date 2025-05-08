
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

export interface TreinamentoExecucaoInput {
  data: Date;
  cca_id: number;
  processo_treinamento_id: string;
  tipo_treinamento_id: string;
  treinamento_id?: string;
  treinamento_nome?: string;
  carga_horaria: number;
  observacoes?: string;
  lista_presenca?: File;
}

/**
 * Cria um novo registro de execução de treinamento
 */
export async function criarExecucaoTreinamento(dados: TreinamentoExecucaoInput): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const mes = new Date(dados.data).getMonth() + 1; // Janeiro é 0
    const ano = new Date(dados.data).getFullYear();
    
    let lista_presenca_url = null;
    
    // Se houver um arquivo de lista de presença, faz o upload
    if (dados.lista_presenca) {
      const fileExt = dados.lista_presenca.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `treinamentos/${fileName}`;
      
      try {
        // Aqui teríamos o upload para o storage, mas como não está configurado,
        // apenas simulamos o resultado
        lista_presenca_url = filePath;
      } catch (uploadError) {
        console.error("Erro ao fazer upload do arquivo:", uploadError);
        return { success: false, error: "Erro ao fazer upload da lista de presença" };
      }
    }
    
    const { data, error } = await supabase.from('execucao_treinamentos').insert({
      data: format(dados.data, 'yyyy-MM-dd'),
      mes,
      ano,
      cca_id: dados.cca_id,
      processo_treinamento_id: dados.processo_treinamento_id,
      tipo_treinamento_id: dados.tipo_treinamento_id,
      treinamento_id: dados.treinamento_id,
      treinamento_nome: dados.treinamento_nome,
      carga_horaria: dados.carga_horaria,
      observacoes: dados.observacoes,
      lista_presenca_url
    }).select('id').single();
    
    if (error) {
      console.error("Erro ao registrar execução de treinamento:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Exceção ao registrar execução de treinamento:", error);
    return { success: false, error: "Erro interno ao processar o registro" };
  }
}
