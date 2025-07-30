
import { supabase } from '@/integrations/supabase/client';

export async function fetchOcorrenciasByTipo(ccaIds?: number[]) {
  try {
    let query = supabase
      .from('ocorrencias')
      .select('classificacao_ocorrencia_codigo');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      // Converter ccaIds para string e filtrar diretamente
      const ccaIdsAsString = ccaIds.map(id => id.toString());
      query = query.in('cca', ccaIdsAsString);
    }

    const { data, error } = await query;

    if (error) throw error;

    console.log('Dados de ocorrências por tipo (filtrado):', data);

    const tipoCount = (data || []).reduce((acc: Record<string, number>, curr) => {
      const tipo = curr.classificacao_ocorrencia_codigo || 'Não definido';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    console.log('Contagem por tipo (filtrado):', tipoCount);

    return Object.entries(tipoCount).map(([tipo, count]) => ({
      tipo,
      count
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por tipo:', error);
    return [];
  }
}
