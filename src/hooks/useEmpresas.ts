import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Empresa {
  id: number;
  name: string;
  ativo: boolean;
}

export const useEmpresas = () => {
  return useQuery({
    queryKey: ["empresas_sienge"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("empresas_sienge" as any)
        .select("*")
        .eq("ativo", true)
        .order("name", { ascending: true });

      if (error) throw error;
      return (data || []) as unknown as Empresa[];
    },
  });
};
