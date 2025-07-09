
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
import ProcessoGeralPieChart from "@/components/treinamentos/ProcessoGeralPieChart";
import { DonutSubprocessoChart } from "@/components/treinamentos/DonutSubprocessoChart";
import { fetchProcessosTreinamento } from "@/services/treinamentos/processoTreinamentoService";
import { TabelaTreinamentosNormativosVencidos } from "@/components/treinamentos/TabelaTreinamentosNormativosVencidos";
import { useUserCCAs } from "@/hooks/useUserCCAs";

const TreinamentosDashboard = () => {
  // Inicializar com ano atual por padrão
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState<string>(currentYear);
  const [month, setMonth] = useState<string>("todos");
  const [ccaId, setCcaId] = useState<string>("todos");
  const { data: userCCAs = [] } = useUserCCAs();

  // Opções de processo treinamento para o seletor
  const [processos, setProcessos] = useState<any[]>([]);
  const [processoTreinamentoId, setProcessoTreinamentoId] = useState<string | null>(null);
  useEffect(() => {
    fetchProcessosTreinamento().then(setProcessos);
  }, []);

  // Criar objeto de filtros para passar aos componentes
  const filters = { year, month, ccaId };

  if (userCCAs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Você não possui acesso a nenhum CCA.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <TreinamentosSummaryCards filters={filters} />

      <TreinamentosPorProcessoTable filters={filters} />

      <Tabs defaultValue="execucao" className="space-y-4">
        <TabsList>
          <TabsTrigger value="execucao">Registros de Execução</TabsTrigger>
          <TabsTrigger value="normativos">Treinamentos Normativos</TabsTrigger>
        </TabsList>

        <TabsContent value="execucao" className="space-y-4">
          
          <div className="flex flex-col gap-4">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>PROCESSO - GERAL</CardTitle>
                <CardDescription>
                  Distribuição geral dos processos de treinamento
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <ProcessoGeralPieChart filters={filters} />
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

        <TabsContent value="normativos" className="w-full px-0">
          <div className="w-full overflow-x-auto">
            <div className="flex flex-col w-full gap-4 min-w-[700px] max-w-full">
              {/* Card do gráfico */}
              <Card className="w-full max-w-full">
                <CardHeader>
                  <CardTitle>Status dos Treinamentos Normativos</CardTitle>
                  <CardDescription>
                    Visão geral do status dos treinamentos normativos
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[320px]">
                  <TreinamentosNormativosChart filters={filters} />
                </CardContent>
              </Card>
              {/* Card da tabela vencidos */}
              <Card className="w-full max-w-full">
                <CardContent className="p-0">
                  <TabelaTreinamentosNormativosVencidos />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" asChild></Button>
            <Button variant="outline" size="lg" asChild></Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default TreinamentosDashboard;
