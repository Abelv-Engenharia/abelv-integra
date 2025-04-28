
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InspecaoStatusDonutChart } from "@/components/hora-seguranca/InspecaoStatusDonutChart";
import { InspecoesBarChart } from "@/components/hora-seguranca/InspecoesBarChart";
import { InspecoesSummaryCards } from "@/components/hora-seguranca/InspecoesSummaryCards";
import { RecentInspectionsList } from "@/components/hora-seguranca/RecentInspectionsList";

const HoraSegurancaDashboard = () => {
  const [tab, setTab] = useState("overview");

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Hora da Segurança</h2>
          <p className="text-muted-foreground">
            Dashboard de acompanhamento de inspeções de segurança
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="by-cca">Por CCA</TabsTrigger>
            <TabsTrigger value="by-responsible">Por Responsável</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <InspecoesSummaryCards />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Distribuição por Status</CardTitle>
                  <CardDescription>
                    Visão geral do status das inspeções
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <InspecaoStatusDonutChart />
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Inspeções Recentes</CardTitle>
                  <CardDescription>
                    Últimas inspeções registradas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentInspectionsList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="by-cca" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inspeções por CCA</CardTitle>
                <CardDescription>
                  Distribuição de inspeções por centro de custo
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <InspecoesBarChart dataType="cca" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="by-responsible" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inspeções por Responsável</CardTitle>
                <CardDescription>
                  Distribuição de inspeções por responsável
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <InspecoesBarChart dataType="responsible" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HoraSegurancaDashboard;
