import { useState } from "react";
import { Building2, Award, DollarSign, FileText, ScrollText, Upload, FolderOpen, Search, Calendar, User, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { categoriasmock, documentosmock } from "@/data/repositorioMockData";

const DocumentRepository = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const categoriasFiltradas = categoriasmock.filter(categoria =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, any> = {
      'Empresarial': Building2,
      'Habilitação': Award,
      'Financeiro': DollarSign,
      'Certidões': ScrollText,
      'Políticas e Código de Conduta': Briefcase
    };
    const IconComponent = icons[categoryName] || FolderOpen;
    return <IconComponent className="h-8 w-8" />;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Repositório de Documentos</h1>
          <p className="text-muted-foreground">Gerencie todos os seus documentos organizadamente</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Link to="/comercial/repositorio/upload">
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Upload className="mr-2 h-4 w-4" />
              Enviar Documento
            </Button>
          </Link>
          <Link to="/comercial/repositorio/documentos">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Ver Todos os Documentos
            </Button>
          </Link>
          <Link to="/comercial/repositorio/busca">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Busca Avançada
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentosmock.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias Ativas</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Buscar categorias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriasFiltradas.map((categoria) => (
          <Card 
            key={categoria.id} 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate(`/comercial/repositorio/categoria/${categoria.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${categoria.cor} bg-opacity-15 group-hover:bg-opacity-25 transition-all`}>
                  {getCategoryIcon(categoria.nome)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {categoria.nome}
                  </CardTitle>
                  <CardDescription className="text-sm mt-1">
                    {categoria.quantidadedocumentos} documento{categoria.quantidadedocumentos !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {categoria.descricao}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Subpastas:</span>
                  <Badge variant="secondary" className="text-xs">
                    {categoria.subcategorias.length}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {categoria.subcategorias.slice(0, 3).map((subcategoria) => (
                    <Badge key={subcategoria.id} variant="outline" className="text-xs">
                      {subcategoria.nome}
                    </Badge>
                  ))}
                  {categoria.subcategorias.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{categoria.subcategorias.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-start text-primary hover:text-primary">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Explorar Categoria
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categoriasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhuma categoria encontrada
          </h3>
          <p className="text-sm text-muted-foreground">
            Tente ajustar sua busca ou explore todas as categorias disponíveis
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentRepository;
