import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import DesviosTableRow from "./DesviosTableRow";
import { DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import { TableLoadingSkeleton } from "@/components/ui/loading-skeleton";
import { InlineLoader } from "@/components/common/PageLoader";
import { AlertCircle } from "lucide-react";

interface DesviosTableProps {
  filters?: {
    year?: string;
    month?: string;
    cca?: string;
    company?: string;
    status?: string;
    risk?: string;
  };
  searchTerm?: string;
}

// Helper function to convert database types to our interface
const convertDbToDesvio = (dbDesvio: any): DesvioCompleto => {
  return {
    ...dbDesvio,
    funcionarios_envolvidos: Array.isArray(dbDesvio.funcionarios_envolvidos) 
      ? dbDesvio.funcionarios_envolvidos 
      : dbDesvio.funcionarios_envolvidos 
        ? [dbDesvio.funcionarios_envolvidos] 
        : [],
    acoes: Array.isArray(dbDesvio.acoes) 
      ? dbDesvio.acoes 
      : dbDesvio.acoes 
        ? [dbDesvio.acoes] 
        : [],
  };
};

const DesviosTable = ({
  filters,
  searchTerm
}: DesviosTableProps) => {
  const {
    toast
  } = useToast();
  const {
    data: userCCAs = [],
    isLoading: isLoadingCCAs
  } = useUserCCAs();
  const [desvios, setDesvios] = useState<DesvioCompleto[]>([]);
  const [editDesvio, setEditDesvio] = useState<DesvioCompleto | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDesvioId, setEditDesvioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const allowedCcaIds = userCCAs.map(cca => cca.id);

  // Recarrega desvios do backend filtrando pelos CCAs permitidos e filtros aplicados
  const fetchDesvios = async () => {
    setIsLoading(true);
    try {
      if (allowedCcaIds.length === 0 && !isLoadingCCAs) {
        setDesvios([]);
        return;
      }
      let query = supabase.from('desvios_completos').select(`
          *,
          ccas:cca_id(nome, codigo),
          empresas:empresa_id(nome),
          disciplinas:disciplina_id(nome)
        `).in('cca_id', allowedCcaIds);

      // Aplicar filtros se fornecidos
      if (filters?.year && filters.year !== "") {
        query = query.gte('data_desvio', `${filters.year}-01-01`).lte('data_desvio', `${filters.year}-12-31`);
      }
      if (filters?.month && filters.month !== "" && filters.month !== "todos") {
        const monthStr = filters.month.padStart(2, '0');
        if (filters?.year) {
          query = query.gte('data_desvio', `${filters.year}-${monthStr}-01`).lte('data_desvio', `${filters.year}-${monthStr}-31`);
        }
      }
      if (filters?.status && filters.status !== "" && filters.status !== "todos") {
        query = query.eq('status', filters.status);
      }
      if (filters?.risk && filters.risk !== "" && filters.risk !== "todos") {
        query = query.eq('classificacao_risco', filters.risk);
      }

      // Aplicar busca por termo se fornecido
      if (searchTerm && searchTerm.trim() !== "") {
        query = query.or(`descricao_desvio.ilike.%${searchTerm}%,local.ilike.%${searchTerm}%`);
      }
      const {
        data,
        error
      } = await query.order('created_at', {
        ascending: false
      });
      if (error) {
        console.error('Erro ao buscar desvios:', error);
        setDesvios([]);
      } else {
        console.log("Desvios filtrados carregados:", data);
        // Convert database results to DesvioCompleto format
        const convertedData = (data || []).map(convertDbToDesvio);
        setDesvios(convertedData);
      }
    } catch (error) {
      console.error('Erro ao buscar desvios:', error);
      setDesvios([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoadingCCAs) {
      if (allowedCcaIds.length > 0) {
        fetchDesvios();
      } else {
        setDesvios([]);
        setIsLoading(false);
      }
    }
  }, [allowedCcaIds.join(','), isLoadingCCAs, filters, searchTerm]);

  const handleStatusUpdated = (id: string, newStatus: string) => {
    setDesvios(desvios.map(d => d.id === id ? {
      ...d,
      status: newStatus
    } : d));
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

  const handleDesvioDeleted = (id?: string, deleted?: boolean) => {
    if (deleted && id) {
      console.log("Removendo desvio da tabela na UI (otimista):", id);
      setDesvios(prev => prev.filter(d => d.id !== id));
      fetchDesvios();
      toast({
        title: "Desvio excluído",
        description: "O desvio foi removido com sucesso.",
        variant: "default"
      });
    } else {
      toast({
        title: "Erro técnico ao excluir",
        description: "Não foi possível remover o desvio no servidor. Por favor, recarregue a página ou tente novamente.",
        variant: "destructive"
      });
      console.error("Falha no handleDesvioDeleted (deleted=false ou id indefinido):", id, deleted);
    }
  };

  if (isLoadingCCAs) {
    return <div className="table-container">
        <div className="p-4 sm:p-6">
          <InlineLoader text="Carregando permissões..." />
        </div>
      </div>;
  }

  if (userCCAs.length === 0) {
    return <div className="table-container">
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
          <div className="text-center space-y-2">
            <p className="text-responsive font-medium">Acesso Restrito</p>
            <p className="text-sm text-muted-foreground">Você não tem acesso a nenhum CCA.</p>
          </div>
        </div>
      </div>;
  }

  return <>
      <div className="table-container">
        <div className="relative w-full overflow-auto">
          {isLoading ? <div className="p-4 sm:p-6">
              <TableLoadingSkeleton rows={8} />
            </div> : <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm w-24 sm:w-32">Data</TableHead>
                  <TableHead className="text-xs sm:text-sm w-56 sm:w-64">CCA</TableHead>
                  <TableHead className="text-xs sm:text-sm min-w-[200px] max-w-[250px]">Descrição</TableHead>
                  <TableHead className="text-xs sm:text-sm w-32 sm:w-40">Empresa</TableHead>
                  <TableHead className="text-xs sm:text-sm w-32 sm:w-40">Disciplina</TableHead>
                  <TableHead className="text-xs sm:text-sm w-16 sm:w-20">Risco</TableHead>
                  <TableHead className="text-xs sm:text-sm w-20 sm:w-24">Status</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm w-24 sm:w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {desvios.length > 0 ? desvios.map(desvio => <DesviosTableRow key={desvio.id} desvio={desvio} onStatusUpdated={handleStatusUpdated} onEditClick={handleEditClick} onDesvioDeleted={handleDesvioDeleted} editDesvioId={editDesvioId} editDialogOpen={editDialogOpen} setEditDialogOpen={setEditDialogOpen} onDesvioUpdated={handleDesvioUpdated} />) : <TableRow>
                    <TableCell colSpan={8} className="h-24 sm:h-32">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                        <div className="text-center space-y-1">
                          <p className="text-responsive font-medium">Nenhum desvio encontrado</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Não há desvios cadastrados para os CCAs permitidos.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>}
              </TableBody>
            </Table>}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 border-t gap-3">
          <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
            Mostrando {desvios.length} de {desvios.length} desvios dos CCAs permitidos
          </div>
          <div className="button-group order-1 sm:order-2">
            <Button variant="outline" disabled size="sm" className="text-xs sm:text-sm">
              Anterior
            </Button>
            <Button variant="outline" disabled size="sm" className="text-xs sm:text-sm">
              Próximo
            </Button>
          </div>
        </div>
      </div>
    </>;
};

export default DesviosTable;
