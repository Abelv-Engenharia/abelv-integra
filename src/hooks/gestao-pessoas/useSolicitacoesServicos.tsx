import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type SolicitacaoServicoRow = Database["public"]["Tables"]["solicitacoes_servicos"]["Row"];
type SolicitacaoServicoInsert = Database["public"]["Tables"]["solicitacoes_servicos"]["Insert"];
type SolicitacaoServicoUpdate = Database["public"]["Tables"]["solicitacoes_servicos"]["Update"];

export function useSolicitacoesServicos() {
  const queryClient = useQueryClient();

  // Buscar todas as solicitações
  const { data: solicitacoes = [], isLoading, error } = useQuery({
    queryKey: ["solicitacoes_servicos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solicitacoes_servicos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SolicitacaoServicoRow[];
    },
  });

  // Criar nova solicitação
  const createSolicitacao = useMutation({
    mutationFn: async (novaSolicitacao: SolicitacaoServicoInsert) => {
      const { data, error } = await supabase
        .from("solicitacoes_servicos")
        .insert(novaSolicitacao)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solicitacoes_servicos"] });
      toast.success("Solicitação criada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar solicitação:", error);
      toast.error("Erro ao criar solicitação");
    },
  });

  // Atualizar solicitação
  const updateSolicitacao = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: SolicitacaoServicoUpdate }) => {
      const { data, error } = await supabase
        .from("solicitacoes_servicos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solicitacoes_servicos"] });
    },
    onError: (error) => {
      console.error("Erro ao atualizar solicitação:", error);
      toast.error("Erro ao atualizar solicitação");
    },
  });

  // Deletar solicitação
  const deleteSolicitacao = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("solicitacoes_servicos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solicitacoes_servicos"] });
      toast.success("Solicitação excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir solicitação:", error);
      toast.error("Erro ao excluir solicitação");
    },
  });

  // Buscar solicitação por ID
  const getSolicitacaoById = (id: string) => {
    return solicitacoes.find((sol) => sol.id === id);
  };

  return {
    solicitacoes,
    isLoading,
    error,
    createSolicitacao: createSolicitacao.mutate,
    updateSolicitacao: updateSolicitacao.mutate,
    deleteSolicitacao: deleteSolicitacao.mutate,
    getSolicitacaoById,
    isCreating: createSolicitacao.isPending,
    isUpdating: updateSolicitacao.isPending,
    isDeleting: deleteSolicitacao.isPending,
  };
}
