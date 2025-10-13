import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type DisciplinaEngenhariaMatricial = "ELETRICA" | "MECANICA" | "AMBAS";

export interface UsuarioEngenhariaMatricial {
  id: string;
  usuario_id: string;
  nome: string;
  email: string;
  disciplina_preferida: DisciplinaEngenhariaMatricial;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useUsuariosEngenhariaMatricial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar todos os usuários com join na tabela profiles
  const { data: usuarios, isLoading, error, refetch } = useQuery({
    queryKey: ["usuarios-engenharia-matricial"],
    queryFn: async () => {
      // Primeiro buscar os usuários da engenharia matricial
      const { data: usuariosEM, error: errorEM } = await supabase
        .from("usuarios_engenharia_matricial")
        .select("*")
        .order("created_at", { ascending: false });

      if (errorEM) throw errorEM;
      if (!usuariosEM || usuariosEM.length === 0) return [];

      // Buscar os dados dos profiles
      const usuarioIds = usuariosEM.map((u) => u.usuario_id);
      const { data: profiles, error: errorProfiles } = await supabase
        .from("profiles")
        .select("id, nome, email")
        .in("id", usuarioIds);

      if (errorProfiles) throw errorProfiles;

      // Mapear os dados combinados
      const profilesMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      return usuariosEM.map((item) => {
        const profile = profilesMap.get(item.usuario_id);
        return {
          id: item.id,
          usuario_id: item.usuario_id,
          nome: profile?.nome || "",
          email: profile?.email || "",
          disciplina_preferida: item.disciplina_preferida,
          ativo: item.ativo,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      }) as UsuarioEngenhariaMatricial[];
    },
  });

  // Criar novo usuário
  const criarUsuario = useMutation({
    mutationFn: async (dados: {
      usuario_id: string;
      disciplina_preferida: DisciplinaEngenhariaMatricial;
      ativo: boolean;
    }) => {
      const { data, error } = await supabase
        .from("usuarios_engenharia_matricial")
        .insert([dados])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios-engenharia-matricial"] });
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário",
        variant: "destructive",
      });
    },
  });

  // Atualizar usuário
  const atualizarUsuario = useMutation({
    mutationFn: async (dados: {
      id: string;
      disciplina_preferida: DisciplinaEngenhariaMatricial;
      ativo: boolean;
    }) => {
      const { data, error } = await supabase
        .from("usuarios_engenharia_matricial")
        .update({
          disciplina_preferida: dados.disciplina_preferida,
          ativo: dados.ativo,
        })
        .eq("id", dados.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios-engenharia-matricial"] });
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário",
        variant: "destructive",
      });
    },
  });

  // Deletar usuário
  const deletarUsuario = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("usuarios_engenharia_matricial")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios-engenharia-matricial"] });
      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao deletar usuário",
        variant: "destructive",
      });
    },
  });

  return {
    usuarios: usuarios || [],
    isLoading,
    error,
    refetch,
    criarUsuario: criarUsuario.mutateAsync,
    atualizarUsuario: atualizarUsuario.mutateAsync,
    deletarUsuario: deletarUsuario.mutateAsync,
    isCreating: criarUsuario.isPending,
    isUpdating: atualizarUsuario.isPending,
    isDeleting: deletarUsuario.isPending,
  };
};
