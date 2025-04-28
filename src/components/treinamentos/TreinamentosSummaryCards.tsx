
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar,
  FileCheck, 
  FileText, 
  Users
} from "lucide-react";
import { MOCK_FUNCIONARIOS, MOCK_TREINAMENTOS_NORMATIVOS, MOCK_EXECUCAO_TREINAMENTOS } from "@/types/treinamentos";
import { calcularStatusTreinamento } from "@/utils/treinamentosUtils";

export const TreinamentosSummaryCards = () => {
  // Count total trainings executed
  const totalTreinamentosExecutados = MOCK_EXECUCAO_TREINAMENTOS.length;
  
  // Count valid and near expiration trainings
  const treinamentosStatus = MOCK_TREINAMENTOS_NORMATIVOS.map(t => ({
    ...t,
    status: calcularStatusTreinamento(t.dataValidade)
  }));
  const treinamentosValidos = treinamentosStatus.filter(t => t.status === "Válido").length;
  const treinamentosVencendo = treinamentosStatus.filter(t => t.status === "Próximo ao vencimento").length;
  
  // Count employees with valid trainings
  const funcionariosComTreinamentos = new Set(
    treinamentosStatus
      .filter(t => t.status === "Válido" || t.status === "Próximo ao vencimento")
      .map(t => t.funcionarioId)
  ).size;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{MOCK_FUNCIONARIOS.length}</div>
          <p className="text-xs text-muted-foreground">
            Funcionários com treinamentos: {funcionariosComTreinamentos}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Treinamentos Executados</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTreinamentosExecutados}</div>
          <p className="text-xs text-muted-foreground">
            Total de eventos de treinamento
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Treinamentos Válidos</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{treinamentosValidos}</div>
          <p className="text-xs text-muted-foreground">
            Certificações dentro da validade
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próximos ao Vencimento</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{treinamentosVencendo}</div>
          <p className="text-xs text-muted-foreground">
            Vencimento nos próximos 30 dias
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
