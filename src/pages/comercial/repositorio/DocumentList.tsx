import { useState } from "react";
import { FileText, Upload, Search, Download, Eye, Trash2, Shield, AlertTriangle, CheckCircle, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { useRepositorioDocumentos } from "@/hooks/useRepositorioDocumentos";
import { useRepositorioCategorias } from "@/hooks/useRepositorioCategorias";
import { format } from "date-fns";
const DocumentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroValidade, setFiltroValidade] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  
  const { data: documentos = [], isLoading } = useRepositorioDocumentos();
  const { data: categorias = [] } = useRepositorioCategorias();
  
  const getValidadeStatus = (dataValidade: Date) => {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diffDias = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias < 0) return "vencido";
    if (diffDias <= 30) return "proximo";
    return "valido";
  };
  const getValidadeIcon = (status: string) => {
    switch (status) {
      case "vencido":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "proximo":
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case "valido":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };
  const documentosFiltrados = documentos.filter(doc => {
    const matchesSearch = doc.arquivo_nome_original.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (doc.categoria?.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (doc.subcategoria?.nome || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filtroCategoria === "todos" || doc.categoria_id === filtroCategoria;
    const matchesTipo = filtroTipo === "todos" || doc.arquivo_tipo === filtroTipo;
    if (filtroValidade === "todos") return matchesSearch && matchesCategoria && matchesTipo;
    if (!doc.data_validade) return false;
    const status = getValidadeStatus(new Date(doc.data_validade));
    return matchesSearch && status === filtroValidade && matchesCategoria && matchesTipo;
  });
  
  const tipos: string[] = [...new Set(documentos.map(doc => doc.arquivo_tipo).filter(Boolean))] as string[];
  const getFileIcon = (tipo: string) => {
    return <FileText className="h-4 w-4 text-blue-500" />;
  };
  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      PDF: "bg-red-100 text-red-800",
      Excel: "bg-green-100 text-green-800",
      Word: "bg-blue-100 text-blue-800",
      PowerPoint: "bg-orange-100 text-orange-800",
      PNG: "bg-purple-100 text-purple-800"
    };
    return colors[tipo] || "bg-gray-100 text-gray-800";
  };
  return <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Consulta de Documentos</h1>
          <p className="text-muted-foreground">Visualize todos os documentos do repositório</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/comercial/repositorio/upload">
            <Button className="bg-gradient-primary hover:opacity-90 text-sky-50 text-center text-sm bg-sky-900 hover:bg-sky-800">
              <Upload className="mr-2 h-4 w-4" />
              Enviar Documento
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

      {/* Filtros de Pesquisa */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>
          <CardDescription>Utilize os filtros abaixo para encontrar documentos específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <Input placeholder="Nome do documento..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Categorias</SelectItem>
                  {categorias.map(categoria => <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </SelectItem>)}
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
                  {tipos.map(tipo => <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>)}
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
            {isLoading ? "Carregando..." : `${documentosFiltrados.length} de ${documentos.length} documentos`}
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
                const statusValidade = documento.data_validade ? getValidadeStatus(new Date(documento.data_validade)) : "valido";
                return <TableRow key={documento.id} className="hover:bg-muted/50">
                      <TableCell>{getFileIcon(documento.arquivo_tipo || "")}</TableCell>
                      <TableCell className="font-medium">{documento.arquivo_nome_original}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="secondary">{documento.categoria?.nome || "-"}</Badge>
                          <div className="text-xs text-muted-foreground">{documento.subcategoria?.nome || "-"}</div>
                        </div>
                      </TableCell>
                      <TableCell>{documento.created_at ? format(new Date(documento.created_at), "dd/MM/yyyy") : "-"}</TableCell>
                      <TableCell>
                        {documento.data_validade ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 cursor-help">
                                {getValidadeIcon(statusValidade)}
                                <span className="text-sm">{format(new Date(documento.data_validade), "dd/MM/yyyy")}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Validade: {format(new Date(documento.data_validade), "dd/MM/yyyy")}
                                <br />
                                Status:{" "}
                                {statusValidade === "vencido" ? "Vencido" : statusValidade === "proximo" ? "Próximo do vencimento" : "Válido"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{documento.responsavel_nome || "-"}</TableCell>
                      <TableCell>{documento.responsavel_email || "-"}</TableCell>
                      <TableCell>{documento.arquivo_tamanho ? `${(documento.arquivo_tamanho / 1024 / 1024).toFixed(2)} MB` : "-"}</TableCell>
                      <TableCell>
                        <Badge className={getTipoColor(documento.arquivo_tipo || "")}>{documento.arquivo_tipo || "-"}</Badge>
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