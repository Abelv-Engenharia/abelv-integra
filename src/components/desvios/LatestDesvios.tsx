
import { AlertTriangle, ArrowRight, Calendar, CircleAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Mock data for latest deviations
const latestDesvios = [
  {
    id: "DEV-2025-0143",
    date: "07/04/2025",
    title: "Falta de uso de EPI em trabalho em altura",
    cca: "CCA-001",
    company: "Abelv",
    risk: "Substancial",
    status: "Pendente",
  },
  {
    id: "DEV-2025-0142",
    date: "06/04/2025",
    title: "Equipamento sem inspeção de segurança",
    cca: "CCA-002",
    company: "Fornecedor A",
    risk: "Moderado",
    status: "Em andamento",
  },
  {
    id: "DEV-2025-0141",
    date: "05/04/2025",
    title: "Acesso não autorizado a área restrita",
    cca: "CCA-001",
    company: "Abelv",
    risk: "Tolerável",
    status: "Concluído",
  },
  {
    id: "DEV-2025-0140",
    date: "04/04/2025",
    title: "Procedimento incorreto em operação de equipamento",
    cca: "CCA-003",
    company: "Fornecedor B",
    risk: "Moderado",
    status: "Pendente",
  },
  {
    id: "DEV-2025-0139",
    date: "03/04/2025",
    title: "Falha na sinalização de área de risco",
    cca: "CCA-002",
    company: "Abelv",
    risk: "Tolerável",
    status: "Concluído",
  },
];

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "Trivial":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Tolerável":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Moderado":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Substancial":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "Intolerável":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Concluído":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Em andamento":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Pendente":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const LatestDesvios = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Desvios Recentes</CardTitle>
            <CardDescription>Os últimos desvios registrados no sistema</CardDescription>
          </div>
          <CircleAlert className="h-5 w-5 text-orange-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {latestDesvios.map((desvio) => (
            <div
              key={desvio.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg border"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">{desvio.title}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{desvio.id}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{desvio.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <Badge variant="outline">{desvio.cca}</Badge>
                <Badge variant="outline">{desvio.company}</Badge>
                <Badge variant="secondary" className={getRiskColor(desvio.risk)}>
                  {desvio.risk}
                </Badge>
                <Badge variant="secondary" className={getStatusColor(desvio.status)}>
                  {desvio.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/desvios/consulta")}
        >
          Ver Todos os Desvios
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LatestDesvios;
