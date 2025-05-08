
import { supabase } from '@/integrations/supabase/client';
import { RPCDesviosByInspectionTypeResult } from '@/types/treinamentos';

/**
 * Fetch desvios by inspection type
 */
export async function fetchDesviosByInspectionType(): Promise<RPCDesviosByInspectionTypeResult[]> {
  try {
    const { data, error } = await supabase.rpc<RPCDesviosByInspectionTypeResult>('get_desvios_by_inspection_type');

    if (error) {
      console.error("Erro ao buscar desvios por tipo de inspeção:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || !data.length) {
      return [];
    }

    return data as RPCDesviosByInspectionTypeResult[];
  } catch (error) {
    console.error("Exceção ao buscar desvios por tipo de inspeção:", error);
    return [];
  }
}
