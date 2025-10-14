import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Vendedor {
  id: string;
  usuario_id: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    nome: string;
    email: string;
  };
}

export const useVendedores = () => {
  const queryClient = useQueryClient();

  const { data: vendedores = [], isLoading } = useQuery({
    queryKey: ["vendedores-comercial"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendedores_comercial")
        .select(`
          *,
          profiles:usuario_id (
            id,
            nome,
            email
          )
        `)
        .order("profiles(nome)");

      if (error) throw error;
      return data as Vendedor[];
    },
  });

  const { data: usuarios = [], isLoading: isLoadingUsuarios } = useQuery({
    queryKey: ["usuarios-disponiveis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, nome, email")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });

  const addVendedor = useMutation({
    mutationFn: async (usuarioId: string) => {
      const { data, error } = await supabase
        .from("vendedores_comercial")
        .insert({ usuario_id: usuarioId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedores-comercial"] });
      toast.success("Vendedor adicionado com sucesso");
    },
    onError: (error: any) => {
      if (error.code === "23505") {
        toast.error("Este usuário já é um vendedor");
      } else {
        toast.error("Erro ao adicionar vendedor");
      }
    },
  });

  const updateVendedor = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { data, error } = await supabase
        .from("vendedores_comercial")
        .update({ ativo })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedores-comercial"] });
      toast.success("Vendedor atualizado com sucesso");
    },
    onError: () => {
      toast.error("Erro ao atualizar vendedor");
    },
  });

  const removeVendedor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vendedores_comercial")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendedores-comercial"] });
      toast.success("Vendedor removido com sucesso");
    },
    onError: () => {
      toast.error("Erro ao remover vendedor");
    },
  });

  return {
    vendedores,
    usuarios,
    isLoading,
    isLoadingUsuarios,
    addVendedor,
    updateVendedor,
    removeVendedor,
  };
};
