import { Badge } from "@/components/ui/badge";
import { TipoContrato } from "@/types/gestao-pessoas/contrato";

interface TipoContratoBadgeProps {
  tipo: TipoContrato;
}

export function TipoContratoBadge({ tipo }: TipoContratoBadgeProps) {
  const tipoConfig = {
    contrato: {
      label: 'Contrato de prestação de serviço',
      className: 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20'
    },
    aditivo: {
      label: 'Aditivo de prestação de serviço',
      className: 'bg-purple-500/10 text-purple-700 hover:bg-purple-500/20'
    },
    distrato: {
      label: 'Distrato de prestação de serviço',
      className: 'bg-orange-500/10 text-orange-700 hover:bg-orange-500/20'
    }
  };

  const config = tipoConfig[tipo];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
