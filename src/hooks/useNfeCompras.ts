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
  credor?: {
    razao: string;
  };
  empresa?: {
    name: string;
  };
}

export const useNfeCompras = (ccaId?: number, excludeAlocadas: boolean = false) => {
  return useQuery({
    queryKey: ["nfe_compras", ccaId, excludeAlocadas],
    queryFn: async () => {
      let query = supabase
        .from("nfe_compra" as any)
        .select(`
          *,
          itens:nfe_compra_itens(
            id_cca_sienge
          ),
          credor:credores!nfe_compra_id_credor_fkey(
            razao
          ),
          empresa:empresas_sienge!nfe_compra_id_empresa_fkey(
            name
          )
        `)
        .order("emissao", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      
      let filteredData = data || [];
      
      // Se houver filtro de CCA, buscar os id_sienge dos subcentros
      if (ccaId && filteredData) {
        const { data: subcentros } = await supabase
          .from("subcentros_custos" as any)
          .select("id_sienge")
          .eq("cca_id", ccaId);
        
        const idsSubcentros = subcentros?.map((s: any) => s.id_sienge) || [];
        
        // Filtrar apenas NFEs que possuem itens com esses subcentros
        filteredData = filteredData.filter((nfe: any) => 
          nfe.itens?.some((item: any) => idsSubcentros.includes(item.id_cca_sienge))
        );
      }
      
      // Se deve excluir alocadas, buscar NFEs já alocadas
      if (excludeAlocadas && filteredData.length > 0) {
        const { data: movimentacoes } = await supabase
          .from("estoque_movimentacoes_entradas")
          .select("item_nfe_id");
        
        const itemIds = movimentacoes?.map(m => m.item_nfe_id).filter(Boolean) || [];
        
        if (itemIds.length > 0) {
          const { data: itens } = await supabase
            .from("nfe_compra_itens")
            .select("id_nfe")
            .in("id", itemIds);
          
          const nfesAlocadas = [...new Set(itens?.map(i => i.id_nfe).filter(Boolean) || [])];
          
          // Filtrar NFEs já alocadas
          filteredData = filteredData.filter((nfe: any) => !nfesAlocadas.includes(nfe.id));
        }
      }
      
      return (filteredData || []) as unknown as NfeCompra[];
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
