
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
        // Primeiro, verificar se o email já existe
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

        // Tentar criar o usuário com retry em caso de timeout
        let authData;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          try {
            const { data, error } = await supabase.auth.signUp({
              email: userData.email,
              password: userData.password,
              options: {
                data: {
                  nome: userData.nome
                },
                emailRedirectTo: undefined
              }
            });

            if (error) {
              // Tratar erros específicos
              if (error.message.includes('rate limit') || error.message.includes('429')) {
                throw new Error("Limite de criação de usuários atingido. Aguarde alguns minutos antes de tentar novamente.");
              } else if (error.message.includes('already registered')) {
                throw new Error("Este email já está registrado no sistema.");
              } else if (error.message.includes('timeout') || error.message.includes('504')) {
                attempts++;
                if (attempts >= maxAttempts) {
                  throw new Error("Timeout na criação do usuário. Tente novamente em alguns minutos.");
                }
                // Aguardar antes de tentar novamente
                await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
                continue;
              } else {
                throw new Error(`Erro ao criar usuário: ${error.message}`);
              }
            }

            authData = data;
            break;
          } catch (retryError: any) {
            if (retryError.message.includes('Limite de criação') || 
                retryError.message.includes('já está registrado') ||
                !retryError.message.includes('timeout')) {
              throw retryError;
            }
            
            attempts++;
            if (attempts >= maxAttempts) {
              throw new Error("Falha na criação após múltiplas tentativas. Tente novamente mais tarde.");
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
          }
        }

        if (!authData?.user?.id) {
          throw new Error("Falha ao criar usuário: dados de resposta inválidos");
        }

        console.log("Usuário criado no auth, ID:", authData.user.id);

        // Aguardar para garantir consistência
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Criar perfil na tabela profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            nome: userData.nome,
            email: userData.email
          }, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError);
          throw new Error("Usuário criado, mas houve erro ao configurar o perfil. Contate o administrador.");
        }

        // Associar o perfil de acesso
        const perfilId = parseInt(userData.perfil);
        const { error: userPerfilError } = await supabase
          .from('usuario_perfis')
          .upsert({
            usuario_id: authData.user.id,
            perfil_id: perfilId
          }, {
            onConflict: 'usuario_id,perfil_id',
            ignoreDuplicates: true
          });

        if (userPerfilError) {
          console.error("Erro ao associar perfil:", userPerfilError);
          throw new Error("Usuário criado, mas houve erro ao definir permissões. Contate o administrador.");
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
      const errorMessage = error?.message || "Erro desconhecido ao criar usuário";
      
      toast({
        title: "❌ Erro ao criar usuário",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
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
