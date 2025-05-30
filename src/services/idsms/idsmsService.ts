
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
      console.log('Buscando dados do dashboard IDSMS...');
      
      // Buscar todos os CCAs ativos
      const { data: ccas, error: ccasError } = await supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true);

      if (ccasError) {
        console.error('Erro ao buscar CCAs:', ccasError);
        return [];
      }

      console.log('CCAs encontrados:', ccas);

      // Buscar todos os indicadores IDSMS
      const { data: indicadores, error: indicadoresError } = await supabase
        .from('idsms_indicadores')
        .select('*')
        .order('created_at', { ascending: false });

      if (indicadoresError) {
        console.error('Erro ao buscar indicadores IDSMS:', indicadoresError);
        return [];
      }

      console.log('Indicadores encontrados:', indicadores);

      const dashboardData: IDSMSDashboardData[] = [];

      for (const cca of ccas || []) {
        // Buscar os últimos indicadores de cada tipo para este CCA
        const indicadoresPorTipo = await this.getLatestIndicadoresByCCA(cca.id);
        
        console.log(`Indicadores para CCA ${cca.codigo}:`, indicadoresPorTipo);
        
        const iid = indicadoresPorTipo.find(i => i.tipo === 'IID')?.resultado || 0;
        const hsa = indicadoresPorTipo.find(i => i.tipo === 'HSA')?.resultado || 0;
        const ht = indicadoresPorTipo.find(i => i.tipo === 'HT')?.resultado || 0;
        const ipom = indicadoresPorTipo.find(i => i.tipo === 'IPOM')?.resultado || 0;
        const inspecao_alta_lideranca = indicadoresPorTipo.find(i => i.tipo === 'INSPECAO_ALTA_LIDERANCA')?.resultado || 0;
        const inspecao_gestao_sms = indicadoresPorTipo.find(i => i.tipo === 'INSPECAO_GESTAO_SMS')?.resultado || 0;
        const indice_reativo = indicadoresPorTipo.find(i => i.tipo === 'INDICE_REATIVO')?.resultado || 0;

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
          idsms_total: Math.round(idsms_total * 100) / 100 // Arredondar para 2 casas decimais
        });
      }

      console.log('Dashboard data final:', dashboardData);
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
          console.error(`Erro ao buscar indicador ${tipo} para CCA ${ccaId}:`, error);
          continue;
        }

        if (data && data.length > 0) {
          indicadores.push(data[0] as IDSMSIndicador);
        }
      }

      return indicadores;
    } catch (error) {
      console.error('Exceção ao buscar indicadores por CCA:', error);
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
