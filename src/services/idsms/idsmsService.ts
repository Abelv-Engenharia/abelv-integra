
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

  async updateIndicador(id: string, indicador: Partial<Omit<IDSMSIndicador, 'id' | 'created_at' | 'updated_at'>>): Promise<IDSMSIndicador | null> {
    try {
      const { data, error } = await supabase
        .from('idsms_indicadores')
        .update(indicador)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar indicador IDSMS:', error);
        return null;
      }
      
      return data as IDSMSIndicador;
    } catch (error) {
      console.error('Exceção ao atualizar indicador IDSMS:', error);
      return null;
    }
  },

  async deleteIndicador(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('idsms_indicadores')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao excluir indicador IDSMS:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Exceção ao excluir indicador IDSMS:', error);
      return false;
    }
  },

  async getDashboardData(filters?: {
    cca_id?: string;
    ano?: string;
    mes?: string;
  }): Promise<IDSMSDashboardData[]> {
    try {
      console.log('Iniciando busca dos dados do dashboard IDSMS com filtros:', filters);
      
      // Construir query base para indicadores
      let indicadoresQuery = supabase
        .from('idsms_indicadores')
        .select('*');

      // Aplicar filtros se fornecidos - agora suportando múltiplos valores
      if (filters?.cca_id && filters.cca_id !== "all") {
        const ccaIds = filters.cca_id.split(',').map(id => parseInt(id));
        indicadoresQuery = indicadoresQuery.in('cca_id', ccaIds);
      }
      if (filters?.ano && filters.ano !== "all") {
        const anos = filters.ano.split(',').map(ano => parseInt(ano));
        indicadoresQuery = indicadoresQuery.in('ano', anos);
      }
      if (filters?.mes && filters.mes !== "all") {
        const meses = filters.mes.split(',').map(mes => parseInt(mes));
        indicadoresQuery = indicadoresQuery.in('mes', meses);
      }

      const { data: indicadores, error: indicadoresError } = await indicadoresQuery
        .order('created_at', { ascending: false });

      if (indicadoresError) {
        console.error('Erro ao buscar indicadores:', indicadoresError);
        return [];
      }

      console.log('Total de indicadores encontrados:', indicadores?.length || 0);

      if (!indicadores || indicadores.length === 0) {
        console.log('Nenhum indicador encontrado com os filtros aplicados');
        return [];
      }

      // Buscar CCAs - filtrar se necessário
      let ccasQuery = supabase
        .from('ccas')
        .select('id, codigo, nome')
        .eq('ativo', true);

      if (filters?.cca_id && filters.cca_id !== "all") {
        const ccaIds = filters.cca_id.split(',').map(id => parseInt(id));
        ccasQuery = ccasQuery.in('id', ccaIds);
      }

      const { data: ccas, error: ccasError } = await ccasQuery;

      if (ccasError) {
        console.error('Erro ao buscar CCAs:', ccasError);
        return [];
      }

      console.log('CCAs encontrados:', ccas?.length || 0);

      if (!ccas || ccas.length === 0) {
        console.log('Nenhum CCA encontrado');
        return [];
      }

      const dashboardData: IDSMSDashboardData[] = [];

      // Agrupar indicadores por CCA e somar por tipo
      const indicadoresPorCCA = indicadores.reduce((acc, indicador) => {
        if (!acc[indicador.cca_id]) {
          acc[indicador.cca_id] = {};
        }
        if (!acc[indicador.cca_id][indicador.tipo]) {
          acc[indicador.cca_id][indicador.tipo] = [];
        }
        acc[indicador.cca_id][indicador.tipo].push({
          ...indicador,
          tipo: indicador.tipo as IDSMSIndicador['tipo']
        });
        return acc;
      }, {} as Record<number, Record<string, IDSMSIndicador[]>>);

      for (const cca of ccas) {
        const indicadoresDoCCA = indicadoresPorCCA[cca.id] || {};
        
        console.log(`Processando CCA: ${cca.codigo} (ID: ${cca.id})`);
        console.log(`Tipos de indicadores para CCA ${cca.codigo}:`, Object.keys(indicadoresDoCCA));
        
        // Se não há indicadores para este CCA, pular
        if (Object.keys(indicadoresDoCCA).length === 0) {
          console.log(`Pulando CCA ${cca.codigo} - sem indicadores`);
          continue;
        }

        // Calcular médias ou somas por tipo de indicador
        const tipos = ['IID', 'HSA', 'HT', 'IPOM', 'INSPECAO_ALTA_LIDERANCA', 'INSPECAO_GESTAO_SMS', 'INDICE_REATIVO'];
        const indicadoresCalculados: Record<string, number> = {};

        for (const tipo of tipos) {
          const indicadoresDoTipo = indicadoresDoCCA[tipo] || [];
          
          if (indicadoresDoTipo.length > 0) {
            // Para os filtros de mês específico, somar todos os valores do período
            // Para filtros gerais, usar a média
            if (filters?.mes && filters.mes !== "all") {
              // Se filtrando por mês específico, somar valores
              indicadoresCalculados[tipo] = indicadoresDoTipo.reduce((sum, ind) => sum + Number(ind.resultado), 0);
            } else {
              // Se não filtrando por mês, usar média dos valores
              const soma = indicadoresDoTipo.reduce((sum, ind) => sum + Number(ind.resultado), 0);
              indicadoresCalculados[tipo] = soma / indicadoresDoTipo.length;
            }
          } else {
            indicadoresCalculados[tipo] = 0;
          }
        }

        const iid = indicadoresCalculados['IID'] || 0;
        const hsa = indicadoresCalculados['HSA'] || 0;
        const ht = indicadoresCalculados['HT'] || 0;
        const ipom = indicadoresCalculados['IPOM'] || 0;
        const inspecao_alta_lideranca = indicadoresCalculados['INSPECAO_ALTA_LIDERANCA'] || 0;
        const inspecao_gestao_sms = indicadoresCalculados['INSPECAO_GESTAO_SMS'] || 0;
        const indice_reativo = indicadoresCalculados['INDICE_REATIVO'] || 0;

        // Cálculo do IDSMS = ((IID + HSA + HT + IPOM) / 4) + (INSPECAO_ALTA_LIDERANCA + INSPECAO_GESTAO_SMS) - INDICE_REATIVO
        const idsms_total = ((iid + hsa + ht + ipom) / 4) + (inspecao_alta_lideranca + inspecao_gestao_sms) - indice_reativo;

        console.log(`IDSMS calculado para ${cca.codigo}: ${idsms_total}`);
        console.log(`Valores individuais - IID: ${iid}, HSA: ${hsa}, HT: ${ht}, IPOM: ${ipom}`);

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

  async getFilterOptions(): Promise<{
    ccas: Array<{ id: number; codigo: string; nome: string }>;
    anos: number[];
    meses: number[];
  }> {
    try {
      console.log('Buscando opções de filtro...');

      // Buscar CCAs que possuem indicadores
      const { data: ccasComIndicadores, error: ccasError } = await supabase
        .from('idsms_indicadores')
        .select(`
          cca_id,
          ccas!inner(id, codigo, nome)
        `)
        .eq('ccas.ativo', true);

      if (ccasError) {
        console.error('Erro ao buscar CCAs:', ccasError);
        return { ccas: [], anos: [], meses: [] };
      }

      // Extrair CCAs únicos
      const ccasUnicos = ccasComIndicadores.reduce((acc, item) => {
        const cca = item.ccas as any;
        if (!acc.find(c => c.id === cca.id)) {
          acc.push({
            id: cca.id,
            codigo: cca.codigo,
            nome: cca.nome
          });
        }
        return acc;
      }, [] as Array<{ id: number; codigo: string; nome: string }>);

      // Buscar anos e meses únicos dos indicadores
      const { data: indicadores, error: indicadoresError } = await supabase
        .from('idsms_indicadores')
        .select('ano, mes')
        .order('ano', { ascending: false })
        .order('mes', { ascending: false });

      if (indicadoresError) {
        console.error('Erro ao buscar indicadores para filtro:', indicadoresError);
        return { ccas: ccasUnicos, anos: [], meses: [] };
      }

      // Extrair anos únicos
      const anosUnicos = [...new Set(indicadores.map(item => item.ano))].sort((a, b) => b - a);
      
      // Extrair meses únicos
      const mesesUnicos = [...new Set(indicadores.map(item => item.mes))].sort((a, b) => a - b);

      console.log('Opções de filtro encontradas:', {
        ccas: ccasUnicos.length,
        anos: anosUnicos.length,
        meses: mesesUnicos.length
      });

      return {
        ccas: ccasUnicos,
        anos: anosUnicos,
        meses: mesesUnicos
      };
    } catch (error) {
      console.error('Exceção ao buscar opções de filtro:', error);
      return { ccas: [], anos: [], meses: [] };
    }
  },

  async getAllIndicadores(filters?: {
    cca_id?: string;
    ano?: string;
    mes?: string;
  }): Promise<IDSMSIndicador[]> {
    try {
      console.log('Buscando todos os indicadores com filtros:', filters);
      
      // Construir query base para indicadores
      let query = supabase
        .from('idsms_indicadores')
        .select('*');

      // Aplicar filtros se fornecidos - agora suportando múltiplos valores
      if (filters?.cca_id && filters.cca_id !== "all") {
        const ccaIds = filters.cca_id.split(',').map(id => parseInt(id));
        query = query.in('cca_id', ccaIds);
      }
      if (filters?.ano && filters.ano !== "all") {
        const anos = filters.ano.split(',').map(ano => parseInt(ano));
        query = query.in('ano', anos);
      }
      if (filters?.mes && filters.mes !== "all") {
        const meses = filters.mes.split(',').map(mes => parseInt(mes));
        query = query.in('mes', meses);
      }

      const { data: indicadores, error } = await query
        .order('data', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar indicadores:', error);
        return [];
      }

      console.log('Total de indicadores encontrados:', indicadores?.length || 0);

      if (!indicadores) {
        return [];
      }

      return indicadores.map(item => ({
        ...item,
        tipo: item.tipo as IDSMSIndicador['tipo']
      }));
    } catch (error) {
      console.error('Exceção ao buscar todos os indicadores:', error);
      return [];
    }
  }
};
