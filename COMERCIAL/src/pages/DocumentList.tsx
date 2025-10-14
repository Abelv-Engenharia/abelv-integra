import { useState } from "react";
import { FileText, Upload, Search, Download, Eye, Trash2, ArrowLeft, Shield, AlertTriangle, CheckCircle, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { documentosmock, type documento } from "@/data/mockData";
const DocumentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroValidade, setFiltroValidade] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const getValidadeStatus = (dataValidade: string) => {
    const hoje = new Date();
    const validade = new Date(dataValidade.split('/').reverse().join('-'));
    const diffDias = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias < 0) return 'vencido';
    if (diffDias <= 30) return 'proximo';
    return 'valido';
  };
  const getValidadeIcon = (status: string) => {
    switch (status) {
      case 'vencido':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'proximo':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'valido':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };
  const documentosFiltrados = documentosmock.filter(doc => {
    const matchesSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) || doc.categoria.toLowerCase().includes(searchTerm.toLowerCase()) || doc.subcategoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategoria = filtroCategoria === "todos" || doc.categoria === filtroCategoria;
    const matchesTipo = filtroTipo === "todos" || doc.tipo === filtroTipo;
    
    if (filtroValidade === "todos") return matchesSearch && matchesCategoria && matchesTipo;
    
    const status = getValidadeStatus(doc.datavalidade);
    return matchesSearch && status === filtroValidade && matchesCategoria && matchesTipo;
  });

  const categorias = [...new Set(documentosmock.map(doc => doc.categoria))];
  const tipos = [...new Set(documentosmock.map(doc => doc.tipo))];
  const getFileIcon = (tipo: string) => {
    return <FileText className="h-4 w-4 text-blue-500" />;
  };
  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      'PDF': 'bg-red-100 text-red-800',
      'Excel': 'bg-green-100 text-green-800',
      'Word': 'bg-blue-100 text-blue-800',
      'PowerPoint': 'bg-orange-100 text-orange-800',
      'PNG': 'bg-purple-100 text-purple-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };
  return <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Consulta de Documentos</h1>
          <p className="text-muted-foreground">Visualize todos os documentos do repositório</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Link to="/repositorio/upload">
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Upload className="mr-2 h-4 w-4" />
              Enviar Documento
            </Button>
          </Link>
          <Link to="/repositorio/busca">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Busca Avançada
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros de Pesquisa */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>
          <CardDescription>
            Utilize os filtros abaixo para encontrar documentos específicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <Input 
                placeholder="Nome do documento..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Categorias</SelectItem>
                  {categorias.map(categoria => (
                    <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status de Validade</label>
              <Select value={filtroValidade} onValueChange={setFiltroValidade}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="valido">Válidos</SelectItem>
                  <SelectItem value="proximo">Próximos do Vencimento</SelectItem>
                  <SelectItem value="vencido">Vencidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Arquivo</label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  {tipos.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Documentos</CardTitle>
          <CardDescription>
            {documentosFiltrados.length} de {documentosmock.length} documentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Nome do Arquivo</TableHead>
                  <TableHead>Categoria / Subpasta</TableHead>
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
                {documentosFiltrados.map(documento => {
                const statusValidade = getValidadeStatus(documento.datavalidade);
                return <TableRow key={documento.id} className="hover:bg-muted/50">
                      <TableCell>
                        {getFileIcon(documento.tipo)}
                      </TableCell>
                      <TableCell className="font-medium">{documento.nome}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="secondary">{documento.categoria}</Badge>
                          <div className="text-xs text-muted-foreground">{documento.subcategoria}</div>
                        </div>
                      </TableCell>
                      <TableCell>{documento.dataupload}</TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              {getValidadeIcon(statusValidade)}
                              <span className="text-sm">{documento.datavalidade}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Validade: {documento.datavalidade}
                              <br />
                              Status: {statusValidade === 'vencido' ? 'Vencido' : statusValidade === 'proximo' ? 'Próximo do vencimento' : 'Válido'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{documento.responsavel}</TableCell>
                      <TableCell>{documento.emailresponsavel}</TableCell>
                      <TableCell>{documento.tamanho}</TableCell>
                      <TableCell>
                        <Badge className={getTipoColor(documento.tipo)}>
                          {documento.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>;
              })}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>;
};
export default DocumentList;