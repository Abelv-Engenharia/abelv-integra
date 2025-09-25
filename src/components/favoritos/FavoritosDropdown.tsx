import { Star, X, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useFavoritos } from "@/hooks/useFavoritos";

const FavoritosDropdown = () => {
  const { favoritos, loading, removerFavorito, toggleFavoritoAtual } = useFavoritos();
  const location = useLocation();

  const obterTituloPagina = () => {
    // Primeiro, tenta obter do document.title (removendo " | Gestão de SMS" se existir)
    let titulo = document.title.replace(/\s*\|\s*.*$/, '').trim();
    
    // Se não encontrar no document.title ou estiver genérico, busca no h1
    if (!titulo || titulo === 'Gestão de SMS' || titulo === '') {
      const h1Element = document.querySelector('h1');
      if (h1Element && h1Element.textContent) {
        titulo = h1Element.textContent.trim();
      }
    }
    
    // Se ainda não encontrar, usa o pathname como fallback
    if (!titulo) {
      const pathSegments = location.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        titulo = pathSegments[pathSegments.length - 1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      } else {
        titulo = 'Página Atual';
      }
    }
    
    return titulo;
  };

  const handleAdicionarPaginaAtual = async () => {
    const nomePagina = obterTituloPagina();
    
    const sucesso = await toggleFavoritoAtual(nomePagina);
    if (sucesso) {
      // Não precisa resetar nenhum estado pois não há mais input manual
    }
  };

  const handleRemoverFavorito = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await removerFavorito(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Páginas favoritas"
        >
          <Star className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="px-3 py-2">
          <h3 className="font-medium text-sm">Páginas favoritas</h3>
        </div>
        
        <DropdownMenuSeparator />
        
        {loading ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : favoritos.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Nenhuma página favoritada ainda.
          </div>
        ) : (
          favoritos.map((favorito) => (
            <DropdownMenuItem key={favorito.id} asChild className="group">
              <Link 
                to={favorito.url_pagina} 
                className="flex items-center justify-between w-full cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {favorito.icone && (
                    <span className="text-sm">{favorito.icone}</span>
                  )}
                  <span className="truncate text-sm">{favorito.nome_pagina}</span>
                </div>
                <button
                  onClick={(e) => handleRemoverFavorito(e, favorito.id)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground rounded p-1 transition-all"
                  title="Remover dos favoritos"
                >
                  <X className="h-3 w-3" />
                </button>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleAdicionarPaginaAtual}
          className="cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar página atual
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FavoritosDropdown;