import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Credor {
  id: string;
  razao: string;
  fantasia?: string;
  cnpj_cpf?: string;
  id_sienge: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useCredores = () => {
  return useQuery({
    queryKey: ["credores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credores")
        .select("*")
        .eq("ativo", true)
        .order("razao", { ascending: true });

      if (error) throw error;
      return (data || []) as Credor[];
    },
  });
};
