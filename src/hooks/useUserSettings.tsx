
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface UserSettings {
  id?: string;
  user_id?: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  dark_mode: boolean;
  language: string;
  timezone: string;
}

const defaultSettings: UserSettings = {
  email_notifications: true,
  sms_notifications: false,
  dark_mode: false,
  language: "pt-BR",
  timezone: "America/Sao_Paulo"
};

export const useUserSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buscar configurações do usuário
  const { 
    data: settings, 
    isLoading: loadingSettings,
    error: settingsError
  } = useQuery({
    queryKey: ['user-settings', user?.id],
    queryFn: async () => {
      if (!user?.id) return defaultSettings;
      
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar configurações:", error);
          // Se não existe configuração, retornar configurações padrão
          if (error.code === 'PGRST116') {
            return defaultSettings;
          }
          return defaultSettings;
        }

        return data || defaultSettings;
      } catch (error) {
        console.error("Exceção ao buscar configurações:", error);
        return defaultSettings;
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Mutation para atualizar/criar configurações
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }

      // Primeiro tentar atualizar
      const { data: existingData, error: selectError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (existingData) {
        // Atualizar configuração existente
        const { error } = await supabase
          .from('user_settings')
          .update(newSettings)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Criar nova configuração
        const { error } = await supabase
          .from('user_settings')
          .insert({
            ...newSettings,
            user_id: user.id
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings', user?.id] });
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar configurações",
        variant: "destructive",
      });
    }
  });

  return {
    settings: settings || defaultSettings,
    loadingSettings,
    settingsError,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending
  };
};
