
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelatorioFilters } from "@/components/relatorios/RelatorioFilters";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_TREINAMENTOS, MOCK_TREINAMENTOS_NORMATIVOS, MOCK_EXECUCAO_TREINAMENTOS } from "@/types/treinamentos";
import { calcularStatusTreinamento, getStatusColor } from "@/utils/treinamentosUtils";

// Prepare data for the report
const prepareTreinamentosData = () => {
  // Process training data for the report
  const treinamentosData = MOCK_TREINAMENTOS_NORMATIVOS.map(treinamento => {
    const status = calcularStatusTreinamento(treinamento.dataValidade);
    const treinamentoDetalhes = MOCK_TREINAMENTOS.find(t => t.id === treinamento.treinamentoId);
    
    return {
      id: treinamento.id,
      funcionario: `Funcionário ID ${treinamento.funcionarioId}`,
      nome: treinamentoDetalhes?.nome || "Desconhecido",
      tipo: treinamentoDetalhes?.categoria || "Desconhecido", // Changed from tipo to categoria
      dataInicio: new Date(treinamento.dataRealizacao), // Changed from dataInicio to dataRealizacao
      dataValidade: treinamento.dataValidade,
      status,
      cargaHoraria: treinamentoDetalhes?.cargaHoraria || 0
    };
  });
  
  return treinamentosData;
};

// Prepare chart data
const prepareChartData = (data: ReturnType<typeof prepareTreinamentosData>) => {
  // Status chart
  const byStatus = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Training type chart
  const byTipo = data.reduce((acc, item) => {
    acc[item.tipo] = (acc[item.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Monthly execution chart
  const byMonth = MOCK_EXECUCAO_TREINAMENTOS.reduce((acc, item) => {
    const key = `${item.mes}/${item.ano}`;
    if (!acc[key]) {
      acc[key] = { name: key, count: 0, hoursTotal: 0 };
    }
    acc[key].count += 1;
    acc[key].hoursTotal += item.cargaHoraria;
    return acc;
  }, {} as Record<string, { name: string; count: number; hoursTotal: number }>);
  
  return {
    byStatus: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
    byTipo: Object.entries(byTipo).map(([name, value]) => ({ name, value })),
    byMonth: Object.values(byMonth).sort((a, b) => {
      const [aMonth, aYear] = a.name.split('/').map(Number);
      const [bMonth, bYear] = b.name.split('/').map(Number);
      return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    })
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RelatoriosTreinamentos = () => {
  const [treinamentosData] = useState(prepareTreinamentosData());
  const [isFiltered, setIsFiltered] = useState(false);
  
  const chartData = prepareChartData(treinamentosData);
  
  const handleFilter = (filters: any) => {
    console.log("Applied filters:", filters);
    // In a real app, this would filter the data based on the selected filters
    setIsFiltered(true);
  };
  
  const chartConfig = {
    "Válido": { label: "Válido", theme: { light: "#22c55e", dark: "#22c55e" } },
    "Próximo ao vencimento": { label: "Próximo ao vencimento", theme: { light: "#f97316", dark: "#f97316" } },
    "Vencido": { label: "Vencido", theme: { light: "#ef4444", dark: "#ef4444" } },
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/relatorios">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Relatório de Treinamentos</h2>
        </div>
      </div>
      
      <RelatorioFilters 
        onFilter={handleFilter}
        filterOptions={{
          periods: [
            { value: "last-7", label: "Últimos 7 dias" },
            { value: "last-30", label: "Últimos 30 dias" },
            { value: "last-90", label: "Últimos 90 dias" },
            { value: "current-month", label: "Mês atual" },
            { value: "previous-month", label: "Mês anterior" },
            { value: "current-year", label: "Ano atual" },
          ],
          additionalFilters: [
            {
              id: "tipo",
              label: "Tipo de Treinamento",
              options: [
                { value: "normativo", label: "Normativo" },
                { value: "seguranca", label: "Segurança" },
                { value: "procedimento", label: "Procedimento" },
                { value: "tecnico", label: "Técnico" },
              ]
            },
            {
              id: "status",
              label: "Status",
              options: [
                { value: "valido", label: "Válido" },
                { value: "proximo-vencimento", label: "Próximo ao vencimento" },
                { value: "vencido", label: "Vencido" },
              ]
            }
          ]
        }}
      />
      
      {isFiltered && (
        <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
          <p className="text-sm text-muted-foreground">
            Mostrando dados filtrados. 
          </p>
        </div>
      )}
      
      <Tabs defaultValue="graficos">
        <TabsList>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          <TabsTrigger value="tabela">Tabela</TabsTrigger>
        </TabsList>
        <TabsContent value="graficos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Treinamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.byStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {chartData.byStatus.map((entry) => (
                            <Cell 
                              key={`cell-${entry.name}`} 
                              fill={
                                entry.name === "Válido" ? "#22c55e" :
                                entry.name === "Próximo ao vencimento" ? "#f97316" : 
                                "#ef4444"
                              } 
                            />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegend />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Treinamentos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.byTipo}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {chartData.byTipo.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegend />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Execução de Treinamentos por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.byMonth}>
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegend />} />
                        <Bar yAxisId="left" dataKey="count" name="Quantidade" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="hoursTotal" name="Horas Totais" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="tabela">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Treinamento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Carga Horária</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treinamentosData.map((treinamento) => (
                    <TableRow key={treinamento.id}>
                      <TableCell>{treinamento.id}</TableCell>
                      <TableCell>{treinamento.funcionario}</TableCell>
                      <TableCell>{treinamento.nome}</TableCell>
                      <TableCell>{treinamento.tipo}</TableCell>
                      <TableCell>{new Date(treinamento.dataInicio).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(treinamento.dataValidade).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{treinamento.cargaHoraria}h</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            treinamento.status === "Válido" 
                              ? "outline"
                              : treinamento.status === "Próximo ao vencimento"
                              ? "secondary"
                              : "destructive"
                          }
                          className={getStatusColor(treinamento.status)}
                        >
                          {treinamento.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosTreinamentos;
