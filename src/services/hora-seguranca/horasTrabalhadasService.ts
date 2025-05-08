
import { supabase } from '@/integrations/supabase/client';

interface HorasTrabalhadas {
  id?: string;
  cca_id: number;
  mes: number;
  ano: number;
  horas_trabalhadas: number;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
  usuario_id?: string;
}

/**
 * Create a new HHT (Horas-Homem Trabalhadas) record
 */
export async function createHorasTrabalhadas(data: Omit<HorasTrabalhadas, 'id' | 'created_at' | 'updated_at'>): Promise<HorasTrabalhadas | null> {
  try {
    const { data: record, error } = await supabase
      .from('horas_trabalhadas')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir registro de HHT:", error);
      return null;
    }

    return record as HorasTrabalhadas;
  } catch (error) {
    console.error("Exceção ao inserir registro de HHT:", error);
    return null;
  }
}

/**
 * Fetch HHT by month
 */
export async function fetchHHTByMonth() {
  try {
    const { data, error } = await supabase.rpc('get_hht_by_month');

    if (error) {
      console.error("Erro ao buscar HHT por mês:", error);
      return [];
    }

    if (!data || !data.length) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Exceção ao buscar HHT por mês:", error);
    return [];
  }
}

/**
 * Fetch HHT by CCA
 */
export async function fetchHHTByCCA() {
  try {
    const { data, error } = await supabase.rpc('get_hht_by_cca');

    if (error) {
      console.error("Erro ao buscar HHT por CCA:", error);
      return [];
    }

    if (!data || !data.length) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Exceção ao buscar HHT por CCA:", error);
    return [];
  }
}
