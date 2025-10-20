import { Badge } from "@/components/ui/badge";
import { NotaFiscal } from "@/types/nf";

interface StatusBadgeNFProps {
  status: NotaFiscal["status"];
}

export function StatusBadgeNF({ status }: StatusBadgeNFProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Rascunho":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Enviado":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Aprovado":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Reprovado":
      case "Erro":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor()}>
      {status}
    </Badge>
  );
}
