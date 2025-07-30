
import { supabase } from '@/integrations/supabase/client';
import { OcorrenciasByRisco } from './types';

export async function fetchOcorrenciasByRisco(ccaIds?: number[]): Promise<OcorrenciasByRisco[]> {
  try {
    let query = supabase
      .from('ocorrencias')
      .select(`
        classificacao_risco,
        cca
      `);

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      // Converter ccaIds para string e filtrar diretamente
      const ccaIdsAsString = ccaIds.map(id => id.toString());
      query = query.in('cca', ccaIdsAsString);
    }

    const { data, error } = await query.order('classificacao_risco');

    if (error) throw error;

    console.log('Dados de ocorrências por risco (filtrado):', data);

    // Agrupar e contar as ocorrências por classificação de risco
    const riscosContagem: Record<string, number> = {};
    
    data?.forEach(ocorrencia => {
      const risco = ocorrencia.classificacao_risco || 'Não classificado';
      riscosContagem[risco] = (riscosContagem[risco] || 0) + 1;
    });

    return Object.entries(riscosContagem).map(([risco, quantidade]) => ({
      name: risco,
      value: quantidade
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por risco:', error);
    return [];
  }
}
