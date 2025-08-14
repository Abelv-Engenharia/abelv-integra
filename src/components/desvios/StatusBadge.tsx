
import { Badge } from "@/components/ui/badge";

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONCLUÍDO":
    case "Fechado":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "EM ANDAMENTO":
    case "Em andamento":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "EM TRATATIVA":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "PENDENTE":
    case "Aberto":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const statusDisplayMap: { [key: string]: string } = {
  "EM TRATATIVA": "EM ANDAMENTO",
  "Aberto": "PENDENTE",
};

const StatusBadge = ({ status }: { status?: string }) => {
  const currentStatus = status || "PENDENTE";
  const displayStatus = statusDisplayMap[currentStatus] || currentStatus;

  return (
    <Badge variant="secondary" className={getStatusColor(currentStatus)}>
      {displayStatus}
    </Badge>
  );
};

export default StatusBadge;
