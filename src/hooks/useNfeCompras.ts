import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface NfeCompra {
  id: string;
  numero: string;
  id_documento: string;
  emissao: string;
  Movimenbto: string;
  id_empresa: number;
  id_credor: string;
  titulo?: number;
  sequencial: number;
  PC_Abelv?: string;
  PC_Cliente?: string;
  created_at?: string;
}

export const useNfeCompras = () => {
  return useQuery({
    queryKey: ["nfe_compras"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nfe_compra" as any)
        .select("*")
        .order("emissao", { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as NfeCompra[];
    },
  });
};

export const useNfeCompra = (id: string | undefined) => {
  return useQuery({
    queryKey: ["nfe_compra", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("nfe_compra" as any)
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as NfeCompra | null;
    },
    enabled: !!id,
  });
};
