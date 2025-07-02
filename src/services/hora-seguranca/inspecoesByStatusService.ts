
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByStatus } from './types';

/**
 * Fetch inspeções by status directly from execucao_hsa
 */
export async function fetchInspecoesByStatus(ccaIds?: number[]): Promise<InspecoesByStatus[]> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select('status');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Agrupa por status
    const grouped: Record<string, number> = {};
    data.forEach((row: any) => {
      const st = (row.status || 'Indefinido');
      grouped[st] = (grouped[st] || 0) + 1;
    });
    
    return Object.keys(grouped).map((status) => ({
      status,
      quantidade: grouped[status],
    }));
  } catch (error) {
    console.error("Erro ao buscar inspeções por status:", error);
    return [];
  }
}
