
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByStatus } from './types';

/**
 * Fetch inspeções by status directly from execucao_hsa
 */
export async function fetchInspecoesByStatus(): Promise<InspecoesByStatus[]> {
  try {
    const { data, error } = await supabase
      .from('execucao_hsa')
      .select('status');

    if (error) throw error;

    // Agrupa por status
    const grouped: Record<string, number> = {};
    data.forEach((row: any) => {
      const st = (row.status || 'Indefinido');
      grouped[st] = (grouped[st] || 0) + 1;
    });
    return Object.keys(grouped).map((status) => ({
      name: status,
      value: grouped[status],
      status,
    }));
  } catch (error) {
    console.error("Erro ao buscar inspeções por status:", error);
    return [];
  }
}
