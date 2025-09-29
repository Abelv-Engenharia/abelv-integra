
import { useState, useEffect, useRef } from "react";
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
    baseLegal?: string;    // nome vindo do gráfico
    baseLegalId?: string;  // id vindo do gráfico
  };
  searchTerm?: string;
}

// Converte o payload do banco para a interface
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

const DesviosTable = ({ filters, searchTerm }: DesviosTableProps) => {
  const { toast } = useToast();
  const { data: userCCAs = [], isLoading: isLoadingCCAs } = useUserCCAs();

  const [desvios, setDesvios] = useState<DesvioCompleto[]>([]);
  const [editDesvio, setEditDesvio] = useState<DesvioCompleto | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDesvioId, setEditDesvioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Controle de concorrência entre buscas
  const fetchSeq = useRef(0);
  const allowedCcaIds = userCCAs.map(cca => cca.id);

  const fetchDesvios = async () => {
    const myId = ++fetchSeq.current;
    setIsLoading(true);

    try {
      if (allowedCcaIds.length === 0 && !isLoadingCCAs) {
        if (myId !== fetchSeq.current) return;
        setDesvios([]);
        setIsLoading(false);
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

      // ====== Filtros ======
      if (filters?.year && filters.year !== "") {
        const year = parseInt(filters.year);
        query = query
          .gte("data_desvio", `${year}-01-01`)
          .lte("data_desvio", `${year}-12-31`);
      }

      if (filters?.month && filters.month !== "" && filters.month !== "todos") {
        const month = parseInt(filters.month);
        const year = filters?.year && filters.year !== "" ? parseInt(filters.year) : new Date().getFullYear();
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const startDateStr = startDate.toISOString().split("T")[0];
        const endDateStr = endDate.toISOString().split("T")[0];
        query = query.gte("data_desvio", startDateStr).lte("data_desvio", endDateStr);
      }

      if (filters?.cca && filters.cca !== "" && filters.cca !== "todos") {
        const { data: ccaData } = await supabase
          .from("ccas")
          .select("id")
          .eq("codigo", filters.cca)
          .single();
        if (ccaData) query = query.eq("cca_id", ccaData.id);
      }

      if (filters?.company && filters.company !== "" && filters.company !== "todas") {
        const { data: empresaData } = await supabase
          .from("empresas")
          .select("id")
          .eq("nome", filters.company)
          .single();
        if (empresaData) query = query.eq("empresa_id", empresaData.id);
      }

      if (filters?.risk && filters.risk !== "" && filters.risk !== "todos") {
        query = query.eq("classificacao_risco", filters.risk);
      }

      if (filters?.disciplina && filters.disciplina !== "" && filters.disciplina !== "todas") {
        const { data: disciplinaData } = await supabase
          .from("disciplinas")
          .select("id")
          .eq("nome", filters.disciplina)
          .single();
        if (disciplinaData) query = query.eq("disciplina_id", disciplinaData.id);
      }

      if (filters?.tipo && filters.tipo !== "" && filters.tipo !== "todos") {
        const { data: tipoData } = await supabase
          .from("tipos_registro")
          .select("id")
          .eq("nome", filters.tipo)
          .single();
        if (tipoData) query = query.eq("tipo_registro_id", tipoData.id);
      }

      if (filters?.evento && filters.evento !== "" && filters.evento !== "todos") {
        const { data: eventoData } = await supabase
          .from("eventos_identificados")
          .select("id")
          .eq("nome", filters.evento)
          .single();
        if (eventoData) query = query.eq("evento_identificado_id", eventoData.id);
      }

      if (filters?.processo && filters.processo !== "" && filters.processo !== "todos") {
        const { data: processoData } = await supabase
          .from("processos")
          .select("id")
          .eq("nome", filters.processo)
          .single();
        if (processoData) query = query.eq("processo_id", processoData.id);
      }

      // --- Base Legal (robusto: aceita ID ou nome parcial) ---
      if ((filters?.baseLegalId && filters.baseLegalId !== "") || (filters?.baseLegal && filters.baseLegal !== "" && filters.baseLegal !== "todas")) {
        if (filters?.baseLegalId && filters.baseLegalId !== "") {
          const idNum = Number(filters.baseLegalId);
          if (Number.isFinite(idNum)) {
            query = query.eq("base_legal_opcao_id", idNum);
          } else {
            console.warn("baseLegalId recebido não é numérico:", filters.baseLegalId);
          }
        } else if (filters?.baseLegal && filters.baseLegal !== "") {
          const termo = String(filters.baseLegal).trim();

          // tentativa 1: igual
          let { data: baseData } = await supabase
            .from("base_legal_opcoes")
            .select("id, nome")
            .ilike("nome", termo)
            .limit(1)
            .maybeSingle();

          // tentativa 2: parcial
          if (!baseData) {
            const { data: baseLike } = await supabase
              .from("base_legal_opcoes")
              .select("id, nome")
              .ilike("nome", `%${termo}%`)
              .order("nome", { ascending: true })
              .limit(1);
            baseData = baseLike?.[0];
          }

          // tentativa 3: prefixo antes de " - "
          if (!baseData && termo.includes(" - ")) {
            const prefixo = termo.split(" - ")[0].trim();
            const { data: basePrefix } = await supabase
              .from("base_legal_opcoes")
              .select("id, nome")
              .ilike("nome", `${prefixo}%`)
              .order("nome", { ascending: true })
              .limit(1);
            baseData = basePrefix?.[0];
          }

          if (baseData?.id !== undefined && baseData?.id !== null) {
            query = query.eq("base_legal_opcao_id", baseData.id as number);
          } else {
            // força sem resultado com um número impossível
            query = query.eq("base_legal_opcao_id", -1);
          }
        }
      }

      if (filters?.empresa && filters.empresa !== "" && filters.empresa !== "todas") {
        const { data: empresaData } = await supabase
          .from("empresas")
          .select("id")
          .eq("nome", filters.empresa)
          .single();
        if (empresaData) query = query.eq("empresa_id", empresaData.id);
      }

      if (filters?.classificacao && filters.classificacao !== "" && filters.classificacao !== "todos") {
        query = query.eq("classificacao_risco", filters.classificacao);
      }

      if (searchTerm && searchTerm.trim() !== "") {
        query = query.or(`descricao_desvio.ilike.%${searchTerm}%,responsavel_inspecao.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order("data_desvio", { ascending: false });

      if (myId !== fetchSeq.current) return; // ignora se outra chamada mais nova foi feita

      if (error) {
        console.error("Erro ao buscar desvios:", error);
        setDesvios([]);
      } else {
        let convertedData = (data || []).map(convertDbToDesvio);

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
      if (myId !== fetchSeq.current) return;
      console.error("Erro ao buscar desvios:", error);
      setDesvios([]);
    } finally {
      if (myId === fetchSeq.current) setIsLoading(false);
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
  }, [allowedCcaIds.join(","), isLoadingCCAs, JSON.stringify(filters), searchTerm]);

  const handleStatusUpdated = (id: string, newStatus: string) => {
    setDesvios(desvios.map(d => (d.id === id ? { ...d, status: newStatus } : d)));
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
    if (deleted && id) {
      setDesvios(prev => prev.filter(d => d.id !== id));
      setTimeout(() => fetchDesvios(), 500);
    } else {
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
              <colgroup>
                <col className="w-24 sm:w-32" />             {/* Data */}
                <col className="w-56 sm:w-64" />             {/* CCA */}
                <col className="w-[340px] sm:w-[440px]" />   {/* Descrição */}
                <col className="w-[260px] sm:w-[320px]" />   {/* Base Legal */}
                <col className="w-32 sm:w-40" />             {/* Empresa */}
                <col className="w-32 sm:w-40" />             {/* Disciplina */}
                <col className="w-16 sm:w-20" />             {/* Risco */}
                <col className="w-20 sm:w-24" />             {/* Status */}
                <col className="w-24 sm:w-32" />             {/* Ações */}
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
