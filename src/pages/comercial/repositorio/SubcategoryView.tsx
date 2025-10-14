import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, FileText, Download, Eye, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useRepositorioSubcategoria } from "@/hooks/useRepositorioCategorias";
import { useRepositorioDocumentos } from "@/hooks/useRepositorioDocumentos";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SubcategoryView() {
  const { categoriaId, subcategoriaId } = useParams<{ categoriaId: string; subcategoriaId: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading } = useRepositorioSubcategoria(categoriaId || "", subcategoriaId || "");
  const { data: docs = [] } = useRepositorioDocumentos(subcategoriaId);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Subcategoria não encontrada</h1>
          <Button onClick={() => navigate("/comercial/repositorio")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Repositório
          </Button>
        </div>
      </div>
    );
  }
  
  const { categoria, subcategoria } = data;

  const getValidadeStatus = (dataValidade: Date): 'vencido' | 'proximo' | 'valido' => {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes < 0) return 'vencido';
    if (diasRestantes <= 30) return 'proximo';
    return 'valido';
  };

  const getValidadeIcon = (status: string) => {
    switch (status) {
      case 'vencido':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'proximo':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'valido':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'doc':
      case 'docx':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'xls':
      case 'xlsx':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleViewDocument = async (arquivoUrl: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('repositorio-documentos')
        .createSignedUrl(arquivoUrl, 3600);

      if (error) throw error;
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Erro ao visualizar documento:', error);
      toast.error('Erro ao visualizar documento');
    }
  };

  const handleDownloadDocument = async (arquivoUrl: string, nomeOriginal: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('repositorio-documentos')
        .createSignedUrl(arquivoUrl, 60);

      if (error) throw error;
      
      if (data?.signedUrl) {
        const response = await fetch(data.signedUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeOriginal;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Download iniciado');
      }
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
      toast.error('Erro ao baixar documento');
    }
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
                  <BreadcrumbLink asChild>
                    <Link to={`/comercial/repositorio/categoria/${categoriaId}`}>{categoria.nome}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{subcategoria.nome}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div>
              <h1 className="text-3xl font-bold text-foreground">{subcategoria.nome}</h1>
              <p className="text-muted-foreground mt-2">
                Documentos da categoria {categoria.nome}
              </p>
            </div>
          </div>
          
          <Button onClick={() => navigate(`/comercial/repositorio/categoria/${categoriaId}`)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{docs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Válidos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {docs.filter(doc => doc.data_validade && getValidadeStatus(new Date(doc.data_validade)) === 'valido').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximo ao Vencimento</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {docs.filter(doc => doc.data_validade && getValidadeStatus(new Date(doc.data_validade)) === 'proximo').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {docs.filter(doc => doc.data_validade && getValidadeStatus(new Date(doc.data_validade)) === 'vencido').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>
              Lista de todos os documentos desta subcategoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {docs.length > 0 ? (
              <TooltipProvider>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Data de Upload</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Tamanho</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {docs.map((documento) => {
                      const validadeStatus = documento.data_validade ? getValidadeStatus(new Date(documento.data_validade)) : 'valido';
                      
                      return (
                        <TableRow key={documento.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{documento.arquivo_nome_original}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {documento.created_at ? format(new Date(documento.created_at), "dd/MM/yyyy") : "-"}
                          </TableCell>
                          <TableCell>
                            {documento.data_validade ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center space-x-2 cursor-help">
                                    {getValidadeIcon(validadeStatus)}
                                    <span className="text-sm">
                                      {format(new Date(documento.data_validade), "dd/MM/yyyy")}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {validadeStatus === 'vencido' && 'Documento vencido'}
                                    {validadeStatus === 'proximo' && 'Vence em breve'}
                                    {validadeStatus === 'valido' && 'Documento válido'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{documento.responsavel_nome || "-"}</TableCell>
                          <TableCell>{documento.responsavel_email || "-"}</TableCell>
                          <TableCell>
                            {documento.arquivo_tamanho ? `${(documento.arquivo_tamanho / 1024 / 1024).toFixed(2)} MB` : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getTipoColor(documento.arquivo_tipo || "")}>
                              {(documento.arquivo_tipo || "").toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewDocument(documento.arquivo_url)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadDocument(documento.arquivo_url, documento.arquivo_nome_original)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TooltipProvider>
            ) : (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-foreground">Nenhum documento encontrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Esta subcategoria ainda não possui documentos.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
