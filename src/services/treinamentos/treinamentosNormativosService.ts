
import { supabase } from '@/integrations/supabase/client';
import { TreinamentoNormativo } from '@/types/treinamentos';

/**
 * Fetch treinamentos normativos
 */
export async function fetchTreinamentosNormativos(): Promise<TreinamentoNormativo[]> {
  try {
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .select(`
        id,
        funcionario_id,
        treinamento_id,
        data_realizacao,
        data_validade,
        tipo,
        status,
        certificado_url,
        arquivado
      `)
      .eq('arquivado', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar treinamentos normativos:", error);
      return [];
    }

    // Convert string dates to Date objects
    return (data || []).map(item => ({
      ...item,
      data_realizacao: new Date(item.data_realizacao),
      data_validade: new Date(item.data_validade)
    }));
  } catch (error) {
    console.error("Exceção ao buscar treinamentos normativos:", error);
    return [];
  }
}

// Export service object to match the import pattern
export const treinamentosNormativosService = {
  getAll: fetchTreinamentosNormativos
};
