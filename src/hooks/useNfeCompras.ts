import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NfeCompra {
  id: string;
  numero_nota: string;
  serie: string;
  data_emissao: string;
  data_movimento: string;
  cca_id: number;
  fornecedor: string;
  cnpj_fornecedor: string;
  valor_total: number;
  chave_acesso?: string;
  created_at?: string;
}

export const useNfeCompras = () => {
  return useQuery({
    queryKey: ["nfe_compras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nfe_compras")
        .select("*")
        .order("data_emissao", { ascending: false });

      if (error) throw error;
      return data as NfeCompra[];
    },
  });
};

export const useNfeCompra = (id: string | undefined) => {
  return useQuery({
    queryKey: ["nfe_compra", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("nfe_compras")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as NfeCompra;
    },
    enabled: !!id,
  });
};
