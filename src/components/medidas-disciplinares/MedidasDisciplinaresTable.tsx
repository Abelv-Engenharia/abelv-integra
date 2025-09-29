import { useEffect, useState } from "react";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { listarCCAs } from "@/services/medidasDisciplinaresService";
import { supabase } from "@/integrations/supabase/client";
import { MedidaDisciplinar, DB_TO_UI_TIPO_MAP, TipoMedidaAplicada } from "@/types/medidasDisciplinares";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, FileText } from "lucide-react";
import MedidaDisciplinarViewDialog from "./MedidaDisciplinarViewDialog";
import MedidaDisciplinarEditDialog from "./MedidaDisciplinarEditDialog";
import MedidaDisciplinarDeleteDialog from "./MedidaDisciplinarDeleteDialog";
import { useToast } from "@/hooks/use-toast";

interface Props {
  searchTerm: string;
  filters: {
    year: string;
    month: string;
    cca: string;
    tipo_medida: string;
    funcionario?: string;
  };
}

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR");
}

const tiposBadgeColor: Record<string, string> = {
  "ADVERTÊNCIA VERBAL": "bg-yellow-200 text-yellow-900",
  "ADVERTÊNCIA ESCRITA": "bg-orange-200 text-orange-900",
  "SUSPENSÃO": "bg-pink-200 text-pink-900",
  "DEMISSÃO POR JUSTA CAUSA": "bg-red-200 text-red-900",
};

const MedidasDisciplinaresTable = ({ searchTerm, filters }: Props) => {
  const [medidas, setMedidas] = useState<MedidaDisciplinar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMedida, setSelectedMedida] = useState<MedidaDisciplinar | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMedidas() {
      setLoading(true);

      let query = supabase
        .from("medidas_disciplinares")
        .select("id, cca_id, funcionario_id, medida, data, motivo, pdf_url, created_at");

      // Filtros
      if (filters.year && filters.year !== "todos") {
        query = query.gte("data", `${filters.year}-01-01`).lte("data", `${filters.year}-12-31`);
      }
      if (filters.month && filters.month !== "" && filters.month !== "todos") {
        const monthNum = Number(filters.month).toString().padStart(2, "0");
        query = query.gte("data", `${filters.year}-${monthNum}-01`).lte("data", `${filters.year}-${monthNum}-31`);
      }
      if (filters.cca && filters.cca !== "" && filters.cca !== "todos") {
        query = query.eq("cca_id", Number(filters.cca));
      }
      if (filters.tipo_medida && filters.tipo_medida !== "todos") {
        query = query.eq("medida", filters.tipo_medida as "ADVERTÊNCIA VERBAL" | "ADVERTÊNCIA ESCRITA" | "SUSPENSÃO" | "DEMISSÃO POR JUSTA CAUSA");
      }
      if (searchTerm) {
        query = query.ilike("motivo", `%${searchTerm}%`);
      }

      const { data, error } = await query.order("data", { ascending: false });
      if (!error && data) {
        setMedidas(
          (data as any[]).map((m) => ({
            id: m.id,
            cca_id: m.cca_id?.toString() ?? "",
            funcionario_id: m.funcionario_id ?? "",
            tipo_medida: DB_TO_UI_TIPO_MAP[m.medida] as TipoMedidaAplicada, // MAPA tipo_medida para enum UI
            data_aplicacao: m.data,
            descricao: m.motivo,
            arquivo_url: m.pdf_url,
            created_at: m.created_at,
          }))
        );
      } else setMedidas([]);
      setLoading(false);
    }
    fetchMedidas();
  }, [searchTerm, filters]);

  const handleView = (medida: MedidaDisciplinar) => {
    setSelectedMedida(medida);
    setViewDialogOpen(true);
  };

  const handleViewPdf = async (pdfUrl: string) => {
    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = pdfUrl.split('/storage/v1/object/public/medidas_disciplinares/');
      if (urlParts.length < 2) {
        throw new Error("URL inválida");
      }
      
      const filePath = urlParts[1];
      
      // Obter URL assinada do Supabase
      const { data, error } = await supabase
        .storage
        .from('medidas_disciplinares')
        .createSignedUrl(filePath, 3600); // URL válida por 1 hora
      
      if (error) throw error;
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error("Erro ao abrir PDF:", error);
      toast({
        title: "Erro ao abrir arquivo",
        description: "Não foi possível acessar o arquivo PDF. Verifique se ele ainda existe.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (medida: MedidaDisciplinar) => {
    setSelectedMedida(medida);
    setEditDialogOpen(true);
  };

  const handleDelete = (medida: MedidaDisciplinar) => {
    setSelectedMedida(medida);
    setDeleteDialogOpen(true);
  };

  const handleRefresh = () => {
    // Re-fetch data after edit or delete
    setLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="bg-white rounded-md border shadow-sm mt-4">
      <div className="relative w-full overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <p>Carregando medidas disciplinares...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Data</TableHead>
                <TableHead>CCA</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Funcionário</TableHead>
                <TableHead>Descrição/Motivo</TableHead>
                <TableHead className="w-40">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medidas.length > 0 ? (
                medidas.map((medida) => (
                  <TableRow key={medida.id}>
                    <TableCell>{formatDate(medida.data_aplicacao)}</TableCell>
                    <TableCell>
                      {medida.cca_id
                        ? <CCAName ccaId={Number(medida.cca_id)} />
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${tiposBadgeColor[medida.tipo_medida] || "bg-gray-100 text-gray-700"}`}>
                        {medida.tipo_medida}
                      </span>
                    </TableCell>
                    <TableCell>
                      {medida.funcionario_id
                        ? <FuncionarioNome funcionarioId={medida.funcionario_id} />
                        : "-"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{medida.descricao || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(medida)}
                          title="Visualizar detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {medida.arquivo_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPdf(medida.arquivo_url!)}
                            title="Ver anexo PDF"
                          >
                            <FileText className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(medida)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(medida)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhuma medida encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialogs */}
      {selectedMedida && (
        <>
          <MedidaDisciplinarViewDialog
            medida={selectedMedida}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
          />
          <MedidaDisciplinarEditDialog
            medida={selectedMedida}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={handleRefresh}
          />
          <MedidaDisciplinarDeleteDialog
            medida={selectedMedida}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onSuccess={handleRefresh}
          />
        </>
      )}
    </div>
  );
};

// Exibe nome do funcionário pelo ID, usando consulta direta
function FuncionarioNome({ funcionarioId }: { funcionarioId: string }) {
  const [nome, setNome] = useState("Carregando...");
  useEffect(() => {
    async function fetchNome() {
      if (!funcionarioId) return;
      const { data } = await supabase
        .from("funcionarios")
        .select("nome")
        .eq("id", funcionarioId)
        .maybeSingle();
      setNome(data?.nome || "-");
    }
    fetchNome();
  }, [funcionarioId]);
  return <span>{nome}</span>;
}

// Exibe nome do CCA pelo ID usando consulta direta (pode ser melhorado via cache/hook)
function CCAName({ ccaId }: { ccaId: number }) {
  const [nome, setNome] = useState("Carregando...");
  useEffect(() => {
    async function fetchNome() {
      if (!ccaId) return;
      const { data } = await supabase
        .from("ccas")
        .select("codigo, nome")
        .eq("id", ccaId)
        .maybeSingle();
      setNome(data ? `${data.codigo} - ${data.nome}` : "-");
    }
    fetchNome();
  }, [ccaId]);
  return <span>{nome}</span>;
}

export default MedidasDisciplinaresTable;
