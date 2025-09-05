
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";
import { applyFiltersToQuery } from "./utils/filterUtils";

export const fetchDesviosByBaseLegal = async (filters?: FilterParams) => {
  try {
    let query = supabase
      .from('desvios_completos')
      .select(`
        base_legal_opcao_id,
        data_desvio,
        cca_id,
        disciplina_id,
        empresa_id,
        base_legal_opcoes:base_legal_opcao_id(codigo, nome)
      `)
      .not('base_legal_opcao_id', 'is', null)
      .limit(50000);

    // Apply standardized filters
    if (filters) {
      query = applyFiltersToQuery(query, filters);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching desvios by base legal:', error);
      return [];
    }

    // Count occurrences by base legal
    const baseLegalCounts: Record<string, { codigo: string; nome: string; count: number }> = {};
    data?.forEach(desvio => {
      const codigo = desvio.base_legal_opcoes?.codigo || "OUTROS";
      const nome = desvio.base_legal_opcoes?.nome || "OUTROS";
      const key = `${codigo}_${nome}`;
      
      if (!baseLegalCounts[key]) {
        baseLegalCounts[key] = { codigo, nome, count: 0 };
      }
      baseLegalCounts[key].count += 1;
    });

    // Convert to array format for the chart
    return Object.values(baseLegalCounts)
      .map(({ codigo, nome, count }) => ({ 
        name: codigo, 
        fullName: nome, 
        value: count 
      }))
      .sort((a, b) => b.value - a.value);
  } catch (error) {
    console.error('Exception fetching desvios by base legal:', error);
    return [];
  }
};
