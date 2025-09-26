
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";

export const fetchDesviosByClassification = async (filters?: FilterParams) => {
  try {
    // Convert filters to jsonb format for RPC
    const filtros = filters ? {
      year: filters.year,
      month: filters.month,
      ccaId: filters.ccaId,
      disciplinaId: filters.disciplinaId,
      empresaId: filters.empresaId,
      ccaIds: filters.ccaIds?.join(',')
    } : {};

    const { data, error } = await supabase.rpc('get_desvios_by_classification', { filtros });
    
    if (error) {
      console.error('Error fetching desvios by classification:', error);
      return [];
    }

    // Convert bigint to number and return in expected format
    return data?.map(item => ({ 
      name: item.nome, 
      value: Number(item.value),
      color: item.color
    })) || [];
  } catch (error) {
    console.error('Exception fetching desvios by classification:', error);
    return [];
  }
};
