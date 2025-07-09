
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
 * Update an existing HHT record
 */
export async function updateHorasTrabalhadas(id: string, data: Partial<HorasTrabalhadas>): Promise<HorasTrabalhadas | null> {
  try {
    const { data: record, error } = await supabase
      .from('horas_trabalhadas')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar registro de HHT:", error);
      return null;
    }

    return record as HorasTrabalhadas;
  } catch (error) {
    console.error("Exceção ao atualizar registro de HHT:", error);
    return null;
  }
}

/**
 * Delete an HHT record
 */
export async function deleteHorasTrabalhadas(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('horas_trabalhadas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erro ao deletar registro de HHT:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exceção ao deletar registro de HHT:", error);
    return false;
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
 * Fetch HHT by CCA with detailed information
 */
export async function fetchHHTByCCA() {
  try {
    const { data, error } = await supabase
      .from('horas_trabalhadas')
      .select(`
        id,
        mes,
        ano,
        horas_trabalhadas,
        observacoes,
        cca_id,
        ccas (
          id,
          codigo,
          nome
        )
      `)
      .order('ano', { ascending: false })
      .order('mes', { ascending: false });

    if (error) {
      console.error("Erro ao buscar HHT por CCA:", error);
      return [];
    }

    if (!data || !data.length) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      mes: item.mes,
      ano: item.ano,
      horas_trabalhadas: item.horas_trabalhadas,
      observacoes: item.observacoes,
      cca_id: item.cca_id,
      codigo: item.ccas.codigo,
      nome: item.ccas.nome
    }));
  } catch (error) {
    console.error("Exceção ao buscar HHT por CCA:", error);
    return [];
  }
}

/**
 * Fetch horas trabalhadas by month
 */
export async function fetchHorasTrabalhadasByMonth() {
  try {
    const { data, error } = await supabase.rpc('get_hht_by_month');

    if (error) {
      console.error("Erro ao buscar horas trabalhadas por mês:", error);
      return [];
    }

    if (!data || !data.length) {
      return [];
    }

    return data.map((item: any) => ({
      month: `${item.mes}/${item.ano}`,
      horas: item.total_horas
    }));
  } catch (error) {
    console.error("Exceção ao buscar horas trabalhadas por mês:", error);
    return [];
  }
}
