import { Badge } from "@/components/ui/badge";
import { NotaFiscal } from "@/types/gestao-pessoas/nf";

interface StatusBadgeNFProps {
  status: NotaFiscal["status"];
}

export function StatusBadgeNF({ status }: StatusBadgeNFProps) {
  // Normalizar o status para garantir capitalização correta
  const normalizeStatus = (status: string): NotaFiscal["status"] => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "rascunho":
        return "Rascunho";
      case "aguardando aprovação":
      case "aguardando_aprovacao":
        return "Aguardando Aprovação";
      case "aprovado":
        return "Aprovado";
      case "reprovado":
        return "Reprovado";
      case "erro":
        return "Erro";
      default:
        return status as NotaFiscal["status"];
    }
  };

  const normalizedStatus = normalizeStatus(status);

  const getStatusColor = () => {
    switch (normalizedStatus) {
      case "Rascunho":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Aguardando Aprovação":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Aprovado":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Reprovado":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Erro":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor()}>
      {normalizedStatus}
    </Badge>
  );
}
