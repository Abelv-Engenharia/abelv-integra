
import { supabase } from '@/integrations/supabase/client';
import { RPCInspecoesByResponsavelResult } from '@/types/treinamentos';

/**
 * Fetch inspeções by responsável
 */
export async function fetchInspecoesByResponsavel(): Promise<RPCInspecoesByResponsavelResult[]> {
  try {
    const { data, error } = await supabase.rpc<RPCInspecoesByResponsavelResult>('get_inspecoes_by_responsavel');

    if (error) {
      console.error("Erro ao buscar inspeções por responsável:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || !data.length) {
      return [];
    }

    return data as RPCInspecoesByResponsavelResult[];
  } catch (error) {
    console.error("Exceção ao buscar inspeções por responsável:", error);
    return [];
  }
}
