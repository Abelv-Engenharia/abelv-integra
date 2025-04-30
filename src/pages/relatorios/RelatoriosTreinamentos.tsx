
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RelatorioFilters } from "@/components/relatorios/RelatorioFilters";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Sample data for the report
const MOCK_TREINAMENTOS_DATA = [
  { id: 1, nome: "NR-10", tipo: "Normativo", status: "Válido", validade: "2023-12-31", cargaHoraria: 40, colaboradores: 25 },
  { id: 2, nome: "NR-35", tipo: "Normativo", status: "Expirado", validade: "2023-01-15", cargaHoraria: 16, colaboradores: 18 },
  { id: 3, nome: "Segurança em Espaço Confinado", tipo: "Técnico", status: "Válido", validade: "2023-11-20", cargaHoraria: 24, colaboradores: 12 },
  { id: 4, nome: "Operação de Empilhadeira", tipo: "Técnico", status: "Válido", validade: "2024-02-28", cargaHoraria: 16, colaboradores: 8 },
  { id: 5, nome: "Primeiros Socorros", tipo: "Técnico", status: "Válido", validade: "2023-09-10", cargaHoraria: 8, colaboradores: 30 },
  { id: 6, nome: "Liderança", tipo: "Comportamental", status: "Válido", validade: null, cargaHoraria: 20, colaboradores: 15 },
  { id: 7, nome: "Comunicação Efetiva", tipo: "Comportamental", status: "Válido", validade: null, cargaHoraria: 12, colaboradores: 22 },
  { id: 8, nome: "Brigada de Incêndio", tipo: "Normativo", status: "Expirado", validade: "2023-03-25", cargaHoraria: 8, colaboradores: 12 },
];

// Chart data
const prepareChartData = (data: typeof MOCK_TREINAMENTOS_DATA) => {
  // Group by training type
  const byTipo = data.reduce((acc, item) => {
    acc[item.tipo] = (acc[item.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Group by status
  const byStatus = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    byTipo: Object.entries(byTipo).map(([name, value]) => ({ name, value })),
    byStatus: Object.entries(byStatus).map(([name, value]) => ({ name, value })),
  };
};

const RelatoriosTreinamentos = () => {
  const [filteredData, setFilteredData] = useState(MOCK_TREINAMENTOS_DATA);
  const [isFiltered, setIsFiltered] = useState(false);
  
  const chartData = prepareChartData(filteredData);
  
  const handleFilter = (filters: any) => {
    console.log("Applied filters:", filters);
    // In a real app, this would filter the data based on the selected filters
    setIsFiltered(true);
  };

  // Function to determine bar color based on status
  const getBarColor = (entry: { name: string }) => {
    return entry.name === "Válido" ? "#28a745" : "#dc3545";
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
            { value: "last-30", label: "Últimos 30 dias" },
            { value: "last-90", label: "Últimos 90 dias" },
            { value: "last-180", label: "Últimos 180 dias" },
            { value: "current-year", label: "Ano atual" },
            { value: "previous-year", label: "Ano anterior" },
          ],
          additionalFilters: [
            {
              id: "tipo",
              label: "Tipo de Treinamento",
              options: [
                { value: "normativo", label: "Normativo" },
                { value: "tecnico", label: "Técnico" },
                { value: "comportamental", label: "Comportamental" },
              ]
            },
            {
              id: "status",
              label: "Status",
              options: [
                { value: "valido", label: "Válido" },
                { value: "expirado", label: "Expirado" },
                { value: "proximos", label: "Próximo de expirar" },
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
                <CardTitle>Treinamentos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.byTipo}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Quantidade" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Treinamentos por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.byStatus}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        fill={getBarColor}
                        name="Quantidade"
                      />
                    </BarChart>
                  </ResponsiveContainer>
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Carga Horária</TableHead>
                    <TableHead>Colaboradores</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((treinamento) => (
                    <TableRow key={treinamento.id}>
                      <TableCell className="font-medium">{treinamento.nome}</TableCell>
                      <TableCell>{treinamento.tipo}</TableCell>
                      <TableCell>
                        <Badge variant={treinamento.status === "Válido" ? "outline" : "destructive"}>
                          {treinamento.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {treinamento.validade 
                          ? new Date(treinamento.validade).toLocaleDateString('pt-BR') 
                          : "N/A"}
                      </TableCell>
                      <TableCell>{treinamento.cargaHoraria}h</TableCell>
                      <TableCell>{treinamento.colaboradores}</TableCell>
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
