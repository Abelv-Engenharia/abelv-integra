
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
  tipo_inspecao_id: string;
  arquivo_modelo_url: string;
  campos_substituicao: any;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  tipos_inspecao_sms?: {
    nome: string;
  };
  // Propriedades adicionais para compatibilidade com o frontend
  descricao?: string;
  campos_cabecalho?: string[];
  itens_verificacao?: ItemVerificacao[];
}

export const useModelosInspecao = () => {
  const queryClient = useQueryClient();

  const { data: modelos = [], isLoading } = useQuery({
    queryKey: ['modelos-inspecao-sms'],
    queryFn: async () => {
      console.log("Buscando modelos de inspeção...");
      const { data, error } = await supabase
        .from('modelos_inspecao_sms')
        .select(`
          *,
          tipos_inspecao_sms(nome)
        `)
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error("Erro ao buscar modelos:", error);
        throw error;
      }
      
      console.log("Modelos retornados:", data);
      
      // Mapear os dados do banco para o formato esperado pelo frontend
      return (data || []).map(modelo => ({
        id: modelo.id,
        nome: modelo.nome,
        tipo_inspecao_id: modelo.tipo_inspecao_id,
        arquivo_modelo_url: modelo.arquivo_modelo_url,
        campos_substituicao: modelo.campos_substituicao,
        ativo: modelo.ativo,
        created_at: modelo.created_at,
        updated_at: modelo.updated_at,
        tipos_inspecao_sms: modelo.tipos_inspecao_sms,
        // Valores padrão para compatibilidade
        descricao: '',
        campos_cabecalho: [],
        itens_verificacao: []
      })) as ModeloInspecao[];
    },
  });

  const createModelo = useMutation({
    mutationFn: async (modelo: Omit<ModeloInspecao, 'id' | 'created_at' | 'updated_at' | 'ativo'>) => {
      console.log("Criando modelo:", modelo);
      const { data, error } = await supabase
        .from('modelos_inspecao_sms')
        .insert([{
          nome: modelo.nome,
          tipo_inspecao_id: modelo.tipo_inspecao_id,
          arquivo_modelo_url: modelo.arquivo_modelo_url || '',
          campos_substituicao: modelo.campos_substituicao || {}
        }])
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao criar modelo:", error);
        throw error;
      }
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
      console.error("Erro na criação:", error);
      toast({
        title: "Erro ao criar modelo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateModelo = useMutation({
    mutationFn: async ({ id, ...modelo }: Partial<ModeloInspecao> & { id: string }) => {
      console.log("Atualizando modelo:", id, modelo);
      const { data, error } = await supabase
        .from('modelos_inspecao_sms')
        .update({
          nome: modelo.nome,
          tipo_inspecao_id: modelo.tipo_inspecao_id,
          arquivo_modelo_url: modelo.arquivo_modelo_url,
          campos_substituicao: modelo.campos_substituicao
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao atualizar modelo:", error);
        throw error;
      }
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
      console.error("Erro na atualização:", error);
      toast({
        title: "Erro ao atualizar modelo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteModelo = useMutation({
    mutationFn: async (id: string) => {
      console.log("Excluindo modelo:", id);
      const { error } = await supabase
        .from('modelos_inspecao_sms')
        .update({ ativo: false })
        .eq('id', id);
      
      if (error) {
        console.error("Erro ao excluir modelo:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelos-inspecao-sms'] });
      toast({
        title: "Modelo excluído",
        description: "Modelo de inspeção excluído com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error("Erro na exclusão:", error);
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
