
import { supabase } from "@/integrations/supabase/client";

export const fetchTreinamentosStats = async () => {
  // Fetch total number of trainings (normative and execution)
  const { count: totalTreinamentosNormativos } = await supabase
    .from('treinamentos_normativos')
    .select('*', { count: 'exact', head: true });

  const { count: totalTreinamentosExecutados } = await supabase
    .from('execucao_treinamentos')
    .select('*', { count: 'exact', head: true });

  // Fetch funcionarios with valid trainings
  const { data: funcionariosComTreinamentos } = await supabase
    .from('treinamentos_normativos')
    .select('funcionario_id')
    .eq('arquivado', false)
    .in('status', ['Válido', 'Próximo ao vencimento'])
    .limit(1000);

  const uniqueFuncionariosIds = new Set(
    funcionariosComTreinamentos?.map(item => item.funcionario_id) || []
  );

  // Fetch total number of funcionarios
  const { count: totalFuncionarios } = await supabase
    .from('funcionarios')
    .select('*', { count: 'exact', head: true })
    .eq('ativo', true);

  // Fetch valid trainings
  const { data: treinamentosStatus } = await supabase
    .from('treinamentos_normativos')
    .select('status')
    .eq('arquivado', false)
    .limit(1000);

  const treinamentosValidos = treinamentosStatus?.filter(t => t.status === 'Válido')?.length || 0;
  const treinamentosVencendo = treinamentosStatus?.filter(t => t.status === 'Próximo ao vencimento')?.length || 0;

  // Fetch HHT (Horas Homem Trabalhadas) for current month/year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const { data: hhtData } = await supabase
    .from('horas_trabalhadas')
    .select('horas_trabalhadas')
    .eq('mes', currentMonth)
    .eq('ano', currentYear);

  const totalHHT = hhtData?.reduce((sum, item) => sum + Number(item.horas_trabalhadas), 0) || 0;

  // Fetch total training hours from execucao_treinamentos for current month/year using horas_totais column
  const { data: horasTreinamento } = await supabase
    .from('execucao_treinamentos')
    .select('horas_totais')
    .eq('mes', currentMonth)
    .eq('ano', currentYear);

  const totalHorasTreinamento = horasTreinamento?.reduce((sum, item) => sum + Number(item.horas_totais || 0), 0) || 0;

  // Calculate percentages and goals
  const metaHoras = totalHHT * 0.025; // 2.5% meta
  const percentualHorasInvestidas = totalHHT > 0 ? (totalHorasTreinamento / totalHHT) * 100 : 0;
  const metaAtingida = percentualHorasInvestidas >= 2.5;

  console.log('Debug training stats:', {
    totalHHT,
    totalHorasTreinamento,
    percentualHorasInvestidas,
    metaHoras,
    metaAtingida,
    currentMonth,
    currentYear
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
