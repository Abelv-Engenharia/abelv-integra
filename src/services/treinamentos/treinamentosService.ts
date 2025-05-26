
import { supabase } from '@/integrations/supabase/client';
import { Treinamento } from '@/types/treinamentos';

/**
 * Fetch treinamentos
 */
export async function fetchTreinamentos(): Promise<Treinamento[]> {
  try {
    const { data, error } = await supabase
      .from('treinamentos')
      .select(`
        id,
        nome,
        validade_dias,
        carga_horaria
      `)
      .order('nome');

    if (error) {
      console.error("Erro ao buscar treinamentos:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exceção ao buscar treinamentos:", error);
    return [];
  }
}

// Export service object to match the import pattern
export const treinamentosService = {
  getAll: fetchTreinamentos
};
