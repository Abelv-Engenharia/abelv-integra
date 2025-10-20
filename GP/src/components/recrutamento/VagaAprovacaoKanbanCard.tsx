import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vaga, PrioridadeVaga, StatusAprovacao } from "@/types/vaga";
import { Eye, CheckCircle, XCircle, Briefcase, MapPin, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface VagaAprovacaoKanbanCardProps {
  vaga: Vaga;
  onViewDetails: (vaga: Vaga) => void;
  onAprovar: (vaga: Vaga) => void;
  onReprovar: (vaga: Vaga) => void;
}

export function VagaAprovacaoKanbanCard({ 
  vaga, 
  onViewDetails, 
  onAprovar, 
  onReprovar 
}: VagaAprovacaoKanbanCardProps) {
  const getPrioridadeColor = (prioridade: PrioridadeVaga) => {
    switch (prioridade) {
      case PrioridadeVaga.ALTA:
        return "bg-red-500 text-white";
      case PrioridadeVaga.MEDIA:
        return "bg-yellow-500 text-white";
      case PrioridadeVaga.BAIXA:
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPrioridadeLabel = (prioridade: PrioridadeVaga) => {
    switch (prioridade) {
      case PrioridadeVaga.ALTA:
        return "Alta";
      case PrioridadeVaga.MEDIA:
        return "Média";
      case PrioridadeVaga.BAIXA:
        return "Baixa";
      default:
        return prioridade;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm line-clamp-2">{vaga.cargo}</h4>
            <p className="text-xs text-muted-foreground mt-1">{vaga.numeroVaga}</p>
          </div>
          <Badge className={getPrioridadeColor(vaga.prioridade)}>
            {getPrioridadeLabel(vaga.prioridade)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="h-3 w-3" />
            <span>{vaga.area} - {vaga.setor}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{vaga.localTrabalho}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-3 w-3" />
            <span>Gestor: {vaga.gestor}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Criado em: {format(vaga.dataCriacao, "dd/MM/yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Prazo: {format(vaga.prazoMobilizacao, "dd/MM/yyyy")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          {vaga.statusAprovacao === StatusAprovacao.PENDENTE && (
            <>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full gap-2"
                onClick={() => onAprovar(vaga)}
              >
                <CheckCircle className="h-3 w-3" />
                Aprovar
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full gap-2"
                onClick={() => onReprovar(vaga)}
              >
                <XCircle className="h-3 w-3" />
                Reprovar
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={() => onViewDetails(vaga)}
          >
            <Eye className="h-3 w-3" />
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
