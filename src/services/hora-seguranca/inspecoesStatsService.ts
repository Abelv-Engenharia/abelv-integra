
import { supabase } from '@/integrations/supabase/client';

interface InspecoesStats {
  periodo: string;
  quantidade: number;
}

/**
 * Fetch inspeções stats
 */
export async function fetchInspecoesStats(): Promise<InspecoesStats[]> {
  try {
    const { data, error } = await supabase.rpc<InspecoesStats>('get_inspecoes_stats');

    if (error) {
      console.error("Erro ao buscar estatísticas de inspeções:", error);
      return [];
    }

    // Verificar se há dados
    if (!data || !data.length) {
      return [];
    }

    return data as InspecoesStats[];
  } catch (error) {
    console.error("Exceção ao buscar estatísticas de inspeções:", error);
    return [];
  }
}
