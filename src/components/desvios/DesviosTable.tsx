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
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import DesviosTableRow from "./DesviosTableRow";
import { DesvioCompleto } from "@/services/desvios/desviosCompletosService";

const DesviosTable = () => {
  const { toast } = useToast();
  const { data: userCCAs = [] } = useUserCCAs();
  const [desvios, setDesvios] = useState<DesvioCompleto[]>([]);
  const [editDesvio, setEditDesvio] = useState<DesvioCompleto | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDesvioId, setEditDesvioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const allowedCcaIds = userCCAs.map(cca => cca.id);

  // Recarrega desvios do backend filtrando pelos CCAs permitidos
  const fetchDesvios = async () => {
    setIsLoading(true);
    try {
      if (allowedCcaIds.length === 0) {
        setDesvios([]);
        return;
      }

      const { data, error } = await supabase
        .from('desvios_completos')
        .select(`
          *,
          ccas:cca_id(nome)
        `)
        .in('cca_id', allowedCcaIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar desvios:', error);
        setDesvios([]);
      } else {
        console.log("Desvios filtrados por CCA carregados:", data);
        setDesvios(data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar desvios:', error);
      setDesvios([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (allowedCcaIds.length > 0) {
      fetchDesvios();
    } else {
      setDesvios([]);
      setIsLoading(false);
    }
  }, [allowedCcaIds.join(',')]);

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

  // Remove o desvio da UI de forma otimista, e faz fetch para manter sincronizado
  const handleDesvioDeleted = (id?: string, deleted?: boolean) => {
    if (deleted && id) {
      console.log("Removendo desvio da tabela na UI (otimista):", id);
      setDesvios(prev => prev.filter((d) => d.id !== id));
      fetchDesvios();
      toast({
        title: "Desvio excluído",
        description: "O desvio foi removido com sucesso.",
        variant: "default",
      });
    } else {
      toast({
        title: "Erro técnico ao excluir",
        description: "Não foi possível remover o desvio no servidor. Por favor, recarregue a página ou tente novamente.",
        variant: "destructive",
      });
      console.error("Falha no handleDesvioDeleted (deleted=false ou id indefinido):", id, deleted);
    }
  };

  if (userCCAs.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-md border shadow-sm">
        <div className="flex justify-center items-center p-8">
          <p className="text-muted-foreground">Você não tem acesso a nenhum CCA.</p>
        </div>
      </div>
    );
  }

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
                      onDesvioDeleted={handleDesvioDeleted}
                      editDesvioId={editDesvioId}
                      editDialogOpen={editDialogOpen}
                      setEditDialogOpen={setEditDialogOpen}
                      onDesvioUpdated={handleDesvioUpdated}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum desvio encontrado para os CCAs permitidos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando {desvios.length} de {desvios.length} desvios dos CCAs permitidos
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
