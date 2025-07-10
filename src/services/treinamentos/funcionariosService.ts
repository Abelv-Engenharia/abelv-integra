
import { supabase } from '@/integrations/supabase/client';
import { Funcionario } from '@/types/treinamentos';

/**
 * Fetch funcionários with their CCAs through the new relationship
 */
export async function fetchFuncionarios(): Promise<Funcionario[]> {
  try {
    const { data: funcionariosComCCAs, error } = await supabase
      .from('funcionario_ccas')
      .select(`
        funcionario_id,
        cca_id,
        funcionarios!inner(
          id,
          nome,
          matricula,
          funcao,
          ativo,
          foto,
          data_admissao
        ),
        ccas!inner(
          id,
          codigo,
          nome
        )
      `)
      .eq('funcionarios.ativo', true)
      .order('funcionarios(nome)');

    if (error) {
      console.error("Erro ao buscar funcionários:", error);
      return [];
    }

    // Group funcionários by ID and collect their CCAs
    const funcionariosMap = new Map<string, Funcionario>();
    
    funcionariosComCCAs?.forEach(item => {
      const funcionarioId = item.funcionarios.id;
      
      if (funcionariosMap.has(funcionarioId)) {
        // Add CCA to existing funcionário
        const funcionario = funcionariosMap.get(funcionarioId)!;
        funcionario.funcionario_ccas!.push({
          id: crypto.randomUUID(),
          cca_id: item.cca_id,
          ccas: item.ccas
        });
      } else {
        // Create new funcionário entry
        funcionariosMap.set(funcionarioId, {
          ...item.funcionarios,
          funcionario_ccas: [{
            id: crypto.randomUUID(),
            cca_id: item.cca_id,
            ccas: item.ccas
          }]
        });
      }
    });
    
    return Array.from(funcionariosMap.values());
  } catch (error) {
    console.error("Exceção ao buscar funcionários:", error);
    return [];
  }
}

// Export service object to match the import pattern
export const funcionariosService = {
  getAll: fetchFuncionarios
};
