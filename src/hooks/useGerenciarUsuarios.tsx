
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { User, Profile, Permissoes } from "@/types/users";

export const useGerenciarUsuarios = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [canManageUsers, setCanManageUsers] = useState(false);

  // Verificar permissões do usuário
  useEffect(() => {
    const checkPermissions = async () => {
      if (!user?.id) return;

      try {
        const { data: userPerfil } = await supabase
          .from('usuario_perfis')
          .select(`
            perfil_id,
            perfis!inner (
              permissoes
            )
          `)
          .eq('usuario_id', user.id)
          .single();

        if (userPerfil?.perfis?.permissoes) {
          const permissoes = userPerfil.perfis.permissoes as unknown as Permissoes;
          setCanManageUsers(permissoes.admin_usuarios === true);
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setCanManageUsers(false);
      }
    };

    checkPermissions();
  }, [user?.id]);

  // Buscar usuários
  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['usuarios-gerenciamento'],
    queryFn: async (): Promise<User[]> => {
      if (!canManageUsers) return [];

      try {
        // Buscar profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('nome');

        if (profilesError) throw profilesError;

        // Buscar usuario_perfis
        const { data: userPerfis, error: userPerfilError } = await supabase
          .from('usuario_perfis')
          .select(`
            usuario_id,
            perfil_id,
            perfis!inner (
              nome
            )
          `);

        if (userPerfilError) throw userPerfilError;

        // Mapear dados
        return profiles.map((profile) => {
          const userPerfil = userPerfis?.find((up) => up.usuario_id === profile.id);
          const perfilNome = userPerfil?.perfis?.nome || 'Usuário';

          return {
            id: profile.id,
            nome: profile.nome || 'Sem nome',
            email: profile.email || '',
            perfil: perfilNome,
            status: profile.ativo ? 'Ativo' : 'Inativo'
          };
        });
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return [];
      }
    },
    enabled: canManageUsers,
    staleTime: 2 * 60 * 1000,
  });

  // Buscar perfis
  const { data: perfis = [] } = useQuery({
    queryKey: ['perfis'],
    queryFn: async (): Promise<Profile[]> => {
      try {
        const { data, error } = await supabase
          .from('perfis')
          .select('*')
          .order('nome');

        if (error) throw error;

        return data.map(perfil => ({
          id: perfil.id,
          nome: perfil.nome
        }));
      } catch (error) {
        console.error("Erro ao buscar perfis:", error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  // Mutation para criar usuário
  const createUserMutation = useMutation({
    mutationFn: async (userData: { nome: string; email: string; password: string; perfil: string }) => {
      if (!canManageUsers) {
        throw new Error("Você não tem permissão para criar usuários");
      }

      console.log("Iniciando criação de usuário:", userData);

      // Verificar se email já existe
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', userData.email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Erro ao verificar email existente:", checkError);
        throw new Error("Erro ao verificar disponibilidade do email");
      }

      if (existingProfile) {
        throw new Error("Este email já está sendo usado por outro usuário");
      }

      // Criar usuário no auth
      console.log("Criando usuário na autenticação...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: { nome: userData.nome },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        console.error("Erro ao criar usuário na autenticação:", authError);
        if (authError.message.includes('rate limit') || authError.message.includes('429')) {
          throw new Error("Limite de criação de usuários atingido. Aguarde alguns minutos antes de tentar novamente.");
        } else if (authError.message.includes('already registered')) {
          throw new Error("Este email já está registrado no sistema.");
        } else {
          throw new Error(`Erro ao criar usuário: ${authError.message}`);
        }
      }

      if (!authData?.user?.id) {
        throw new Error("Falha ao criar usuário: dados de resposta inválidos");
      }

      console.log("Usuário criado no auth, ID:", authData.user.id);

      // Aguardar para garantir consistência
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Criar perfil
      console.log("Criando perfil...");
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          nome: userData.nome,
          email: userData.email,
          ativo: true
        });

      if (profileError) {
        console.error("Erro ao criar perfil:", profileError);
        // Limpar usuário do auth em caso de erro
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupError) {
          console.error("Erro ao limpar usuário:", cleanupError);
        }
        throw new Error("Erro ao criar perfil do usuário");
      }

      // Associar perfil de acesso
      console.log("Associando perfil de acesso...");
      const { error: userPerfilError } = await supabase
        .from('usuario_perfis')
        .insert({
          usuario_id: authData.user.id,
          perfil_id: parseInt(userData.perfil)
        });

      if (userPerfilError) {
        console.error("Erro ao associar perfil de acesso:", userPerfilError);
        // Limpar dados em caso de erro
        try {
          await supabase.from('profiles').delete().eq('id', authData.user.id);
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupError) {
          console.error("Erro ao limpar dados:", cleanupError);
        }
        throw new Error("Erro ao associar perfil de acesso");
      }

      console.log("Usuário criado com sucesso!");
      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-gerenciamento'] });
      toast({
        title: "✅ Usuário criado com sucesso!",
        description: "O usuário foi criado e receberá um email de confirmação.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      console.error("Erro ao criar usuário:", error);
      const errorMessage = error?.message || "Erro desconhecido ao criar usuário";
      
      toast({
        title: "❌ Erro ao criar usuário",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
      });
    }
  });

  // Mutation para atualizar usuário
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: { nome: string; email: string; perfil: string; status: boolean } }) => {
      if (!canManageUsers) {
        throw new Error("Você não tem permissão para editar usuários");
      }

      console.log("Atualizando usuário:", { userId, userData });

      // Atualizar profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          nome: userData.nome,
          email: userData.email,
          ativo: userData.status
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Erro ao atualizar perfil:", profileError);
        throw new Error("Erro ao atualizar perfil do usuário");
      }

      // Atualizar perfil de acesso
      const profileId = perfis.find(p => p.nome === userData.perfil)?.id;
      if (profileId) {
        // Remover associação existente
        await supabase
          .from('usuario_perfis')
          .delete()
          .eq('usuario_id', userId);

        // Criar nova associação
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

      console.log("Usuário atualizado com sucesso!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-gerenciamento'] });
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

  // Mutation para excluir usuário
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!canManageUsers) {
        throw new Error("Você não tem permissão para excluir usuários");
      }

      // Excluir usuario_perfis
      const { error: userPerfilError } = await supabase
        .from('usuario_perfis')
        .delete()
        .eq('usuario_id', userId);

      if (userPerfilError) throw new Error("Erro ao excluir perfil de usuário");

      // Excluir profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw new Error("Erro ao excluir perfil");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios-gerenciamento'] });
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
    usuarios,
    perfis,
    isLoading,
    canManageUsers,
    createUser: async (data: any) => {
      try {
        await createUserMutation.mutateAsync(data);
        return true;
      } catch {
        return false;
      }
    },
    updateUser: async (userId: string, data: any) => {
      try {
        await updateUserMutation.mutateAsync({ userId, userData: data });
        return true;
      } catch {
        return false;
      }
    },
    deleteUser: async (userId: string) => {
      try {
        await deleteUserMutation.mutateAsync(userId);
        return true;
      } catch {
        return false;
      }
    },
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
