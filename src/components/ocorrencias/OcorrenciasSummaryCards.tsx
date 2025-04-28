
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, ArrowDown, FileBarChart, FileCheck, FileClock } from "lucide-react";

const OcorrenciasSummaryCards = () => {
  // Mock data for the summary cards
  const totalOcorrencias = 48;
  const ocorrenciasPorTipo = {
    comAfastamento: 8,
    semAfastamento: 24,
    quaseAcidente: 16
  };
  const diasPerdidos = 126;
  const diasDebitados = 75;
  const ocorrenciasPorRisco = {
    alto: 12,
    medio: 20,
    baixo: 16
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
          <FileBarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOcorrencias}</div>
          <p className="text-xs text-muted-foreground">
            Últimos 12 meses
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Com Afastamento</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ocorrenciasPorTipo.comAfastamento}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((ocorrenciasPorTipo.comAfastamento / totalOcorrencias) * 100)}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sem Afastamento</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ocorrenciasPorTipo.semAfastamento}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((ocorrenciasPorTipo.semAfastamento / totalOcorrencias) * 100)}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quase Acidentes</CardTitle>
          <FileCheck className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{ocorrenciasPorTipo.quaseAcidente}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((ocorrenciasPorTipo.quaseAcidente / totalOcorrencias) * 100)}% do total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dias Perdidos</CardTitle>
          <ArrowDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{diasPerdidos}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round(diasPerdidos / ocorrenciasPorTipo.comAfastamento)} dias/ocorrência
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dias Debitados</CardTitle>
          <FileClock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{diasDebitados}</div>
          <p className="text-xs text-muted-foreground">
            Por incapacidade permanente
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OcorrenciasSummaryCards;
