
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InspecaoStatusDonutChart } from "@/components/hora-seguranca/InspecaoStatusDonutChart";
import { InspecoesBarChart } from "@/components/hora-seguranca/InspecoesBarChart";
import { InspecoesSummaryCards } from "@/components/hora-seguranca/InspecoesSummaryCards";
import { RecentInspectionsList } from "@/components/hora-seguranca/RecentInspectionsList";

const HoraSegurancaDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [filterCCA, setFilterCCA] = useState("");
  const [filterResponsavel, setFilterResponsavel] = useState("");
  const [filterPeriodo, setFilterPeriodo] = useState("");

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
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Select value={filterCCA} onValueChange={setFilterCCA}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="CCA001">CCA 001</SelectItem>
                  <SelectItem value="CCA002">CCA 002</SelectItem>
                  <SelectItem value="CCA003">CCA 003</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterResponsavel} onValueChange={setFilterResponsavel}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por Responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="RESP001">João Silva</SelectItem>
                  <SelectItem value="RESP002">Maria Oliveira</SelectItem>
                  <SelectItem value="RESP003">Carlos Santos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <div className="grid gap-4 md:grid-cols-2">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HoraSegurancaDashboard;
