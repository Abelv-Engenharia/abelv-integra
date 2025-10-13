import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NfeCompraItem {
  id: string;
  id_nfe?: string;
  descricao: string;
  id_unidade: number;
  quantidade: number;
  unitario: number;
  id_cca_sienge: number;
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
