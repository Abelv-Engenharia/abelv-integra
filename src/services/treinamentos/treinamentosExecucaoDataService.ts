
import { supabase } from "@/integrations/supabase/client";

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
