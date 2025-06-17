
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { User, AuthUserCreateValues, UserFormValues, Permissoes } from "@/types/users";
import { 
  fetchUsers, 
  createAuthUser, 
  updateUser, 
  deleteUser, 
  updateUserRole 
} from "@/services/authAdminService";
import { fetchProfiles } from "@/services/usuariosService";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useUsuarios = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Verificar permissões do usuário atual através do perfil
  const { data: userPermissions } = useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('usuario_perfis')
          .select(`
            perfil_id,
            perfis (
              permissoes
            )
          `)
          .eq('usuario_id', user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar permissões:", error);
          return null;
        }

        return (data?.perfis?.permissoes as unknown) as Permissoes || null;
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

  // Buscar usuários usando a tabela profiles em vez da Admin API
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
        // Buscar usuários através da tabela profiles e relacionamentos
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            nome,
            email,
            created_at
          `);

        if (profilesError) {
          console.error("Erro ao buscar perfis:", profilesError);
          return { users: [], total: 0, count: 0 };
        }

        // Buscar as relações de perfis de usuários
        const { data: userPerfis, error: userPerfilsError } = await supabase
          .from('usuario_perfis')
          .select(`
            usuario_id,
            perfis (
              nome
            )
          `);

        if (userPerfilsError) {
          console.error("Erro ao buscar perfis de usuários:", userPerfilsError);
        }

        // Mapear os dados para o formato esperado
        const users = profiles?.map(profile => {
          const userPerfil = userPerfis?.find(up => up.usuario_id === profile.id);
          const perfilNome = userPerfil?.perfis?.nome || 'Usuário';

          return {
            id: profile.id,
            nome: profile.nome || 'Sem nome',
            email: profile.email || '',
            perfil: perfilNome,
            status: "Ativo"
          };
        }) || [];

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

  // Mutation para criar usuário usando a edge function
  const createUsuarioMutation = useMutation({
    mutationFn: async (userData: AuthUserCreateValues) => {
      if (!canManageUsers) {
        throw new Error("Você não tem permissão para criar usuários");
      }

      try {
        console.log("Criando usuário via edge function:", userData);
        
        // Usar a edge function em vez do signUp direto
        const result = await createAuthUser(userData.email, userData.password, {
          nome: userData.nome,
          perfil_id: parseInt(userData.perfil)
        });

        console.log("Usuário criado com sucesso:", result);
        return result;
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
      let errorMessage = "Erro ao criar usuário";
      
      if (error?.message?.includes("rate limit")) {
        errorMessage = "Limite de criação de usuários excedido. Tente novamente em alguns minutos.";
      } else if (error?.message?.includes("User already registered")) {
        errorMessage = "Este email já está cadastrado no sistema.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
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

      // Atualizar na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          nome: userData.nome,
          email: userData.email
        })
        .eq('id', userId);

      if (profileError) {
        throw new Error("Erro ao atualizar perfil do usuário");
      }

      // Atualizar perfil de acesso
      const profileId = profiles.find(p => p.nome === userData.perfil)?.id;
      if (profileId) {
        const { error: userPerfilError } = await supabase
          .from('usuario_perfis')
          .update({ perfil_id: profileId })
          .eq('usuario_id', userId);

        if (userPerfilError) {
          throw new Error("Erro ao atualizar perfil de acesso");
        }
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
      
      // Deletar da tabela profiles (cascade deve cuidar do resto)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new Error("Erro ao excluir usuário");
      }
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
