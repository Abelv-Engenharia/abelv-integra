
import { Badge } from "@/components/ui/badge";

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONCLUÍDO":
    case "Fechado":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "EM ANDAMENTO":
    case "Em andamento":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "PENDENTE":
    case "Aberto":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const StatusBadge = ({ status }: { status?: string }) => (
  <Badge variant="secondary" className={getStatusColor(status || "")}>
    {status || "PENDENTE"}
  </Badge>
);

export default StatusBadge;
