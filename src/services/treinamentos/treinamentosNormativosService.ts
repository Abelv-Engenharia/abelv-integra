
import { supabase } from '@/integrations/supabase/client';
import { TreinamentoNormativo } from '@/types/treinamentos';

/**
 * Fetch treinamentos normativos
 */
export async function fetchTreinamentosNormativos(): Promise<TreinamentoNormativo[]> {
  try {
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .select(`
        id,
        funcionario_id,
        treinamento_id,
        data_realizacao,
        data_validade,
        tipo,
        status
      `)
      .order('data_realizacao', { ascending: false });

    if (error) {
      console.error("Erro ao buscar treinamentos normativos:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exceção ao buscar treinamentos normativos:", error);
    return [];
  }
}
