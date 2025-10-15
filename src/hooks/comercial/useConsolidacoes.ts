import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Consolidacao {
  id: string;
  proposta_id: string;
  data_assinatura_contrato_real: string;
  data_termino_contrato_prevista: string;
  data_entrega_orcamento_executivo_prevista: string;
  data_entrega_orcamento_executivo_real: string;
  created_at?: string;
  updated_at?: string;
}

export const useConsolidacoes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: consolidacoes = [], isLoading } = useQuery({
    queryKey: ["consolidacoes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consolidacoes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Consolidacao[];
    },
  });

  const createConsolidacao = useMutation({
    mutationFn: async (consolidacao: Omit<Consolidacao, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("consolidacoes")
        .insert([consolidacao])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consolidacoes"] });
      toast({
        title: "Sucesso!",
        description: "Consolidação criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar consolidação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateConsolidacao = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Consolidacao> & { id: string }) => {
      const { data, error } = await supabase
        .from("consolidacoes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consolidacoes"] });
      toast({
        title: "Sucesso!",
        description: "Consolidação atualizada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar consolidação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    consolidacoes,
    isLoading,
    createConsolidacao: createConsolidacao.mutateAsync,
    updateConsolidacao: updateConsolidacao.mutateAsync,
    isCreating: createConsolidacao.isPending,
    isUpdating: updateConsolidacao.isPending,
  };
};

export const useConsolidacao = (propostaId: string | undefined) => {
  const { toast } = useToast();

  const { data: consolidacao, isLoading } = useQuery({
    queryKey: ["consolidacao", propostaId],
    queryFn: async () => {
      if (!propostaId) return null;

      const { data, error } = await supabase
        .from("consolidacoes")
        .select("*")
        .eq("proposta_id", propostaId)
        .maybeSingle();

      if (error) throw error;
      return data as Consolidacao | null;
    },
    enabled: !!propostaId,
  });

  return {
    consolidacao,
    isLoading,
  };
};
