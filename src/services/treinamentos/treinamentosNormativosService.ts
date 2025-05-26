
import { supabase } from '@/integrations/supabase/client';
import { TreinamentoNormativo } from '@/types/treinamentos';

/**
 * Fetch all treinamentos normativos
 */
export async function fetchTreinamentosNormativos(): Promise<TreinamentoNormativo[]> {
  try {
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar treinamentos normativos:", error);
      return [];
    }

    // Convert string dates to Date objects
    const processedData = (data || []).map(item => ({
      ...item,
      data_realizacao: new Date(item.data_realizacao),
      data_validade: new Date(item.data_validade)
    }));

    return processedData;
  } catch (error) {
    console.error("Exceção ao buscar treinamentos normativos:", error);
    return [];
  }
}

export const treinamentosNormativosService = {
  getAll: fetchTreinamentosNormativos
};
