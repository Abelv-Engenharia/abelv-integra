
import { supabase } from "@/integrations/supabase/client";
import { formatISO } from "date-fns";

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

export const fetchTreinamentosExecucaoData = async () => {
  // Get training execution data for the last 6 months
  const { data } = await supabase
    .from('execucao_treinamentos')
    .select('mes, ano, carga_horaria')
    .order('ano', { ascending: true })
    .order('mes', { ascending: true })
    .limit(100);

  // Group trainings by month and year
  const monthsData = (data || []).reduce((acc, training) => {
    const monthYear = `${training.mes}/${training.ano}`;
    if (!acc[monthYear]) {
      acc[monthYear] = {
        name: monthYear,
        count: 0,
        hoursTotal: 0
      };
    }
    acc[monthYear].count += 1;
    acc[monthYear].hoursTotal += training.carga_horaria;
    return acc;
  }, {} as Record<string, { name: string; count: number; hoursTotal: number }>);

  // Convert to array and sort by date
  return Object.values(monthsData).sort((a, b) => {
    const [aMonth, aYear] = a.name.split('/').map(Number);
    const [bMonth, bYear] = b.name.split('/').map(Number);
    return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
  });
};

export const fetchTreinamentosNormativosData = async () => {
  // Get normative training data
  const { data: trainings } = await supabase
    .from('treinamentos_normativos')
    .select('status')
    .eq('arquivado', false)
    .limit(1000);
  
  // Count trainings by status
  const statusCount = (trainings || []).reduce((acc, training) => {
    if (!acc[training.status]) {
      acc[training.status] = 0;
    }
    acc[training.status] += 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Return formatted data for chart
  return [
    { name: "Válido", value: statusCount["Válido"] || 0 },
    { name: "Próximo ao vencimento", value: statusCount["Próximo ao vencimento"] || 0 },
    { name: "Vencido", value: statusCount["Vencido"] || 0 }
  ];
};

export const fetchFuncionariosComTreinamentos = async () => {
  // Get funcionarios with their trainings
  const { data: funcionarios } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('ativo', true)
    .limit(100);
  
  const { data: treinamentosNormativos } = await supabase
    .from('treinamentos_normativos')
    .select('id, funcionario_id, treinamento_id, tipo, data_realizacao, data_validade, status, arquivado')
    .eq('arquivado', false)
    .limit(1000);
  
  const { data: treinamentosInfo } = await supabase
    .from('treinamentos')
    .select('id, nome')
    .limit(100);

  // Map treinamentos to funcionarios
  const funcionariosComTreinamentos = (funcionarios || []).map(funcionario => {
    const treinamentos = (treinamentosNormativos || [])
      .filter(t => t.funcionario_id === funcionario.id && !t.arquivado)
      .map(t => ({
        ...t,
        treinamentoNome: (treinamentosInfo || [])
          .find(tr => tr.id === t.treinamento_id)?.nome || "Desconhecido"
      }));

    return {
      ...funcionario,
      treinamentos
    };
  });

  return funcionariosComTreinamentos;
};

export const fetchTreinamentosPorProcesso = async () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Fetch training data grouped by processo
  const { data: treinamentosData } = await supabase
    .from('execucao_treinamentos')
    .select('processo_treinamento, efetivo_mod, efetivo_moi, horas_totais')
    .eq('mes', currentMonth)
    .eq('ano', currentYear);

  // Group by processo and calculate totals
  const processoStats = (treinamentosData || []).reduce((acc, item) => {
    const processo = item.processo_treinamento;
    if (!acc[processo]) {
      acc[processo] = {
        processo,
        horasMOD: 0,
        totalHoras: 0
      };
    }
    
    const totalEfetivo = (item.efetivo_mod || 0) + (item.efetivo_moi || 0);
    const horasPorMOD = totalEfetivo > 0 ? (item.horas_totais || 0) * (item.efetivo_mod || 0) / totalEfetivo : 0;
    acc[processo].horasMOD += horasPorMOD;
    acc[processo].totalHoras += item.horas_totais || 0;
    
    return acc;
  }, {} as Record<string, { processo: string; horasMOD: number; totalHoras: number }>);

  // Calculate total MOD hours for percentage calculation
  const totalHorasMOD = Object.values(processoStats).reduce((sum, item) => sum + item.horasMOD, 0);

  // Convert to array with percentages
  return Object.values(processoStats).map(item => ({
    ...item,
    percentualMOD: totalHorasMOD > 0 ? (item.horasMOD / totalHorasMOD) * 100 : 0
  }));
};
