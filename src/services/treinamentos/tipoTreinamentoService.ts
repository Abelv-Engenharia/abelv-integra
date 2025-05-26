
import { supabase } from '@/integrations/supabase/client';

export interface TipoTreinamentoOption {
  id: string;
  codigo: string;
  nome: string;
  ativo?: boolean;
}

/**
 * Busca todas as opções de Tipo de Treinamento ativas
 */
export async function fetchTiposTreinamento(): Promise<TipoTreinamentoOption[]> {
  try {
    const { data, error } = await supabase
      .from('tipo_treinamento')
      .select('id, codigo, nome')
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error("Erro ao buscar Tipos de Treinamento:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exceção ao buscar Tipos de Treinamento:", error);
    return [];
  }
}

// Export service object to match the import pattern
export const tipoTreinamentoService = {
  getAll: fetchTiposTreinamento
};
