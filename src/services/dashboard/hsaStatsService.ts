
import { supabase } from '@/integrations/supabase/client';

export async function fetchHSAPercentage(ccaIds?: number[]): Promise<number> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select('id, inspecao_programada, status');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return 0;
    }

    // Filtrar apenas as inspeções programadas
    const inspecoesProgramadas = data.filter(item => 
      (item.inspecao_programada || '').toUpperCase() === 'PROGRAMADA'
    );

    if (inspecoesProgramadas.length === 0) {
      return 0;
    }

    // Contar as realizadas (status contém "REALIZADA")
    const realizadas = inspecoesProgramadas.filter(item => 
      (item.status || '').toUpperCase().includes('REALIZADA')
    ).length;

    // Calcular percentual
    const percentual = (realizadas / inspecoesProgramadas.length) * 100;
    
    return Math.round(percentual * 100) / 100; // Arredondar para 2 casas decimais
  } catch (error) {
    console.error('Erro ao buscar dados do HSA:', error);
    return 0;
  }
}
