
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  avatar_url?: string;
  cargo?: string;
  departamento?: string;
}

export const useProfile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buscar dados do perfil do usuário
  const { 
    data: profile, 
    isLoading: loadingProfile,
    error: profileError
  } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          // Se não existe perfil, criar um básico
          if (error.code === 'PGRST116') {
            const newProfile = {
              id: user.id,
              nome: user.user_metadata?.nome || user.email?.split('@')[0] || 'Usuário',
              email: user.email || '',
              cargo: 'Usuário',
              departamento: 'Geral'
            };
            
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();
              
            if (createError) {
              console.error("Erro ao criar perfil:", createError);
              return null;
            }
            
            return createdProfile;
          }
          return null;
        }

        return data;
      } catch (error) {
        console.error("Exceção ao buscar perfil:", error);
        return null;
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Buscar perfil de acesso do usuário
  const { data: userRole } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('usuario_perfis')
          .select(`
            perfil_id,
            perfis (
              nome,
              descricao
            )
          `)
          .eq('usuario_id', user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil de acesso:", error);
          return null;
        }

        return data?.perfis?.nome || 'Usuário';
      } catch (error) {
        console.error("Erro ao verificar perfil de acesso:", error);
        return 'Usuário';
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000
  });

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar perfil",
        variant: "destructive",
      });
    }
  });

  return {
    profile,
    userRole,
    loadingProfile,
    profileError,
    updateProfileMutation
  };
};
