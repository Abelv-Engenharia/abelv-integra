import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vaga, StatusVaga, StatusAprovacao, EtapaProcesso } from "@/types/gestao-pessoas/vaga";
import { useVagas, useUpdateVaga } from "@/hooks/gestao-pessoas/useVagas";
import { VagaKanbanCard } from "@/components/gestao-pessoas/recrutamento/VagaKanbanCard";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
type ColunaGestao = "solicitadas" | "aprovadas" | "anunciadas" | "triagem" | "envio_curriculos" | "agendamento_entrevistas" | "entrevistas_agendadas" | "envio_profile" | "envio_testes" | "entrevista_final" | "pesquisa_daco" | "envio_proposta" | "concluidas";
interface ColunaKanbanProps {
  id: ColunaGestao;
  titulo: string;
  vagas: Vaga[];
  onViewDetails: (vaga: Vaga) => void;
}
function ColunaKanban({
  id,
  titulo,
  vagas,
  onViewDetails
}: ColunaKanbanProps) {
  const {
    setNodeRef
  } = useDroppable({
    id
  });
  const vagasIds = vagas.map(v => v.id);
  return <div className="flex-shrink-0 w-80">
      <Card className="h-full">
        <CardHeader className="pb-3 bg-muted/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">{titulo}</CardTitle>
            <Badge variant="secondary">{vagas.length}</Badge>
          </div>
        </CardHeader>
        <CardContent ref={setNodeRef} className="pt-4 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto">
          <SortableContext items={vagasIds} strategy={verticalListSortingStrategy}>
            {vagas.length === 0 ? <div className="text-center text-muted-foreground text-sm py-8">
                Nenhuma vaga nesta etapa
              </div> : vagas.map(vaga => <VagaKanbanCard key={vaga.id} vaga={vaga} onViewDetails={onViewDetails} />)}
          </SortableContext>
        </CardContent>
      </Card>
    </div>;
}
export default function GestaoVagas() {
  const navigate = useNavigate();
  const { data: vagas = [], isLoading } = useVagas();
  const updateVaga = useUpdateVaga();
  const getColunaVaga = (vaga: Vaga): ColunaGestao => {
    // Vagas por etapa específica
    if (vaga.etapaAtual === EtapaProcesso.TRIAGEM_CURRICULOS) {
      return "triagem";
    }
    if (vaga.etapaAtual === EtapaProcesso.ENVIO_CURRICULOS_GESTOR) {
      return "envio_curriculos";
    }
    if (vaga.etapaAtual === EtapaProcesso.AGENDAMENTO_ENTREVISTAS) {
      return "agendamento_entrevistas";
    }
    if (vaga.etapaAtual === EtapaProcesso.ENTREVISTAS_AGENDADAS) {
      return "entrevistas_agendadas";
    }
    if (vaga.etapaAtual === EtapaProcesso.ENVIO_PROFILE) {
      return "envio_profile";
    }
    if (vaga.etapaAtual === EtapaProcesso.ENVIO_TESTES) {
      return "envio_testes";
    }
    if (vaga.etapaAtual === EtapaProcesso.ENTREVISTA_FINAL) {
      return "entrevista_final";
    }
    if (vaga.etapaAtual === EtapaProcesso.PESQUISA_DACO) {
      return "pesquisa_daco";
    }
    if (vaga.etapaAtual === EtapaProcesso.ENVIO_PROPOSTA) {
      return "envio_proposta";
    }

    // Vagas Concluídas
    if (vaga.status === StatusVaga.FINALIZADA) {
      return "concluidas";
    }

    // Vagas Anunciadas
    if (vaga.status === StatusVaga.DIVULGACAO_FEITA) {
      return "anunciadas";
    }

    // Vagas Aprovadas pelo Gestor
    if (vaga.statusAprovacao === StatusAprovacao.APROVADO) {
      return "aprovadas";
    }

    // Vagas Solicitadas (pendentes de aprovação)
    if (vaga.statusAprovacao === StatusAprovacao.PENDENTE || vaga.status === StatusVaga.SOLICITACAO_ABERTA) {
      return "solicitadas";
    }
    return "solicitadas";
  };
  const vagasSolicitadas = vagas.filter(v => getColunaVaga(v) === "solicitadas");
  const vagasAprovadas = vagas.filter(v => getColunaVaga(v) === "aprovadas");
  const vagasAnunciadas = vagas.filter(v => getColunaVaga(v) === "anunciadas");
  const vagasTriagem = vagas.filter(v => getColunaVaga(v) === "triagem");
  const vagasEnvioCurriculos = vagas.filter(v => getColunaVaga(v) === "envio_curriculos");
  const vagasAgendamentoEntrevistas = vagas.filter(v => getColunaVaga(v) === "agendamento_entrevistas");
  const vagasEntrevistasAgendadas = vagas.filter(v => getColunaVaga(v) === "entrevistas_agendadas");
  const vagasEnvioProfile = vagas.filter(v => getColunaVaga(v) === "envio_profile");
  const vagasEnvioTestes = vagas.filter(v => getColunaVaga(v) === "envio_testes");
  const vagasEntrevistaFinal = vagas.filter(v => getColunaVaga(v) === "entrevista_final");
  const vagasPesquisaDaco = vagas.filter(v => getColunaVaga(v) === "pesquisa_daco");
  const vagasEnvioProposta = vagas.filter(v => getColunaVaga(v) === "envio_proposta");
  const vagasConcluidas = vagas.filter(v => getColunaVaga(v) === "concluidas");
  const handleViewDetails = (vaga: Vaga) => {
    navigate(`/rh-detalhes-vaga/${vaga.id}`);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const vagaId = active.id as string;
    const novaColuna = over.id as ColunaGestao;
    const vaga = vagas.find(v => v.id === vagaId);
    if (!vaga) return;

    const vagaAtualizada: Partial<Vaga> = {};

    // Atualiza status/etapa baseado na coluna de destino
    switch (novaColuna) {
      case "solicitadas":
        vagaAtualizada.statusAprovacao = StatusAprovacao.PENDENTE;
        vagaAtualizada.status = StatusVaga.SOLICITACAO_ABERTA;
        vagaAtualizada.etapaAtual = undefined;
        break;
      case "aprovadas":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.APROVADA;
        vagaAtualizada.etapaAtual = undefined;
        break;
      case "anunciadas":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.DIVULGACAO_FEITA;
        vagaAtualizada.etapaAtual = undefined;
        break;
      case "triagem":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.EM_SELECAO;
        vagaAtualizada.etapaAtual = EtapaProcesso.TRIAGEM_CURRICULOS;
        break;
      case "envio_curriculos":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.EM_SELECAO;
        vagaAtualizada.etapaAtual = EtapaProcesso.ENVIO_CURRICULOS_GESTOR;
        break;
      case "agendamento_entrevistas":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.EM_SELECAO;
        vagaAtualizada.etapaAtual = EtapaProcesso.AGENDAMENTO_ENTREVISTAS;
        break;
      case "entrevistas_agendadas":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.EM_SELECAO;
        vagaAtualizada.etapaAtual = EtapaProcesso.ENTREVISTAS_AGENDADAS;
        break;
      case "envio_profile":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.EM_SELECAO;
        vagaAtualizada.etapaAtual = EtapaProcesso.ENVIO_PROFILE;
        break;
      case "envio_testes":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.EM_SELECAO;
        vagaAtualizada.etapaAtual = EtapaProcesso.ENVIO_TESTES;
        break;
      case "entrevista_final":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.EM_SELECAO;
        vagaAtualizada.etapaAtual = EtapaProcesso.ENTREVISTA_FINAL;
        break;
      case "pesquisa_daco":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.EM_SELECAO;
        vagaAtualizada.etapaAtual = EtapaProcesso.PESQUISA_DACO;
        break;
      case "envio_proposta":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.EM_SELECAO;
        vagaAtualizada.etapaAtual = EtapaProcesso.ENVIO_PROPOSTA;
        break;
      case "concluidas":
        vagaAtualizada.statusAprovacao = StatusAprovacao.APROVADO;
        vagaAtualizada.status = StatusVaga.FINALIZADA;
        vagaAtualizada.etapaAtual = undefined;
        break;
    }

    updateVaga.mutate({ id: vagaId, vaga: vagaAtualizada });
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Carregando vagas...</div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Gestão de Vagas</h1>
        </div>

        

        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <ColunaKanban id="solicitadas" titulo="Vagas Solicitadas" vagas={vagasSolicitadas} onViewDetails={handleViewDetails} />
            <ColunaKanban id="aprovadas" titulo="Vagas Aprovadas pelo Gestor" vagas={vagasAprovadas} onViewDetails={handleViewDetails} />
            <ColunaKanban id="anunciadas" titulo="Vagas Anunciadas" vagas={vagasAnunciadas} onViewDetails={handleViewDetails} />
            <ColunaKanban id="triagem" titulo="Triagem de Currículos" vagas={vagasTriagem} onViewDetails={handleViewDetails} />
            <ColunaKanban id="envio_curriculos" titulo="Currículos em Análise do Gestor" vagas={vagasEnvioCurriculos} onViewDetails={handleViewDetails} />
            <ColunaKanban id="agendamento_entrevistas" titulo="Agendamento de Entrevista" vagas={vagasAgendamentoEntrevistas} onViewDetails={handleViewDetails} />
            <ColunaKanban id="entrevistas_agendadas" titulo="Entrevistas Agendadas" vagas={vagasEntrevistasAgendadas} onViewDetails={handleViewDetails} />
            <ColunaKanban id="envio_profile" titulo="Envio de Profiler" vagas={vagasEnvioProfile} onViewDetails={handleViewDetails} />
            <ColunaKanban id="envio_testes" titulo="Aplicações de Testes" vagas={vagasEnvioTestes} onViewDetails={handleViewDetails} />
            <ColunaKanban id="entrevista_final" titulo="Avaliação Final" vagas={vagasEntrevistaFinal} onViewDetails={handleViewDetails} />
            <ColunaKanban id="pesquisa_daco" titulo="Pesquisa Daco" vagas={vagasPesquisaDaco} onViewDetails={handleViewDetails} />
            <ColunaKanban id="envio_proposta" titulo="Envio de Proposta" vagas={vagasEnvioProposta} onViewDetails={handleViewDetails} />
            <ColunaKanban id="concluidas" titulo="Vagas Concluídas" vagas={vagasConcluidas} onViewDetails={handleViewDetails} />
          </div>
        </DndContext>
      </div>
    </div>;
}