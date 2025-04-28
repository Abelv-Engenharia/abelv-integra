
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

// Mock data para inspeções recentes
const recentInspections = [
  {
    id: 1,
    cca: "CCA 001",
    dataInspecao: new Date(2025, 0, 10),
    responsavel: "João Silva",
    status: "A REALIZAR",
  },
  {
    id: 2,
    cca: "CCA 002",
    dataInspecao: new Date(2025, 0, 15),
    responsavel: "Maria Oliveira",
    status: "REALIZADA NÃO PROGRAMADA",
  },
  {
    id: 3,
    cca: "CCA 003",
    dataInspecao: new Date(2024, 11, 20),
    responsavel: "Carlos Santos",
    status: "REALIZADA",
  },
  {
    id: 4,
    cca: "CCA 001",
    dataInspecao: new Date(2024, 11, 25),
    responsavel: "Ana Costa",
    status: "NÃO REALIZADA",
  },
  {
    id: 5,
    cca: "CCA 002",
    dataInspecao: new Date(2024, 11, 30),
    responsavel: "Pedro Souza",
    status: "CANCELADA",
  }
];

// Função para renderizar o ícone de acordo com o status
const getStatusIcon = (status: string) => {
  switch (status) {
    case "REALIZADA":
      return <ShieldCheck className="h-4 w-4" />;
    case "REALIZADA NÃO PROGRAMADA":
      return <ShieldCheck className="h-4 w-4" />;
    case "A REALIZAR":
      return <Shield className="h-4 w-4" />;
    case "NÃO REALIZADA":
      return <ShieldAlert className="h-4 w-4" />;
    case "CANCELADA":
      return <ShieldX className="h-4 w-4" />;
    default:
      return <Shield className="h-4 w-4" />;
  }
};

// Função para renderizar a cor da badge de acordo com o status
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "REALIZADA":
      return "bg-green-500 hover:bg-green-600";
    case "REALIZADA NÃO PROGRAMADA":
      return "bg-blue-500 hover:bg-blue-600";
    case "A REALIZAR":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "NÃO REALIZADA":
      return "bg-red-500 hover:bg-red-600";
    case "CANCELADA":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "";
  }
};

export function RecentInspectionsList() {
  return (
    <div className="space-y-4">
      {recentInspections.map((inspecao) => (
        <div
          key={inspecao.id}
          className="flex items-center justify-between border-b pb-2 last:border-0"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{inspecao.cca}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-2">{format(inspecao.dataInspecao, "dd/MM/yyyy")}</span>
              <span>{inspecao.responsavel}</span>
            </div>
          </div>
          <Badge className={getStatusBadgeClass(inspecao.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(inspecao.status)}
              <span className="hidden sm:inline">{inspecao.status}</span>
            </div>
          </Badge>
        </div>
      ))}
    </div>
  );
}
