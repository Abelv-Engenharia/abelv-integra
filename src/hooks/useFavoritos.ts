import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { favoritosService } from "@/services/favoritosService";
import { PaginaFavorita, NovaFavorita } from "@/types/favoritos";
import { toast } from "@/hooks/use-toast";

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<PaginaFavorita[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const carregarFavoritos = async () => {
    setLoading(true);
    const data = await favoritosService.getFavoritos();
    setFavoritos(data);
    setLoading(false);
  };

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const adicionarFavorito = async (favorito: NovaFavorita) => {
    const sucesso = await favoritosService.adicionarFavorito(favorito);
    
    if (sucesso) {
      toast({
        title: "Favorito adicionado",
        description: `${favorito.nome_pagina} foi adicionada aos favoritos.`
      });
      await carregarFavoritos();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar aos favoritos.",
        variant: "destructive"
      });
    }
    
    return sucesso;
  };

  const removerFavorito = async (id: string) => {
    const sucesso = await favoritosService.removerFavorito(id);
    
    if (sucesso) {
      toast({
        title: "Favorito removido",
        description: "Página removida dos favoritos."
      });
      await carregarFavoritos();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível remover dos favoritos.",
        variant: "destructive"
      });
    }
    
    return sucesso;
  };

  const removerFavoritoPorUrl = async (url: string) => {
    const sucesso = await favoritosService.removerFavoritoPorUrl(url);
    
    if (sucesso) {
      toast({
        title: "Favorito removido",
        description: "Página removida dos favoritos."
      });
      await carregarFavoritos();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível remover dos favoritos.",
        variant: "destructive"
      });
    }
    
    return sucesso;
  };

  const isFavoritoAtual = async () => {
    return await favoritosService.isFavorito(location.pathname);
  };

  const toggleFavoritoAtual = async (nomePagina: string, icone?: string) => {
    const isFav = await isFavoritoAtual();
    
    if (isFav) {
      return await removerFavoritoPorUrl(location.pathname);
    } else {
      return await adicionarFavorito({
        nome_pagina: nomePagina,
        url_pagina: location.pathname,
        icone
      });
    }
  };

  return {
    favoritos,
    loading,
    adicionarFavorito,
    removerFavorito,
    removerFavoritoPorUrl,
    isFavoritoAtual,
    toggleFavoritoAtual,
    carregarFavoritos
  };
};