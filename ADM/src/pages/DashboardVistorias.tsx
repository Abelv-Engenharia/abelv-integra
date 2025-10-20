import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Mock data for charts
const statusData = [
  { name: 'Realizadas', value: 80, color: '#10b981' },
  { name: 'Pendentes', value: 20, color: '#f59e0b' }
];

const evolucaoMensal = [
  { mes: 'Out', realizadas: 25, pendentes: 8 },
  { mes: 'Nov', realizadas: 32, pendentes: 12 },
  { mes: 'Dez', realizadas: 28, pendentes: 6 },
  { mes: 'Jan', realizadas: 35, pendentes: 10 }
];

const contratosPorFornecedor = [
  { fornecedor: 'Hospedagem Norte', contratos: 15 },
  { fornecedor: 'Acomodações Sul', contratos: 12 },
  { fornecedor: 'Alojamentos Brasil', contratos: 8 },
  { fornecedor: 'Hospedagem Centro', contratos: 5 },
  { fornecedor: 'Outros', contratos: 3 }
];

const resumoPorProjeto = [
  {
    projeto: "Projeto Alpha",
    fornecedor: "Alojamentos Brasil Ltda",
    total: 25,
    realizadas: 23,
    pendentes: 2,
    atrasadas: 0
  },
  {
    projeto: "Projeto Beta", 
    fornecedor: "Hospedagem Norte S.A.",
    total: 18,
    realizadas: 16,
    pendentes: 2,
    atrasadas: 1
  },
  {
    projeto: "Projeto Gamma",
    fornecedor: "Acomodações Sul",
    total: 22,
    realizadas: 19,
    pendentes: 3,
    atrasadas: 2
  }
];

const mockProjetos = ["Projeto Alpha", "Projeto Beta", "Projeto Gamma"];
const mockFornecedores = ["Alojamentos Brasil Ltda", "Hospedagem Norte S.A.", "Acomodações Sul"];

export default function DashboardVistorias() {
  const [periodo, setPeriodo] = useState("2024-01");
  const [projeto, setProjeto] = useState("all");
  const [fornecedor, setFornecedor] = useState("all");

  const handleExportarDashboard = () => {
    console.log("Exportando dashboard PDF...");
  };

  const handleExportarTabela = () => {
    console.log("Exportando tabela CSV...");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard de Contratos e Vistorias</h1>
        <p className="text-muted-foreground">
          Painel executivo com KPIs e análises dos contratos de alojamento
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Período (mês/ano)</label>
            <Input
              type="month"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Projeto</label>
            <Select value={projeto} onValueChange={setProjeto}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os projetos</SelectItem>
                {mockProjetos.map(proj => (
                  <SelectItem key={proj} value={proj}>{proj}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fornecedor</label>
            <Select value={fornecedor} onValueChange={setFornecedor}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar fornecedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os fornecedores</SelectItem>
                {mockFornecedores.map(forn => (
                  <SelectItem key={forn} value={forn}>{forn}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Contratos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Vistoriadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">89%</div>
            <p className="text-xs text-muted-foreground">
              58 de 65 vistorias realizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Pendentes</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">7</div>
            <p className="text-xs text-muted-foreground">
              Aguardando vistoria
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vistorias Atrasadas</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">3</div>
            <p className="text-xs text-muted-foreground">
              Com prazo vencido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Linha - Evolução Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolucaoMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="realizadas" stroke="#10b981" strokeWidth={2} name="Realizadas" />
                <Line type="monotone" dataKey="pendentes" stroke="#f59e0b" strokeWidth={2} name="Pendentes" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Distribuição por Status */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: any) => `${name} ${((value / statusData.reduce((sum: number, item: any) => sum + item.value, 0)) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras - Contratos por Fornecedor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contratos por Fornecedor (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contratosPorFornecedor}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fornecedor" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contratos" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Resumo */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Resumo por Projeto e Fornecedor</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportarDashboard}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Dashboard (PDF)
              </Button>
              <Button variant="outline" onClick={handleExportarTabela}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Tabela (CSV)
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Realizadas</TableHead>
                <TableHead>Pendentes</TableHead>
                <TableHead>Atrasadas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumoPorProjeto.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.projeto}</TableCell>
                  <TableCell>{item.fornecedor}</TableCell>
                  <TableCell>{item.total}</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                      {item.realizadas}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      {item.pendentes}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.atrasadas > 0 ? (
                      <Badge variant="destructive">{item.atrasadas}</Badge>
                    ) : (
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">0</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}