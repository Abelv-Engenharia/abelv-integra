import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PropostaComercial {
  id: string;
  pc: string;
  data_saida_proposta: string;
  orcamento_duplicado: 'Sim' | 'Não';
  segmento_id: string;
  cliente: string;
  obra: string;
  vendedor_id: string;
  numero_revisao: number;
  valor_venda: number;
  margem_percentual: number;
  margem_valor: number;
  status: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export function usePropostasComerciais() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: propostas = [], isLoading } = useQuery({
    queryKey: ["propostas-comerciais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("propostas_comerciais")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PropostaComercial[];
    },
  });

  const createProposta = useMutation({
    mutationFn: async (proposta: Omit<PropostaComercial, "id" | "created_at" | "updated_at" | "created_by" | "updated_by">) => {
      const { data, error } = await supabase
        .from("propostas_comerciais")
        .insert(proposta)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propostas-comerciais"] });
      toast({
        title: "Proposta criada!",
        description: "A proposta foi cadastrada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar proposta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProposta = useMutation({
    mutationFn: async ({ id, ...proposta }: Partial<PropostaComercial> & { id: string }) => {
      const { data, error } = await supabase
        .from("propostas_comerciais")
        .update(proposta)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propostas-comerciais"] });
      toast({
        title: "Proposta atualizada!",
        description: "A proposta foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar proposta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProposta = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("propostas_comerciais")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propostas-comerciais"] });
      toast({
        title: "Proposta deletada!",
        description: "A proposta foi removida com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao deletar proposta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    propostas,
    isLoading,
    createProposta: createProposta.mutate,
    updateProposta: updateProposta.mutate,
    deleteProposta: deleteProposta.mutate,
    isCreating: createProposta.isPending,
    isUpdating: updateProposta.isPending,
    isDeleting: deleteProposta.isPending,
  };
}

export function useProposta(id?: string) {
  const { toast } = useToast();

  const { data: proposta, isLoading } = useQuery({
    queryKey: ["proposta-comercial", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("propostas_comerciais")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as PropostaComercial | null;
    },
    enabled: !!id,
  });

  return {
    proposta,
    isLoading,
  };
}
