import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService, DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import DesviosTableRow from "./DesviosTableRow";

const DesviosTable = () => {
  const { toast } = useToast();
  const [desvios, setDesvios] = useState<DesvioCompleto[]>([]);
  const [editDesvio, setEditDesvio] = useState<DesvioCompleto | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDesvioId, setEditDesvioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDesvios = async () => {
    setIsLoading(true);
    try {
      const data = await desviosCompletosService.getAll();
      setDesvios(data);
    } catch (error) {
      console.error('Erro ao buscar desvios:', error);
      setDesvios([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesvios();
  }, []);

  const handleStatusUpdated = (id: string, newStatus: string) => {
    setDesvios(desvios.map(d =>
      d.id === id ? { ...d, status: newStatus } : d
    ));
  };

  const handleEditClick = (desvio: DesvioCompleto) => {
    setEditDesvio(desvio);
    setEditDesvioId(desvio.id || null);
    setEditDialogOpen(true);
  };

  const handleDesvioUpdated = () => {
    fetchDesvios();
    setEditDialogOpen(false);
    setEditDesvioId(null);
  };

  const handleDesvioDeleted = (id?: string) => {
    fetchDesvios();
    toast({
      title: "Desvio excluído",
      description: "O desvio foi removido com sucesso.",
      variant: "default",
    });
  };

  return (
    <>
      <div className="bg-white rounded-md border shadow-sm">
        <div className="relative w-full overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <p>Carregando desvios...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="max-w-[250px]">Descrição</TableHead>
                  <TableHead>CCA</TableHead>
                  <TableHead>Risco</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {desvios.length > 0 ? (
                  desvios.map((desvio) => (
                    <DesviosTableRow
                      key={desvio.id}
                      desvio={desvio}
                      onStatusUpdated={handleStatusUpdated}
                      onEditClick={handleEditClick}
                      onDesvioDeleted={() => handleDesvioDeleted(desvio.id)}
                      editDesvioId={editDesvioId}
                      editDialogOpen={editDialogOpen}
                      setEditDialogOpen={setEditDialogOpen}
                      onDesvioUpdated={handleDesvioUpdated}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum desvio encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando {desvios.length} de {desvios.length} desvios
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              Anterior
            </Button>
            <Button variant="outline" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesviosTable;

// Após esta alteração, DesviosTable.tsx ficou muito menor e muito mais simples!
