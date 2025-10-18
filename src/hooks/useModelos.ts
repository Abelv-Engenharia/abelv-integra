import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Modelo {
  id: string;
  tipo: string;
  nome: string;
  descricao: string | null;
  arquivo_url: string;
  arquivo_nome: string;
  codigos_disponiveis: string[];
  versao: number;
  ativo: boolean;
  created_at: string;
  created_by: string | null;
}

interface CreateModeloData {
  tipo: string;
  nome: string;
  descricao?: string;
  arquivo_url: string;
  arquivo_nome: string;
  codigos_disponiveis: string[];
}

export const useModelos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: modelos = [], isLoading } = useQuery({
    queryKey: ["modelos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documentacao_modelos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Modelo[];
    },
  });

  const createModelo = useMutation({
    mutationFn: async (dados: CreateModeloData) => {
      const { data, error } = await supabase
        .from("documentacao_modelos")
        .insert({
          tipo: dados.tipo,
          nome: dados.nome,
          descricao: dados.descricao || null,
          arquivo_url: dados.arquivo_url,
          arquivo_nome: dados.arquivo_nome,
          codigos_disponiveis: dados.codigos_disponiveis,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modelos"] });
      toast({
        title: "Modelo cadastrado",
        description: "Template salvo com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cadastrar modelo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteModelo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("documentacao_modelos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modelos"] });
      toast({
        title: "Modelo excluído",
        description: "Template removido com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir modelo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const modelosAtivos = modelos.filter((m) => m.ativo);
  const tiposUnicos = new Set(modelos.map((m) => m.tipo));

  return {
    modelos,
    modelosAtivos,
    totalModelos: modelos.length,
    totalAtivos: modelosAtivos.length,
    totalTipos: tiposUnicos.size,
    isLoading,
    createModelo,
    deleteModelo,
  };
};
