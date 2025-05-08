
import { supabase } from '@/integrations/supabase/client';
import { RPCDesviosByInspectionTypeResult } from './types';

/**
 * Fetch desvios by inspection type
 */
export async function fetchDesviosByInspectionType(): Promise<RPCDesviosByInspectionTypeResult[]> {
  try {
    // Mock data since the real RPC function doesn't exist yet
    const mockData: RPCDesviosByInspectionTypeResult[] = [
      { tipo: "Segurança", quantidade: 18 },
      { tipo: "Técnica", quantidade: 12 },
      { tipo: "Qualidade", quantidade: 9 }
    ];
    
    return mockData;
  } catch (error) {
    console.error("Exceção ao buscar desvios por tipo de inspeção:", error);
    return [];
  }
}
