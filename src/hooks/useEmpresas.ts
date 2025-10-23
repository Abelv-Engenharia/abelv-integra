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
      console.log('useEmpresas - ccaId:', ccaId);
      if (!ccaId) {
        console.log('useEmpresas - sem ccaId, retornando vazio');
        return [];
      }

      console.log('useEmpresas - buscando subcentros_custos para cca_id:', ccaId);
      const { data, error } = await supabase
        .from("subcentros_custos")
        .select("empresa_sienge_id")
        .eq("cca_id", ccaId);

      console.log('useEmpresas - resultado subcentros_custos:', { data, error });

      if (error) throw error;
      
      // Buscar os nomes das empresas na tabela empresas_sienge
      if (!data || data.length === 0) {
        console.log('useEmpresas - nenhuma empresa vinculada ao CCA');
        return [];
      }
      
      const empresaIds = data.map((item: any) => item.empresa_sienge_id);
      console.log('useEmpresas - empresaIds:', empresaIds);
      
      const { data: empresasSienge, error: siengeError } = await supabase
        .from("empresas_sienge" as any)
        .select("id, id_sienge, name")
        .in("id", empresaIds)
        .order("name", { ascending: true });
      
      console.log('useEmpresas - resultado empresas_sienge:', { empresasSienge, siengeError });
      
      if (siengeError) throw siengeError;
      
      const resultado = ((empresasSienge || []) as any[]).map((empresa: any) => ({
        id: empresa.id_sienge,
        name: empresa.name,
        ativo: true
      })) as Empresa[];
      
      console.log('useEmpresas - resultado final:', resultado);
      return resultado;
    },
    enabled: !!ccaId,
  });
};
