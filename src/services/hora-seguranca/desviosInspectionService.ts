
import { supabase } from '@/integrations/supabase/client';
import { FilterOptions } from '@/pages/hora-seguranca/HoraSegurancaDashboard';

export interface DesviosByInspectionType {
  tipo: string;
  quantidade: number;
}

/**
 * Fetch desvios by inspection type from execucao_hsa table with filters
 */
export async function fetchDesviosByInspectionType(ccaIds?: number[], filters?: FilterOptions): Promise<DesviosByInspectionType[]> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select('inspecao_programada, desvios_identificados');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    // Aplicar filtro de CCA específico
    if (filters?.ccaId) {
      query = query.eq('cca_id', parseInt(filters.ccaId));
    }

    // Aplicar filtro de responsável
    if (filters?.responsavel) {
      query = query.eq('responsavel_inspecao', filters.responsavel);
    }

    // Aplicar filtro de data inicial
    if (filters?.dataInicial) {
      query = query.gte('data', filters.dataInicial.toISOString().split('T')[0]);
    }

    // Aplicar filtro de data final
    if (filters?.dataFinal) {
      query = query.lte('data', filters.dataFinal.toISOString().split('T')[0]);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Agrupa por tipo de inspeção e conta os desvios
    const grouped: Record<string, number> = {};
    
    data.forEach((row: any) => {
      const tipo = row.inspecao_programada || "Não Definido";
      const desvios = row.desvios_identificados || 0;
      
      if (!(tipo in grouped)) {
        grouped[tipo] = 0;
      }
      grouped[tipo] += desvios;
    });

    return Object.entries(grouped)
      .filter(([_, quantidade]) => quantidade > 0) // Só mostra tipos com desvios
      .map(([tipo, quantidade]) => ({
        tipo,
        quantidade
      }))
      .sort((a, b) => b.quantidade - a.quantidade); // Ordena por quantidade de desvios (decrescente)
      
  } catch (error) {
    console.error("Erro ao buscar desvios por tipo de inspeção:", error);
    return [];
  }
}
