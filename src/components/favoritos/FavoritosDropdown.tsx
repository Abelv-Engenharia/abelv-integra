import { Star, X, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useFavoritos } from "@/hooks/useFavoritos";

const FavoritosDropdown = () => {
  const { favoritos, loading, removerFavorito, toggleFavoritoAtual } = useFavoritos();
  const location = useLocation();

  const obterTituloPagina = () => {
    // 1. Busca no h1 principal da página (mais confiável para títulos específicos)
    const h1Element = document.querySelector('main h1, .main h1, [role="main"] h1, h1');
    if (h1Element && h1Element.textContent) {
      const h1Text = h1Element.textContent.trim();
      // Evita títulos muito genéricos
      if (h1Text && 
          h1Text !== 'Dashboard SMS' && 
          h1Text !== 'Gestão de SMS' && 
          h1Text !== 'Dashboard' &&
          h1Text !== 'Sistema') {
        return h1Text;
      }
    }
    
    // 2. Busca por títulos em elementos com classes específicas que podem conter o nome da página
    const titleSelectors = [
      '.page-title',
      '.page-header h1',
      '.page-header h2',
      '[data-page-title]',
      '.main-title',
      '.content-title'
    ];
    
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent) {
        const text = element.textContent.trim();
        if (text && text !== 'Dashboard SMS' && text !== 'Gestão de SMS') {
          return text;
        }
      }
    }
    
    // 3. Tenta obter do document.title (removendo sufixos genéricos)
    let titulo = document.title
      .replace(/\s*\|\s*.*$/, '')
      .replace(/\s*-\s*.*$/, '')
      .trim();
    
    // Se o título do document for específico, usa ele
    if (titulo && 
        titulo !== 'Gestão de SMS' && 
        titulo !== 'Dashboard SMS' && 
        titulo !== 'Abelv Integra' &&
        titulo !== 'Dashboard') {
      return titulo;
    }
    
    // 4. Mapeamento específico baseado na rota atual
    const pathname = location.pathname;
    const routeNames: Record<string, string> = {
      '/': 'Dashboard Principal',
      '/dashboard': 'Dashboard Principal',
      '/treinamentos': 'Treinamentos',
      '/treinamentos/dashboard': 'Dashboard de Treinamentos',
      '/treinamentos/novo': 'Novo Treinamento',
      '/treinamentos/matriculas': 'Matrículas de Treinamentos',
      '/desvios': 'Desvios',
      '/desvios/dashboard': 'Dashboard de Desvios',
      '/desvios/cadastro': 'Cadastro de Desvios',
      '/desvios/consulta': 'Consulta de Desvios',
      '/hora-seguranca': 'Hora da Segurança',
      '/hora-seguranca/dashboard': 'Hora da Segurança',
      '/ocorrencias': 'Ocorrências',
      '/ocorrencias/consulta': 'Consulta de Ocorrências',
      '/ocorrencias/nova': 'Nova Ocorrência',
      '/funcionarios': 'Funcionários',
      '/funcionarios/cadastro': 'Cadastro de Funcionários',
      '/admin': 'Administração',
      '/admin/funcionarios': 'Cadastro de Funcionários',
      '/admin/importacao-funcionarios': 'Importação de Funcionários',
      '/profile': 'Perfil do Usuário',
      '/settings': 'Configurações do Sistema'
    };
    
    titulo = routeNames[pathname];
    
    // 5. Se não encontrou no mapeamento exato, tenta mapeamento parcial
    if (!titulo) {
      for (const [route, name] of Object.entries(routeNames)) {
        if (pathname.startsWith(route) && route !== '/') {
          titulo = name;
          break;
        }
      }
    }
    
    // 6. Como último recurso, transforma o último segmento da URL
    if (!titulo) {
      const pathSegments = pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        const lastSegment = pathSegments[pathSegments.length - 1];
        titulo = lastSegment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      } else {
        titulo = 'Página Inicial';
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