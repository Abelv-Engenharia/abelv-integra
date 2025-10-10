import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CCA {
  id: number;
  codigo: string;
  nome: string;
  tipo: string;
  ativo: boolean;
}

export const useCCAs = () => {
  return useQuery({
    queryKey: ["ccas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ccas")
        .select("*")
        .eq("ativo", true)
        .order("codigo");

      if (error) throw error;
      return data as CCA[];
    },
  });
};
