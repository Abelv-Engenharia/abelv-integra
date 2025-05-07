
import { supabase } from '@/integrations/supabase/client';
import { OcorrenciasByRisco } from './types';

export async function fetchOcorrenciasByRisco(): Promise<OcorrenciasByRisco[]> {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('classificacao_risco')
      .order('classificacao_risco');

    if (error) throw error;

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
