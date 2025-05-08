
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByResponsavel, RPCInspecoesByResponsavelResult } from './types';

/**
 * Fetch inspeções by responsável
 */
export async function fetchInspecoesByResponsavel(): Promise<InspecoesByResponsavel[]> {
  try {
    const { data, error } = await supabase.rpc<RPCInspecoesByResponsavelResult>(
      'get_inspecoes_by_responsavel'
    );

    if (error) {
      console.error("Erro ao buscar inspeções por responsável:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || data.length === 0) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Exceção ao buscar inspeções por responsável:", error);
    return [];
  }
}
