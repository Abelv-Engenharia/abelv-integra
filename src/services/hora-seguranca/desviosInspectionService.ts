
import { supabase } from "@/integrations/supabase/client";

interface Filters {
  ccaId?: number;
  responsavel?: string;
  dataInicial?: string;
  dataFinal?: string;
}

export async function fetchDesviosByInspectionType(ccaIds: number[], filters?: Filters) {
  try {
    let query = supabase
      .from("execucao_hsa")
      .select("inspecao_programada, desvios_identificados")
      .in("cca_id", ccaIds)
      .not("inspecao_programada", "is", null);

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
      console.error("Error fetching desvios by inspection type:", error);
      return [];
    }

    // Agrupar por tipo de inspeção
    const groupedData: { [key: string]: number } = {};
    
    data?.forEach((item: any) => {
      const tipo = item.inspecao_programada || "Não especificado";
      if (!groupedData[tipo]) {
        groupedData[tipo] = 0;
      }
      groupedData[tipo] += item.desvios_identificados || 0;
    });

    return Object.entries(groupedData).map(([tipo, desvios]) => ({
      tipo,
      desvios
    }));
  } catch (error) {
    console.error("Error in fetchDesviosByInspectionType:", error);
    return [];
  }
}
