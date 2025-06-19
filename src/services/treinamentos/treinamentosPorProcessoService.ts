
import { supabase } from "@/integrations/supabase/client";

export const fetchTreinamentosPorProcesso = async (userCCAIds: number[] = []) => {
  // Se não tem CCAs permitidos, retorna vazio
  if (userCCAIds.length === 0) {
    return [];
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Fetch training data grouped by processo, filtered by user CCAs
  const { data: treinamentosData } = await supabase
    .from('execucao_treinamentos')
    .select('processo_treinamento, efetivo_mod, efetivo_moi, horas_totais, cca_id')
    .in('cca_id', userCCAIds)
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
