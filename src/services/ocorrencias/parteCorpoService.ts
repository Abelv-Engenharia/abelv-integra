
import { supabase } from '@/integrations/supabase/client';
import { ParteCorpoData } from './types';

export async function fetchParteCorpoData(): Promise<ParteCorpoData[]> {
  try {
    const { data, error } = await supabase
      .from('ocorrencias')
      .select('partes_corpo_afetadas')
      .not('partes_corpo_afetadas', 'is', null);

    if (error) throw error;

    // Processar arrays de partes do corpo e contabilizar
    const partesCorpoContagem: Record<string, number> = {};
    
    data?.forEach(ocorrencia => {
      if (Array.isArray(ocorrencia.partes_corpo_afetadas)) {
        ocorrencia.partes_corpo_afetadas.forEach((parte: string) => {
          partesCorpoContagem[parte] = (partesCorpoContagem[parte] || 0) + 1;
        });
      }
    });

    return Object.entries(partesCorpoContagem)
      .map(([parte, quantidade]) => ({
        name: parte,
        value: quantidade
      }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Erro ao buscar dados de partes do corpo:', error);
    return [];
  }
}
