
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type UserSettings = {
  id: string;
  user_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  dark_mode: boolean;
  language: string;
  timezone: string;
};

const DEFAULTS: Omit<UserSettings, "id" | "user_id"> = {
  email_notifications: true,
  sms_notifications: false,
  dark_mode: false,
  language: "pt-BR",
  timezone: "America/Sao_Paulo",
};

export function useUserSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Busca configurações do usuário
  const { data: settings, isLoading } = useQuery({
    queryKey: ["user-settings", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        // Retorna defaults se ainda não existir
        return {
          ...DEFAULTS,
          id: "",
          user_id: user.id,
        };
      }
      return data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Mutação para salvar/atualizar configurações
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      if (!user?.id) throw new Error("Usuário não autenticado.");
      // Se configurações já existem, faz update, senão faz insert
      const { data: existing } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", user.id)
        .single();

      let result;
      if (existing) {
        result = await supabase
          .from("user_settings")
          .update({ ...data, user_id: user.id })
          .eq("user_id", user.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("user_settings")
          .insert({ ...DEFAULTS, ...data, user_id: user.id })
          .select()
          .single();
      }
      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings", user?.id] });
      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar configurações",
        description: error?.message || "Tente novamente.",
        variant: "destructive",
      });
    },
  });

  return {
    settings,
    isLoading,
    saveSettingsMutation,
  };
}
