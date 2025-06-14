
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreinamentosNormativosChart } from "@/components/treinamentos/TreinamentosNormativosChart";
import { TreinamentoStatusTable } from "@/components/treinamentos/TreinamentoStatusTable";
import { TreinamentosSummaryCards } from "@/components/treinamentos/TreinamentosSummaryCards";
import { TreinamentosPorProcessoTable } from "@/components/treinamentos/TreinamentosPorProcessoTable";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, LayoutDashboard, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import TreinamentosDashboardFilters from "@/components/treinamentos/TreinamentosDashboardFilters";
import { TreinamentosExecucaoChart } from "@/components/treinamentos/TreinamentosExecucaoChart";
import { DonutProcessoGeralChart } from "@/components/treinamentos/DonutProcessoGeralChart";
import { DonutSubprocessoChart } from "@/components/treinamentos/DonutSubprocessoChart";
import { fetchProcessosTreinamento } from "@/services/treinamentos/processoTreinamentoService";
import { TabelaTreinamentosNormativosVencidos } from "@/components/treinamentos/TabelaTreinamentosNormativosVencidos";
const TreinamentosDashboard = () => {
  const [year, setYear] = useState<string>("todos");
  const [month, setMonth] = useState<string>("todos");
  const [ccaId, setCcaId] = useState<string>("todos");

  // Opções de processo treinamento para o seletor
  const [processos, setProcessos] = useState<any[]>([]);
  const [processoTreinamentoId, setProcessoTreinamentoId] = useState<string | null>(null);
  useEffect(() => {
    fetchProcessosTreinamento().then(setProcessos);
  }, []);
  return <div className="space-y-6">
      <TreinamentosDashboardFilters year={year} setYear={setYear} month={month} setMonth={setMonth} ccaId={ccaId} setCcaId={setCcaId} />
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
          
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>PROCESSO - GERAL</CardTitle>
                <CardDescription>
                  Distribuição geral dos processos de treinamento
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <DonutProcessoGeralChart />
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
        
        <TabsContent value="normativos" className="flex flex-col items-center w-full gap-4">
          <div className="flex flex-col items-center w-full gap-4">
            {/* Card do gráfico, altura reduzida e largura padronizada */}
            <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Status dos Treinamentos Normativos</CardTitle>
                <CardDescription>
                  Visão geral do status dos treinamentos normativos
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[375px]">
                <TreinamentosNormativosChart />
              </CardContent>
            </Card>
            {/* Card da tabela vencidos, alinhado a largura do card acima */}
            <Card className="w-full max-w-4xl mx-auto">
              <CardContent>
                <TabelaTreinamentosNormativosVencidos />
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" asChild>
              
            </Button>
            <Button variant="outline" size="lg" asChild>
              
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default TreinamentosDashboard;

