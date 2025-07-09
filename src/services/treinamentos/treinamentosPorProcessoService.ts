
import { supabase } from "@/integrations/supabase/client";

export const fetchTreinamentosPorProcesso = async (userCCAIds: number[] = [], filters?: { year?: string; month?: string; ccaId?: string }) => {
  // Se não tem CCAs permitidos, retorna vazio
  if (userCCAIds.length === 0) {
    return [];
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

  // Fetch training data grouped by processo, filtered by user CCAs and period
  let query = supabase
    .from('execucao_treinamentos')
    .select('processo_treinamento, efetivo_mod, efetivo_moi, horas_totais, cca_id')
    .in('cca_id', allowedCCAIds)
    .eq('ano', targetYear);

  if (targetMonth) {
    query = query.eq('mes', targetMonth);
  }

  const { data: treinamentosData } = await query;

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

  // Calculate total hours (MOD + MOI) for percentage calculation
  const totalHorasGeral = Object.values(processoStats).reduce((sum, item) => sum + item.totalHoras, 0);

  // Convert to array with percentages based on total hours
  return Object.values(processoStats).map(item => {
    const horasMOI = item.totalHoras - item.horasMOD;
    return {
      ...item,
      percentualMOD: totalHorasGeral > 0 ? (item.horasMOD / totalHorasGeral) * 100 : 0,
      percentualMOI: totalHorasGeral > 0 ? (horasMOI / totalHorasGeral) * 100 : 0
    };
  });
};
