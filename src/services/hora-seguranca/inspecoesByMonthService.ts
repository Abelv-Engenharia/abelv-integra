
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch inspeções by month
 */
export async function fetchInspecoesByMonth(): Promise<any[]> {
  try {
    // Since we don't have this RPC yet, we'll return mock data for now
    // TODO: Replace with real RPC call when available
    const mockData = [
      { name: 'Jan', 'Concluída': 20, 'Pendente': 10, 'Cancelada': 5 },
      { name: 'Fev', 'Concluída': 25, 'Pendente': 8, 'Cancelada': 3 },
      { name: 'Mar', 'Concluída': 30, 'Pendente': 12, 'Cancelada': 4 },
      { name: 'Abr', 'Concluída': 22, 'Pendente': 15, 'Cancelada': 6 },
      { name: 'Mai', 'Concluída': 28, 'Pendente': 10, 'Cancelada': 2 },
      { name: 'Jun', 'Concluída': 32, 'Pendente': 8, 'Cancelada': 1 }
    ];

    return mockData;
  } catch (error) {
    console.error("Exceção ao buscar inspeções por mês:", error);
    return [];
  }
}
