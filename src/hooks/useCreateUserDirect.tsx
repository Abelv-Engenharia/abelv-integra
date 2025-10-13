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

        // 2. Obter token de autenticação
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Usuário não autenticado');
        }

        // 3. Criar usuário via edge function admin (sem senha, sem email)
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users/create`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userData.email,
              userData: {
                nome: userData.nome,
              },
              emailConfirm: false, // Não enviar email
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Erro ao criar usuário');
        }

        const result = await response.json();
        return result.user;
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