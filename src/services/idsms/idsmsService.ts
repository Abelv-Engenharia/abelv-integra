
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
      
      return data;
    } catch (error) {
      console.error('Exceção ao criar indicador IDSMS:', error);
      return null;
    }
  },

  async getDashboardData(): Promise<IDSMSDashboardData[]> {
    try {
      // Buscar todos os CCAs
      const { data: ccas, error: ccasError } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true);

      if (ccasError) {
        console.error('Erro ao buscar CCAs:', ccasError);
        return [];
      }

      // Buscar os últimos indicadores de cada tipo para cada CCA
      const dashboardData: IDSMSDashboardData[] = [];

      for (const cca of ccas || []) {
        const indicadores = await this.getLatestIndicadoresByCCA(cca.id);
        
        const iid = indicadores.find(i => i.tipo === 'IID')?.resultado || 0;
        const hsa = indicadores.find(i => i.tipo === 'HSA')?.resultado || 0;
        const ht = indicadores.find(i => i.tipo === 'HT')?.resultado || 0;
        const ipom = indicadores.find(i => i.tipo === 'IPOM')?.resultado || 0;
        const inspecao_alta_lideranca = indicadores.find(i => i.tipo === 'INSPECAO_ALTA_LIDERANCA')?.resultado || 0;
        const inspecao_gestao_sms = indicadores.find(i => i.tipo === 'INSPECAO_GESTAO_SMS')?.resultado || 0;
        const indice_reativo = indicadores.find(i => i.tipo === 'INDICE_REATIVO')?.resultado || 0;

        // IDSMS = ((IID + HSA + HT + IPOM) / 4) + (INSPECAO_ALTA_LIDERANCA + INSPECAO_GESTAO_SMS) - INDICE_REATIVO
        const idsms_total = ((iid + hsa + ht + ipom) / 4) + (inspecao_alta_lideranca + inspecao_gestao_sms) - indice_reativo;

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
          idsms_total: Math.round(idsms_total * 100) / 100 // Arredondar para 2 casas decimais
        });
      }

      return dashboardData;
    } catch (error) {
      console.error('Exceção ao buscar dados do dashboard IDSMS:', error);
      return [];
    }
  },

  async getLatestIndicadoresByCCA(ccaId: number): Promise<IDSMSIndicador[]> {
    try {
      const tipos = ['IID', 'HSA', 'HT', 'IPOM', 'INSPECAO_ALTA_LIDERANCA', 'INSPECAO_GESTAO_SMS', 'INDICE_REATIVO'];
      const indicadores: IDSMSIndicador[] = [];

      for (const tipo of tipos) {
        const { data, error } = await supabase
          .from('idsms_indicadores')
          .select('*')
          .eq('cca_id', ccaId)
          .eq('tipo', tipo)
          .order('data', { ascending: false })
          .limit(1);

        if (error) {
          console.error(`Erro ao buscar indicador ${tipo}:`, error);
          continue;
        }

        if (data && data.length > 0) {
          indicadores.push(data[0]);
        }
      }

      return indicadores;
    } catch (error) {
      console.error('Exceção ao buscar indicadores por CCA:', error);
      return [];
    }
  }
};
