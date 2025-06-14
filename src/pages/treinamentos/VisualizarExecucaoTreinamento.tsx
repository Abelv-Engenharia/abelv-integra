
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { ExecucaoTreinamento } from "@/types/treinamentos";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VisualizarExecucaoTreinamento = () => {
  const { id } = useParams<{ id: string }>();
  const [execucao, setExecucao] = useState<ExecucaoTreinamento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    execucaoTreinamentoService.getById(id)
      .then(data => setExecucao(data))
      .catch(() => setExecucao(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-full min-h-[300px]">Carregando execução...</div>;
  }

  if (!execucao) {
    return <div className="flex justify-center items-center h-full min-h-[300px]">Execução não encontrada.</div>;
  }

  return (
    <div className="w-full h-full p-0 overflow-auto"> {/* Remove o container centralizado e deixa ocupar a tela */}
      <Card className="w-full h-full shadow-none border-none rounded-none"> {/* Deixa o card ocupar tudo */}
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
            <div><strong>Anexo Lista:</strong> {execucao.lista_presenca_url
              ? <a className="text-primary underline" href={execucao.lista_presenca_url} target="_blank" rel="noopener noreferrer">Baixar</a>
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
      </Card>
    </div>
  );
};

export default VisualizarExecucaoTreinamento;
