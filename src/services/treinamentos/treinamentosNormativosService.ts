
import { supabase } from "@/integrations/supabase/client";

export interface TreinamentoNormativo {
  id?: string;
  funcionario_id: string;
  treinamento_id: string;
  tipo: string;
  data_realizacao: string;
  data_validade: string;
  status: string;
  certificado_url?: string;
  funcionarioNome?: string;
  treinamentoNome?: string;
}

export const treinamentosNormativosService = {
  async create(data: TreinamentoNormativo) {
    console.log("Creating treinamento normativo with data:", data);
    
    const insertData = {
      funcionario_id: data.funcionario_id,
      treinamento_id: data.treinamento_id,
      tipo: data.tipo,
      data_realizacao: data.data_realizacao,
      data_validade: data.data_validade,
      status: data.status,
      certificado_url: data.certificado_url,
    };

    const { data: result, error } = await supabase
      .from("treinamentos_normativos")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Error creating treinamento normativo:", error);
      throw error;
    }

    return result;
  },

  async getAll() {
    const { data, error } = await supabase
      .from("treinamentos_normativos")
      .select(`
        *,
        funcionarios:funcionario_id(nome),
        treinamentos:treinamento_id(nome)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching treinamentos normativos:", error);
      throw error;
    }

    return data || [];
  }
};
