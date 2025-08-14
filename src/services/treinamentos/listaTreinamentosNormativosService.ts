
import { supabase } from "@/integrations/supabase/client";

// Retorna treinamentos normativos da tabela lista_treinamentos_normativos
export async function fetchTreinamentosNormativos() {
  console.log('Service: Iniciando busca de treinamentos normativos...');
  
  try {
    const { data, error } = await supabase
      .from("lista_treinamentos_normativos")
      .select("id, nome, validade_dias")
      .order("nome");

    if (error) {
      console.error("Service: Erro ao buscar lista_treinamentos_normativos:", error);
      throw error;
    }
    
    console.log('Service: Dados retornados:', data);
    console.log('Service: Quantidade de treinamentos:', data?.length || 0);
    
    return data || [];
  } catch (error) {
    console.error("Service: Exceção ao buscar treinamentos:", error);
    throw error;
  }
}

export const listaTreinamentosNormativosService = {
  getAll: fetchTreinamentosNormativos,
};
