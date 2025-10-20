import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockVagas } from "@/data/gestao-pessoas/mockVagas";
import { Vaga, StatusAprovacao } from "@/types/gestao-pessoas/vaga";
import { VagaAprovacaoKanbanColumn } from "@/components/gestao-pessoas/recrutamento/VagaAprovacaoKanbanColumn";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AprovacaoVaga() {
  const navigate = useNavigate();
  const [vagas, setVagas] = useState<Vaga[]>(mockVagas);
  const [vagaSelecionada, setVagaSelecionada] = useState<Vaga | null>(null);
  const [modalAcao, setModalAcao] = useState<"aprovar" | "reprovar" | "detalhes" | null>(null);
  const [justificativa, setJustificativa] = useState("");

  // Separar vagas por status de aprovação
  const vagasPendentes = vagas.filter(v => v.statusAprovacao === StatusAprovacao.PENDENTE);
  const vagasAprovadas = vagas.filter(v => v.statusAprovacao === StatusAprovacao.APROVADO);
  const vagasReprovadas = vagas.filter(v => v.statusAprovacao === StatusAprovacao.REPROVADO);

  const handleAbrirModalAprovar = (vaga: Vaga) => {
    setVagaSelecionada(vaga);
    setModalAcao("aprovar");
    setJustificativa("");
  };

  const handleAbrirModalReprovar = (vaga: Vaga) => {
    setVagaSelecionada(vaga);
    setModalAcao("reprovar");
    setJustificativa("");
  };

  const handleAbrirDetalhes = (vaga: Vaga) => {
    setVagaSelecionada(vaga);
    setModalAcao("detalhes");
  };

  const handleConfirmarAprovacao = () => {
    if (!vagaSelecionada) return;

    setVagas(vagas.map(v => 
      v.id === vagaSelecionada.id 
        ? { ...v, statusAprovacao: StatusAprovacao.APROVADO } 
        : v
    ));

    toast.success("Vaga aprovada com sucesso!");
    setModalAcao(null);
    setVagaSelecionada(null);
    setJustificativa("");
  };

  const handleConfirmarReprovacao = () => {
    if (!vagaSelecionada) return;
    
    if (!justificativa.trim()) {
      toast.error("Por favor, informe a justificativa da reprovação");
      return;
    }

    setVagas(vagas.map(v => 
      v.id === vagaSelecionada.id 
        ? { ...v, statusAprovacao: StatusAprovacao.REPROVADO } 
        : v
    ));

    toast.success("Vaga reprovada");
    setModalAcao(null);
    setVagaSelecionada(null);
    setJustificativa("");
  };

  const handleFecharModal = () => {
    setModalAcao(null);
    setVagaSelecionada(null);
    setJustificativa("");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Aprovação de vaga</h1>
            <p className="text-muted-foreground">
              Gerencie as solicitações de abertura de vagas
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Aguardando aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{vagasPendentes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Aprovada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{vagasAprovadas.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Rejeitada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{vagasReprovadas.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <VagaAprovacaoKanbanColumn
          status={StatusAprovacao.PENDENTE}
          titulo="Aguardando aprovação"
          vagas={vagasPendentes}
          onViewDetails={handleAbrirDetalhes}
          onAprovar={handleAbrirModalAprovar}
          onReprovar={handleAbrirModalReprovar}
        />
        <VagaAprovacaoKanbanColumn
          status={StatusAprovacao.APROVADO}
          titulo="Aprovada"
          vagas={vagasAprovadas}
          onViewDetails={handleAbrirDetalhes}
          onAprovar={handleAbrirModalAprovar}
          onReprovar={handleAbrirModalReprovar}
        />
        <VagaAprovacaoKanbanColumn
          status={StatusAprovacao.REPROVADO}
          titulo="Rejeitada"
          vagas={vagasReprovadas}
          onViewDetails={handleAbrirDetalhes}
          onAprovar={handleAbrirModalAprovar}
          onReprovar={handleAbrirModalReprovar}
        />
      </div>

      {/* Modal de Aprovação */}
      <Dialog open={modalAcao === "aprovar"} onOpenChange={handleFecharModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar vaga</DialogTitle>
          </DialogHeader>
          {vagaSelecionada && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Número da vaga</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.numeroVaga}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Cargo</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.cargo}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Gestor</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.gestor}</p>
              </div>
              <div>
                <Label htmlFor="justificativa-aprovacao">Justificativa (opcional)</Label>
                <Textarea
                  id="justificativa-aprovacao"
                  placeholder="Adicione uma justificativa para a aprovação..."
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleFecharModal}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarAprovacao}>
              Confirmar aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Reprovação */}
      <Dialog open={modalAcao === "reprovar"} onOpenChange={handleFecharModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar vaga</DialogTitle>
          </DialogHeader>
          {vagaSelecionada && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Número da vaga</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.numeroVaga}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Cargo</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.cargo}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Gestor</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.gestor}</p>
              </div>
              <div>
                <Label htmlFor="justificativa-reprovacao">
                  Justificativa <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="justificativa-reprovacao"
                  placeholder="Informe o motivo da reprovação..."
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  rows={3}
                  className={!justificativa.trim() ? "border-red-500" : ""}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleFecharModal}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmarReprovacao}>
              Confirmar reprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes */}
      <Dialog open={modalAcao === "detalhes"} onOpenChange={handleFecharModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da vaga</DialogTitle>
          </DialogHeader>
          {vagaSelecionada && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Número da vaga</p>
                  <p className="text-sm text-muted-foreground">{vagaSelecionada.numeroVaga}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={
                    vagaSelecionada.statusAprovacao === StatusAprovacao.APROVADO ? "default" :
                    vagaSelecionada.statusAprovacao === StatusAprovacao.REPROVADO ? "destructive" :
                    "secondary"
                  }>
                    {vagaSelecionada.statusAprovacao === StatusAprovacao.APROVADO ? "Aprovado" :
                     vagaSelecionada.statusAprovacao === StatusAprovacao.REPROVADO ? "Reprovado" :
                     "Pendente"}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Cargo</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.cargo}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Área</p>
                  <p className="text-sm text-muted-foreground">{vagaSelecionada.area}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Setor</p>
                  <p className="text-sm text-muted-foreground">{vagaSelecionada.setor}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Local de trabalho</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.localTrabalho}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Tipo de contrato</p>
                  <p className="text-sm text-muted-foreground">{vagaSelecionada.tipoContrato.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Jornada de trabalho</p>
                  <p className="text-sm text-muted-foreground">{vagaSelecionada.jornadaTrabalho}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Faixa salarial</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.faixaSalarial}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Benefícios</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.beneficios}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Formação mínima</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.formacaoMinima}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Experiência desejada</p>
                <p className="text-sm text-muted-foreground">{vagaSelecionada.experienciaDesejada}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Hard skills</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {vagaSelecionada.hardSkills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Soft skills</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {vagaSelecionada.softSkills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Gestor</p>
                  <p className="text-sm text-muted-foreground">{vagaSelecionada.gestor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Aprovador</p>
                  <p className="text-sm text-muted-foreground">{vagaSelecionada.aprovador}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Data de criação</p>
                  <p className="text-sm text-muted-foreground">{format(vagaSelecionada.dataCriacao, "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Prazo de mobilização</p>
                  <p className="text-sm text-muted-foreground">{format(vagaSelecionada.prazoMobilizacao, "dd/MM/yyyy")}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleFecharModal}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
