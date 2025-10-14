import { useState } from "react";
import { ArrowLeft, Search, Filter, Calendar, User, FileText, Download, Eye, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { documentosmock, categoriasmock, type documento } from "@/data/repositorioMockData";

const DocumentSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedUser, setSelectedUser] = useState("todos");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Get unique users for filter
  const uniqueUsers = [...new Set(documentosmock.map(doc => doc.usuarioresponsavel))];
  
  const filteredDocuments = documentosmock.filter(doc => {
    const matchesSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "todas" || doc.categoria === selectedCategory;
    
    const matchesUser = selectedUser === "todos" || doc.usuarioresponsavel === selectedUser;
    
    // Simple date filter (you would normally use proper date parsing)
    let matchesDate = true;
    if (dateFrom && dateTo) {
      // This is a simplified date comparison - in a real app you'd use proper date parsing
      matchesDate = true; // Placeholder for date filtering logic
    }
    
    return matchesSearch && matchesCategory && matchesUser && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("todas");
    setSelectedUser("todos");
    setDateFrom("");
    setDateTo("");
  };

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

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/comercial/repositorio">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Busca Avançada</h1>
          <p className="text-muted-foreground">Encontre documentos usando filtros específicos</p>
        </div>
      </div>

      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
          <CardDescription>Use os filtros abaixo para refinar sua busca</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Term */}
            <div className="space-y-2">
              <Label htmlFor="search">Termo de Busca</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome do arquivo ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Categorias</SelectItem>
                  {categoriasmock.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.nome}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* User Filter */}
            <div className="space-y-2">
              <Label>Usuário Responsável</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Usuários</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Data Inicial</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dateTo">Data Final</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resultados da Busca</span>
            <Badge variant="secondary">
              {filteredDocuments.length} documento{filteredDocuments.length !== 1 ? 's' : ''} encontrado{filteredDocuments.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
          <CardDescription>
            {filteredDocuments.length === 0 
              ? "Nenhum documento encontrado com os filtros aplicados" 
              : `Mostrando ${filteredDocuments.length} de ${documentosmock.length} documentos`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Nome do Arquivo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data de Upload</TableHead>
                  <TableHead>Usuário Responsável</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((documento) => (
                  <TableRow key={documento.id} className="hover:bg-muted/50">
                    <TableCell>
                      {getFileIcon(documento.tipo)}
                    </TableCell>
                    <TableCell className="font-medium">{documento.nome}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{documento.categoria}</Badge>
                    </TableCell>
                    <TableCell>{documento.dataupload}</TableCell>
                    <TableCell>{documento.usuarioresponsavel}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Nenhum documento encontrado
              </h3>
              <p className="text-sm text-muted-foreground">
                Tente ajustar os filtros de busca para encontrar os documentos desejados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentSearch;
