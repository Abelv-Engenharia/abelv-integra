
import { supabase } from '@/integrations/supabase/client';
import { Funcionario } from '@/types/treinamentos';

/**
 * Fetch funcionários
 */
export async function fetchFuncionarios(): Promise<Funcionario[]> {
  try {
    const { data, error } = await supabase
      .from('funcionarios')
      .select(`
        id,
        nome,
        matricula,
        funcao,
        ativo,
        foto,
        data_admissao,
        cca_id,
        ccas:cca_id(id, codigo, nome)
      `)
      .eq('ativo', true)
      .order('nome');
    if (error) {
      console.error("Erro ao buscar funcionários:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Exceção ao buscar funcionários:", error);
    return [];
  }
}

// Export service object to match the import pattern
export const funcionariosService = {
  getAll: fetchFuncionarios
};
