import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Empresa {
  id: number;
  name: string;
  ativo: boolean;
}

export const useEmpresas = (ccaId?: number) => {
  return useQuery({
    queryKey: ["empresas_sienge", ccaId],
    queryFn: async () => {
      if (!ccaId) return [];

      const { data, error } = await supabase
        .from("empresa_ccas")
        .select(`
          empresa_id,
          empresas!inner(id, nome, cnpj, ativo)
        `)
        .eq("cca_id", ccaId)
        .eq("empresas.ativo", true);

      if (error) throw error;
      
      // Buscar os nomes das empresas na tabela empresas_sienge
      if (!data || data.length === 0) return [];
      
      const empresaIds = data.map((item: any) => item.empresa_id);
      
      const { data: empresasSienge, error: siengeError } = await supabase
        .from("empresas_sienge" as any)
        .select("id, name")
        .in("id", empresaIds)
        .eq("ativo", true)
        .order("name", { ascending: true });
      
      if (siengeError) throw siengeError;
      
      return ((empresasSienge || []) as any[]).map((empresa: any) => ({
        id: empresa.id,
        name: empresa.name,
        ativo: true
      })) as Empresa[];
    },
    enabled: !!ccaId,
  });
};
