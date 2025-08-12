
import { supabase } from "@/integrations/supabase/client";

export const fetchTreinamentosStats = async (userCCAIds: number[] = [], filters?: { year?: string; month?: string; ccaId?: string }) => {
  console.log('fetchTreinamentosStats iniciado:', { userCCAIds, filters });
  
  // Se não tem CCAs permitidos, retorna dados vazios
  if (userCCAIds.length === 0) {
    console.log('Nenhum CCA permitido, retornando dados vazios');
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
    
    console.log('Período definido:', { targetYear, targetMonth });
    
    // Filtrar CCAs se especificado
    let allowedCCAIds = userCCAIds;
    if (filters?.ccaId && filters.ccaId !== "todos") {
      allowedCCAIds = [parseInt(filters.ccaId)];
    }
    
    console.log('CCAs permitidos finais:', allowedCCAIds);

    // Buscar execuções de treinamento
    console.log('Buscando execuções de treinamento...');
    let execucaoQuery = supabase
      .from('execucao_treinamentos')
      .select('*', { count: 'exact', head: true })
      .in('cca_id', allowedCCAIds)
      .eq('ano', targetYear);
    
    if (targetMonth) {
      execucaoQuery = execucaoQuery.eq('mes', targetMonth);
    }
    
    const execucaoResult = await execucaoQuery;
    console.log('Resultado execução:', execucaoResult);

    // Buscar HHT
    console.log('Buscando HHT...');
    let hhtQuery = supabase
      .from('horas_trabalhadas')
      .select('horas_trabalhadas')
      .in('cca_id', allowedCCAIds)
      .eq('ano', targetYear);
    
    if (targetMonth) {
      hhtQuery = hhtQuery.eq('mes', targetMonth);
    }
    
    const hhtResult = await hhtQuery;
    console.log('Resultado HHT:', hhtResult);

    // Buscar horas de treinamento
    console.log('Buscando horas de treinamento...');
    let horasQuery = supabase
      .from('execucao_treinamentos')
      .select('horas_totais')
      .in('cca_id', allowedCCAIds)
      .eq('ano', targetYear);
    
    if (targetMonth) {
      horasQuery = horasQuery.eq('mes', targetMonth);
    }
    
    const horasTreinamentoResult = await horasQuery;
    console.log('Resultado horas treinamento:', horasTreinamentoResult);

    // Buscar funcionários
    console.log('Buscando funcionários...');
    const funcionariosResult = await supabase
      .from('funcionarios')
      .select('id')
      .in('cca_id', allowedCCAIds)
      .eq('ativo', true);
    
    console.log('Resultado funcionários:', funcionariosResult);

    // Verificar erros
    if (execucaoResult.error) {
      console.error('Erro execução:', execucaoResult.error);
      throw execucaoResult.error;
    }
    if (hhtResult.error) {
      console.error('Erro HHT:', hhtResult.error);
      throw hhtResult.error;
    }
    if (horasTreinamentoResult.error) {
      console.error('Erro horas treinamento:', horasTreinamentoResult.error);
      throw horasTreinamentoResult.error;
    }
    if (funcionariosResult.error) {
      console.error('Erro funcionários:', funcionariosResult.error);
      throw funcionariosResult.error;
    }

    const funcionariosPermitidos = funcionariosResult.data || [];
    const funcionariosPermitidosIds = funcionariosPermitidos.map(f => f.id);
    console.log('IDs funcionários permitidos:', funcionariosPermitidosIds);

    // Buscar treinamentos normativos apenas se há funcionários
    let treinamentosNormativos = [];
    if (funcionariosPermitidosIds.length > 0) {
      console.log('Buscando treinamentos normativos...');
      const { data: normativosData, error: normativosError } = await supabase
        .from('treinamentos_normativos')
        .select('funcionario_id, status')
        .in('funcionario_id', funcionariosPermitidosIds)
        .eq('arquivado', false);

      if (normativosError) {
        console.warn('Erro ao buscar treinamentos normativos:', normativosError);
      } else {
        treinamentosNormativos = normativosData || [];
        console.log('Treinamentos normativos encontrados:', treinamentosNormativos.length);
      }
    }

    // Calcular resultados
    const totalTreinamentosExecutados = execucaoResult.count || 0;
    const totalHHT = hhtResult.data?.reduce((sum, item) => sum + Number(item.horas_trabalhadas || 0), 0) || 0;
    const totalHorasTreinamento = horasTreinamentoResult.data?.reduce((sum, item) => sum + Number(item.horas_totais || 0), 0) || 0;
    
    console.log('Valores calculados:', {
      totalTreinamentosExecutados,
      totalHHT,
      totalHorasTreinamento,
      hhtDataLength: hhtResult.data?.length || 0,
      horasDataLength: horasTreinamentoResult.data?.length || 0
    });
    
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

    const result = {
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

    console.log('Resultado final:', result);
    return result;

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
