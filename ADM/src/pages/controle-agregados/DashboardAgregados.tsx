import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, DollarSign, TrendingUp, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const mockOcupacaoData = [
  { nome: "MOI 01", ocupacao: 67, capacidade: 12, atual: 8 },
  { nome: "MOD 01", ocupacao: 90, capacidade: 20, atual: 18 },
  { nome: "Técnicos", ocupacao: 75, capacidade: 8, atual: 6 },
  { nome: "Supervisores", ocupacao: 0, capacidade: 6, atual: 0 }
];

const mockEvolucaoData = [
  { mes: "Jan", custo: 28500 },
  { mes: "Fev", custo: 31200 },
  { mes: "Mar", custo: 29800 },
  { mes: "Abr", custo: 32100 },
  { mes: "Mai", custo: 34500 },
  { mes: "Jun", custo: 33200 },
  { mes: "Jul", custo: 35800 },
  { mes: "Ago", custo: 37200 },
  { mes: "Set", custo: 38900 }
];

const mockDistribuicaoFornecedor = [
  { nome: "Bruno Martins", valor: 8419, cor: "#0088FE" },
  { nome: "Embu Mercearia", valor: 9150, cor: "#00C49F" },
  { nome: "Locações XYZ", valor: 6800, cor: "#FFBB28" },
  { nome: "Imóveis ABC", valor: 3600, cor: "#FF8042" }
];

const mockDiferencasData = [
  { alojamento: "MOI 01", contrato: 2619, nf: 2619, diferenca: 0 },
  { alojamento: "MOD 01", contrato: 4500, nf: 4650, diferenca: 150 },
  { alojamento: "Técnicos", contrato: 3200, nf: 3150, diferenca: -50 },
  { alojamento: "Supervisores", contrato: 1800, nf: 1800, diferenca: 0 }
];

export default function DashboardAgregados() {
  const [ccaFiltro, setCcaFiltro] = useState("all");
  const [periodoFiltro, setPeriodoFiltro] = useState("09/2024");
  const [fornecedorFiltro, setFornecedorFiltro] = useState("all");

  // Cálculos de KPIs
  const totalCapacidade = mockOcupacaoData.reduce((sum, item) => sum + item.capacidade, 0);
  const totalOcupacao = mockOcupacaoData.reduce((sum, item) => sum + item.atual, 0);
  const percentualOcupacaoGeral = Math.round((totalOcupacao / totalCapacidade) * 100);
  
  const custoMensalTotal = mockDistribuicaoFornecedor.reduce((sum, item) => sum + item.valor, 0);
  const valorMedioPorColaborador = Math.round(custoMensalTotal / totalOcupacao);
  
  const totalDiferenca = mockDiferencasData.reduce((sum, item) => sum + item.diferenca, 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Indicadores visuais de controle de agregados de alojamento</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Select value={ccaFiltro} onValueChange={setCcaFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os CCAs</SelectItem>
                  <SelectItem value="24043">24043 - Obra São Paulo Centro</SelectItem>
                  <SelectItem value="24044">24044 - Obra Guarulhos</SelectItem>
                  <SelectItem value="24045">24045 - Obra Osasco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09/2024">Setembro/2024</SelectItem>
                  <SelectItem value="08/2024">Agosto/2024</SelectItem>
                  <SelectItem value="07/2024">Julho/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={fornecedorFiltro} onValueChange={setFornecedorFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os fornecedores</SelectItem>
                  <SelectItem value="bruno">Bruno Martins Moreira</SelectItem>
                  <SelectItem value="embu">Embu Mercearia Delicias</SelectItem>
                  <SelectItem value="xyz">Locações XYZ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              % Ocupação geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{percentualOcupacaoGeral}%</div>
            <Progress value={percentualOcupacaoGeral} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {totalOcupacao} de {totalCapacidade} vagas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Custo mensal total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {custoMensalTotal.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              +2.3% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Valor médio/colaborador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valorMedioPorColaborador.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Por colaborador alocado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Diferença contrato x NF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalDiferenca >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {totalDiferenca >= 0 ? '+' : ''}R$ {totalDiferenca.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalDiferenca >= 0 ? 'Acima do' : 'Abaixo do'} orçamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* % Ocupação por Alojamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              % Ocupação por alojamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOcupacaoData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.nome}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.atual}/{item.capacidade}</span>
                      <Badge variant={item.ocupacao >= 90 ? "destructive" : item.ocupacao >= 70 ? "secondary" : "outline"}>
                        {item.ocupacao}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={item.ocupacao} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Evolução do Custo Mensal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Evolução do custo mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockEvolucaoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Custo']} />
                <Line 
                  type="monotone" 
                  dataKey="custo" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Diferença Contrato x NF */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Diferença contrato x NF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDiferencasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="alojamento" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Diferença']} />
                <Bar 
                  dataKey="diferenca" 
                  fill="#8884d8"
                  name="Diferença"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Custos por Fornecedor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Distribuição de custos por fornecedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockDistribuicaoFornecedor}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {mockDistribuicaoFornecedor.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resumos Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Alojamentos ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">Todos operacionais</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Contratos vencendo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <div className="flex items-center gap-2 mt-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-600">Vence em 30 dias</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Fornecedores ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">Sem pendências</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}