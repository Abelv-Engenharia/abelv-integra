
import { supabase } from "@/integrations/supabase/client";

// Retorna treinamentos normativos da tabela lista_treinamentos_normativos
export async function fetchTreinamentosNormativos() {
  const { data, error } = await supabase
    .from("lista_treinamentos_normativos")
    .select("id, nome, validade_dias")
    .order("nome");

  if (error) {
    console.error("Erro ao buscar lista_treinamentos_normativos:", error);
    return [];
  }
  return data || [];
}

export const listaTreinamentosNormativosService = {
  getAll: fetchTreinamentosNormativos,
};
