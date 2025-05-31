
import { supabase } from "@/integrations/supabase/client";
import { IDSMSIndicador, IDSMSDashboardData } from "@/types/treinamentos";

export const idsmsService = {
  async createIndicador(indicador: Omit<IDSMSIndicador, 'id' | 'created_at' | 'updated_at'>): Promise<IDSMSIndicador | null> {
    try {
      const { data, error } = await supabase
        .from('idsms_indicadores')
        .insert(indicador)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar indicador IDSMS:', error);
        return null;
      }
      
      return data as IDSMSIndicador;
    } catch (error) {
      console.error('Exceção ao criar indicador IDSMS:', error);
      return null;
    }
  },

  async getDashboardData(): Promise<IDSMSDashboardData[]> {
    try {
      console.log('Iniciando busca dos dados do dashboard IDSMS...');
      
      // Buscar todos os indicadores
      const { data: indicadores, error: indicadoresError } = await supabase
        .from('idsms_indicadores')
        .select('*')
        .order('created_at', { ascending: false });

      if (indicadoresError) {
        console.error('Erro ao buscar indicadores:', indicadoresError);
        return [];
      }

      console.log('Total de indicadores encontrados:', indicadores?.length || 0);

      if (!indicadores || indicadores.length === 0) {
        console.log('Nenhum indicador encontrado na tabela idsms_indicadores');
        return [];
      }

      // Buscar todos os CCAs ativos
      const { data: ccas, error: ccasError } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true);

      if (ccasError) {
        console.error('Erro ao buscar CCAs:', ccasError);
        return [];
      }

      console.log('CCAs encontrados:', ccas?.length || 0);

      if (!ccas || ccas.length === 0) {
        console.log('Nenhum CCA ativo encontrado');
        return [];
      }

      const dashboardData: IDSMSDashboardData[] = [];

      // Agrupar indicadores por CCA
      const indicadoresPorCCA = indicadores.reduce((acc, indicador) => {
        if (!acc[indicador.cca_id]) {
          acc[indicador.cca_id] = [];
        }
        acc[indicador.cca_id].push(indicador);
        return acc;
      }, {} as Record<number, IDSMSIndicador[]>);

      for (const cca of ccas) {
        const indicadoresDoCCA = indicadoresPorCCA[cca.id] || [];
        
        console.log(`Processando CCA: ${cca.codigo} (ID: ${cca.id})`);
        console.log(`Indicadores encontrados para CCA ${cca.codigo}:`, indicadoresDoCCA.length);
        
        if (indicadoresDoCCA.length === 0) {
          console.log(`Pulando CCA ${cca.codigo} - sem indicadores`);
          continue;
        }

        // Pegar o indicador mais recente de cada tipo
        const tipos = ['IID', 'HSA', 'HT', 'IPOM', 'INSPECAO_ALTA_LIDERANCA', 'INSPECAO_GESTAO_SMS', 'INDICE_REATIVO'];
        const indicadoresRecentes: Record<string, number> = {};

        for (const tipo of tipos) {
          const indicadorDoTipo = indicadoresDoCCA
            .filter(ind => ind.tipo === tipo)
            .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())[0];
          
          if (indicadorDoTipo) {
            indicadoresRecentes[tipo] = Number(indicadorDoTipo.resultado);
          } else {
            indicadoresRecentes[tipo] = 0;
          }
        }

        const iid = indicadoresRecentes['IID'] || 0;
        const hsa = indicadoresRecentes['HSA'] || 0;
        const ht = indicadoresRecentes['HT'] || 0;
        const ipom = indicadoresRecentes['IPOM'] || 0;
        const inspecao_alta_lideranca = indicadoresRecentes['INSPECAO_ALTA_LIDERANCA'] || 0;
        const inspecao_gestao_sms = indicadoresRecentes['INSPECAO_GESTAO_SMS'] || 0;
        const indice_reativo = indicadoresRecentes['INDICE_REATIVO'] || 0;

        // Cálculo do IDSMS = ((IID + HSA + HT + IPOM) / 4) + (INSPECAO_ALTA_LIDERANCA + INSPECAO_GESTAO_SMS) - INDICE_REATIVO
        const idsms_total = ((iid + hsa + ht + ipom) / 4) + (inspecao_alta_lideranca + inspecao_gestao_sms) - indice_reativo;

        console.log(`IDSMS calculado para ${cca.codigo}: ${idsms_total}`);

        dashboardData.push({
          cca_id: cca.id,
          cca_codigo: cca.codigo,
          cca_nome: cca.nome,
          iid,
          hsa,
          ht,
          ipom,
          inspecao_alta_lideranca,
          inspecao_gestao_sms,
          indice_reativo,
          idsms_total: Math.round(idsms_total * 100) / 100
        });
      }

      console.log('Dashboard data final:', dashboardData.length, 'CCAs com dados');
      return dashboardData;
    } catch (error) {
      console.error('Exceção ao buscar dados do dashboard IDSMS:', error);
      return [];
    }
  },

  async getAllIndicadores(): Promise<IDSMSIndicador[]> {
    try {
      const { data, error } = await supabase
        .from('idsms_indicadores')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar todos os indicadores:', error);
        return [];
      }

      return data as IDSMSIndicador[];
    } catch (error) {
      console.error('Exceção ao buscar todos os indicadores:', error);
      return [];
    }
  }
};
