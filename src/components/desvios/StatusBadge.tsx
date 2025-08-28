
import { Badge } from "@/components/ui/badge";

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONCLUÍDO":
    case "Fechado":
    case "TRATADO":
      return "bg-status-concluida-bg text-status-concluida border-status-concluida";
    case "EM ANDAMENTO":
    case "Em andamento":
      return "bg-status-andamento-bg text-status-andamento border-status-andamento";
    case "EM TRATATIVA":
      return "bg-status-andamento-bg text-status-andamento border-status-andamento";
    case "PENDENTE":
    case "Aberto":
      return "bg-status-pendente-bg text-status-pendente border-status-pendente";
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

  console.log('🏷️ StatusBadge - Status recebido:', currentStatus, 'Status exibido:', displayStatus, 'Cor:', getStatusColor(currentStatus));

  return (
    <Badge variant="secondary" className={`${getStatusColor(currentStatus)} border font-medium`}>
      {displayStatus}
    </Badge>
  );
};

export default StatusBadge;
