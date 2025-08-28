
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ItemVerificacao {
  id: string;
  descricao: string;
  categoria?: string;
}

export interface ModeloInspecao {
  id: string;
  nome: string;
  descricao: string;
  tipo_inspecao_id: string;
  campos_cabecalho: string[];
  itens_verificacao: ItemVerificacao[];
  ativo: boolean;
  created_at: string;
  updated_at: string;
  tipos_inspecao_sms?: {
    nome: string;
  };
}

export const useModelosInspecao = () => {
  const queryClient = useQueryClient();

  const { data: modelos = [], isLoading } = useQuery({
    queryKey: ['modelos-inspecao-sms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modelos_inspecao_sms')
        .select(`
          *,
          tipos_inspecao_sms(nome)
        `)
        .eq('ativo', true)
        .order('nome');
      
      if (error) throw error;
      return data as ModeloInspecao[];
    },
  });

  const createModelo = useMutation({
    mutationFn: async (modelo: Omit<ModeloInspecao, 'id' | 'created_at' | 'updated_at' | 'ativo'>) => {
      const { data, error } = await supabase
        .from('modelos_inspecao_sms')
        .insert([modelo])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelos-inspecao-sms'] });
      toast({
        title: "Modelo criado",
        description: "Modelo de inspeção criado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar modelo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateModelo = useMutation({
    mutationFn: async ({ id, ...modelo }: Partial<ModeloInspecao> & { id: string }) => {
      const { data, error } = await supabase
        .from('modelos_inspecao_sms')
        .update(modelo)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelos-inspecao-sms'] });
      toast({
        title: "Modelo atualizado",
        description: "Modelo de inspeção atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar modelo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteModelo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('modelos_inspecao_sms')
        .update({ ativo: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelos-inspecao-sms'] });
      toast({
        title: "Modelo excluído",
        description: "Modelo de inspeção excluído com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir modelo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    modelos,
    isLoading,
    createModelo: createModelo.mutate,
    updateModelo: updateModelo.mutate,
    deleteModelo: deleteModelo.mutate,
    isCreating: createModelo.isPending,
    isUpdating: updateModelo.isPending,
    isDeleting: deleteModelo.isPending,
  };
};
