
import { supabase } from '@/integrations/supabase/client';

export interface DesviosByInspectionType {
  tipo: string;
  quantidade: number;
}

/**
 * Fetch desvios by inspection type from execucao_hsa table
 */
export async function fetchDesviosByInspectionType(): Promise<DesviosByInspectionType[]> {
  try {
    const { data, error } = await supabase
      .from('execucao_hsa')
      .select('inspecao_programada, desvios_identificados');

    if (error) throw error;

    // Agrupa por tipo de inspeção e soma os desvios
    const grouped: Record<string, number> = {};
    
    data.forEach((row: any) => {
      const tipo = row.inspecao_programada || "Indefinido";
      const desvios = row.desvios_identificados || 0;
      
      // Só processa se há desvios identificados
      if (desvios > 0) {
        if (!(tipo in grouped)) {
          grouped[tipo] = 0;
        }
        grouped[tipo] += desvios;
      }
    });

    // DEBUG: log agrupamento final
    console.log('[HSA][fetchDesviosByInspectionType] grouped:', grouped);

    return Object.entries(grouped)
      .filter(([_, quantidade]) => quantidade > 0) // Remove entradas com zero desvios
      .map(([tipo, quantidade]) => ({
        tipo,
        quantidade
      }))
      .sort((a, b) => b.quantidade - a.quantidade); // Ordena por quantidade (decrescente)
      
  } catch (error) {
    console.error("Erro ao buscar desvios por tipo de inspeção:", error);
    return [];
  }
}
