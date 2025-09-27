import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UpdateUserDirectData {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: 'administrador' | 'usuario';
  permissoes_customizadas?: Record<string, boolean>;
  ccas_permitidas?: number[];
}

export const useUpdateUserDirect = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: async (userData: UpdateUserDirectData) => {
      try {
        // Atualizar o perfil do usuário com as novas informações
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
          .eq('id', userData.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
          throw new Error('Erro ao atualizar perfil do usuário');
        }

        return userData;
      } catch (error) {
        console.error('Erro na atualização do usuário:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile-direct'] });
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso!",
      });
    },
    onError: (error: Error) => {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar usuário. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateUser = async (userData: UpdateUserDirectData): Promise<boolean> => {
    try {
      await updateUserMutation.mutateAsync(userData);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return false;
    }
  };

  return {
    updateUser,
    isUpdating: updateUserMutation.isPending,
  };
};