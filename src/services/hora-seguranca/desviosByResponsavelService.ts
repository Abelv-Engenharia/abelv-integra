
import { supabase } from "@/integrations/supabase/client";

interface Filters {
  ccaId?: number;
  responsavel?: string;
  dataInicial?: string;
  dataFinal?: string;
}

export async function fetchDesviosByResponsavel(ccaIds: number[], filters?: Filters) {
  try {
    let query = supabase
      .from("execucao_hsa")
      .select("responsavel_inspecao, desvios_identificados")
      .in("cca_id", ccaIds)
      .not("responsavel_inspecao", "is", null);

    // Aplicar filtros
    if (filters?.ccaId) {
      query = query.eq('cca_id', filters.ccaId);
    }
    
    if (filters?.responsavel) {
      query = query.eq('responsavel_inspecao', filters.responsavel);
    }
    
    if (filters?.dataInicial) {
      query = query.gte('data', filters.dataInicial);
    }
    
    if (filters?.dataFinal) {
      query = query.lte('data', filters.dataFinal);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching desvios by responsável:", error);
      return [];
    }

    // Agrupar por responsável
    const groupedData: { [key: string]: number } = {};
    
    data?.forEach((item: any) => {
      const responsavel = item.responsavel_inspecao;
      if (!groupedData[responsavel]) {
        groupedData[responsavel] = 0;
      }
      groupedData[responsavel] += item.desvios_identificados || 0;
    });

    return Object.entries(groupedData).map(([responsavel, desvios]) => ({
      responsavel,
      desvios
    }));
  } catch (error) {
    console.error("Error in fetchDesviosByResponsavel:", error);
    return [];
  }
}
