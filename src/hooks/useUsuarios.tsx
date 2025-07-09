
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

  // Verificar permissões do usuário atual através de uma função security definer
  const { data: userPermissions } = useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        // Usar a função security definer para evitar recursão RLS
        const { data, error } = await supabase
          .rpc('get_user_permissions', { user_uuid: user.id });

        if (error) {
          console.error("Erro ao buscar permissões:", error);
          return null;
        }

        return data?.permissoes as Permissoes || null;
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

  // Buscar usuários usando função security definer
  const { 
    data: usersData, 
    isLoading: loadingUsuarios,
    refetch: refetchUsers,
    error: usersError
  } = useQuery({
    queryKey: ['admin-usuarios'],
    queryFn: async () => {
      if (!canManageUsers) {
        console.log("Usuário não tem permissão para administrar usuários");
        return { users: [], total: 0, count: 0 };
      }

      try {
        console.log("Buscando usuários através de função security definer...");
        
        // Usar função security definer para buscar usuários
        const { data: userData, error: userError } = await supabase
          .rpc('get_all_users_with_profiles');

        if (userError) {
          console.error("Erro ao buscar usuários:", userError);
          return { users: [], total: 0, count: 0 };
        }

        console.log("Usuários encontrados:", userData);

        // Mapear os dados para o formato esperado
        const users = userData?.map((item: any) => ({
          id: item.user_id,
          nome: item.nome || 'Sem nome',
          email: item.email || '',
          perfil: item.perfil_nome || 'Usuário',
          status: "Ativo"
        })) || [];

        return {
          users,
          total: users.length,
          count: users.length
        };
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return { users: [], total: 0, count: 0 };
      }
    },
    enabled: !!user && canManageUsers !== undefined,
    retry: 1,
    staleTime: 5 * 60 * 1000,
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

      // Atualizar perfil de acesso usando função security definer
      const profileId = profiles.find(p => p.nome === userData.perfil)?.id;
      if (profileId) {
        const { error: userPerfilError } = await supabase
          .rpc('update_user_profile', { 
            user_uuid: userId, 
            new_profile_id: profileId 
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

      // Usar função security definer para excluir usuário
      const { error } = await supabase
        .rpc('delete_user_and_profile', { user_uuid: userId });

      if (error) {
        console.error("Erro ao excluir usuário:", error);
        throw new Error("Erro ao excluir usuário");
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
    usuarios: usersData?.users || [],
    totalUsuarios: usersData?.total || 0,
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
