import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from '../types/dashboardTypes';

interface IndiceDesviosResult {
  indiceDesvios: number;
  indiceDesviosStatus: 'positivo' | 'negativo';
}

export async function calculateIndiceDesvios(
  totalDesvios: number,
  filters?: FilterParams
): Promise<IndiceDesviosResult> {
  try {
    // Determinar período de cálculo
    const now = new Date();
    const year = filters?.year ? parseInt(filters.year) : now.getFullYear();
    const month = filters?.month ? parseInt(filters.month) : now.getMonth() + 1;

    // Buscar funcionários ativos do snapshot mensal
    let query = supabase
      .from('funcionarios_mensal_snapshot')
      .select('funcionarios_ativos')
      .eq('ano', year)
      .eq('mes', month);

    // Filtrar por CCAs se fornecido
    if (filters?.ccaIds && filters.ccaIds.length > 0) {
      query = query.in('cca_id', filters.ccaIds.map(id => parseInt(id)));
    } else if (filters?.ccaId) {
      query = query.eq('cca_id', parseInt(filters.ccaId));
    }

    const { data: snapshots, error } = await query;

    if (error) {
      console.error('Erro ao buscar snapshot de funcionários:', error);
      return { indiceDesvios: 0, indiceDesviosStatus: 'negativo' };
    }

    // Somar funcionários ativos de todos os CCAs filtrados
    const totalFuncionariosAtivos = snapshots?.reduce(
      (sum, snapshot) => sum + (snapshot.funcionarios_ativos || 0),
      0
    ) || 0;

    // Evitar divisão por zero
    if (totalFuncionariosAtivos === 0) {
      return { indiceDesvios: 0, indiceDesviosStatus: 'negativo' };
    }

    // Calcular índice: desvios / funcionários ativos
    const indice = totalDesvios / totalFuncionariosAtivos;

    // Determinar status: >= 1 é positivo (verde), < 1 é negativo (vermelho)
    const status = indice >= 1 ? 'positivo' : 'negativo';

    return {
      indiceDesvios: parseFloat(indice.toFixed(2)),
      indiceDesviosStatus: status
    };
  } catch (error) {
    console.error('Erro ao calcular índice de desvios:', error);
    return { indiceDesvios: 0, indiceDesviosStatus: 'negativo' };
  }
}
