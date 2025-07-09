
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

  // Fetch total number of trainings (normative and execution) filtered by user CCAs
  const { count: totalTreinamentosNormativos } = await supabase
    .from('treinamentos_normativos')
    .select('funcionario_id', { count: 'exact', head: true })
    .in('funcionario_id', 
      await supabase
        .from('funcionarios')
        .select('id')
        .in('cca_id', allowedCCAIds)
        .then(res => (res.data || []).map(f => f.id))
    );

  let execucaoQuery = supabase
    .from('execucao_treinamentos')
    .select('*', { count: 'exact', head: true })
    .in('cca_id', allowedCCAIds)
    .eq('ano', targetYear);

  if (targetMonth) {
    execucaoQuery = execucaoQuery.eq('mes', targetMonth);
  }

  const { count: totalTreinamentosExecutados } = await execucaoQuery;

  // Fetch funcionarios with valid trainings from allowed CCAs
  const { data: funcionariosPermitidos } = await supabase
    .from('funcionarios')
    .select('id')
    .in('cca_id', allowedCCAIds)
    .eq('ativo', true);

  const funcionariosPermitidosIds = funcionariosPermitidos?.map(f => f.id) || [];

  const { data: funcionariosComTreinamentos } = await supabase
    .from('treinamentos_normativos')
    .select('funcionario_id')
    .in('funcionario_id', funcionariosPermitidosIds)
    .eq('arquivado', false)
    .in('status', ['Válido', 'Próximo ao vencimento'])
    .limit(1000);

  const uniqueFuncionariosIds = new Set(
    funcionariosComTreinamentos?.map(item => item.funcionario_id) || []
  );

  // Fetch total number of funcionarios from allowed CCAs
  const { count: totalFuncionarios } = await supabase
    .from('funcionarios')
    .select('*', { count: 'exact', head: true })
    .in('cca_id', allowedCCAIds)
    .eq('ativo', true);

  // Fetch valid trainings from funcionarios in allowed CCAs
  const { data: treinamentosStatus } = await supabase
    .from('treinamentos_normativos')
    .select('status')
    .in('funcionario_id', funcionariosPermitidosIds)
    .eq('arquivado', false)
    .limit(1000);

  const treinamentosValidos = treinamentosStatus?.filter(t => t.status === 'Válido')?.length || 0;
  const treinamentosVencendo = treinamentosStatus?.filter(t => t.status === 'Próximo ao vencimento')?.length || 0;

  // Fetch HHT (Horas Homem Trabalhadas) for the specified period
  let hhtQuery = supabase
    .from('horas_trabalhadas')
    .select('horas_trabalhadas')
    .in('cca_id', allowedCCAIds)
    .eq('ano', targetYear);

  if (targetMonth) {
    hhtQuery = hhtQuery.eq('mes', targetMonth);
  }

  const { data: hhtData } = await hhtQuery;
  const totalHHT = hhtData?.reduce((sum, item) => sum + Number(item.horas_trabalhadas), 0) || 0;

  // Fetch total training hours from execucao_treinamentos for the specified period
  let horasTreinamentoQuery = supabase
    .from('execucao_treinamentos')
    .select('horas_totais')
    .in('cca_id', allowedCCAIds)
    .eq('ano', targetYear);

  if (targetMonth) {
    horasTreinamentoQuery = horasTreinamentoQuery.eq('mes', targetMonth);
  }

  const { data: horasTreinamento } = await horasTreinamentoQuery;
  const totalHorasTreinamento = horasTreinamento?.reduce((sum, item) => sum + Number(item.horas_totais || 0), 0) || 0;

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
    totalFuncionarios: totalFuncionarios || 0,
    funcionariosComTreinamentos: uniqueFuncionariosIds.size,
    totalTreinamentosExecutados: totalTreinamentosExecutados || 0,
    treinamentosValidos,
    treinamentosVencendo,
    totalHHT,
    totalHorasTreinamento,
    metaHoras,
    percentualHorasInvestidas,
    metaAtingida
  };
};
