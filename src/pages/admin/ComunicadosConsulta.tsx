import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Edit, Trash2, FileText } from "lucide-react";
import { useComunicados, useExcluirComunicado } from "@/hooks/useComunicados";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

const ComunicadosConsulta = () => {
  const navigate = useNavigate();
  const { data: comunicados, isLoading } = useComunicados();
  const excluirComunicado = useExcluirComunicado();
  
  const [filtros, setFiltros] = useState({
    busca: "",
    status: "todos", // todos, ativo, inativo
    periodo: "todos" // todos, vigente, expirado
  });

  const comunicadosFiltrados = comunicados?.filter(comunicado => {
    const today = new Date().toISOString().split('T')[0];
    
    // Filtro de busca
    if (filtros.busca && !comunicado.titulo.toLowerCase().includes(filtros.busca.toLowerCase())) {
      return false;
    }
    
    // Filtro de status
    if (filtros.status === "ativo" && !comunicado.ativo) return false;
    if (filtros.status === "inativo" && comunicado.ativo) return false;
    
    // Filtro de período
    if (filtros.periodo === "vigente") {
      if (today < comunicado.data_inicio || today > comunicado.data_fim) return false;
    }
    if (filtros.periodo === "expirado") {
      if (today <= comunicado.data_fim) return false;
    }
    
    return true;
  }) || [];

  const getStatusBadge = (comunicado: any) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (!comunicado.ativo) {
      return <Badge variant="secondary">Inativo</Badge>;
    }
    
    if (today < comunicado.data_inicio) {
      return <Badge variant="outline">Aguardando</Badge>;
    }
    
    if (today > comunicado.data_fim) {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    
    return <Badge variant="default">Ativo</Badge>;
  };

  const handleExcluir = async (id: string) => {
    try {
      await excluirComunicado.mutateAsync(id);
    } catch (error) {
      console.error('Erro ao excluir comunicado:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Carregando comunicados...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Consulta de Comunicados</h1>
          <p className="text-muted-foreground">
            Gerencie todos os comunicados do sistema.
          </p>
        </div>
        <Button onClick={() => navigate('/admin/comunicados/cadastro')}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Comunicado
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Buscar por título..."
                value={filtros.busca}
                onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
              />
            </div>
            <div>
              <Select
                value={filtros.status}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Apenas ativos</SelectItem>
                  <SelectItem value="inativo">Apenas inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={filtros.periodo}
                onValueChange={(value) => setFiltros(prev => ({ ...prev, periodo: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                  <SelectItem value="vigente">Vigentes</SelectItem>
                  <SelectItem value="expirado">Expirados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Anexo</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comunicadosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-2" />
                      Nenhum comunicado encontrado
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                comunicadosFiltrados.map((comunicado) => (
                  <TableRow key={comunicado.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{comunicado.titulo}</div>
                        {comunicado.descricao && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {comunicado.descricao}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {format(new Date(comunicado.data_inicio), "dd/MM/yyyy", { locale: pt })} -
                        </div>
                        <div>
                          {format(new Date(comunicado.data_fim), "dd/MM/yyyy", { locale: pt })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(comunicado)}
                    </TableCell>
                    <TableCell>
                      {comunicado.arquivo_nome ? (
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{comunicado.arquivo_nome}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(comunicado.created_at), "dd/MM/yyyy HH:mm", { locale: pt })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/comunicados/detalhe/${comunicado.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/comunicados/edicao/${comunicado.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o comunicado "{comunicado.titulo}"?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleExcluir(comunicado.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComunicadosConsulta;