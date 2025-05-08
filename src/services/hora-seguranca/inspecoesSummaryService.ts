
import { supabase } from '@/integrations/supabase/client';
import { InspecoesSummary } from './types';

/**
 * Fetch inspeções summary data
 */
export async function fetchInspecoesSummary(): Promise<InspecoesSummary> {
  try {
    // Mock data since the real RPC function doesn't exist yet
    const mockSummary: InspecoesSummary = {
      totalInspecoes: 120,
      programadas: 80,
      naoProgramadas: 40,
      desviosIdentificados: 25,
      realizadas: 95,
      canceladas: 10
    };
    
    return mockSummary;
  } catch (error) {
    console.error("Exceção ao buscar resumo de inspeções:", error);
    return {
      totalInspecoes: 0,
      programadas: 0,
      naoProgramadas: 0,
      desviosIdentificados: 0,
      realizadas: 0,
      canceladas: 0
    };
  }
}
