
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
import { calculateStatusAcao } from "@/utils/desviosUtils";

interface DesviosTableProps {
  filters?: {
    year?: string;
    month?: string;
    cca?: string;
    company?: string;
    status?: string;
    risk?: string;
    disciplina?: string;
    empresa?: string;
    classificacao?: string;
    tipo?: string;
    evento?: string;
    processo?: string;
    baseLegal?: string;
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
  const { toast } = useToast();
  const { data: userCCAs = [], isLoading: isLoadingCCAs } = useUserCCAs();
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

      let query = supabase
        .from("desvios_completos")
        .select(`
          *,
          ccas:cca_id(nome, codigo),
          empresas:empresa_id(nome),
          disciplinas:disciplina_id(nome),
          base_legal_opcoes:base_legal_opcao_id(nome)
        `)
        .in("cca_id", allowedCcaIds);

      // Aplicar filtros se fornecidos
      if (filters?.year && filters.year !== "") {
        const year = parseInt(filters.year);
        query = query
          .gte("data_desvio", `${year}-01-01`)
          .lte("data_desvio", `${year}-12-31`);
        console.log(`Aplicando filtro de ano: ${year}`);
      }

      if (filters?.month && filters.month !== "" && filters.month !== "todos") {
        const month = parseInt(filters.month);
        const year = filters?.year && filters.year !== "" ? parseInt(filters.year) : new Date().getFullYear();
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const startDateStr = startDate.toISOString().split("T")[0];
        const endDateStr = endDate.toISOString().split("T")[0];
        console.log(`Aplicando filtro de mês ${month}/${year}: ${startDateStr} até ${endDateStr}`);
        query = query.gte("data_desvio", startDateStr).lte("data_desvio", endDateStr);
      }

      // Filtro por CCA específico (além da permissão do usuário)
      if (filters?.cca && filters.cca !== "" && filters.cca !== "todos") {
        const { data: ccaData } = await supabase
          .from("ccas")
          .select("id")
          .eq("codigo", filters.cca)
          .single();
        if (ccaData) {
          query = query.eq("cca_id", ccaData.id);
        }
      }

      // Filtro por empresa (via company)
      if (filters?.company && filters.company !== "" && filters.company !== "todas") {
        const { data: empresaData } = await supabase
          .from("empresas")
          .select("id")
          .eq("nome", filters.company)
          .single();
        if (empresaData) {
          query = query.eq("empresa_id", empresaData.id);
        }
      }

      if (filters?.risk && filters.risk !== "" && filters.risk !== "todos") {
        query = query.eq("classificacao_risco", filters.risk);
      }

      // Filtros adicionais vindos dos gráficos
      if (filters?.disciplina && filters.disciplina !== "") {
        const { data: disciplinaData } = await supabase
          .from("disciplinas")
          .select("id")
          .eq("nome", filters.disciplina)
          .single();
        if (disciplinaData) {
          query = query.eq("disciplina_id", disciplinaData.id);
        }
      }

      if (filters?.tipo && filters.tipo !== "") {
        const { data: tipoData } = await supabase
          .from("tipos_registro")
          .select("id")
          .eq("nome", filters.tipo)
          .single();
        if (tipoData) {
          query = query.eq("tipo_registro_id", tipoData.id);
        }
      }

      if (filters?.evento && filters.evento !== "") {
        const { data: eventoData } = await supabase
          .from("eventos_identificados")
          .select("id")
          .eq("nome", filters.evento)
          .single();
        if (eventoData) {
          query = query.eq("evento_identificado_id", eventoData.id);
        }
      }

      if (filters?.processo && filters.processo !== "") {
        const { data: processoData } = await supabase
          .from("processos")
          .select("id")
          .eq("nome", filters.processo)
          .single();
        if (processoData) {
          query = query.eq("processo_id", processoData.id);
        }
      }

      if (filters?.baseLegal && filters.baseLegal !== "") {
        const { data: baseData } = await supabase
          .from("base_legal_opcoes")
          .select("id")
          .eq("nome", filters.baseLegal)
          .single();
        if (baseData) {
          query = query.eq("base_legal_opcao_id", baseData.id);
        }
      }

      if (filters?.empresa && filters.empresa !== "") {
        const { data: empresaData } = await supabase
          .from("empresas")
          .select("id")
          .eq("nome", filters.empresa)
          .single();
        if (empresaData) {
          query = query.eq("empresa_id", empresaData.id);
        }
      }

      if (filters?.classificacao && filters.classificacao !== "") {
        query = query.eq("classificacao_risco", filters.classificacao);
      }

      // Aplicar busca por termo se fornecido
      if (searchTerm && searchTerm.trim() !== "") {
        query = query.or(`descricao_desvio.ilike.%${searchTerm}%,responsavel_inspecao.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order("data_desvio", { ascending: false });

      if (error) {
        console.error("Erro ao buscar desvios:", error);
        setDesvios([]);
      } else {
        console.log("Desvios filtrados carregados:", data);
        // Convert database results to DesvioCompleto format
        let convertedData = (data || []).map(convertDbToDesvio);

        // Aplicar filtro de status APÓS buscar os dados (pois precisa calcular o status)
        if (filters?.status && filters.status !== "" && filters.status !== "todos") {
          convertedData = convertedData.filter(desvio => {
            const calculatedStatus = calculateStatusAcao(
              desvio.situacao || desvio.status || "",
              desvio.prazo_conclusao || ""
            );
            const displayStatus = calculatedStatus || desvio.status || "PENDENTE";
            return displayStatus === filters.status;
          });
        }

        setDesvios(convertedData);
      }
    } catch (error) {
      console.error("Erro ao buscar desvios:", error);
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
  }, [allowedCcaIds.join(","), isLoadingCCAs, filters, searchTerm]);

  const handleStatusUpdated = (id: string, newStatus: string) => {
    setDesvios(
      desvios.map(d =>
        d.id === id
          ? {
              ...d,
              status: newStatus,
            }
          : d
      )
    );
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

  const handleDesvioDeleted = async (id?: string, deleted?: boolean) => {
    console.log("🔄 handleDesvioDeleted chamado:", { id, deleted });

    if (deleted && id) {
      console.log("✅ Removendo desvio da UI:", id);

      // Atualizar imediatamente a UI
      setDesvios(prev => {
        const updated = prev.filter(d => d.id !== id);
        console.log(`📊 UI atualizada: ${prev.length} -> ${updated.length} desvios`);
        return updated;
      });

      // Recarregar do servidor para confirmar
      console.log("📡 Recarregando dados do servidor...");
      setTimeout(async () => {
        await fetchDesvios();
      }, 1000);
    } else {
      console.error("❌ Falha na exclusão, recarregando dados:", { id, deleted });
      await fetchDesvios();
    }
  };

  if (isLoadingCCAs) {
    return (
      <div className="table-container">
        <div className="p-4 sm:p-6">
          <InlineLoader text="Carregando permissões..." />
        </div>
      </div>
    );
  }

  if (userCCAs.length === 0) {
    return (
      <div className="table-container">
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
          <div className="text-center space-y-2">
            <p className="text-responsive font-medium">Acesso Restrito</p>
            <p className="text-sm text-muted-foreground">Você não tem acesso a nenhum CCA.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="table-container">
        <div className="relative w-full overflow-auto">
          {isLoading ? (
            <div className="p-4 sm:p-6">
              <TableLoadingSkeleton rows={8} />
            </div>
          ) : (
            <Table className="w-full table-fixed">
              {/* Controle de largura das colunas */}
              <colgroup>
                <col className="w-24 sm:w-32" />            {/* Data */}
                <col className="w-56 sm:w-64" />            {/* CCA */}
                <col className="w-[360px] sm:w-[480px]" />  {/* Descrição */}
                <col className="w-40 sm:w-48" />            {/* Base Legal */}
                <col className="w-32 sm:w-40" />            {/* Empresa */}
                <col className="w-32 sm:w-40" />            {/* Disciplina */}
                <col className="w-16 sm:w-20" />            {/* Risco */}
                <col className="w-20 sm:w-24" />            {/* Status */}
                <col className="w-24 sm:w-32" />            {/* Ações */}
              </colgroup>

              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Data</TableHead>
                  <TableHead className="text-xs sm:text-sm">CCA</TableHead>
                  <TableHead className="text-xs sm:text-sm">Descrição</TableHead>
                  <TableHead className="text-xs sm:text-sm">Base Legal</TableHead>
                  <TableHead className="text-xs sm:text-sm">Empresa</TableHead>
                  <TableHead className="text-xs sm:text-sm">Disciplina</TableHead>
                  <TableHead className="text-xs sm:text-sm">Risco</TableHead>
                  <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Ações</TableHead>
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
                    <TableCell colSpan={9} className="h-24 sm:h-32">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                        <div className="text-center space-y-1">
                          <p className="text-responsive font-medium">Nenhum desvio encontrado</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {filters?.status && filters.status !== "todos"
                              ? `Não há desvios com status "${filters.status}" para os filtros aplicados.`
                              : "Não há desvios cadastrados para os CCAs permitidos."
                            }
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
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
    </>
  );
};

export default DesviosTable;
