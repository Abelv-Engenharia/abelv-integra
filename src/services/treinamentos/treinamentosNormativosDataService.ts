
import { supabase } from "@/integrations/supabase/client";

interface Filters {
  year?: number;
  month?: number;
  ccaId?: number;
}

export const fetchTreinamentosNormativosData = async (userCCAIds: number[] = [], filters?: Filters) => {
  // Se não tem CCAs permitidos, retorna dados vazios
  if (userCCAIds.length === 0) {
    return [
      { name: "Válido", value: 0 },
      { name: "Próximo ao vencimento", value: 0 },
      { name: "Vencido", value: 0 }
    ];
  }

  // Aplicar filtros de CCA se especificado
  const filteredCCAIds = filters?.ccaId ? [filters.ccaId] : userCCAIds;

  // Get funcionários from allowed CCAs
  const { data: funcionarios } = await supabase
    .from('funcionarios')
    .select('id')
    .in('cca_id', filteredCCAIds)
    .eq('ativo', true);

  if (!funcionarios || funcionarios.length === 0) {
    return [
      { name: "Válido", value: 0 },
      { name: "Próximo ao vencimento", value: 0 },
      { name: "Vencido", value: 0 }
    ];
  }

  const funcionarioIds = funcionarios.map(f => f.id);

  // Get normative training data for funcionários from allowed CCAs
  let query = supabase
    .from('treinamentos_normativos')
    .select('status, data_realizacao')
    .in('funcionario_id', funcionarioIds)
    .eq('arquivado', false)
    .limit(1000);

  // Se há filtros de ano ou mês, aplicar na data de realização
  if (filters?.year || filters?.month) {
    if (filters.year && filters.month) {
      const startDate = new Date(filters.year, filters.month - 1, 1);
      const endDate = new Date(filters.year, filters.month, 0);
      query = query
        .gte('data_realizacao', startDate.toISOString().split('T')[0])
        .lte('data_realizacao', endDate.toISOString().split('T')[0]);
    } else if (filters.year) {
      const startDate = new Date(filters.year, 0, 1);
      const endDate = new Date(filters.year, 11, 31);
      query = query
        .gte('data_realizacao', startDate.toISOString().split('T')[0])
        .lte('data_realizacao', endDate.toISOString().split('T')[0]);
    }
  }

  const { data: trainings } = await query;
  
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
