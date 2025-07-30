
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByCCA } from './types';

export async function fetchInspecoesByCCA(ccaIds?: number[]): Promise<InspecoesByCCA[]> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select(`
        status,
        cca_id,
        ccas!inner(codigo, nome)
      `);

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    const { data: rows, error } = await query;

    if (error || !rows) {
      console.error("Erro ao buscar inspeções por CCA:", error);
      return [];
    }

    // Agrupar por CCA e contar por status
    const ccaMap: Record<string, InspecoesByCCA> = {};

    rows.forEach((row: any) => {
      const ccaKey = `${row.ccas.codigo} - ${row.ccas.nome}`;
      const status = (row.status || '').toUpperCase();

      if (!ccaMap[ccaKey]) {
        ccaMap[ccaKey] = {
          cca: ccaKey,
          codigo: row.ccas.codigo,
          nomeCompleto: `${row.ccas.codigo} - ${row.ccas.nome}`,
          "A Realizar": 0,
          "Realizada": 0,
          "Não Realizada": 0,
          "Realizada (Não Programada)": 0,
          "Cancelada": 0,
        };
      }

      switch (status) {
        case 'A REALIZAR':
          ccaMap[ccaKey]["A Realizar"]++;
          break;
        case 'REALIZADA':
          ccaMap[ccaKey]["Realizada"]++;
          break;
        case 'NÃO REALIZADA':
          ccaMap[ccaKey]["Não Realizada"]++;
          break;
        case 'REALIZADA (NÃO PROGRAMADA)':
          ccaMap[ccaKey]["Realizada (Não Programada)"]++;
          break;
        case 'CANCELADA':
          ccaMap[ccaKey]["Cancelada"]++;
          break;
      }
    });

    return Object.values(ccaMap);
  } catch (error) {
    console.error("Erro ao buscar inspeções por CCA:", error);
    return [];
  }
}
