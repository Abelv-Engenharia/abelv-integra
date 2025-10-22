import { useState, useEffect, useMemo } from "react";
import { Building2, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VisualizarPrestadorModal } from "@/components/gestao-pessoas/prestadores/VisualizarPrestadorModal";
import { EditarPrestadorModal } from "@/components/gestao-pessoas/prestadores/EditarPrestadorModal";
import { usePrestadoresPJ, useDeletePrestadorPJ, PrestadorPJ } from "@/hooks/gestao-pessoas/usePrestadoresPJ";

export default function ConsultaPrestadores() {
  const { data: prestadores = [], isLoading } = usePrestadoresPJ();
  const deletePrestadorMutation = useDeletePrestadorPJ();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [prestadorToDelete, setPrestadorToDelete] = useState<PrestadorPJ | null>(null);
  const [visualizarModal, setVisualizarModal] = useState(false);
  const [editarModal, setEditarModal] = useState(false);
  const [prestadorSelecionado, setPrestadorSelecionado] = useState<PrestadorPJ | null>(null);

  // Filtrar prestadores
  const filteredPrestadores = useMemo(() => {
    if (searchTerm.trim() === "") {
      return prestadores;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return prestadores.filter((prestador) => 
      prestador.nomeCompleto?.toLowerCase().includes(searchLower) ||
      prestador.razaoSocial?.toLowerCase().includes(searchLower) ||
      prestador.cpf?.includes(searchTerm) ||
      prestador.cnpj?.includes(searchTerm) ||
      prestador.email?.toLowerCase().includes(searchLower) ||
      prestador.emailRepresentante?.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, prestadores]);

  const handleVisualizar = (prestador: any) => {
    setPrestadorSelecionado(prestador);
    setVisualizarModal(true);
  };

  const handleEditar = (prestador: any) => {
    setPrestadorSelecionado(prestador);
    setEditarModal(true);
  };

  const handleDeleteClick = (prestador: PrestadorPJ) => {
    setPrestadorToDelete(prestador);
  };

  const handleConfirmDelete = async () => {
    if (prestadorToDelete) {
      try {
        await deletePrestadorMutation.mutateAsync(prestadorToDelete.id);
        setPrestadorToDelete(null);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao excluir prestador.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Consulta de Prestadores</h1>
          <p className="text-muted-foreground">Visualize, edite e gerencie todos os prestadores cadastrados</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prestadores Cadastrados</CardTitle>
          <CardDescription>
            Total de {filteredPrestadores.length} prestador(es) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Barra de pesquisa */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, razão social, CPF, CNPJ ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabela */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Completo</TableHead>
                  <TableHead>Razão Social</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Carregando prestadores...
                    </TableCell>
                  </TableRow>
                ) : filteredPrestadores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Nenhum prestador encontrado com os critérios de busca." : "Nenhum prestador cadastrado."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrestadores.map((prestador) => (
                    <TableRow key={prestador.id}>
                      <TableCell className="font-medium">{prestador.nomeCompleto}</TableCell>
                      <TableCell>{prestador.razaoSocial}</TableCell>
                      <TableCell>{prestador.cpf}</TableCell>
                      <TableCell>{prestador.cnpj}</TableCell>
                      <TableCell>{prestador.emailRepresentante || prestador.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVisualizar(prestador)}
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditar(prestador)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(prestador)}
                            title="Excluir"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Visualização */}
      {prestadorSelecionado && (
        <VisualizarPrestadorModal
          open={visualizarModal}
          onOpenChange={setVisualizarModal}
          prestador={prestadorSelecionado}
        />
      )}

      {/* Modal de Edição */}
      {prestadorSelecionado && (
        <EditarPrestadorModal
          open={editarModal}
          onOpenChange={setEditarModal}
          prestador={prestadorSelecionado}
        />
      )}

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!prestadorToDelete} onOpenChange={() => setPrestadorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o prestador <strong>{prestadorToDelete?.nomeCompleto}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
