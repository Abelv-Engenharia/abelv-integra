
import { supabase } from "@/integrations/supabase/client";

export const fetchTreinamentosNormativosData = async (userCCAIds: number[] = [], filters?: { year?: string; month?: string; ccaId?: string }) => {
  // Se não tem CCAs permitidos, retorna dados vazios
  if (userCCAIds.length === 0) {
    return [
      { name: "Válido", value: 0 },
      { name: "Próximo ao vencimento", value: 0 },
      { name: "Vencido", value: 0 }
    ];
  }

  // Filtrar CCAs se especificado
  let allowedCCAIds = userCCAIds;
  if (filters?.ccaId && filters.ccaId !== "todos") {
    allowedCCAIds = [parseInt(filters.ccaId)];
  }

  // Get funcionários from allowed CCAs
  const { data: funcionarios } = await supabase
    .from('funcionarios')
    .select('id')
    .in('cca_id', allowedCCAIds)
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
  const { data: trainings } = await supabase
    .from('treinamentos_normativos')
    .select('status')
    .in('funcionario_id', funcionarioIds)
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
