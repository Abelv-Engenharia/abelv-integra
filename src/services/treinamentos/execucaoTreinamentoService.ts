
import { supabase } from "@/integrations/supabase/client";

export interface ExecucaoTreinamento {
  id?: string;
  data: Date;
  mes: number;
  ano: number;
  cca: string;
  processo_treinamento: string;
  tipo_treinamento: string;
  treinamento_nome?: string;
  carga_horaria: number;
  efetivo_mod: number;
  efetivo_moi: number;
  horas_totais: number;
  observacoes?: string;
  lista_presenca_url?: string;
  cca_id?: number;
  processo_treinamento_id?: string;
  tipo_treinamento_id?: string;
  treinamento_id?: string;
}

export const execucaoTreinamentoService = {
  async create(data: Omit<ExecucaoTreinamento, 'id'>) {
    console.log("Creating execucao with data:", data);
    
    const insertData = {
      data: data.data.toISOString().split('T')[0], // Convert Date to string
      mes: data.mes,
      ano: data.ano,
      cca: data.cca,
      processo_treinamento: data.processo_treinamento,
      tipo_treinamento: data.tipo_treinamento,
      treinamento_nome: data.treinamento_nome,
      carga_horaria: data.carga_horaria,
      efetivo_mod: data.efetivo_mod,
      efetivo_moi: data.efetivo_moi,
      horas_totais: data.horas_totais,
      observacoes: data.observacoes,
      lista_presenca_url: data.lista_presenca_url,
      cca_id: data.cca_id,
      processo_treinamento_id: data.processo_treinamento_id,
      tipo_treinamento_id: data.tipo_treinamento_id,
      treinamento_id: data.treinamento_id,
    };

    const { data: result, error } = await supabase
      .from("execucao_treinamentos")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating execucao:", error);
      throw error;
    }

    return result;
  },

  async getAll() {
    const { data, error } = await supabase
      .from("execucao_treinamentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching execucoes:", error);
      throw error;
    }

    return data || [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("execucao_treinamentos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching execucao:", error);
      throw error;
    }

    return data;
  },

  async update(id: string, updateData: Partial<Omit<ExecucaoTreinamento, 'data'> & { data?: string }>) {
    const { data: result, error } = await supabase
      .from("execucao_treinamentos")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating execucao:", error);
      throw error;
    }

    return result;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from("execucao_treinamentos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting execucao:", error);
      throw error;
    }

    return true;
  }
};

// Export function for backward compatibility with TreinamentosConsulta.tsx
export async function fetchExecucaoTreinamentos(): Promise<ExecucaoTreinamento[]> {
  try {
    const { data, error } = await supabase
      .from("execucao_treinamentos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching execucao treinamentos:", error);
      return [];
    }

    // Convert string dates back to Date objects for compatibility and ensure id is present
    return (data || []).map(item => ({
      ...item,
      id: item.id || '',
      data: new Date(item.data)
    }));
  } catch (error) {
    console.error("Exception fetching execucao treinamentos:", error);
    return [];
  }
}
