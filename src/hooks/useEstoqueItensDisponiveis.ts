import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EstoqueItemDisponivel {
  descricao: string;
  unidade: string | null;
  unitario: number | null;
  quantidade_total: number;
}

export function useEstoqueItensDisponiveis(searchTerm?: string, almoxarifadoId?: string) {
  return useQuery({
    queryKey: ["estoque-itens-disponiveis", searchTerm, almoxarifadoId],
    queryFn: async () => {
      if (!almoxarifadoId) return [];

      let query = supabase
        .from("estoque_movimentacoes_entradas_itens")
        .select(`
          descricao,
          unidade,
          unitario,
          quantidade,
          estoque_movimentacoes_entradas!inner(almoxarifado_id)
        `)
        .eq("estoque_movimentacoes_entradas.almoxarifado_id", almoxarifadoId)
        .order("descricao");

      if (searchTerm && searchTerm.length >= 2) {
        query = query.ilike("descricao", `%${searchTerm}%`);
      }

      const { data, error } = await query.limit(200);

      if (error) throw error;
      
      // Agrupar por descrição e somar as quantidades
      const groupedItems = data?.reduce((acc, item: any) => {
        const existing = acc.find(i => i.descricao === item.descricao);
        if (existing) {
          existing.quantidade_total += item.quantidade || 0;
        } else {
          acc.push({
            descricao: item.descricao,
            unidade: item.unidade,
            unitario: item.unitario,
            quantidade_total: item.quantidade || 0
          });
        }
        return acc;
      }, [] as EstoqueItemDisponivel[]);
      
      return groupedItems || [];
    },
    enabled: !!almoxarifadoId && (!searchTerm || searchTerm.length >= 2),
  });
}
