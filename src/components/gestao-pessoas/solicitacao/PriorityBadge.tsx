import { Badge } from "@/components/ui/badge";
import { PrioridadeSolicitacao, StatusSolicitacao } from "@/types/solicitacao";

interface PriorityBadgeProps {
  priority: PrioridadeSolicitacao;
}

interface StatusBadgeProps {
  status: StatusSolicitacao;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getBadgeVariant = () => {
    switch (priority) {
      case PrioridadeSolicitacao.ALTA:
        return "destructive";
      case PrioridadeSolicitacao.MEDIA:
        return "default";
      case PrioridadeSolicitacao.BAIXA:
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getPriorityText = () => {
    switch (priority) {
      case PrioridadeSolicitacao.ALTA:
        return "Alta";
      case PrioridadeSolicitacao.MEDIA:
        return "Média";
      case PrioridadeSolicitacao.BAIXA:
        return "Baixa";
      default:
        return "Baixa";
    }
  };

  return (
    <Badge variant={getBadgeVariant()}>
      {getPriorityText()}
    </Badge>
  );
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeVariant = () => {
    switch (status) {
      case StatusSolicitacao.APROVADO:
        return "default";
      case StatusSolicitacao.EM_ANDAMENTO:
        return "secondary";
      case StatusSolicitacao.AGUARDANDO_APROVACAO:
        return "secondary";
      case StatusSolicitacao.CONCLUIDO:
        return "outline";
      case StatusSolicitacao.REJEITADO:
        return "destructive";
      case StatusSolicitacao.PENDENTE:
      default:
        return "secondary";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case StatusSolicitacao.APROVADO:
        return "Aprovado";
      case StatusSolicitacao.EM_ANDAMENTO:
        return "Em Andamento";
      case StatusSolicitacao.AGUARDANDO_APROVACAO:
        return "Aguardando Aprovação";
      case StatusSolicitacao.CONCLUIDO:
        return "Concluído";
      case StatusSolicitacao.REJEITADO:
        return "Rejeitado";
      case StatusSolicitacao.PENDENTE:
      default:
        return "Pendente";
    }
  };

  return (
    <Badge variant={getBadgeVariant()}>
      {getStatusText()}
    </Badge>
  );
}