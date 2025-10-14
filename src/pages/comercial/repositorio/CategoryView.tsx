import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, FolderOpen, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useRepositorioCategoria } from "@/hooks/useRepositorioCategorias";
import { useRepositorioDocumentos } from "@/hooks/useRepositorioDocumentos";

export default function CategoryView() {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const navigate = useNavigate();
  
  const { data: categoria, isLoading } = useRepositorioCategoria(categoriaId || "");
  const { data: documentos = [] } = useRepositorioDocumentos();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!categoria) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Categoria não encontrada</h1>
          <Button onClick={() => navigate("/comercial/repositorio")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Repositório
          </Button>
        </div>
      </div>
    );
  }

  const getSubcategoryDocumentCount = (subcategoriaId: string) => {
    return documentos.filter(doc => doc.subcategoria_id === subcategoriaId).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex items-center justify-between p-6">
          <div className="space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/comercial/repositorio">Repositório</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{categoria.nome}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div>
              <h1 className="text-3xl font-bold text-foreground">{categoria.nome}</h1>
              <p className="text-muted-foreground mt-2">{categoria.descricao || "Sem descrição"}</p>
            </div>
          </div>
          
          <Button onClick={() => navigate("/comercial/repositorio")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Subpastas</h2>
          <p className="text-muted-foreground">
            Selecione uma subpasta para visualizar os documentos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoria.subcategorias?.map((subcategoria) => {
            const documentCount = getSubcategoryDocumentCount(subcategoria.id);
            
            return (
              <Card 
                key={subcategoria.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/comercial/repositorio/categoria/${categoriaId}/subcategoria/${subcategoria.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FolderOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {subcategoria.nome}
                        </CardTitle>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{documentCount} {documentCount === 1 ? 'documento' : 'documentos'}</span>
                    </div>
                    <Badge variant="secondary">
                      {categoria.nome}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(!categoria.subcategorias || categoria.subcategorias.length === 0) && (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">Nenhuma subpasta encontrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Esta categoria ainda não possui subpastas configuradas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
