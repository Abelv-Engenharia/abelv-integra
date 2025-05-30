
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
      
      // Primeiro, vamos verificar se existem dados na tabela idsms_indicadores
      const { data: allIndicadores, error: indicadoresError } = await supabase
        .from('idsms_indicadores')
        .select('*')
        .order('created_at', { ascending: false });

      if (indicadoresError) {
        console.error('Erro ao buscar indicadores:', indicadoresError);
        return [];
      }

      console.log('Total de indicadores encontrados:', allIndicadores?.length || 0);
      console.log('Primeiros 5 indicadores:', allIndicadores?.slice(0, 5));

      if (!allIndicadores || allIndicadores.length === 0) {
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

      for (const cca of ccas) {
        console.log(`Processando CCA: ${cca.codigo} (ID: ${cca.id})`);
        
        // Buscar os últimos indicadores de cada tipo para este CCA
        const indicadoresPorTipo = await this.getLatestIndicadoresByCCA(cca.id);
        
        console.log(`Indicadores encontrados para CCA ${cca.codigo}:`, indicadoresPorTipo.length);
        
        // Se não há indicadores para este CCA, pular
        if (indicadoresPorTipo.length === 0) {
          console.log(`Pulando CCA ${cca.codigo} - sem indicadores`);
          continue;
        }

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

  async getLatestIndicadoresByCCA(ccaId: number): Promise<IDSMSIndicador[]> {
    try {
      console.log(`Buscando indicadores para CCA ID: ${ccaId}`);
      
      // Buscar todos os indicadores para este CCA, agrupados por tipo
      const { data, error } = await supabase
        .from('idsms_indicadores')
        .select('*')
        .eq('cca_id', ccaId)
        .order('data', { ascending: false });

      if (error) {
        console.error(`Erro ao buscar indicadores para CCA ${ccaId}:`, error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log(`Nenhum indicador encontrado para CCA ${ccaId}`);
        return [];
      }

      console.log(`Total de ${data.length} indicadores encontrados para CCA ${ccaId}`);

      // Pegar o indicador mais recente de cada tipo
      const tipos = ['IID', 'HSA', 'HT', 'IPOM', 'INSPECAO_ALTA_LIDERANCA', 'INSPECAO_GESTAO_SMS', 'INDICE_REATIVO'];
      const indicadoresRecentes: IDSMSIndicador[] = [];

      for (const tipo of tipos) {
        const indicadorDoTipo = data.find(ind => ind.tipo === tipo);
        if (indicadorDoTipo) {
          indicadoresRecentes.push(indicadorDoTipo as IDSMSIndicador);
        }
      }

      console.log(`${indicadoresRecentes.length} tipos diferentes de indicadores encontrados para CCA ${ccaId}`);
      return indicadoresRecentes;
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
