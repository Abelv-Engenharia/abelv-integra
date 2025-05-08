
import { supabase } from '@/integrations/supabase/client';
import { InspecoesByTipo } from './types';

/**
 * Fetch inspeções by tipo
 */
export async function fetchInspecoesByTipo(): Promise<InspecoesByTipo[]> {
  try {
    // Mock data since the real RPC function doesn't exist yet
    const mockData: InspecoesByTipo[] = [
      { tipo: "Segurança", quantidade: 45 },
      { tipo: "Técnica", quantidade: 32 },
      { tipo: "Qualidade", quantidade: 28 }
    ];
    
    return mockData;
  } catch (error) {
    console.error("Exceção ao buscar inspeções por tipo:", error);
    return [];
  }
}
