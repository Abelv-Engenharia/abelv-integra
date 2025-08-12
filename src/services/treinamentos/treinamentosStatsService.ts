
import { supabase } from "@/integrations/supabase/client";

export const fetchTreinamentosStats = async (userCCAIds: number[] = [], filters?: { year?: string; month?: string; ccaId?: string }) => {
  // Se não tem CCAs permitidos, retorna dados vazios
  if (userCCAIds.length === 0) {
    return {
      totalFuncionarios: 0,
      funcionariosComTreinamentos: 0,
      totalTreinamentosExecutados: 0,
      treinamentosValidos: 0,
      treinamentosVencendo: 0,
      totalHHT: 0,
      totalHorasTreinamento: 0,
      metaHoras: 0,
      percentualHorasInvestidas: 0,
      metaAtingida: false
    };
  }

  try {
    // Definir período baseado nos filtros ou ano atual
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const targetYear = filters?.year && filters.year !== "todos" ? parseInt(filters.year) : currentYear;
    const targetMonth = filters?.month && filters.month !== "todos" ? parseInt(filters.month) : null;
    
    // Filtrar CCAs se especificado
    let allowedCCAIds = userCCAIds;
    if (filters?.ccaId && filters.ccaId !== "todos") {
      allowedCCAIds = [parseInt(filters.ccaId)];
    }

    // Executar consultas em paralelo para otimizar performance
    const [
      execucaoResult,
      hhtResult,
      horasTreinamentoResult,
      funcionariosResult,
      treinamentosNormativosResult
    ] = await Promise.all([
      // Contagem de execuções de treinamento
      (async () => {
        let query = supabase
          .from('execucao_treinamentos')
          .select('*', { count: 'exact', head: true })
          .in('cca_id', allowedCCAIds)
          .eq('ano', targetYear);
        
        if (targetMonth) {
          query = query.eq('mes', targetMonth);
        }
        
        return await query;
      })(),

      // Total de HHT
      (async () => {
        let query = supabase
          .from('horas_trabalhadas')
          .select('horas_trabalhadas')
          .in('cca_id', allowedCCAIds)
          .eq('ano', targetYear);
        
        if (targetMonth) {
          query = query.eq('mes', targetMonth);
        }
        
        return await query;
      })(),

      // Total de horas de treinamento
      (async () => {
        let query = supabase
          .from('execucao_treinamentos')
          .select('horas_totais')
          .in('cca_id', allowedCCAIds)
          .eq('ano', targetYear);
        
        if (targetMonth) {
          query = query.eq('mes', targetMonth);
        }
        
        return await query;
      })(),

      // Funcionários dos CCAs permitidos
      supabase
        .from('funcionarios')
        .select('id')
        .in('cca_id', allowedCCAIds)
        .eq('ativo', true),

      // Treinamentos normativos - busca depois dos funcionários
      null // Será executado após ter os IDs dos funcionários
    ]);

    if (execucaoResult.error) throw execucaoResult.error;
    if (hhtResult.error) throw hhtResult.error;
    if (horasTreinamentoResult.error) throw horasTreinamentoResult.error;
    if (funcionariosResult.error) throw funcionariosResult.error;

    const funcionariosPermitidos = funcionariosResult.data || [];
    const funcionariosPermitidosIds = funcionariosPermitidos.map(f => f.id);

    // Buscar treinamentos normativos apenas se há funcionários
    let treinamentosNormativos = [];
    if (funcionariosPermitidosIds.length > 0) {
      const { data: normativosData, error: normativosError } = await supabase
        .from('treinamentos_normativos')
        .select('funcionario_id, status')
        .in('funcionario_id', funcionariosPermitidosIds)
        .eq('arquivado', false);

      if (normativosError) {
        console.warn('Erro ao buscar treinamentos normativos:', normativosError);
      } else {
        treinamentosNormativos = normativosData || [];
      }
    }

    // Calcular resultados
    const totalTreinamentosExecutados = execucaoResult.count || 0;
    const totalHHT = hhtResult.data?.reduce((sum, item) => sum + Number(item.horas_trabalhadas || 0), 0) || 0;
    const totalHorasTreinamento = horasTreinamentoResult.data?.reduce((sum, item) => sum + Number(item.horas_totais || 0), 0) || 0;
    
    const treinamentosValidos = treinamentosNormativos.filter(t => t.status === 'Válido').length;
    const treinamentosVencendo = treinamentosNormativos.filter(t => t.status === 'Próximo ao vencimento').length;
    
    const uniqueFuncionariosIds = new Set(
      treinamentosNormativos
        .filter(t => ['Válido', 'Próximo ao vencimento'].includes(t.status))
        .map(item => item.funcionario_id)
    );

    const totalFuncionarios = funcionariosPermitidos.length;

    // Calculate percentages and goals
    const metaHoras = totalHHT * 0.025; // 2.5% meta
    const percentualHorasInvestidas = totalHHT > 0 ? (totalHorasTreinamento / totalHHT) * 100 : 0;
    const metaAtingida = percentualHorasInvestidas >= 2.5;

    return {
      totalFuncionarios,
      funcionariosComTreinamentos: uniqueFuncionariosIds.size,
      totalTreinamentosExecutados,
      treinamentosValidos,
      treinamentosVencendo,
      totalHHT,
      totalHorasTreinamento,
      metaHoras,
      percentualHorasInvestidas: Number(percentualHorasInvestidas.toFixed(2)),
      metaAtingida
    };

  } catch (error) {
    console.error('Erro ao buscar estatísticas de treinamentos:', error);
    
    // Retornar dados padrão em caso de erro
    return {
      totalFuncionarios: 0,
      funcionariosComTreinamentos: 0,
      totalTreinamentosExecutados: 0,
      treinamentosValidos: 0,
      treinamentosVencendo: 0,
      totalHHT: 0,
      totalHorasTreinamento: 0,
      metaHoras: 0,
      percentualHorasInvestidas: 0,
      metaAtingida: false
    };
  }
};
