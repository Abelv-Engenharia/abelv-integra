
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreinamentosNormativosChart } from "@/components/treinamentos/TreinamentosNormativosChart";
import { TreinamentosSummaryCards } from "@/components/treinamentos/TreinamentosSummaryCards";
import { TreinamentosPorProcessoTable } from "@/components/treinamentos/TreinamentosPorProcessoTable";
import TreinamentosDashboardFilters from "@/components/treinamentos/TreinamentosDashboardFilters";
import ProcessoGeralPieChart from "@/components/treinamentos/ProcessoGeralPieChart";
import { TabelaTreinamentosNormativosVencidos } from "@/components/treinamentos/TabelaTreinamentosNormativosVencidos";
import { useUserCCAs } from "@/hooks/useUserCCAs";

const RelatoriosTreinamentos = () => {
  // Inicializar com ano atual por padrão
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState<string>(currentYear);
  const [month, setMonth] = useState<string>("todos");
  const [ccaId, setCcaId] = useState<string>("todos");
  const { data: userCCAs = [] } = useUserCCAs();

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatório de Treinamentos</h1>
          <p className="text-muted-foreground">
            Relatório completo com todas as informações sobre os treinamentos da sua organização
          </p>
        </div>
      </div>

      <TreinamentosDashboardFilters 
        year={year} 
        setYear={setYear} 
        month={month} 
        setMonth={setMonth} 
        ccaId={ccaId} 
        setCcaId={setCcaId} 
      />

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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosTreinamentos;
