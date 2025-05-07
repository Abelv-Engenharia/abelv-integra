
import { supabase } from '@/integrations/supabase/client';
import { RecentInspection } from './types';

/**
 * Fetch recent inspections for dashboard
 */
export async function fetchRecentInspections(): Promise<RecentInspection[]> {
  try {
    const { data, error } = await supabase
      .from('inspecoes')
      .select('id, tipo, responsavel, status, data')
      .order('data', { ascending: false })
      .limit(5);

    if (error) {
      console.error("Erro ao buscar inspeções recentes:", error);
      return [];
    }

    return data as RecentInspection[];
  } catch (error) {
    console.error("Exceção ao buscar inspeções recentes:", error);
    return [];
  }
}
