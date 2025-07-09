
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

  // Definir período baseado nos filtros ou ano atual
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const targetYear = filters?.year && filters.year !== "todos" ? parseInt(filters.year) : currentYear;
  const targetMonth = filters?.month && filters.month !== "todos" ? parseInt(filters.month) : null;
  
  // Filtrar CCAs se especificado
  let allowedCCAIds = userCCAIds;
  if (filters?.ccaId && filters.ccaId !== "todos") {
    allowedCCAIds = [parseInt(filters.ccaId)];
  }

  // Buscar dados dos funcionários dos CCAs permitidos
  const { data: funcionariosPermitidos } = await supabase
    .from('funcionarios')
    .select('id')
    .in('cca_id', allowedCCAIds)
    .eq('ativo', true);

  const funcionariosPermitidosIds = funcionariosPermitidos?.map(f => f.id) || [];

  // Construir consultas com filtros apropriados
  let execucaoQuery = supabase
    .from('execucao_treinamentos')
    .select('*', { count: 'exact', head: true })
    .in('cca_id', allowedCCAIds)
    .eq('ano', targetYear);

  let hhtQuery = supabase
    .from('horas_trabalhadas')
    .select('horas_trabalhadas')
    .in('cca_id', allowedCCAIds)
    .eq('ano', targetYear);

  let horasTreinamentoQuery = supabase
    .from('execucao_treinamentos')
    .select('horas_totais')
    .in('cca_id', allowedCCAIds)
    .eq('ano', targetYear);

  if (targetMonth) {
    execucaoQuery = execucaoQuery.eq('mes', targetMonth);
    hhtQuery = hhtQuery.eq('mes', targetMonth);
    horasTreinamentoQuery = horasTreinamentoQuery.eq('mes', targetMonth);
  }

  // Executar consultas em paralelo para otimizar performance
  const [
    execucaoResult,
    hhtResult,
    horasTreinamentoResult,
    treinamentosNormativosResult
  ] = await Promise.all([
    execucaoQuery,
    hhtQuery,
    horasTreinamentoQuery,
    supabase
      .from('treinamentos_normativos')
      .select('funcionario_id, status')
      .in('funcionario_id', funcionariosPermitidosIds)
      .eq('arquivado', false)
  ]);

  const totalTreinamentosExecutados = execucaoResult.count || 0;
  const totalHHT = hhtResult.data?.reduce((sum, item) => sum + Number(item.horas_trabalhadas), 0) || 0;
  const totalHorasTreinamento = horasTreinamentoResult.data?.reduce((sum, item) => sum + Number(item.horas_totais || 0), 0) || 0;
  
  const treinamentosNormativos = treinamentosNormativosResult.data || [];
  const treinamentosValidos = treinamentosNormativos.filter(t => t.status === 'Válido').length;
  const treinamentosVencendo = treinamentosNormativos.filter(t => t.status === 'Próximo ao vencimento').length;
  
  const uniqueFuncionariosIds = new Set(
    treinamentosNormativos
      .filter(t => ['Válido', 'Próximo ao vencimento'].includes(t.status))
      .map(item => item.funcionario_id)
  );

  const totalFuncionarios = funcionariosPermitidos?.length || 0;

  // Calculate percentages and goals
  const metaHoras = totalHHT * 0.025; // 2.5% meta
  const percentualHorasInvestidas = totalHHT > 0 ? (totalHorasTreinamento / totalHHT) * 100 : 0;
  const metaAtingida = percentualHorasInvestidas >= 2.5;

  console.log('Debug training stats with filters:', {
    filters,
    allowedCCAIds,
    totalHHT,
    totalHorasTreinamento,
    percentualHorasInvestidas,
    metaHoras,
    metaAtingida,
    targetYear,
    targetMonth
  });

  return {
    totalFuncionarios,
    funcionariosComTreinamentos: uniqueFuncionariosIds.size,
    totalTreinamentosExecutados,
    treinamentosValidos,
    treinamentosVencendo,
    totalHHT,
    totalHorasTreinamento,
    metaHoras,
    percentualHorasInvestidas,
    metaAtingida
  };
};
