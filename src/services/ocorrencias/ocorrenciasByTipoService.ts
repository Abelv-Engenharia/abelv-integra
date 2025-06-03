
import { supabase } from '@/integrations/supabase/client';

export async function fetchOcorrenciasByTipo() {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('classificacao_ocorrencia');

    if (error) throw error;

    console.log('Dados de ocorrências por tipo:', data);

    const tipoCount = (data || []).reduce((acc: Record<string, number>, curr) => {
      const tipo = curr.classificacao_ocorrencia || 'Não definido';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    console.log('Contagem por tipo:', tipoCount);

    return Object.entries(tipoCount).map(([tipo, count]) => ({
      tipo,
      count
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por tipo:', error);
    return [];
  }
}
