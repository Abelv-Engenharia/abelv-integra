import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Candidato } from "@/types/gestao-pessoas/candidato";
import { CandidatoStatusBadge } from "./CandidatoStatusBadge";
import { EtapaProcessoBadge } from "./EtapaProcessoBadge";
import { OrigemIcon } from "./OrigemIcon";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Calendar, User, FileText, CheckCircle } from "lucide-react";

interface DetalhesCandidatoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidato: Candidato | null;
  onEdit: (candidato: Candidato) => void;
}

export const DetalhesCandidatoModal = ({ 
  open, 
  onOpenChange, 
  candidato,
  onEdit 
}: DetalhesCandidatoModalProps) => {
  if (!candidato) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Candidato</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header do candidato */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{candidato.nomeCompleto}</h2>
              <p className="text-muted-foreground">{candidato.cargoVagaPretendida}</p>
            </div>
            <CandidatoStatusBadge status={candidato.statusCandidato} />
          </div>

          {/* Informações de contato */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{candidato.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{candidato.telefone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{candidato.cidadeEstado}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{candidato.unidadeObra}</span>
            </div>
          </div>

          {/* Informações do processo */}
          <div className="space-y-3">
            <h3 className="font-semibold">Informações do Processo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Origem</p>
                <OrigemIcon origem={candidato.origemCandidato} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Etapa Atual</p>
                <EtapaProcessoBadge etapa={candidato.etapaProcesso} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Responsável</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{candidato.responsavelEtapa}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reaproveitamento</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${candidato.possibilidadeReaproveitamento ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="text-sm">{candidato.possibilidadeReaproveitamento ? "Sim" : "Não"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detalhes da contratação */}
          {candidato.faixaSalarial && (
            <div className="space-y-3">
              <h3 className="font-semibold">Detalhes da Contratação</h3>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Faixa Salarial</p>
                <p className="text-sm font-medium">{candidato.faixaSalarial}</p>
              </div>
            </div>
          )}

          {/* Datas */}
          <div className="space-y-3">
            <h3 className="font-semibold">Datas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cadastro</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{format(candidato.dataCadastro, "dd/MM/yyyy")}</span>
                </div>
              </div>
              {candidato.dataEntrevista && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Entrevista</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{format(candidato.dataEntrevista, "dd/MM/yyyy")}</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Última Atualização</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{format(candidato.dataUltimaAtualizacao, "dd/MM/yyyy")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          {candidato.feedbackGestorRH && (
            <div className="space-y-2">
              <h3 className="font-semibold">Feedback do Gestor / RH</h3>
              <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                {candidato.feedbackGestorRH}
              </p>
            </div>
          )}

          {/* Motivo não contratação */}
          {candidato.motivoNaoContratacao && (
            <div className="space-y-2">
              <h3 className="font-semibold">Motivo da Não Contratação</h3>
              <p className="text-sm text-muted-foreground p-3 bg-red-50 rounded-lg">
                {candidato.motivoNaoContratacao}
              </p>
            </div>
          )}

          {/* Observações */}
          {candidato.observacoesGerais && (
            <div className="space-y-2">
              <h3 className="font-semibold">Observações Gerais</h3>
              <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                {candidato.observacoesGerais}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={() => { onEdit(candidato); onOpenChange(false); }}>
            Editar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
