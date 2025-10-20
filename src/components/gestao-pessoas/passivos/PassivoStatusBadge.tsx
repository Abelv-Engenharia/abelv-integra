import { Badge } from "@/components/ui/badge";
import { StatusPassivo } from "@/types/gestao-pessoas/passivos";

interface PassivoStatusBadgeProps {
  status: StatusPassivo;
}

export function PassivoStatusBadge({ status }: PassivoStatusBadgeProps) {
  const statusConfig = {
    ativo: {
      label: "Ativo",
      variant: "default" as const,
    },
    quitado: {
      label: "Quitado",
      variant: "secondary" as const,
    },
    parcial: {
      label: "Parcial",
      variant: "outline" as const,
    },
    pendente: {
      label: "Pendente",
      variant: "destructive" as const,
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  );
}
