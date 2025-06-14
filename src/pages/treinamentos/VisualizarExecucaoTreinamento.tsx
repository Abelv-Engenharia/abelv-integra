
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { ExecucaoTreinamento } from "@/types/treinamentos";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Download, Eye } from "lucide-react";
import { useSignedUrl } from "@/hooks/useSignedUrl";

const VisualizarExecucaoTreinamento = () => {
  const { id } = useParams<{ id: string }>();
  const [execucao, setExecucao] = useState<ExecucaoTreinamento | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal e signed URL state para visualizar
  const [openVisualizar, setOpenVisualizar] = useState(false);
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

  // Função utilitária para extrair apenas o path do arquivo a partir da URL salva
  function extractPathFromUrl(url: string) {
    // O path começa depois de 'treinamentos-anexos/'
    const splitToken = "treinamentos-anexos/";
    const idx = url.indexOf(splitToken);
    if (idx === -1) return "";
    return url.substring(idx + splitToken.length);
  }

  // Função para visualizar PDF
  const handleOpenVisualizar = async () => {
    if (execucao?.lista_presenca_url) {
      const path = extractPathFromUrl(execucao.lista_presenca_url);
      setFilePath(path);

      // Gera a URL assinada e só abre o modal após a URL ser definida com sucesso
      await generateSignedUrl("treinamentos-anexos", path);

      setOpenVisualizar(true);
    }
  };

  // Limpa URL ao fechar modal
  const handleCloseVisualizar = () => {
    setOpenVisualizar(false);
    // No hook de signed url, limpe a url ao fechar o modal
    // Poderíamos adicionar um método no hook, mas aqui reseta via "gerar" com caminho nulo:
    setFilePath(null);
  };

  // Faz download usando signed URL válido
  const handleDownload = async () => {
    if (execucao?.lista_presenca_url) {
      const path = extractPathFromUrl(execucao.lista_presenca_url);

      // Gera a URL e só então faz o download
      const result = await generateSignedUrl("treinamentos-anexos", path);

      // Espera o signedUrl realmente ser definido
      setTimeout(() => {
        // "signedUrl" está atualizado via re-render do hook.
        if (signedUrl) {
          window.open(signedUrl, "_blank");
        }
      }, 200);
    }
  };

  useEffect(() => {
    // Quando fechar o modal, reseta URL do arquivo assinado
    if (!openVisualizar) {
      // Aqui podemos chamar um gerador nulo, mas não necessário se o modal já oculta pelo estado
      // O hook reseta o signedUrl novo no próximo open
    }
  }, [openVisualizar]);

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
            {execucao.treinamento_nome || "Sem nome"} em {new Date(execucao.data).toLocaleDateString("pt-BR")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div><strong>Data:</strong> {new Date(execucao.data).toLocaleDateString("pt-BR")}</div>
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
                      title="Baixar PDF"
                      disabled={loadingSignedUrl}
                    >
                      <Download className="h-4 w-4" />
                      {loadingSignedUrl ? "Gerando link..." : "Baixar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      type="button"
                      onClick={handleOpenVisualizar}
                      title="Visualizar PDF"
                      disabled={loadingSignedUrl}
                    >
                      <Eye className="h-4 w-4" />
                      Visualizar
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

        {/* Modal de visualização do PDF */}
        <Dialog open={openVisualizar} onOpenChange={setOpenVisualizar}>
          <DialogContent className="max-w-3xl w-full flex flex-col items-center">
            <DialogHeader>
              <DialogTitle>Visualização da Lista de Presença (PDF)</DialogTitle>
            </DialogHeader>
            <div className="w-full h-[70vh] flex justify-center items-center">
              {loadingSignedUrl && <span>Carregando PDF...</span>}
              {errorSignedUrl && <span className="text-destructive">Erro ao carregar PDF: {errorSignedUrl}</span>}
              {(signedUrl && !loadingSignedUrl && !errorSignedUrl) && (
                <iframe
                  src={signedUrl}
                  title="Lista Presença PDF"
                  className="w-full h-full rounded border"
                  frameBorder={0}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
};

export default VisualizarExecucaoTreinamento;
