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

export const useNfeCompras = (ccaId?: number) => {
  return useQuery({
    queryKey: ["nfe_compras", ccaId],
    queryFn: async () => {
      let query = supabase
        .from("nfe_compra" as any)
        .select(`
          *,
          itens:nfe_compra_itens(
            id_cca_sienge
          )
        `)
        .order("emissao", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      
      // Se houver filtro de CCA, buscar os id_sienge dos subcentros
      if (ccaId && data) {
        const { data: subcentros } = await supabase
          .from("subcentros_custos" as any)
          .select("id_sienge")
          .eq("cca_id", ccaId);
        
        const idsSubcentros = subcentros?.map((s: any) => s.id_sienge) || [];
        
        // Filtrar apenas NFEs que possuem itens com esses subcentros
        const filtered = data.filter((nfe: any) => 
          nfe.itens?.some((item: any) => idsSubcentros.includes(item.id_cca_sienge))
        );
        
        return (filtered || []) as unknown as NfeCompra[];
      }
      
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
