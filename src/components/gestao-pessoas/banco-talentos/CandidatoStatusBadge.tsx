import { StatusCandidato } from "@/types/gestao-pessoas/candidato";
import { Badge } from "@/components/ui/badge";

interface CandidatoStatusBadgeProps {
  status: StatusCandidato;
}

export const CandidatoStatusBadge = ({ status }: CandidatoStatusBadgeProps) => {
  const getStatusVariant = (status: StatusCandidato) => {
    switch (status) {
      case StatusCandidato.DISPONIVEL:
        return "default";
      case StatusCandidato.EM_OUTRO_PROCESSO:
        return "secondary";
      case StatusCandidato.CONTRATADO:
        return "outline";
      case StatusCandidato.NAO_DISPONIVEL:
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: StatusCandidato) => {
    switch (status) {
      case StatusCandidato.DISPONIVEL:
        return "bg-green-100 text-green-800 border-green-200";
      case StatusCandidato.EM_OUTRO_PROCESSO:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case StatusCandidato.CONTRATADO:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case StatusCandidato.NAO_DISPONIVEL:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "";
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};
