
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

        // Criar o usuário no auth do Supabase
        console.log("Criando usuário na autenticação...");
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              nome: userData.nome
            },
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
