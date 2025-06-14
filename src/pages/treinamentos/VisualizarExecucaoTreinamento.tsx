
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { ExecucaoTreinamento } from "@/types/treinamentos";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Download, Eye } from "lucide-react";

const VisualizarExecucaoTreinamento = () => {
  const { id } = useParams<{ id: string }>();
  const [execucao, setExecucao] = useState<ExecucaoTreinamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [openVisualizar, setOpenVisualizar] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    execucaoTreinamentoService.getById(id)
      .then(data => setExecucao(data))
      .catch(() => setExecucao(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleOpenVisualizar = () => setOpenVisualizar(true);
  const handleCloseVisualizar = () => setOpenVisualizar(false);

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
                    <a
                      href={execucao.lista_presenca_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <Button variant="outline" size="sm" className="gap-1" title="Baixar PDF">
                        <Download className="h-4 w-4" />
                        Baixar
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      type="button"
                      onClick={handleOpenVisualizar}
                      title="Visualizar PDF"
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
              {execucao.lista_presenca_url && (
                <iframe
                  src={execucao.lista_presenca_url}
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

