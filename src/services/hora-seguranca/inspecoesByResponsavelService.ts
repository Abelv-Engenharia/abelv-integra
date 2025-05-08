
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByResponsavel } from './types';

/**
 * Fetch inspeções by responsável
 */
export async function fetchInspecoesByResponsavel(): Promise<InspecoesByResponsavel[]> {
  try {
    // Mock data since the real RPC function doesn't exist yet
    const mockData: InspecoesByResponsavel[] = [
      { responsavel: "João Silva", quantidade: 15 },
      { responsavel: "Maria Oliveira", quantidade: 12 },
      { responsavel: "Carlos Santos", quantidade: 10 },
      { responsavel: "Ana Pereira", quantidade: 8 }
    ];
    
    return mockData;
  } catch (error) {
    console.error("Exceção ao buscar inspeções por responsável:", error);
    return [];
  }
}
