
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { User, AuthUserCreateValues, UserFormValues } from "@/types/users";
import { 
  fetchUsers, 
  createAuthUser, 
  updateUser, 
  deleteUser, 
  updateUserRole 
} from "@/services/authAdminService";
import { fetchProfiles } from "@/services/usuariosService";
import { useAuth } from "@/contexts/AuthContext";

export const useUsuarios = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buscar usuários com tratamento de erro melhorado
  const { 
    data: usersData, 
    isLoading: loadingUsuarios,
    refetch: refetchUsers,
    error: usersError
  } = useQuery({
    queryKey: ['admin-usuarios'],
    queryFn: async () => {
      try {
        const result = await fetchUsers(1, 100, '', '');
        return result;
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        // Se houver erro de permissão, retornar dados vazios em vez de falhar
        if (error instanceof Error && error.message.includes('User not allowed')) {
          return { users: [], total: 0, count: 0 };
        }
        throw error;
      }
    },
    enabled: !!user, // Só executar se o usuário estiver logado
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Buscar perfis
  const { data: profiles = [] } = useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles,
    staleTime: 10 * 60 * 1000
  });

  // Verificar se o usuário tem permissões de administrador
  const { data: userPermissions } = useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        // Buscar o perfil do usuário atual para verificar permissões
        const { data, error } = await import("@/integrations/supabase/client").then(({ supabase }) =>
          supabase
            .from('usuario_perfis')
            .select(`
              perfil_id,
              perfis (
                permissoes
              )
            `)
            .eq('usuario_id', user.id)
            .single()
        );

        if (error) {
          console.error("Erro ao buscar permissões:", error);
          return null;
        }

        return data?.perfis?.permissoes || null;
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        return null;
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000
  });

  // Verificar se o usuário pode administrar usuários
  const canManageUsers = userPermissions?.admin_usuarios === true;

  // Mutation para criar usuário
  const createUsuarioMutation = useMutation({
    mutationFn: async (userData: AuthUserCreateValues) => {
      if (!canManageUsers) {
        throw new Error("Você não tem permissão para criar usuários");
      }

      try {
        console.log("Criando usuário:", userData);
        
        const authUserData = await createAuthUser(
          userData.email, 
          userData.password, 
          { nome: userData.nome }
        );
        
        if (!authUserData?.user?.id) {
          throw new Error("Falha ao criar usuário: ID não retornado");
        }
        
        const perfilId = parseInt(userData.perfil);
        await updateUserRole(authUserData.user.id, perfilId);
        
        return authUserData;
      } catch (error) {
        console.error("Erro na mutation de criação:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao criar usuário:", error);
      const errorMessage = error?.message || "Erro ao criar usuário";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  // Mutation para atualizar usuário
  const updateUsuarioMutation = useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: UserFormValues }) => {
      if (!canManageUsers) {
        throw new Error("Você não tem permissão para editar usuários");
      }

      await updateUser(userId, {
        user_metadata: { nome: userData.nome },
        email: userData.email
      });
      
      const profileId = profiles.find(p => p.nome === userData.perfil)?.id;
      if (profileId) {
        await updateUserRole(userId, profileId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
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
      
      await deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
      });
    },
    onError: (error: any) => {
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
    createUsuarioMutation,
    updateUsuarioMutation,
    deleteUsuarioMutation,
    refetchUsers
  };
};
