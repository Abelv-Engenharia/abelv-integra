import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Mail, TrendingUp, AlertCircle } from "lucide-react";
import { CCASpendingData } from "@/types/gestao-pessoas/travel";
import { CCASpendingChart } from "./CCASpendingChart";
interface CCAAnalysisSectionProps {
  ccaData: CCASpendingData[];
  onSendCCA: (cca: string) => void;
}
export const CCAAnalysisSection = ({
  ccaData,
  onSendCCA
}: CCAAnalysisSectionProps) => {
  const [selectedCCA, setSelectedCCA] = useState<string>("todos");
  const [sortBy, setSortBy] = useState<string>("totalGasto");
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  const getStatusColor = (percentual: number) => {
    if (percentual >= 100) return "destructive";
    if (percentual >= 85) return "destructive";
    if (percentual >= 60) return "default";
    return "secondary";
  };
  const getStatusLabel = (percentual: number) => {
    if (percentual >= 100) return "Esgotado";
    if (percentual >= 85) return "Crítico";
    if (percentual >= 60) return "Atenção";
    return "Saudável";
  };
  const filteredData = selectedCCA === "todos" ? ccaData : ccaData.filter(cca => cca.cca === selectedCCA);
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "cca":
        return a.cca.localeCompare(b.cca);
      case "percentualUtilizado":
        return b.percentualUtilizado - a.percentualUtilizado;
      case "totalGasto":
      default:
        return b.totalGasto - a.totalGasto;
    }
  });
  const totalCCAs = ccaData.length;
  const ccasCriticos = ccaData.filter(cca => cca.percentualUtilizado >= 85).length;
  const ccasAtencao = ccaData.filter(cca => cca.percentualUtilizado >= 60 && cca.percentualUtilizado < 85).length;
  const maiorGasto = ccaData.reduce((max, cca) => cca.totalGasto > max.totalGasto ? cca : max, ccaData[0]);
  const menorSaldo = ccaData.reduce((min, cca) => cca.saldoRestante < min.saldoRestante ? cca : min, ccaData[0]);
  return <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de CCAs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCCAs}</div>
            <p className="text-xs text-muted-foreground">Com gastos no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CCAs Críticos</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{ccasCriticos}</div>
            <p className="text-xs text-muted-foreground">≥ 85% do orçamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CCAs em Atenção</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{ccasAtencao}</div>
            <p className="text-xs text-muted-foreground">60-85% do orçamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{maiorGasto?.cca}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(maiorGasto?.totalGasto || 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico */}
      <CCASpendingChart data={ccaData} />

      {/* Filtros e Tabela */}
      
    </div>;
};