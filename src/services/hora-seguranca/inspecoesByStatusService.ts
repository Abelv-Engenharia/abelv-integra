
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByStatus } from './types';

/**
 * Fetch inspeções by status
 */
export async function fetchInspecoesByStatus(): Promise<InspecoesByStatus[]> {
  try {
    const { data, error } = await supabase.rpc('get_inspecoes_by_status');

    if (error) {
      console.error("Erro ao buscar inspeções por status:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || !data.length) {
      return [];
    }

    const statuses = ['Concluída', 'Pendente', 'Cancelada'];
    return statuses.map(status => {
      const found = data.find((item: any) => item.name === status);
      return {
        name: status,
        value: found ? found.value : 0
      };
    });
  } catch (error) {
    console.error("Exceção ao buscar inspeções por status:", error);
    return [];
  }
}
