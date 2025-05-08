
import { supabase } from '@/integrations/supabase/client';

interface InspecoesStats {
  periodo: string;
  quantidade: number;
}

/**
 * Fetch inspeções stats
 */
export async function fetchInspecoesStats(): Promise<InspecoesStats[]> {
  try {
    // Mock data since the real RPC function doesn't exist yet
    const mockData: InspecoesStats[] = [
      { periodo: "Jan", quantidade: 45 },
      { periodo: "Fev", quantidade: 32 },
      { periodo: "Mar", quantidade: 56 },
      { periodo: "Abr", quantidade: 42 },
      { periodo: "Mai", quantidade: 38 }
    ];
    
    return mockData;
  } catch (error) {
    console.error("Exceção ao buscar estatísticas de inspeções:", error);
    return [];
  }
}
