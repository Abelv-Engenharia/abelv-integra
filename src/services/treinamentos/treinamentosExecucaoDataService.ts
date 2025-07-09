
import { supabase } from "@/integrations/supabase/client";

export const fetchTreinamentosExecucaoData = async (userCCAIds: number[] = [], filters?: { year?: string; month?: string; ccaId?: string }) => {
  // Se não tem CCAs permitidos, retorna vazio
  if (userCCAIds.length === 0) {
    return [];
  }

  // Definir período baseado nos filtros ou ano atual
  const currentYear = new Date().getFullYear();
  const targetYear = filters?.year && filters.year !== "todos" ? parseInt(filters.year) : currentYear;
  
  // Filtrar CCAs se especificado
  let allowedCCAIds = userCCAIds;
  if (filters?.ccaId && filters.ccaId !== "todos") {
    allowedCCAIds = [parseInt(filters.ccaId)];
  }

  let query = supabase
    .from('execucao_treinamentos')
    .select('mes, ano, carga_horaria, cca_id')
    .in('cca_id', allowedCCAIds)
    .eq('ano', targetYear)
    .order('ano', { ascending: true })
    .order('mes', { ascending: true })
    .limit(100);

  // Aplicar filtro de mês se especificado
  if (filters?.month && filters.month !== "todos") {
    query = query.eq('mes', parseInt(filters.month));
  }

  const { data } = await query;

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
