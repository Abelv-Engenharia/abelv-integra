import { supabase } from "@/integrations/supabase/client";
import { PaginaFavorita, NovaFavorita } from "@/types/favoritos";

export const favoritosService = {
  async getFavoritos(): Promise<PaginaFavorita[]> {
    try {
      const { data, error } = await supabase
        .from('paginas_favoritas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar favoritos:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Exceção ao buscar favoritos:", error);
      return [];
    }
  },

  async adicionarFavorito(favorito: NovaFavorita): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Usuário não autenticado");
        return false;
      }

      const { error } = await supabase
        .from('paginas_favoritas')
        .insert({
          ...favorito,
          usuario_id: user.id
        });

      if (error) {
        console.error("Erro ao adicionar favorito:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao adicionar favorito:", error);
      return false;
    }
  },

  async removerFavorito(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('paginas_favoritas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Erro ao remover favorito:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao remover favorito:", error);
      return false;
    }
  },

  async removerFavoritoPorUrl(url: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('paginas_favoritas')
        .delete()
        .eq('url_pagina', url);

      if (error) {
        console.error("Erro ao remover favorito por URL:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exceção ao remover favorito por URL:", error);
      return false;
    }
  },

  async isFavorito(url: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('paginas_favoritas')
        .select('id')
        .eq('url_pagina', url)
        .maybeSingle();

      if (error) {
        console.error("Erro ao verificar favorito:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Exceção ao verificar favorito:", error);
      return false;
    }
  }
};