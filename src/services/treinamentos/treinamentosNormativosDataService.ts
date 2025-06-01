
import { supabase } from "@/integrations/supabase/client";

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
