
import { supabase } from '@/integrations/supabase/client';

export async function fetchIDSMSPercentage(ccaIds?: number[]): Promise<number> {
  try {
    console.log('fetchIDSMSPercentage - CCAs filtradas:', ccaIds);
    
    // Buscar dados usando a mesma query do IDSMSDashboard
    const { data: dashboardData, error } = await supabase
      .from('idsms_indicadores')
      .select(`
        cca_id,
        tipo,
        resultado,
        ccas!inner(codigo, nome)
      `);

    if (error) {
      console.error('Erro ao buscar dados do IDSMS:', error);
      return 0;
    }

    if (!dashboardData || dashboardData.length === 0) {
      console.log('Nenhum dado de IDSMS encontrado');
      return 0;
    }

    console.log('Dados brutos do IDSMS:', dashboardData);

    // Agrupar por CCA - EXATAMENTE igual ao IDSMSDashboard
    const ccaGroups = dashboardData.reduce((acc: any, item: any) => {
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

    // Aplicar filtro de CCAs APÓS o cálculo, se fornecido
    let filteredCCAs = ccasWithIDSMS;
    if (ccaIds && ccaIds.length > 0) {
      filteredCCAs = ccasWithIDSMS.filter((cca: any) => {
        const ccaIdFromGroup = Object.keys(ccaGroups).find(id => 
          ccaGroups[id].cca_codigo === cca.cca_codigo
        );
        return ccaIds.includes(Number(ccaIdFromGroup));
      });
    }

    if (filteredCCAs.length === 0) {
      return 0;
    }

    // Calcular média igual ao IDSMSDashboard
    const idsmsMedia = filteredCCAs.length > 0 
      ? filteredCCAs.reduce((sum, item) => sum + item.idsms_total, 0) / filteredCCAs.length 
      : 0;
    
    console.log('Cálculo final do IDSMS - Total CCAs:', filteredCCAs.length, 'Média:', idsmsMedia);
    
    // Retornar com toFixed(1) convertido para number - igual ao IDSMSDashboard
    const resultado = Number(idsmsMedia.toFixed(1));
    console.log('Resultado final do IDSMS:', resultado);
    
    return resultado;
  } catch (error) {
    console.error('Erro ao buscar dados do IDSMS:', error);
    return 0;
  }
}
