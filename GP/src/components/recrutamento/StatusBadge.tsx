import { Badge } from "@/components/ui/badge";
import { StatusVaga, StatusAprovacao, PrioridadeVaga, StatusCandidato } from "@/types/vaga";

interface StatusBadgeProps {
  status: StatusVaga | StatusAprovacao | PrioridadeVaga | StatusCandidato;
  type: 'vaga' | 'aprovacao' | 'prioridade' | 'candidato';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === 'vaga') {
      switch (status as StatusVaga) {
        case StatusVaga.SOLICITACAO_ABERTA:
          return { text: 'Solicitação Aberta', variant: 'secondary' as const };
        case StatusVaga.APROVADA:
          return { text: 'Aprovada', variant: 'default' as const };
        case StatusVaga.DIVULGACAO_FEITA:
          return { text: 'Divulgação Feita', variant: 'secondary' as const };
        case StatusVaga.EM_SELECAO:
          return { text: 'Em Seleção', variant: 'default' as const };
        case StatusVaga.FINALIZADA:
          return { text: 'Finalizada', variant: 'outline' as const };
        default:
          return { text: status, variant: 'secondary' as const };
      }
    }

    if (type === 'aprovacao') {
      switch (status as StatusAprovacao) {
        case StatusAprovacao.PENDENTE:
          return { text: 'Pendente', variant: 'secondary' as const };
        case StatusAprovacao.APROVADO:
          return { text: 'Aprovado', variant: 'default' as const };
        case StatusAprovacao.REPROVADO:
          return { text: 'Reprovado', variant: 'destructive' as const };
        default:
          return { text: status, variant: 'secondary' as const };
      }
    }

    if (type === 'prioridade') {
      switch (status as PrioridadeVaga) {
        case PrioridadeVaga.ALTA:
          return { text: 'Alta', variant: 'destructive' as const };
        case PrioridadeVaga.MEDIA:
          return { text: 'Média', variant: 'default' as const };
        case PrioridadeVaga.BAIXA:
          return { text: 'Baixa', variant: 'secondary' as const };
        default:
          return { text: status, variant: 'secondary' as const };
      }
    }

    if (type === 'candidato') {
      switch (status as StatusCandidato) {
        case StatusCandidato.EM_ANALISE:
          return { text: 'Em Análise', variant: 'secondary' as const };
        case StatusCandidato.ENTREVISTADO:
          return { text: 'Entrevistado', variant: 'default' as const };
        case StatusCandidato.APROVADO:
          return { text: 'Aprovado', variant: 'default' as const };
        case StatusCandidato.REPROVADO:
          return { text: 'Reprovado', variant: 'destructive' as const };
        default:
          return { text: status, variant: 'secondary' as const };
      }
    }

    return { text: status, variant: 'secondary' as const };
  };

  const config = getStatusConfig();
  
  return (
    <Badge variant={config.variant} className="text-xs">
      {config.text}
    </Badge>
  );
}