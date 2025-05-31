
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalDesvios: number;
  acoesCompletas: number;
  acoesAndamento: number;
  acoesPendentes: number;
  percentualCompletas: number;
  percentualAndamento: number;
  percentualPendentes: number;
  riskLevel: string;
}

export interface FilterParams {
  year?: string;
  month?: string;
  ccaId?: string;
  disciplinaId?: string;
  empresaId?: string;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Buscar total de desvios
    const { count: totalDesvios } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true });

    // Buscar ações por status
    const { count: acoesCompletas } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Fechado');

    const { count: acoesAndamento } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Em Andamento');

    const { count: acoesPendentes } = await supabase
      .from('desvios_completos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Aberto');

    // Calcular percentuais
    const total = totalDesvios || 1; // Evitar divisão por zero
    const percentualCompletas = Math.round(((acoesCompletas || 0) / total) * 100);
    const percentualAndamento = Math.round(((acoesAndamento || 0) / total) * 100);
    const percentualPendentes = Math.round(((acoesPendentes || 0) / total) * 100);

    // Calcular nível de risco médio
    const { data: riskData } = await supabase
      .from('desvios_completos')
      .select('classificacao_risco')
      .not('classificacao_risco', 'is', null);

    let riskLevel = "Baixo";
    if (riskData && riskData.length > 0) {
      const riskCounts = riskData.reduce((acc: any, item: any) => {
        acc[item.classificacao_risco] = (acc[item.classificacao_risco] || 0) + 1;
        return acc;
      }, {});
      
      const maxRisk = Object.keys(riskCounts).reduce((a, b) => 
        riskCounts[a] > riskCounts[b] ? a : b
      );
      riskLevel = maxRisk || "Baixo";
    }

    console.log('Dashboard Stats:', {
      totalDesvios: totalDesvios || 0,
      acoesCompletas: acoesCompletas || 0,
      acoesAndamento: acoesAndamento || 0,
      acoesPendentes: acoesPendentes || 0,
      percentualCompletas,
      percentualAndamento,
      percentualPendentes,
      riskLevel,
    });

    return {
      totalDesvios: totalDesvios || 0,
      acoesCompletas: acoesCompletas || 0,
      acoesAndamento: acoesAndamento || 0,
      acoesPendentes: acoesPendentes || 0,
      percentualCompletas,
      percentualAndamento,
      percentualPendentes,
      riskLevel,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error);
    return {
      totalDesvios: 0,
      acoesCompletas: 0,
      acoesAndamento: 0,
      acoesPendentes: 0,
      percentualCompletas: 0,
      percentualAndamento: 0,
      percentualPendentes: 0,
      riskLevel: "Baixo",
    };
  }
};

export const fetchFilteredDashboardStats = async (filters: FilterParams): Promise<DashboardStats> => {
  try {
    // Função auxiliar para aplicar filtros
    const applyFilters = (query: any) => {
      // Aplicar filtros de data
      if (filters.year && filters.month) {
        const startDate = `${filters.year}-${filters.month.padStart(2, '0')}-01`;
        const endDate = `${filters.year}-${filters.month.padStart(2, '0')}-31`;
        query = query.gte('data_desvio', startDate).lte('data_desvio', endDate);
      } else if (filters.year) {
        const startDate = `${filters.year}-01-01`;
        const endDate = `${filters.year}-12-31`;
        query = query.gte('data_desvio', startDate).lte('data_desvio', endDate);
      } else if (filters.month) {
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-${filters.month.padStart(2, '0')}-01`;
        const endDate = `${currentYear}-${filters.month.padStart(2, '0')}-31`;
        query = query.gte('data_desvio', startDate).lte('data_desvio', endDate);
      }

      // Aplicar filtros de CCA, Disciplina e Empresa
      if (filters.ccaId) {
        query = query.eq('cca_id', parseInt(filters.ccaId));
      }
      if (filters.disciplinaId) {
        query = query.eq('disciplina_id', parseInt(filters.disciplinaId));
      }
      if (filters.empresaId) {
        query = query.eq('empresa_id', parseInt(filters.empresaId));
      }

      return query;
    };

    // Buscar total de desvios filtrados
    let totalQuery = supabase.from('desvios_completos').select('*', { count: 'exact', head: true });
    totalQuery = applyFilters(totalQuery);
    const { count: totalDesvios } = await totalQuery;

    // Buscar ações completas filtradas
    let completasQuery = supabase.from('desvios_completos').select('*', { count: 'exact', head: true }).eq('status', 'Fechado');
    completasQuery = applyFilters(completasQuery);
    const { count: acoesCompletas } = await completasQuery;

    // Buscar ações em andamento filtradas
    let andamentoQuery = supabase.from('desvios_completos').select('*', { count: 'exact', head: true }).eq('status', 'Em Andamento');
    andamentoQuery = applyFilters(andamentoQuery);
    const { count: acoesAndamento } = await andamentoQuery;

    // Buscar ações pendentes filtradas
    let pendentesQuery = supabase.from('desvios_completos').select('*', { count: 'exact', head: true }).eq('status', 'Aberto');
    pendentesQuery = applyFilters(pendentesQuery);
    const { count: acoesPendentes } = await pendentesQuery;

    // Calcular percentuais
    const total = totalDesvios || 1; // Evitar divisão por zero
    const percentualCompletas = Math.round(((acoesCompletas || 0) / total) * 100);
    const percentualAndamento = Math.round(((acoesAndamento || 0) / total) * 100);
    const percentualPendentes = Math.round(((acoesPendentes || 0) / total) * 100);

    // Calcular nível de risco do período filtrado
    let riskQuery = supabase.from('desvios_completos').select('classificacao_risco').not('classificacao_risco', 'is', null);
    riskQuery = applyFilters(riskQuery);
    const { data: riskData } = await riskQuery;

    let riskLevel = "Baixo";
    if (riskData && riskData.length > 0) {
      const riskCounts = riskData.reduce((acc: any, item: any) => {
        acc[item.classificacao_risco] = (acc[item.classificacao_risco] || 0) + 1;
        return acc;
      }, {});
      
      const maxRisk = Object.keys(riskCounts).reduce((a, b) => 
        riskCounts[a] > riskCounts[b] ? a : b
      );
      riskLevel = maxRisk || "Baixo";
    }

    console.log('Filtered Dashboard Stats:', {
      totalDesvios: totalDesvios || 0,
      acoesCompletas: acoesCompletas || 0,
      acoesAndamento: acoesAndamento || 0,
      acoesPendentes: acoesPendentes || 0,
      percentualCompletas,
      percentualAndamento,
      percentualPendentes,
      riskLevel,
    });

    return {
      totalDesvios: totalDesvios || 0,
      acoesCompletas: acoesCompletas || 0,
      acoesAndamento: acoesAndamento || 0,
      acoesPendentes: acoesPendentes || 0,
      percentualCompletas,
      percentualAndamento,
      percentualPendentes,
      riskLevel,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas filtradas:', error);
    return {
      totalDesvios: 0,
      acoesCompletas: 0,
      acoesAndamento: 0,
      acoesPendentes: 0,
      percentualCompletas: 0,
      percentualAndamento: 0,
      percentualPendentes: 0,
      riskLevel: "Baixo",
    };
  }
};
