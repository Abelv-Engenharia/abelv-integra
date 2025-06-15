
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByResponsavel } from './types';

/**
 * Fetch inspeções by responsável direto do execucao_hsa
 */
export async function fetchInspecoesByResponsavel(): Promise<InspecoesByResponsavel[]> {
  try {
    const { data, error } = await supabase
      .from('execucao_hsa')
      .select('responsavel_inspecao, status');

    if (error) throw error;

    // Agrupa por responsável
    const grouped: Record<string, { cancelada: number, realizada: number, nao_realizada: number, realizada_np: number }> = {};
    data.forEach((row: any) => {
      const nome = row.responsavel_inspecao || "Indefinido";
      if (!(nome in grouped)) grouped[nome] = { cancelada: 0, realizada: 0, nao_realizada: 0, realizada_np: 0 };
      const status = (row.status || '').toUpperCase();
      if (status.includes('CANCELADA')) grouped[nome].cancelada += 1;
      else if (status === 'REALIZADA') grouped[nome].realizada += 1;
      else if (status.includes('NÃO REALIZADA')) grouped[nome].nao_realizada += 1;
      else if (status.includes('NÃO PROGRAMADA')) grouped[nome].realizada_np += 1;
    });
    return Object.entries(grouped).map(([responsavel, qtds]) => ({
      responsavel,
      quantidade: qtds.realizada,
      cancelada: qtds.cancelada,
      realizada: qtds.realizada,
      nao_realizada: qtds.nao_realizada,
      "realizada (não programada)": qtds.realizada_np
    }));
  } catch (error) {
    console.error("Erro ao buscar inspeções por responsável:", error);
    return [];
  }
}
