
import { supabase } from '@/integrations/supabase/client';
import { RecentInspection } from './types';

/**
 * Fetch recent inspections
 */
export async function fetchRecentInspections(): Promise<RecentInspection[]> {
  try {
    // Since we don't have this RPC yet, we'll return mock data for now
    // TODO: Replace with real RPC call when available
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
