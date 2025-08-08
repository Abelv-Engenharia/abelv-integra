
import { supabase } from "@/integrations/supabase/client";

interface Filters {
  ccaId?: number;
  responsavel?: string;
  dataInicial?: string;
  dataFinal?: string;
}

export async function fetchInspecoesByCCA(ccaIds: number[], filters?: Filters) {
  try {
    let query = supabase
      .from("execucao_hsa")
      .select(`
        cca_id,
        status,
        ccas!inner(codigo, nome)
      `)
      .in("cca_id", ccaIds);

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
      console.error("Error fetching inspections by CCA:", error);
      return [];
    }

    // Agrupar por CCA e status
    const groupedData: { [key: string]: any } = {};
    
    data?.forEach((item: any) => {
      const ccaKey = `${item.ccas.codigo} - ${item.ccas.nome}`;
      
      if (!groupedData[ccaKey]) {
        groupedData[ccaKey] = {
          cca: ccaKey,
          "A Realizar": 0,
          "Realizada": 0,
          "Não Realizada": 0,
          "Realizada (Não Programada)": 0,
          "Cancelada": 0
        };
      }
      
      const status = (item.status || '').toUpperCase();
      switch (status) {
        case 'A REALIZAR':
          groupedData[ccaKey]["A Realizar"]++;
          break;
        case 'REALIZADA':
          groupedData[ccaKey]["Realizada"]++;
          break;
        case 'NÃO REALIZADA':
          groupedData[ccaKey]["Não Realizada"]++;
          break;
        case 'REALIZADA (NÃO PROGRAMADA)':
          groupedData[ccaKey]["Realizada (Não Programada)"]++;
          break;
        case 'CANCELADA':
          groupedData[ccaKey]["Cancelada"]++;
          break;
      }
    });

    return Object.values(groupedData);
  } catch (error) {
    console.error("Error in fetchInspecoesByCCA:", error);
    return [];
  }
}
