
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { User, UserFormValues, Permissoes } from "@/types/users";
import { fetchProfiles } from "@/services/usuariosService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCreateUser } from "@/hooks/useCreateUser";

export const useUsuarios = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const createUserHook = useCreateUser();

  // Verificar permissões do usuário atual
  const { data: userPermissions } = useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        console.log("Buscando permissões para usuário:", user.id);
        
        // Buscar o perfil do usuário e suas permissões
        const { data: userPerfil, error: userPerfilError } = await supabase
          .from('usuario_perfis')
          .select(`
            perfil_id,
            perfis!inner (
              permissoes
            )
          `)
          .eq('usuario_id', user.id)
          .single();

        if (userPerfilError) {
          console.error("Erro ao buscar permissões:", userPerfilError);
          return null;
        }

        // Conversão segura de tipos com validação
        const rawPermissoes = userPerfil?.perfis?.permissoes;
        if (rawPermissoes && typeof rawPermissoes === 'object' && !Array.isArray(rawPermissoes)) {
          const permissoes = rawPermissoes as unknown as Permissoes;
          console.log("Permissões encontradas:", permissoes);
          return permissoes;
        }

        console.warn("Permissões não encontradas ou inválidas");
        return null;
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        return null;
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  // Verificar se o usuário pode administrar usuários
  const canManageUsers = userPermissions?.admin_usuarios === true;

  // Buscar usuários - simplificado e corrigido
  const { 
    data: usuarios = [], 
    isLoading: loadingUsuarios,
    refetch: refetchUsers,
    error: usersError
  } = useQuery({
    queryKey: ['admin-usuarios'],
    queryFn: async (): Promise<User[]> => {
      if (!canManageUsers) {
        console.log("Usuário não tem permissão para administrar usuários");
        return [];
      }

      try {
        console.log("Buscando usuários...");
        
        // Buscar todos os profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('nome');

        if (profilesError) {
          console.error("Erro ao buscar profiles:", profilesError);
          throw new Error("Erro ao buscar usuários");
        }

        if (!profiles || profiles.length === 0) {
          console.log("Nenhum perfil encontrado");
          return [];
        }

        // Buscar todos os relacionamentos usuario_perfis
        const { data: userPerfis, error: userPerfilError } = await supabase
          .from('usuario_perfis')
          .select(`
            usuario_id,
            perfil_id,
            perfis!inner (
              nome
            )
          `);

        if (userPerfilError) {
          console.error("Erro ao buscar usuario_perfis:", userPerfilError);
        }

        console.log("Profiles encontrados:", profiles.length);
        console.log("UserPerfis encontrados:", userPerfis?.length || 0);

        // Mapear os dados para o formato User
        const users: User[] = profiles.map((profile: any) => {
          // Encontrar o perfil de acesso do usuário
          const userPerfil = userPerfis?.find((up: any) => up.usuario_id === profile.id);
          const perfilNome = userPerfil?.perfis?.nome || 'Usuário';

          return {
            id: profile.id,
            nome: profile.nome || 'Sem nome',
            email: profile.email || '',
            perfil: perfilNome,
            status: "Ativo"
          };
        });

        console.log("Usuários mapeados:", users.length);
        return users;
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        throw error;
      }
    },
    enabled: !!user && canManageUsers !== undefined,
    retry: 2,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Buscar perfis
  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
    staleTime: 10 * 60 * 1000
  });

  // Mutation para atualizar usuário
  const updateUsuarioMutation = useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: UserFormValues }) => {
      if (!canManageUsers) {
        throw new Error("Você não tem permissão para editar usuários");
      }

      console.log("Atualizando usuário:", { userId, userData });

      // Atualizar na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          nome: userData.nome,
          email: userData.email
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Erro ao atualizar perfil:", profileError);
        throw new Error("Erro ao atualizar perfil do usuário");
      }

      // Atualizar perfil de acesso
      const profileId = profiles.find(p => p.nome === userData.perfil)?.id;
      if (profileId) {
        // Primeiro, remover associação existente
        await supabase
          .from('usuario_perfis')
          .delete()
          .eq('usuario_id', userId);

        // Depois, criar nova associação
        const { error: userPerfilError } = await supabase
          .from('usuario_perfis')
          .insert({
            usuario_id: userId,
            perfil_id: profileId
          });

        if (userPerfilError) {
          console.error("Erro ao atualizar perfil de acesso:", userPerfilError);
          throw new Error("Erro ao atualizar perfil de acesso");
        }
      }

      console.log("Usuário atualizado com sucesso");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao atualizar usuário:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário",
        variant: "destructive",
      });
    }
  });

  // Mutation para deletar usuário
  const deleteUsuarioMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!canManageUsers) {
        throw new Error("Você não tem permissão para excluir usuários");
      }
      
      console.log("Excluindo usuário:", userId);

      // Excluir da tabela usuario_perfis primeiro
      const { error: userPerfilError } = await supabase
        .from('usuario_perfis')
        .delete()
        .eq('usuario_id', userId);

      if (userPerfilError) {
        console.error("Erro ao excluir perfil de usuário:", userPerfilError);
        throw new Error("Erro ao excluir perfil de usuário");
      }

      // Excluir da tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error("Erro ao excluir perfil:", profileError);
        throw new Error("Erro ao excluir perfil");
      }

      console.log("Usuário excluído com sucesso");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao excluir usuário:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir usuário",
        variant: "destructive",
      });
    }
  });

  return {
    usuarios,
    totalUsuarios: usuarios.length,
    profiles,
    loadingUsuarios,
    usersError,
    canManageUsers,
    userPermissions,
    createUsuarioMutation: {
      mutate: createUserHook.createUser,
      isPending: createUserHook.isCreating,
      error: createUserHook.error,
      isSuccess: createUserHook.isSuccess
    },
    updateUsuarioMutation,
    deleteUsuarioMutation,
    refetchUsers
  };
};
