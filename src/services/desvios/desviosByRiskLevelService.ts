
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

export const fetchDesviosByRiskLevel = async (filters?: FilterParams) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        id,
        classificacao_risco,
        data_desvio,
        cca_id,
        disciplina_id,
        empresa_id
      `)
      .not('classificacao_risco', 'is', null)
      .limit(50000);

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }
      
    const { data, error } = await query;
      
    if (error) {
      console.error('Erro ao buscar desvios por nível de risco:', error);
      return [];
    }
    
    // Processar dados por classificação de risco
    const desviosByRisk = data?.reduce((acc: any, desvio: any) => {
      const riskLevel = desvio.classificacao_risco || 'Não classificado';
      
      if (!acc[riskLevel]) {
        acc[riskLevel] = 0;
      }
      acc[riskLevel]++;
      
      return acc;
    }, {});
    
    return Object.entries(desviosByRisk || {}).map(([name, value]) => ({
      name,
      value
    }));
  } catch (error) {
    console.error('Exceção ao buscar desvios por nível de risco:', error);
    return [];
  }
};
