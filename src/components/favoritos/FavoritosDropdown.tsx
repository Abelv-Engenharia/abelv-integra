import { useState } from "react";
import { Star, X, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useFavoritos } from "@/hooks/useFavoritos";

const FavoritosDropdown = () => {
  const { favoritos, loading, removerFavorito, toggleFavoritoAtual } = useFavoritos();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nomePagina, setNomePagina] = useState("");
  const location = useLocation();

  const handleAdicionarPaginaAtual = async () => {
    if (!nomePagina.trim()) return;
    
    const sucesso = await toggleFavoritoAtual(nomePagina.trim());
    if (sucesso) {
      setNomePagina("");
      setMostrarFormulario(false);
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
        
        {!mostrarFormulario ? (
          <DropdownMenuItem 
            onClick={() => setMostrarFormulario(true)}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar página atual
          </DropdownMenuItem>
        ) : (
          <div className="px-3 py-2 space-y-2">
            <Input
              placeholder="Nome da página"
              value={nomePagina}
              onChange={(e) => setNomePagina(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdicionarPaginaAtual();
                } else if (e.key === 'Escape') {
                  setMostrarFormulario(false);
                  setNomePagina("");
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAdicionarPaginaAtual}
                disabled={!nomePagina.trim()}
              >
                Adicionar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setMostrarFormulario(false);
                  setNomePagina("");
                }}
              >
                Cancelar
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Página atual: {location.pathname}
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FavoritosDropdown;