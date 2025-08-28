
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelatorioFilters } from "@/components/relatorios/RelatorioFilters";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for the report
const MOCK_OCORRENCIAS_DATA = [
  { id: 1, data: "2023-04-05", tipo: "Acidente", classificacaoRisco: "Alto", empresa: "Empresa A", partesCorpo: "Mãos", status: "Fechado" },
  { id: 2, data: "2023-04-10", tipo: "Quase Acidente", classificacaoRisco: "Médio", empresa: "Empresa B", partesCorpo: "N/A", status: "Em Análise" },
  { id: 3, data: "2023-04-15", tipo: "Incidente", classificacaoRisco: "Baixo", empresa: "Empresa A", partesCorpo: "N/A", status: "Fechado" },
  { id: 4, data: "2023-04-20", tipo: "Acidente", classificacaoRisco: "Alto", empresa: "Empresa C", partesCorpo: "Pernas", status: "Em Análise" },
  { id: 5, data: "2023-04-25", tipo: "Quase Acidente", classificacaoRisco: "Médio", empresa: "Empresa B", partesCorpo: "N/A", status: "Fechado" },
  { id: 6, data: "2023-05-02", tipo: "Incidente", classificacaoRisco: "Baixo", empresa: "Empresa A", partesCorpo: "N/A", status: "Fechado" },
  { id: 7, data: "2023-05-08", tipo: "Acidente", classificacaoRisco: "Alto", empresa: "Empresa C", partesCorpo: "Cabeça", status: "Em Análise" },
  { id: 8, data: "2023-05-15", tipo: "Quase Acidente", classificacaoRisco: "Médio", empresa: "Empresa B", partesCorpo: "N/A", status: "Fechado" },
  { id: 9, data: "2023-05-22", tipo: "Incidente", classificacaoRisco: "Baixo", empresa: "Empresa A", partesCorpo: "N/A", status: "Em Análise" },
  { id: 10, data: "2023-05-28", tipo: "Acidente", classificacaoRisco: "Alto", empresa: "Empresa C", partesCorpo: "Braços", status: "Fechado" },
];

