
import { supabase } from '@/integrations/supabase/client';

export interface ProcessoTreinamentoOption {
  id: string;
  codigo: string;
  nome: string;
  ativo?: boolean;
}

/**
 * Busca todas as opções de Processo de Treinamento ativas
 */
export async function fetchProcessosTreinamento(): Promise<ProcessoTreinamentoOption[]> {
  try {
    const { data, error } = await supabase
      .from('processo_treinamento')
      .select('id, codigo, nome')
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error("Erro ao buscar Processos de Treinamento:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exceção ao buscar Processos de Treinamento:", error);
    return [];
  }
}
