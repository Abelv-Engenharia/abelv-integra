import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Plane, AlertTriangle, CheckCircle, Clock, DollarSign } from "lucide-react";

export default function DashboardFolgaCampo() {
  // Mock data para indicadores
  const kpis = {
    folgasD45: { total: 45, tratadas: 38, pendentes: 7 },
    folgasD30: { total: 28, tratadas: 25, pendentes: 3 },
    passagens: { 
      leadTime: 5.2, 
      compradasNoPrazo: 89,
      custoMedio: 850.00
    },
    pendencias: {
      formularios: 12,
      valores: 8,
      comprasAbertas: 15
    }
  };

  const obrasSummary = [
    { obra: "Obra Alpha", colaboradores: 45, folgasPrevistas: 12, emAndamento: 3, concluidas: 9 },
    { obra: "Obra Beta", colaboradores: 32, folgasPrevistas: 8, emAndamento: 2, concluidas: 6 },
    { obra: "Obra Gamma", colaboradores: 28, folgasPrevistas: 6, emAndamento: 1, concluidas: 5 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard - Folga de Campo</h1>
          <p className="text-muted-foreground">Visão geral dos indicadores e status das folgas</p>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Folgas D-45</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.folgasD45.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{kpis.folgasD45.tratadas} tratadas</Badge>
              <Badge variant="destructive">{kpis.folgasD45.pendentes} pendentes</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Folgas D-30</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.folgasD30.total}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{kpis.folgasD30.tratadas} tratadas</Badge>
              <Badge variant="destructive">{kpis.folgasD30.pendentes} pendentes</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Time Passagens</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.passagens.leadTime} dias</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{kpis.passagens.compradasNoPrazo}% no prazo</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Médio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {kpis.passagens.custoMedio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">por trecho</p>
          </CardContent>
        </Card>
      </div>

      {/* Pendências */}
      <Card>
        <CardHeader>
          <CardTitle>Pendências</CardTitle>
          <CardDescription>Itens que requerem atenção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {kpis.pendencias.formularios}
              </Badge>
              <span className="text-sm">Formulários pendentes</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-red-600 border-red-600">
                {kpis.pendencias.valores}
              </Badge>
              <span className="text-sm">Valores pendentes</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                {kpis.pendencias.comprasAbertas}
              </Badge>
              <span className="text-sm">Compras em aberto</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo por Obra */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo por Obra</CardTitle>
          <CardDescription>Status das folgas por centro de custo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {obrasSummary.map((obra, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium">{obra.obra}</h4>
                    <p className="text-sm text-muted-foreground">{obra.colaboradores} colaboradores</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{obra.folgasPrevistas}</div>
                    <div className="text-muted-foreground">Previstas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-orange-600">{obra.emAndamento}</div>
                    <div className="text-muted-foreground">Em andamento</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">{obra.concluidas}</div>
                    <div className="text-muted-foreground">Concluídas</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}