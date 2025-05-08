
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByStatus } from '@/types/treinamentos';

/**
 * Fetch inspeções by status
 */
export async function fetchInspecoesByStatus(): Promise<InspecoesByStatus[]> {
  try {
    const { data, error } = await supabase.rpc<InspecoesByStatus>('get_inspecoes_by_status');

    if (error) {
      console.error("Erro ao buscar inspeções por status:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || !data.length) {
      return [];
    }

    // Transform the data to match the expected format
    return (data as any[]).map(item => ({
      status: item.status,
      quantidade: item.quantidade
    }));
  } catch (error) {
    console.error("Exceção ao buscar inspeções por status:", error);
    return [];
  }
}
