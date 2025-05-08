
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByStatus } from './types';

/**
 * Fetch inspeções by status
 */
export async function fetchInspecoesByStatus(): Promise<InspecoesByStatus[]> {
  try {
    // Since we don't have this RPC yet, we'll return mock data for now
    // TODO: Replace with real RPC call when available
    const mockData: InspecoesByStatus[] = [
      { name: 'Concluída', value: 45, status: 'Concluída' },
      { name: 'Pendente', value: 30, status: 'Pendente' },
      { name: 'Cancelada', value: 10, status: 'Cancelada' }
    ];

    return mockData;
  } catch (error) {
    console.error("Exceção ao buscar inspeções por status:", error);
    return [];
  }
}
