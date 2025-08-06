
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AuthUserCreateValues } from "@/types/users";
import { supabase } from "@/integrations/supabase/client";

export const useCreateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (userData: AuthUserCreateValues) => {
      console.log("Iniciando criação de usuário:", userData);
      
      try {
        // Primeiro, verificar se o email já existe na tabela profiles
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

        // Criar o usuário no auth do Supabase com retry logic
        console.log("Criando usuário na autenticação...");
        let authData, authError;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          const response = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              data: {
                nome: userData.nome
              },
              emailRedirectTo: `${window.location.origin}/`
            }
          });

          authData = response.data;
          authError = response.error;

          if (!authError) {
            break;
          }

          // Verificar se é erro de rate limit
          if (authError.message.includes('rate limit') || authError.message.includes('429')) {
            retryCount++;
            if (retryCount < maxRetries) {
              console.log(`Rate limit atingido, tentativa ${retryCount}/${maxRetries}. Aguardando...`);
              // Aguardar tempo crescente antes de tentar novamente
              await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
              continue;
            } else {
              throw new Error("Limite de criação de usuários atingido. Aguarde alguns minutos antes de tentar novamente.");
            }
          } else if (authError.message.includes('already registered')) {
            throw new Error("Este email já está registrado no sistema.");
          } else {
            throw new Error(`Erro ao criar usuário: ${authError.message}`);
          }
        }

        if (authError) {
          throw new Error(`Erro ao criar usuário: ${authError.message}`);
        }

        if (!authData?.user?.id) {
          throw new Error("Falha ao criar usuário: dados de resposta inválidos");
        }

        console.log("Usuário criado no auth, ID:", authData.user.id);

        // Aguardar para garantir consistência
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Criar perfil na tabela profiles
        console.log("Criando perfil...");
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            nome: userData.nome,
            email: userData.email
          });

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError);
          // Tentar limpar o usuário criado no auth
          try {
            await supabase.auth.admin.deleteUser(authData.user.id);
          } catch (cleanupError) {
            console.error("Erro ao limpar usuário após falha:", cleanupError);
          }
          throw new Error("Erro ao criar perfil do usuário. Usuário foi removido.");
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
          // Tentar limpar dados criados
          try {
            await supabase.from('profiles').delete().eq('id', authData.user.id);
            await supabase.auth.admin.deleteUser(authData.user.id);
          } catch (cleanupError) {
            console.error("Erro ao limpar dados após falha:", cleanupError);
          }
          throw new Error("Erro ao associar perfil de acesso. Usuário foi removido.");
        }

        console.log("Usuário criado com sucesso!");
        return authData;
      } catch (error) {
        console.error("Erro na criação do usuário:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-usuarios'] });
      toast({
        title: "✅ Usuário criado com sucesso!",
        description: "O usuário foi criado e receberá um email de confirmação para ativar sua conta.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      console.error("Erro ao criar usuário:", error);
      let errorMessage = error?.message || "Erro desconhecido ao criar usuário";
      
      // Tratar mensagens de erro específicas
      if (errorMessage.includes('rate limit')) {
        errorMessage = "Limite de criação de usuários atingido. Aguarde alguns minutos antes de tentar novamente.";
      } else if (errorMessage.includes('already registered')) {
        errorMessage = "Este email já está registrado no sistema.";
      } else if (errorMessage.includes('email já está sendo usado')) {
        errorMessage = "Este email já está sendo usado por outro usuário.";
      }
      
      toast({
        title: "❌ Erro ao criar usuário",
        description: errorMessage,
        variant: "destructive",
        duration: 10000,
      });
    }
  });

  return {
    createUser: createUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    error: createUserMutation.error,
    isSuccess: createUserMutation.isSuccess,
    reset: createUserMutation.reset
  };
};
