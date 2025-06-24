
import { supabase } from '@/integrations/supabase/client';

export interface DesviosByResponsavel {
  responsavel: string;
  desvios: number;
}

/**
 * Fetch desvios by responsável from execucao_hsa table
 */
export async function fetchDesviosByResponsavel(ccaIds?: number[]): Promise<DesviosByResponsavel[]> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select('responsavel_inspecao, desvios_identificados');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Agrupa por responsável e soma os desvios
    const grouped: Record<string, number> = {};
    
    data.forEach((row: any) => {
      const nome = row.responsavel_inspecao || "Indefinido";
      const desvios = row.desvios_identificados || 0;
      
      if (!(nome in grouped)) {
        grouped[nome] = 0;
      }
      grouped[nome] += desvios;
    });

    // DEBUG: log agrupamento final
    console.log('[HSA][fetchDesviosByResponsavel] grouped:', grouped);

    return Object.entries(grouped)
      .filter(([_, desvios]) => desvios > 0) // Só mostra responsáveis com desvios
      .map(([responsavel, desvios]) => ({
        responsavel,
        desvios
      }))
      .sort((a, b) => b.desvios - a.desvios); // Ordena por quantidade de desvios (decrescente)
      
  } catch (error) {
    console.error("Erro ao buscar desvios por responsável:", error);
    return [];
  }
}
