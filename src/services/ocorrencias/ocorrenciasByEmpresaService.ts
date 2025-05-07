
import { supabase } from '@/integrations/supabase/client';
import { OcorrenciasByEmpresa } from './types';

export async function fetchOcorrenciasByEmpresa(): Promise<OcorrenciasByEmpresa[]> {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('empresa')
      .order('empresa');

    if (error) throw error;

    // Agrupar e contar as ocorrências por empresa
    const empresasContagem: Record<string, number> = {};
    
    data?.forEach(ocorrencia => {
      const empresa = ocorrencia.empresa || 'Não especificada';
      empresasContagem[empresa] = (empresasContagem[empresa] || 0) + 1;
    });

    return Object.entries(empresasContagem).map(([empresa, quantidade]) => ({
      name: empresa,
      value: quantidade
    }));
  } catch (error) {
    console.error('Erro ao buscar ocorrências por empresa:', error);
    return [];
  }
}
