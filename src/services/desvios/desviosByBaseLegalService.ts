
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";

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

    // Apply filters if provided
    if (filters) {
      // Apply CCA filter if provided
      if (filters.ccaIds && filters.ccaIds.length > 0) {
        query = query.in('cca_id', filters.ccaIds.map(id => parseInt(id)));
      }
      
      // Apply specific CCA filter if provided
      if (filters.ccaId && filters.ccaId !== "todos") {
        query = query.eq('cca_id', parseInt(filters.ccaId));
      }
      
      // Apply year filter if provided
      if (filters.year && filters.year !== "todos") {
        query = query.gte('data_desvio', `${filters.year}-01-01`)
                    .lte('data_desvio', `${filters.year}-12-31`);
      }
      
      // Apply month filter if provided
      if (filters.month && filters.month !== "todos") {
        const year = filters.year && filters.year !== "todos" ? filters.year : new Date().getFullYear();
        const monthStr = filters.month.padStart(2, '0');
        query = query.gte('data_desvio', `${year}-${monthStr}-01`)
                    .lte('data_desvio', `${year}-${monthStr}-31`);
      }
      
      // Apply disciplina filter if provided
      if (filters.disciplinaId && filters.disciplinaId !== "todos") {
        query = query.eq('disciplina_id', parseInt(filters.disciplinaId));
      }
      
      // Apply empresa filter if provided
      if (filters.empresaId && filters.empresaId !== "todos") {
        query = query.eq('empresa_id', parseInt(filters.empresaId));
      }
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
