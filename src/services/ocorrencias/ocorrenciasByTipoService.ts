
import { supabase } from '@/integrations/supabase/client';

export async function fetchOcorrenciasByTipo(ccaIds?: number[]) {
  try {
    let query = supabase
      .from('ocorrencias')
      .select('classificacao_ocorrencia');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      // Como a tabela ocorrencias tem o campo 'cca' como texto, 
      // precisamos buscar os códigos dos CCAs permitidos
      const { data: ccasData } = await supabase
        .from('ccas')
        .select('codigo')
        .in('id', ccaIds);
      
      if (ccasData && ccasData.length > 0) {
        const ccaCodigos = ccasData.map(cca => cca.codigo);
        query = query.in('cca', ccaCodigos);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    console.log('Dados de ocorrências por tipo (filtrado):', data);

    const tipoCount = (data || []).reduce((acc: Record<string, number>, curr) => {
      const tipo = curr.classificacao_ocorrencia || 'Não definido';
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
