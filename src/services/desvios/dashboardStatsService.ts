
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
    // Construir query base
    let query = supabase.from('desvios_completos');

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

    // Buscar total de desvios do período
    const { count: totalDesvios } = await query
      .select('*', { count: 'exact', head: true });

    // Reconstruir query para cada status
    let queryCompletas = supabase.from('desvios_completos').eq('status', 'Fechado');
    let queryAndamento = supabase.from('desvios_completos').eq('status', 'Em Andamento');
    let queryPendentes = supabase.from('desvios_completos').eq('status', 'Aberto');

    // Aplicar os mesmos filtros para cada status
    if (filters.year && filters.month) {
      const startDate = `${filters.year}-${filters.month.padStart(2, '0')}-01`;
      const endDate = `${filters.year}-${filters.month.padStart(2, '0')}-31`;
      queryCompletas = queryCompletas.gte('data_desvio', startDate).lte('data_desvio', endDate);
      queryAndamento = queryAndamento.gte('data_desvio', startDate).lte('data_desvio', endDate);
      queryPendentes = queryPendentes.gte('data_desvio', startDate).lte('data_desvio', endDate);
    } else if (filters.year) {
      const startDate = `${filters.year}-01-01`;
      const endDate = `${filters.year}-12-31`;
      queryCompletas = queryCompletas.gte('data_desvio', startDate).lte('data_desvio', endDate);
      queryAndamento = queryAndamento.gte('data_desvio', startDate).lte('data_desvio', endDate);
      queryPendentes = queryPendentes.gte('data_desvio', startDate).lte('data_desvio', endDate);
    } else if (filters.month) {
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-${filters.month.padStart(2, '0')}-01`;
      const endDate = `${currentYear}-${filters.month.padStart(2, '0')}-31`;
      queryCompletas = queryCompletas.gte('data_desvio', startDate).lte('data_desvio', endDate);
      queryAndamento = queryAndamento.gte('data_desvio', startDate).lte('data_desvio', endDate);
      queryPendentes = queryPendentes.gte('data_desvio', startDate).lte('data_desvio', endDate);
    }

    if (filters.ccaId) {
      queryCompletas = queryCompletas.eq('cca_id', parseInt(filters.ccaId));
      queryAndamento = queryAndamento.eq('cca_id', parseInt(filters.ccaId));
      queryPendentes = queryPendentes.eq('cca_id', parseInt(filters.ccaId));
    }
    if (filters.disciplinaId) {
      queryCompletas = queryCompletas.eq('disciplina_id', parseInt(filters.disciplinaId));
      queryAndamento = queryAndamento.eq('disciplina_id', parseInt(filters.disciplinaId));
      queryPendentes = queryPendentes.eq('disciplina_id', parseInt(filters.disciplinaId));
    }
    if (filters.empresaId) {
      queryCompletas = queryCompletas.eq('empresa_id', parseInt(filters.empresaId));
      queryAndamento = queryAndamento.eq('empresa_id', parseInt(filters.empresaId));
      queryPendentes = queryPendentes.eq('empresa_id', parseInt(filters.empresaId));
    }

    // Executar consultas para cada status
    const { count: acoesCompletas } = await queryCompletas
      .select('*', { count: 'exact', head: true });

    const { count: acoesAndamento } = await queryAndamento
      .select('*', { count: 'exact', head: true });

    const { count: acoesPendentes } = await queryPendentes
      .select('*', { count: 'exact', head: true });

    // Calcular percentuais
    const total = totalDesvios || 1; // Evitar divisão por zero
    const percentualCompletas = Math.round(((acoesCompletas || 0) / total) * 100);
    const percentualAndamento = Math.round(((acoesAndamento || 0) / total) * 100);
    const percentualPendentes = Math.round(((acoesPendentes || 0) / total) * 100);

    // Calcular nível de risco do período
    let queryRisk = supabase.from('desvios_completos').select('classificacao_risco').not('classificacao_risco', 'is', null);
    
    // Aplicar os mesmos filtros para o risco
    if (filters.year && filters.month) {
      const startDate = `${filters.year}-${filters.month.padStart(2, '0')}-01`;
      const endDate = `${filters.year}-${filters.month.padStart(2, '0')}-31`;
      queryRisk = queryRisk.gte('data_desvio', startDate).lte('data_desvio', endDate);
    } else if (filters.year) {
      const startDate = `${filters.year}-01-01`;
      const endDate = `${filters.year}-12-31`;
      queryRisk = queryRisk.gte('data_desvio', startDate).lte('data_desvio', endDate);
    } else if (filters.month) {
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-${filters.month.padStart(2, '0')}-01`;
      const endDate = `${currentYear}-${filters.month.padStart(2, '0')}-31`;
      queryRisk = queryRisk.gte('data_desvio', startDate).lte('data_desvio', endDate);
    }

    if (filters.ccaId) {
      queryRisk = queryRisk.eq('cca_id', parseInt(filters.ccaId));
    }
    if (filters.disciplinaId) {
      queryRisk = queryRisk.eq('disciplina_id', parseInt(filters.disciplinaId));
    }
    if (filters.empresaId) {
      queryRisk = queryRisk.eq('empresa_id', parseInt(filters.empresaId));
    }

    const { data: riskData } = await queryRisk;

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