// Prepare chart data
const prepareChartData = (data: typeof MOCK_OCORRENCIAS_DATA) => {
  // By type
  const byTipo = data.reduce((acc, item) => {
    acc[item.tipo] = (acc[item.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // By risk classification
  const byRisco = data.reduce((acc, item) => {
    acc[item.classificacaoRisco] = (acc[item.classificacaoRisco] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // By company
  const byEmpresa = data.reduce((acc, item) => {
    acc[item.empresa] = (acc[item.empresa] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // By month for timeline
  const byMonth = data.reduce((acc, item) => {
    const date = new Date(item.data);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        name: monthYear,
        acidentes: 0,
        quaseAcidentes: 0,
        incidentes: 0
      };
    }
    
    if (item.tipo === "Acidente") {
      acc[monthYear].acidentes += 1;
    } else if (item.tipo === "Quase Acidente") {
      acc[monthYear].quaseAcidentes += 1;
    } else if (item.tipo === "Incidente") {
      acc[monthYear].incidentes += 1;
    }
    
    return acc;
  }, {} as Record<string, { name: string; acidentes: number; quaseAcidentes: number; incidentes: number }>);
  
  // Convert to arrays and sort
  const timelineData = Object.values(byMonth).sort((a, b) => {
    const [aMonth, aYear] = a.name.split('/').map(Number);
    const [bMonth, bYear] = b.name.split('/').map(Number);
    return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
  });
  
  return {
    byTipo: Object.entries(byTipo).map(([name, value]) => ({ name, value })),
    byRisco: Object.entries(byRisco).map(([name, value]) => ({ name, value })),
    byEmpresa: Object.entries(byEmpresa).map(([name, value]) => ({ name, value })),
    timeline: timelineData
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RelatoriosOcorrencias = () => {
  const [filteredData, setFilteredData] = useState(MOCK_OCORRENCIAS_DATA);
  const [isFiltered, setIsFiltered] = useState(false);
  
  const chartData = prepareChartData(filteredData);
  
  const handleFilter = (filters: any) => {
    console.log("Applied filters:", filters);
    // In a real app, this would filter the data based on the selected filters
    setIsFiltered(true);
  };
  
  const chartConfig = {
    alto: { label: "Alto", theme: { light: "#ef4444", dark: "#ef4444" } },
    médio: { label: "Médio", theme: { light: "#f97316", dark: "#f97316" } },
    baixo: { label: "Baixo", theme: { light: "#22c55e", dark: "#22c55e" } },
    acidente: { label: "Acidente", color: "#ef4444" },
    "quase acidente": { label: "Quase Acidente", color: "#f97316" },
    incidente: { label: "Incidente", color: "#3b82f6" },
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/relatorios/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Relatório de Ocorrências</h2>
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
              label: "Tipo de Ocorrência",
              options: [
                { value: "acidente", label: "Acidente" },
                { value: "quase-acidente", label: "Quase Acidente" },
                { value: "incidente", label: "Incidente" },
              ]
            },
            {
              id: "risco",
              label: "Classificação de Risco",
              options: [
                { value: "alto", label: "Alto" },
                { value: "medio", label: "Médio" },
                { value: "baixo", label: "Baixo" },
              ]
            },
            {
              id: "empresa",
              label: "Empresa",
              options: [
                { value: "empresa-a", label: "Empresa A" },
                { value: "empresa-b", label: "Empresa B" },
                { value: "empresa-c", label: "Empresa C" },
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
                <CardTitle>Ocorrências por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={chartConfig}>
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
                          {chartData.byTipo.map((entry) => (
                            <Cell 
                              key={`cell-${entry.name}`} 
                              fill={
                                entry.name === "Acidente" ? "#ef4444" :
                                entry.name === "Quase Acidente" ? "#f97316" : 
                                "#3b82f6"
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
                <CardTitle>Ocorrências por Classificação de Risco</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.byRisco}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {chartData.byRisco.map((entry) => (
                            <Cell 
                              key={`cell-${entry.name}`} 
                              fill={
                                entry.name === "Alto" ? "#ef4444" :
                                entry.name === "Médio" ? "#f97316" : 
                                "#22c55e"
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
                <CardTitle>Ocorrências por Empresa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.byEmpresa}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegend />} />
                        <Bar dataKey="value" name="Quantidade" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tendência de Ocorrências</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.timeline}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegend />} />
                        <Line type="monotone" dataKey="acidentes" name="Acidentes" stroke="#ef4444" />
                        <Line type="monotone" dataKey="quaseAcidentes" name="Quase Acidentes" stroke="#f97316" />
                        <Line type="monotone" dataKey="incidentes" name="Incidentes" stroke="#3b82f6" />
                      </LineChart>
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
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Partes do Corpo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((ocorrencia) => (
                    <TableRow key={ocorrencia.id}>
                      <TableCell>{ocorrencia.id}</TableCell>
                      <TableCell>{new Date(ocorrencia.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant={
                          ocorrencia.tipo === "Acidente" ? "destructive" :
                          ocorrencia.tipo === "Quase Acidente" ? "default" : "secondary"
                        }>
                          {ocorrencia.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          ocorrencia.classificacaoRisco === "Alto" ? "destructive" :
                          ocorrencia.classificacaoRisco === "Médio" ? "default" : "outline"
                        }>
                          {ocorrencia.classificacaoRisco}
                        </Badge>
                      </TableCell>
                      <TableCell>{ocorrencia.empresa}</TableCell>
                      <TableCell>{ocorrencia.partesCorpo}</TableCell>
                      <TableCell>
                        <Badge variant={ocorrencia.status === "Fechado" ? "outline" : "secondary"}>
                          {ocorrencia.status}
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

export default RelatoriosOcorrencias;
