import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EstoqueItemDisponivel {
  id: string;
  descricao: string;
  unidade: string | null;
  unitario: number | null;
}

export function useEstoqueItensDisponiveis(searchTerm?: string) {
  return useQuery({
    queryKey: ["estoque-itens-disponiveis", searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("estoque_movimentacoes_entradas_itens")
        .select("id, descricao, unidade, unitario")
        .order("descricao");

      if (searchTerm && searchTerm.length >= 2) {
        query = query.ilike("descricao", `%${searchTerm}%`);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      
      // Remover duplicatas por descrição
      const uniqueItems = data?.reduce((acc, item) => {
        if (!acc.find(i => i.descricao === item.descricao)) {
          acc.push(item);
        }
        return acc;
      }, [] as EstoqueItemDisponivel[]);
      
      return uniqueItems || [];
    },
    enabled: !searchTerm || searchTerm.length >= 2,
  });
}
