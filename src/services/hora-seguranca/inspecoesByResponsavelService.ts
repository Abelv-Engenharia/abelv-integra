
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByResponsavel } from './types';

/**
 * Fetch inspeções by responsável direto do execucao_hsa
 */
export async function fetchInspecoesByResponsavel(ccaIds?: number[]): Promise<InspecoesByResponsavel[]> {
  try {
    let query = supabase
      .from('execucao_hsa')
      .select('responsavel_inspecao, status');

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Agrupa por responsável
    const grouped: Record<string, {
      cancelada: number;
      realizada: number;
      nao_realizada: number;
      realizada_np: number;
      a_realizar: number;
    }> = {};
    data.forEach((row: any) => {
      const nome = row.responsavel_inspecao || "Indefinido";
      if (!(nome in grouped)) {
        grouped[nome] = { cancelada: 0, realizada: 0, nao_realizada: 0, realizada_np: 0, a_realizar: 0 };
      }
      const status = (row.status || '').toUpperCase();
      if (status.includes('CANCELADA')) grouped[nome].cancelada += 1;
      else if (status === 'REALIZADA') grouped[nome].realizada += 1;
      else if (status === 'A REALIZAR') grouped[nome].a_realizar += 1;
      else if (status.includes('NÃO REALIZADA')) grouped[nome].nao_realizada += 1;
      else if (status.includes('NÃO PROGRAMADA')) grouped[nome].realizada_np += 1;
    });

    // DEBUG: log agrupamento final
    console.log('[HSA][fetchInspecoesByResponsavel] grouped:', grouped);

    const result = Object.entries(grouped).map(([responsavel, qtds]) => {
      const primeiroNome = responsavel.split(' ')[0];
      const data = {
        responsavel,
        primeiroNome,
        nomeCompleto: responsavel,
        quantidade: qtds.realizada,
        cancelada: qtds.cancelada,
        realizada: qtds.realizada,
        nao_realizada: qtds.nao_realizada,
        "A Realizar": qtds.a_realizar,
        "Realizada": qtds.realizada,
        "Não Realizada": qtds.nao_realizada,
        "Realizada (Não Programada)": qtds.realizada_np,
        "Cancelada": qtds.cancelada,
        "realizada (não programada)": qtds.realizada_np // compatibilidade
      };
      console.log('[fetchInspecoesByResponsavel] mapped data:', data);
      return data;
    });
    
    console.log('[fetchInspecoesByResponsavel] final result:', result);
    return result;
  } catch (error) {
    console.error("Erro ao buscar inspeções por responsável:", error);
    return [];
  }
}
