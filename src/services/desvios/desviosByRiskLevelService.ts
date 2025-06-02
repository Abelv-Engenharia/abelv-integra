
import { supabase } from "@/integrations/supabase/client";

export const fetchDesviosByRiskLevel = async () => {
  try {
    const { data, error } = await supabase
      .from('desvios_completos')
      .select(`
        id,
        classificacao_risco
      `)
      .order('created_at', { ascending: false });
      
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
    
    return Object.entries(desviosByRisk || {}).map(([risk, count]) => ({
      risk,
      count
    }));
  } catch (error) {
    console.error('Exceção ao buscar desvios por nível de risco:', error);
    return [];
  }
};
