
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreinamentosNormativosChart } from "@/components/treinamentos/TreinamentosNormativosChart";
import { TreinamentoStatusTable } from "@/components/treinamentos/TreinamentoStatusTable";
import { TreinamentosSummaryCards } from "@/components/treinamentos/TreinamentosSummaryCards";
import { TreinamentosPorProcessoTable } from "@/components/treinamentos/TreinamentosPorProcessoTable";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  LayoutDashboard, 
  Plus, 
  Users 
} from "lucide-react";
import { Link } from "react-router-dom";
import TreinamentosDashboardFilters from "@/components/treinamentos/TreinamentosDashboardFilters";
import { TreinamentosExecucaoChart } from "@/components/treinamentos/TreinamentosExecucaoChart";
import { DonutProcessoGeralChart } from "@/components/treinamentos/DonutProcessoGeralChart";
import { DonutSubprocessoChart } from "@/components/treinamentos/DonutSubprocessoChart";

const TreinamentosDashboard = () => {
  const [year, setYear] = useState<string>("todos");
  const [month, setMonth] = useState<string>("todos");
  const [ccaId, setCcaId] = useState<string>("todos");

  return (
    <div className="space-y-6">
      <TreinamentosDashboardFilters
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        ccaId={ccaId}
        setCcaId={setCcaId}
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Treinamentos</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie os treinamentos da sua organização
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/treinamentos/consulta">
              <FileText className="mr-2 h-4 w-4" />
              Consultar
            </Link>
          </Button>
          <Button asChild>
            <Link to="/treinamentos/execucao">
              <Plus className="mr-2 h-4 w-4" />
              Novo Treinamento
            </Link>
          </Button>
        </div>
      </div>

      <TreinamentosSummaryCards />

      <TreinamentosPorProcessoTable />

      <Tabs defaultValue="execucao" className="space-y-4">
        <TabsList>
          <TabsTrigger value="execucao">Registros de Execução</TabsTrigger>
          <TabsTrigger value="normativos">Treinamentos Normativos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="execucao" className="space-y-4">
          {/* Alterado para exibir gráficos um abaixo do outro */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>PROCESSO - GERAL</CardTitle>
                <CardDescription>
                  Distribuição geral dos processos de treinamento
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[340px] flex items-center justify-center">
                <DonutProcessoGeralChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>SUBPROCESSO</CardTitle>
                <CardDescription>
                  Distribuição dos subprocessos de treinamento
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[340px] flex items-center justify-center">
                <DonutSubprocessoChart />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              <Link to="/treinamentos/execucao">
                <Calendar className="mr-2 h-5 w-5" />
                Registrar Execução
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/treinamentos/consulta">
                <FileText className="mr-2 h-5 w-5" />
                Consultar Registros
              </Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="normativos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Status dos Treinamentos Normativos</CardTitle>
                <CardDescription>
                  Visão geral do status dos treinamentos normativos
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TreinamentosNormativosChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vencimentos Próximos</CardTitle>
                <CardDescription>
                  Treinamentos com vencimento nos próximos 30 dias
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* Placeholder for expiration chart */}
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">
                    Gráfico de vencimentos próximos
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Treinamentos por Funcionário</CardTitle>
              <CardDescription>
                Visão detalhada do status de treinamentos normativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TreinamentoStatusTable />
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              <Link to="/treinamentos/normativo">
                <FileText className="mr-2 h-5 w-5" />
                Registrar Treinamento Normativo
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/treinamentos/cracha">
                <Users className="mr-2 h-5 w-5" />
                Emitir Crachá de Capacitação
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TreinamentosDashboard;
