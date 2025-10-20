import { Badge } from "@/components/ui/badge";
import { StatusFerias } from "@/types/gestao-pessoas/ferias";

interface FeriasStatusBadgeProps {
  status: StatusFerias;
}

export function FeriasStatusBadge({ status }: FeriasStatusBadgeProps) {
  const getStatusConfig = (status: StatusFerias) => {
    switch (status) {
      case StatusFerias.SOLICITADO:
        return { label: "Solicitado", variant: "outline" as const };
      case StatusFerias.AGUARDANDO_APROVACAO:
        return { label: "Aguardando Aprovação", variant: "secondary" as const };
      case StatusFerias.APROVADO:
        return { label: "Aprovado", variant: "default" as const };
      case StatusFerias.EM_FERIAS:
        return { label: "Em Férias", variant: "default" as const };
      case StatusFerias.CONCLUIDO:
        return { label: "Concluído", variant: "secondary" as const };
      case StatusFerias.REPROVADO:
        return { label: "Reprovado", variant: "destructive" as const };
      default:
        return { label: "Desconhecido", variant: "outline" as const };
    }
  };

  const { label, variant } = getStatusConfig(status);

  return (
    <Badge variant={variant}>
      {label}
    </Badge>
  );
}