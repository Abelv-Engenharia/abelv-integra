
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByTipo } from '@/types/treinamentos';

/**
 * Fetch inspeções by tipo
 */
export async function fetchInspecoesByTipo(): Promise<InspecoesByTipo[]> {
  try {
    const { data, error } = await supabase.rpc<InspecoesByTipo>(
      'get_inspecoes_by_tipo'
    );

    if (error) {
      console.error("Erro ao buscar inspeções por tipo:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || data.length === 0) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Exceção ao buscar inspeções por tipo:", error);
    return [];
  }
}
