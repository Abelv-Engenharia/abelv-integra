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
      console.log("=== HOOK: Iniciando busca de solicitações ===");
      
      const { data, error } = await supabase
        .from("solicitacoes_servicos")
        .select(`
          *,
          dados:solicitacoes_dados_especificos(dados)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("=== HOOK: Erro ao buscar ===", error);
        throw error;
      }
      
      console.log("=== HOOK: Dados brutos ===", JSON.stringify(data, null, 2));
      
      // Processar dados para extrair o JSONB
      const processed = (data || []).map((row: any) => {
        // O Supabase retorna dados como objeto, não array
        const dadosExtraidos = row.dados?.dados || null;
        console.log(`=== HOOK: ID ${row.id} - Dados extraídos ===`, dadosExtraidos);
        
        return {
          ...row,
          dados: dadosExtraidos
        };
      });
      
      console.log("=== HOOK: Total processados ===", processed.length);
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
    onSuccess: async (solicitacao) => {
      queryClient.invalidateQueries({ queryKey: ["solicitacoes_servicos"] });
      toast.success("Solicitação criada com sucesso!");
      
      // Enviar notificação
      if (!solicitacao.responsavel_aprovacao_id) {
        console.warn('⚠️ Solicitação criada sem responsável de aprovação. Notificação não será enviada.');
        return;
      }
      
      try {
        console.log('📤 Enviando notificação para solicitação:', solicitacao.id);
        
        const { data: notifData, error: notifError } = await supabase.functions.invoke(
          'enviar-notificacao-solicitacao',
          {
            body: {
              evento: 'solicitacao_criada',
              solicitacao: {
                id: solicitacao.id,
                numeroSolicitacao: solicitacao.numero_solicitacao,
                solicitanteId: solicitacao.solicitante_id,
                solicitanteNome: solicitacao.solicitante_nome,
                tipoServico: solicitacao.tipo_servico,
                responsavelAprovacaoId: solicitacao.responsavel_aprovacao_id
              }
            }
          }
        );
        
        if (notifError) {
          console.error('❌ Erro ao invocar edge function:', notifError);
          toast.error('Solicitação criada, mas falha ao enviar notificação');
        } else {
          console.log('✅ Notificação enviada com sucesso:', notifData);
        }
      } catch (error) {
        console.error('❌ Erro ao enviar notificação:', error);
        toast.error('Solicitação criada, mas falha ao enviar notificação');
      }
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
