
import { supabase } from '@/integrations/supabase/client';

export async function fetchLatestOcorrencias() {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('*')
      .order('data', { ascending: false })
      .limit(10);

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar ocorrências recentes:', error);
    return [];
  }
}
