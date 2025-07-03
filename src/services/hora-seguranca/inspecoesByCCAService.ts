
import { supabase } from '@/integrations/supabase/client';
import { FilterOptions } from '@/pages/hora-seguranca/HoraSegurancaDashboard';

/**
 * Fetch inspeções by CCA directly from execucao_hsa with filters
 */
export async function fetchInspecoesByCCA(ccaIds: number[], filters?: FilterOptions): Promise<any[]> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select(`
        cca_id,
        status,
        ccas!inner(codigo, nome)
      `);

    // Aplicar filtro de CCAs
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

    // Agrupar por CCA
    const grouped: Record<string, any> = {};
    
    data.forEach((row: any) => {
      const ccaName = `${row.ccas.codigo} - ${row.ccas.nome}`;
      const status = row.status || 'Indefinido';
      
      if (!grouped[ccaName]) {
        grouped[ccaName] = {
          'A Realizar': 0,
          'Realizada': 0,
          'Não Realizada': 0,
          'Realizada (Não Programada)': 0,
          'Cancelada': 0
        };
      }
      
      if (grouped[ccaName][status] !== undefined) {
        grouped[ccaName][status]++;
      }
    });

    return Object.entries(grouped).map(([cca, values]) => ({
      cca,
      ...values
    }));
  } catch (error) {
    console.error("Erro ao buscar inspeções por CCA:", error);
    return [];
  }
}
