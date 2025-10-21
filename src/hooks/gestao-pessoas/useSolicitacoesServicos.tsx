import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type SolicitacaoServicoRow = Database["public"]["Tables"]["solicitacoes_servicos"]["Row"];
type SolicitacaoServicoInsert = Database["public"]["Tables"]["solicitacoes_servicos"]["Insert"];
type SolicitacaoServicoUpdate = Database["public"]["Tables"]["solicitacoes_servicos"]["Update"];

export function useSolicitacoesServicos() {
  const queryClient = useQueryClient();

  // Buscar todas as solicitações com dados específicos
  const { data: solicitacoes = [], isLoading, error } = useQuery({
    queryKey: ["solicitacoes_servicos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("solicitacoes_servicos")
        .select(`
          *,
          dados:solicitacoes_dados_especificos(dados)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      console.log("=== DEBUG HOOK: Dados brutos do Supabase ===", data);
      
      // Processar dados para extrair o JSONB
      const processed = (data || []).map((row: any) => {
        console.log("=== DEBUG HOOK: Processando row ===", row);
        console.log("row.dados:", row.dados);
        const dadosExtraidos = row.dados?.[0]?.dados || null;
        console.log("Dados extraídos:", dadosExtraidos);
        
        return {
          ...row,
          dados: dadosExtraidos
        };
      });
      
      console.log("=== DEBUG HOOK: Dados processados ===", processed);
      return processed;
    },
  });

  // Criar nova solicitação
  const createSolicitacao = useMutation({
    mutationFn: async (novaSolicitacao: any) => {
      const { dados_especificos, ...solicitacaoBase } = novaSolicitacao;
      
      // Inserir solicitação base
      const { data: solicitacao, error: errorSolicitacao } = await supabase
        .from("solicitacoes_servicos")
        .insert(solicitacaoBase)
        .select()
        .single();

      if (errorSolicitacao) throw errorSolicitacao;

      // Inserir dados específicos se existirem
      if (dados_especificos && Object.keys(dados_especificos).length > 0) {
        const { error: errorEspecificos } = await supabase
          .from("solicitacoes_dados_especificos")
          .insert({
            solicitacao_id: solicitacao.id,
            dados: dados_especificos,
          });

        if (errorEspecificos) {
          console.error("Erro ao salvar dados específicos:", errorEspecificos);
        }
      }

      return solicitacao;
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
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { dados_especificos, ...updatesBase } = updates;
      
      // Atualizar solicitação base
      const { data, error } = await supabase
        .from("solicitacoes_servicos")
        .update(updatesBase)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar dados específicos se existirem
      if (dados_especificos) {
        const { error: errorEspecificos } = await supabase
          .from("solicitacoes_dados_especificos")
          .update({ dados: dados_especificos })
          .eq("solicitacao_id", id);

        if (errorEspecificos) {
          console.error("Erro ao atualizar dados específicos:", errorEspecificos);
        }
      }

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
