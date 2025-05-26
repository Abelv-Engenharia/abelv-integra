
import { supabase } from '@/integrations/supabase/client';

export interface CCAOption {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  ativo?: boolean;
}

/**
 * Busca todas as opções de CCA ativas
 */
export async function fetchCCAs(): Promise<CCAOption[]> {
  try {
    const { data, error } = await supabase
      .from('ccas')
      .select('id, codigo, nome, tipo')
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error("Erro ao buscar CCAs:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exceção ao buscar CCAs:", error);
    return [];
  }
}

export const ccaService = {
  getAll: fetchCCAs
};
