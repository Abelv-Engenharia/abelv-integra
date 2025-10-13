import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NfeCompraItem {
  id: string;
  nfe_compra_id: string;
  codigo_produto: string;
  descricao: string;
  ncm?: string;
  cfop?: string;
  unidade: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  created_at?: string;
}

export const useNfeCompraItens = (nfeCompraId: string | undefined) => {
  return useQuery({
    queryKey: ["nfe_compra_itens", nfeCompraId],
    queryFn: async () => {
      if (!nfeCompraId) return [];
      
      const { data, error } = await supabase
        .from("nfe_compra_itens" as any)
        .select("*")
        .eq("id_nfe", nfeCompraId)
        .order("descricao", { ascending: true });

      if (error) throw error;
      return (data || []) as unknown as NfeCompraItem[];
    },
    enabled: !!nfeCompraId,
  });
};
