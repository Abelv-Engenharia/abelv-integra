import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthUserCreateDirectValues } from '@/types/users';

export const useCreateUserDirect = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (userData: AuthUserCreateDirectValues) => {
      try {
        // 1. Verificar se o email já existe
        const { data: existingUsers } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', userData.email);
          
        if (existingUsers && existingUsers.length > 0) {
          throw new Error('Email já está em uso');
        }

        // 2. Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.senha,
          options: {
            data: {
              nome: userData.nome,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (authError) {
          console.error('Erro no signup:', authError);
          throw new Error(authError.message);
        }

        if (!authData.user) {
          throw new Error('Usuário não foi criado no Auth');
        }

        // 3. Atualizar o perfil do usuário com as novas colunas
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            nome: userData.nome,
            tipo_usuario: userData.tipo_usuario,
            permissoes_customizadas: userData.permissoes_customizadas || {},
            ccas_permitidas: userData.ccas_permitidas || [],
            menus_sidebar: Object.keys(userData.permissoes_customizadas || {}).filter(
              key => userData.permissoes_customizadas?.[key] === true
            )
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
          
          // Rollback: deletar usuário do Auth se falhou ao criar perfil
          try {
            await supabase.auth.admin.deleteUser(authData.user.id);
          } catch (rollbackError) {
            console.error('Erro no rollback:', rollbackError);
          }
          
          throw new Error('Erro ao configurar perfil do usuário');
        }

        return authData.user;
      } catch (error) {
        console.error('Erro na criação do usuário:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
      });
    },
    onError: (error: Error) => {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar usuário. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const createUser = async (userData: AuthUserCreateDirectValues): Promise<boolean> => {
    try {
      await createUserMutation.mutateAsync(userData);
      return true;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return false;
    }
  };

  return {
    createUser,
    isCreating: createUserMutation.isPending,
  };
};