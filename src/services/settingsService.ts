
import { supabase } from "@/integrations/supabase/client";
import { UserSettings } from "@/hooks/useUserSettings";

export const settingsService = {
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Erro ao buscar configurações do usuário:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Exceção ao buscar configurações do usuário:", error);
      return null;
    }
  },

  async createUserSettings(userId: string, settings: Partial<UserSettings>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_settings')
        .insert({
          ...settings,
          user_id: userId
        });

      if (error) {
        console.error("Erro ao criar configurações do usuário:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao criar configurações do usuário:", error);
      return false;
    }
  },

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', userId);

      if (error) {
        console.error("Erro ao atualizar configurações do usuário:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao atualizar configurações do usuário:", error);
      return false;
    }
  },

  async applyLanguageSettings(language: string) {
    // Implementação futura para mudança de idioma
    console.log(`Aplicando idioma: ${language}`);
  },

  async applyTimezoneSettings(timezone: string) {
    // Implementação futura para mudança de fuso horário
    console.log(`Aplicando fuso horário: ${timezone}`);
  }
};
