
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelatorioFilters } from "@/components/relatorios/RelatorioFilters";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Sample data for the report
const MOCK_DESVIOS_DATA = [
  { id: 1, data: "2023-04-10", tipo: "Condição Insegura", classificacaoRisco: "Alto", area: "Produção", status: "Fechado", responsavel: "João Silva" },
  { id: 2, data: "2023-04-15", tipo: "Ato Inseguro", classificacaoRisco: "Médio", area: "Manutenção", status: "Em Andamento", responsavel: "Maria Santos" },
  { id: 3, data: "2023-04-18", tipo: "Condição Insegura", classificacaoRisco: "Baixo", area: "Escritório", status: "Fechado", responsavel: "Pedro Lima" },
  { id: 4, data: "2023-04-22", tipo: "Desvio Comportamental", classificacaoRisco: "Alto", area: "Produção", status: "Em Andamento", responsavel: "Ana Oliveira" },
  { id: 5, data: "2023-04-25", tipo: "Ato Inseguro", classificacaoRisco: "Médio", area: "Logística", status: "Fechado", responsavel: "Carlos Souza" },
  { id: 6, data: "2023-05-02", tipo: "Desvio Comportamental", classificacaoRisco: "Baixo", area: "Produção", status: "Em Andamento", responsavel: "João Silva" },
  { id: 7, data: "2023-05-05", tipo: "Condição Insegura", classificacaoRisco: "Alto", area: "Manutenção", status: "Fechado", responsavel: "Maria Santos" },
  { id: 8, data: "2023-05-10", tipo: "Ato Inseguro", classificacaoRisco: "Médio", area: "Escritório", status: "Em Andamento", responsavel: "Pedro Lima" },
];

// Chart data
const prepareChartData = (data: typeof MOCK_DESVIOS_DATA) => {
  const byTipo = data.reduce((acc, item) => {
    acc[item.tipo] = (acc[item.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byRisco = data.reduce((acc, item) => {
    acc[item.classificacaoRisco] = (acc[item.classificacaoRisco] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byArea = data.reduce((acc, item) => {
    acc[item.area] = (acc[item.area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    byTipo: Object.entries(byTipo).map(([name, value]) => ({ name, value })),
    byRisco: Object.entries(byRisco).map(([name, value]) => ({ name, value })),
    byArea: Object.entries(byArea).map(([name, value]) => ({ name, value })),
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RelatoriosDesvios = () => {
  const [filteredData, setFilteredData] = useState(MOCK_DESVIOS_DATA);
  const [isFiltered, setIsFiltered] = useState(false);
  
  const chartData = prepareChartData(filteredData);
  
  const handleFilter = (filters: any) => {
    console.log("Applied filters:", filters);
    // In a real app, this would filter the data based on the selected filters
    // For now, we'll just set the flag to show the filter is applied
    setIsFiltered(true);
  };
  
  const chartConfig = {
    alto: { label: "Alto", theme: { light: "#ef4444", dark: "#ef4444" } },
    médio: { label: "Médio", theme: { light: "#f97316", dark: "#f97316" } },
    baixo: { label: "Baixo", theme: { light: "#22c55e", dark: "#22c55e" } },
    "condição insegura": { label: "Condição Insegura", color: "#0088FE" },
    "ato inseguro": { label: "Ato Inseguro", color: "#00C49F" },
    "desvio comportamental": { label: "Desvio Comportamental", color: "#FFBB28" },
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
          <h2 className="text-3xl font-bold tracking-tight">Relatório de Desvios</h2>
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
              label: "Tipo de Desvio",
              options: [
                { value: "condicao-insegura", label: "Condição Insegura" },
                { value: "ato-inseguro", label: "Ato Inseguro" },
                { value: "desvio-comportamental", label: "Desvio Comportamental" },
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
              id: "area",
              label: "Área",
              options: [
                { value: "producao", label: "Produção" },
                { value: "manutencao", label: "Manutenção" },
                { value: "escritorio", label: "Escritório" },
                { value: "logistica", label: "Logística" },
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
                <CardTitle>Desvios por Tipo</CardTitle>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Desvios por Classificação de Risco</CardTitle>
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
                          {chartData.byRisco.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={
                              entry.name === "Alto" ? "#ef4444" :
                              entry.name === "Médio" ? "#f97316" : "#22c55e"
                            } />
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
                <CardTitle>Desvios por Área</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.byArea}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend content={<ChartLegend />} />
                        <Bar dataKey="value" fill="#8884d8" />
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
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead>Área</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((desvio) => (
                    <TableRow key={desvio.id}>
                      <TableCell>{desvio.id}</TableCell>
                      <TableCell>{new Date(desvio.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{desvio.tipo}</TableCell>
                      <TableCell>
                        <Badge variant={
                          desvio.classificacaoRisco === "Alto" ? "destructive" :
                          desvio.classificacaoRisco === "Médio" ? "default" : "outline"
                        }>
                          {desvio.classificacaoRisco}
                        </Badge>
                      </TableCell>
                      <TableCell>{desvio.area}</TableCell>
                      <TableCell>{desvio.responsavel}</TableCell>
                      <TableCell>
                        <Badge variant={desvio.status === "Fechado" ? "outline" : "secondary"}>
                          {desvio.status}
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

export default RelatoriosDesvios;
