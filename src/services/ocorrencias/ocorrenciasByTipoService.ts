
import { supabase } from '@/integrations/supabase/client';
import { OcorrenciasByTipo } from './types';

export async function fetchOcorrenciasByTipo(): Promise<OcorrenciasByTipo[]> {
  try {
    // Usar o campo tipo_ocorrencia em vez de tipo_acidente
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('tipo_ocorrencia')
      .order('tipo_ocorrencia');

    if (error) throw error;

    // Agrupar e contar as ocorrências por tipo
    const tiposContagem: Record<string, number> = {};
    
    data?.forEach(ocorrencia => {
      const tipo = ocorrencia.tipo_ocorrencia || 'Não classificado';
      tiposContagem[tipo] = (tiposContagem[tipo] || 0) + 1;
    });

    return Object.entries(tiposContagem).map(([tipo, quantidade]) => ({
      name: tipo,
      value: quantidade
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por tipo:', error);
    return [];
  }
}
