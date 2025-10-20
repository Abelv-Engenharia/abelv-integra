import { EtapaProcesso } from "@/types/candidato";
import { Badge } from "@/components/ui/badge";

interface EtapaProcessoBadgeProps {
  etapa: EtapaProcesso;
}

export const EtapaProcessoBadge = ({ etapa }: EtapaProcessoBadgeProps) => {
  const getEtapaColor = (etapa: EtapaProcesso) => {
    switch (etapa) {
      case EtapaProcesso.TRIAGEM_CURRICULAR:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case EtapaProcesso.ENTREVISTA_RH:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case EtapaProcesso.ENTREVISTA_GESTOR:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case EtapaProcesso.TESTE_TECNICO:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case EtapaProcesso.APROVADO:
        return "bg-green-100 text-green-800 border-green-200";
      case EtapaProcesso.REPROVADO:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "";
    }
  };

  return (
    <Badge variant="outline" className={getEtapaColor(etapa)}>
      {etapa}
    </Badge>
  );
};
