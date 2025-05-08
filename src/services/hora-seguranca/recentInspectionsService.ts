
import { supabase } from '@/integrations/supabase/client';
import { RecentInspection } from './types';

/**
 * Fetch recent inspections for dashboard
 * 
 * Note: This is a mock implementation since there's no actual 'inspecoes' table in the database.
 * In a real application, this would be replaced with actual data fetching from the appropriate table.
 */
export async function fetchRecentInspections(): Promise<RecentInspection[]> {
  try {
    // Since we're dealing with a table that doesn't exist in the database schema,
    // we'll return mock data instead of querying the database
    
    // Mock data to represent recent inspections
    const mockData: RecentInspection[] = [
      {
        id: '1',
        tipo: 'Inspeção Programada',
        responsavel: 'João Silva',
        status: 'Concluída',
        data: new Date().toISOString()
      },
      {
        id: '2',
        tipo: 'Inspeção Não Programada',
        responsavel: 'Maria Oliveira',
        status: 'Pendente',
        data: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        tipo: 'Inspeção de Segurança',
        responsavel: 'Carlos Santos',
        status: 'Concluída',
        data: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    return mockData;
  } catch (error) {
    console.error("Exceção ao buscar inspeções recentes:", error);
    return [];
  }
}
