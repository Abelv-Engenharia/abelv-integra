import { Badge } from "@/components/ui/badge";

interface StatusContratoProps {
  status: 'ativo' | 'encerrado' | 'suspenso';
}

export function StatusContratoBadge({ status }: StatusContratoProps) {
  const statusConfig = {
    ativo: {
      label: 'Ativo',
      className: 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
    },
    encerrado: {
      label: 'Encerrado',
      className: 'bg-gray-500/10 text-gray-700 hover:bg-gray-500/20'
    },
    suspenso: {
      label: 'Suspenso',
      className: 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20'
    }
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
