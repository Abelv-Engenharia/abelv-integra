
import { supabase } from '@/integrations/supabase/client';

export async function fetchIDSMSPercentage(ccaIds?: number[]): Promise<number> {
  try {
    console.log('fetchIDSMSPercentage - CCAs filtradas:', ccaIds);
    
    // Usar exatamente a mesma query do IDSMSDashboard
    let query = supabase
      .from('idsms_indicadores')
      .select(`
        cca_id,
        tipo,
        resultado,
        ccas!inner(codigo, nome)
      `);

    // Aplicar filtro de CCAs se fornecido
    if (ccaIds && ccaIds.length > 0) {
      query = query.in('cca_id', ccaIds);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar dados do IDSMS:', error);
      return 0;
    }

    if (!data || data.length === 0) {
      console.log('Nenhum dado de IDSMS encontrado');
      return 0;
    }

    console.log('Dados brutos do IDSMS:', data);

    // Agrupar por CCA - EXATAMENTE igual ao IDSMSDashboard
    const ccaGroups = data.reduce((acc: any, item: any) => {
      const ccaId = item.cca_id;
      if (!acc[ccaId]) {
        acc[ccaId] = {
          cca_codigo: item.ccas.codigo,
          cca_nome: item.ccas.nome,
          iid: 0,
          hsa: 0,
          ht: 0,
          ipom: 0,
          inspecao_alta_lideranca: 0,
          inspecao_gestao_sms: 0,
          indice_reativo: 0
        };
      }

      // Mapear tipos de indicadores - EXATAMENTE igual ao IDSMSDashboard
      switch (item.tipo) {
        case 'IID':
          acc[ccaId].iid = item.resultado;
          break;
        case 'HSA':
          acc[ccaId].hsa = item.resultado;
          break;
        case 'HT':
          acc[ccaId].ht = item.resultado;
          break;
        case 'IPOM':
          acc[ccaId].ipom = item.resultado;
          break;
        case 'Inspeção Alta Liderança':
          acc[ccaId].inspecao_alta_lideranca = item.resultado;
          break;
        case 'Inspeção Gestão SMS':
          acc[ccaId].inspecao_gestao_sms = item.resultado;
          break;
        case 'Índice Reativo':
          acc[ccaId].indice_reativo = item.resultado;
          break;
      }

      return acc;
    }, {});

    console.log('Grupos de CCAs após agrupamento:', ccaGroups);

    // Calcular IDSMS total para cada CCA - EXATAMENTE igual ao IDSMSDashboard
    const ccasWithIDSMS = Object.values(ccaGroups).map((cca: any) => {
      const idsms_total = 
        cca.iid + 
        cca.hsa + 
        cca.ht + 
        cca.ipom + 
        cca.inspecao_alta_lideranca + 
        cca.inspecao_gestao_sms - 
        cca.indice_reativo;
      
      return {
        ...cca,
        idsms_total
      };
    });

    console.log('CCAs com IDSMS calculado:', ccasWithIDSMS);

    if (ccasWithIDSMS.length === 0) {
      return 0;
    }

    // Calcular média - EXATAMENTE igual ao IDSMSDashboard
    const somaTotal = ccasWithIDSMS.reduce((sum: number, cca: any) => sum + cca.idsms_total, 0);
    const media = somaTotal / ccasWithIDSMS.length;
    
    console.log('Cálculo final - Soma total:', somaTotal, 'Quantidade de CCAs:', ccasWithIDSMS.length, 'Média:', media);
    
    // Retornar com toFixed(1) convertido para number - igual ao IDSMSDashboard
    const resultado = Number(media.toFixed(1));
    console.log('Resultado final do IDSMS:', resultado);
    
    return resultado;
  } catch (error) {
    console.error('Erro ao buscar dados do IDSMS:', error);
    return 0;
  }
}
