import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MetaAnual {
  id: string;
  ano: number;
  meta_anual: number;
  meta_t1: number;
  meta_t2: number;
  meta_t3: number;
  meta_t4: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useMetasAnuais = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: metas = [], isLoading } = useQuery({
    queryKey: ["metas-anuais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("metas_anuais")
        .select("*")
        .eq("ativo", true)
        .order("ano", { ascending: false });

      if (error) throw error;
      return data as MetaAnual[];
    },
  });

  const addMeta = useMutation({
    mutationFn: async (meta: {
      ano: number;
      meta_anual: number;
      meta_t1: number;
      meta_t2: number;
      meta_t3: number;
      meta_t4: number;
    }) => {
      const { data, error } = await supabase
        .from("metas_anuais")
        .insert([
          {
            ano: meta.ano,
            meta_anual: meta.meta_anual,
            meta_t1: meta.meta_t1,
            meta_t2: meta.meta_t2,
            meta_t3: meta.meta_t3,
            meta_t4: meta.meta_t4,
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("Já existe uma meta cadastrada para este ano.");
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metas-anuais"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao adicionar meta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMeta = useMutation({
    mutationFn: async (meta: {
      id: string;
      meta_anual: number;
      meta_t1: number;
      meta_t2: number;
      meta_t3: number;
      meta_t4: number;
    }) => {
      const { data, error } = await supabase
        .from("metas_anuais")
        .update({
          meta_anual: meta.meta_anual,
          meta_t1: meta.meta_t1,
          meta_t2: meta.meta_t2,
          meta_t3: meta.meta_t3,
          meta_t4: meta.meta_t4,
        })
        .eq("id", meta.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metas-anuais"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar meta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMeta = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("metas_anuais")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metas-anuais"] });
      toast({
        title: "Meta removida",
        description: "Meta anual foi removida com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover meta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    metas,
    isLoading,
    addMeta,
    updateMeta,
    deleteMeta,
  };
};
