import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Segmento {
  id: string;
  nome: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useSegmentos = () => {
  const queryClient = useQueryClient();

  const { data: segmentos = [], isLoading } = useQuery({
    queryKey: ["segmentos-comercial"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("segmentos_comercial")
        .select("*")
        .order("nome");

      if (error) throw error;
      return data as Segmento[];
    },
  });

  const addSegmento = useMutation({
    mutationFn: async (nome: string) => {
      const { data, error } = await supabase
        .from("segmentos_comercial")
        .insert({ nome })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segmentos-comercial"] });
      toast.success("Segmento adicionado com sucesso");
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.error("Este segmento já existe");
      } else {
        toast.error("Erro ao adicionar segmento");
      }
    },
  });

  const updateSegmento = useMutation({
    mutationFn: async ({ id, nome, ativo }: { id: string; nome: string; ativo: boolean }) => {
      const { data, error } = await supabase
        .from("segmentos_comercial")
        .update({ nome, ativo })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segmentos-comercial"] });
      toast.success("Segmento atualizado com sucesso");
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.error("Este nome de segmento já existe");
      } else {
        toast.error("Erro ao atualizar segmento");
      }
    },
  });

  const removeSegmento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("segmentos_comercial")
        .update({ ativo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segmentos-comercial"] });
      toast.success("Segmento removido com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover segmento");
    },
  });

  return {
    segmentos,
    isLoading,
    addSegmento,
    updateSegmento,
    removeSegmento,
  };
};
