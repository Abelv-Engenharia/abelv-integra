
import { supabase } from '@/integrations/supabase/client';

export async function fetchIDSMSPercentage(ccaIds?: number[]): Promise<number> {
  try {
    let query = supabase
      .from('idsms_indicadores')
      .select('resultado');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return 0;
    }

    // Calcular a média dos resultados
    const total = data.reduce((acc, item) => acc + (item.resultado || 0), 0);
    const media = total / data.length;
    
    return Math.round(media * 100) / 100; // Arredondar para 2 casas decimais
  } catch (error) {
    console.error('Erro ao buscar dados do IDSMS:', error);
    return 0;
  }
}
