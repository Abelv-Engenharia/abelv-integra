import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { ExecucaoTreinamento } from "@/types/treinamentos";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye } from "lucide-react";
import { useSignedUrl } from "@/hooks/useSignedUrl";
import { format, parseISO } from "date-fns";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy");
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
};

const VisualizarExecucaoTreinamento = () => {
  const { id } = useParams<{ id: string }>();
  const [execucao, setExecucao] = useState<ExecucaoTreinamento | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal e signed URL state para visualizar
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [pendingVisualizar, setPendingVisualizar] = useState(false); // novo: aguarda URL
  const [filePath, setFilePath] = useState<string | null>(null);

  // Hook para obter signed URL
  const {
    url: signedUrl,
    loading: loadingSignedUrl,
    error: errorSignedUrl,
    generate: generateSignedUrl,
  } = useSignedUrl();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    execucaoTreinamentoService.getById(id)
      .then(data => setExecucao(data))
      .catch(() => setExecucao(null))
      .finally(() => setLoading(false));
  }, [id]);

  function extractPathFromUrl(url: string) {
    const splitToken = "treinamentos-anexos/";
    const idx = url.indexOf(splitToken);
    if (idx === -1) return "";
    return url.substring(idx + splitToken.length);
  }

  // Função simplificada para usar edge function
  const handleOpenVisualizar = async () => {
    if (execucao?.lista_presenca_url) {
      const path = extractPathFromUrl(execucao.lista_presenca_url);
      
      // Usar a edge function para servir o PDF
      const functionUrl = `https://xexgdtlctyuycohzhmuu.supabase.co/functions/v1/serve-treinamento-file?file=${encodeURIComponent(path)}`;
      window.open(functionUrl, '_blank');
    }
  };

  // Efeito para abrir o modal só quando o signedUrl está disponível após pendingVisualizar
  useEffect(() => {
    if (pendingVisualizar && signedUrl && !loadingSignedUrl && !errorSignedUrl) {
      setOpenVisualizar(true);
      setPendingVisualizar(false);
    }
  }, [pendingVisualizar, signedUrl, loadingSignedUrl, errorSignedUrl]);

  const handleCloseVisualizar = () => {
    setOpenVisualizar(false);
    setFilePath(null);
  };

  // Faz download usando signed URL válido
  const handleDownload = async () => {
    if (execucao?.lista_presenca_url) {
      const path = extractPathFromUrl(execucao.lista_presenca_url);
      await generateSignedUrl("treinamentos-anexos", path);

      setTimeout(() => {
        if (signedUrl) {
          window.open(signedUrl, "_blank");
        }
      }, 200);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[300px]">Carregando execução...</div>;
  }
  if (!execucao) {
    return <div className="flex justify-center items-center h-full min-h-[300px]">Execução não encontrada.</div>;
  }

  return (
    <div className="w-full h-full p-0 overflow-auto">
      <Card className="w-full h-full shadow-none border-none rounded-none">
        <CardHeader>
          <CardTitle>Detalhes da Execução</CardTitle>
          <CardDescription>
            {execucao.treinamento_nome || "Sem nome"} em {formatDate(execucao.data)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div><strong>Data:</strong> {formatDate(execucao.data)}</div>
            <div><strong>Treinamento:</strong> {execucao.treinamento_nome}</div>
            <div><strong>CCA:</strong> {execucao.cca}</div>
            <div><strong>Processo:</strong> {execucao.processo_treinamento}</div>
            <div><strong>Tipo:</strong> {execucao.tipo_treinamento}</div>
            <div><strong>Carga Horária:</strong> {execucao.carga_horaria}h</div>
            <div><strong>Efetivo:</strong> MOD: {execucao.efetivo_mod} / MOI: {execucao.efetivo_moi}</div>
            <div><strong>Horas Totais:</strong> {execucao.horas_totais}h</div>
            <div><strong>Observações:</strong> {execucao.observacoes || "—"}</div>
            <div>
              <strong>Anexo Lista:</strong> {execucao.lista_presenca_url
                ? (
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      type="button"
                      onClick={handleDownload}
                      title="Visualizar PDF"
                      disabled={loadingSignedUrl}
                    >
                      <Download className="h-4 w-4" />
                      {loadingSignedUrl ? "Gerando link..." : "Visualizar"}
                    </Button>
                  </div>
                )
                : "Nenhum anexo"}
            </div>
          </div>
        </CardContent>
        <div className="px-6 pb-6 flex gap-2">
          <Button asChild variant="outline">
            <Link to="/treinamentos/consulta">Voltar</Link>
          </Button>
          <Button asChild>
            <Link to={`/treinamentos/execucao/editar/${execucao.id}`}>Editar</Link>
          </Button>
        </div>
        {/* Modal de visualização removido */}
      </Card>
    </div>
  );
};

export default VisualizarExecucaoTreinamento;
