import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClienteNome } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useOS } from "@/contexts/OSContext";

// Mock data para demonstração
const mockHHData = [
  {
    disciplina: "Elétrica",
    engenheiro: "João Silva",
    cca: "CCA-001",
    horasAlocadas: 160,
    horasApropriadasJan: 128,
    horasApropriadasFev: 144,
    horasApropriadasMar: 152,
    percentualJan: 80,
    percentualFev: 90,
    percentualMar: 95,
  },
  {
    disciplina: "Mecânica",
    engenheiro: "Maria Santos",
    cca: "CCA-002",
    horasAlocadas: 160,
    horasApropriadasJan: 120,
    horasApropriadasFev: 136,
    horasApropriadasMar: 148,
    percentualJan: 75,
    percentualFev: 85,
    percentualMar: 92.5,
  },
  {
    disciplina: "Civil",
    engenheiro: "Pedro Costa",
    cca: "CCA-003",
    horasAlocadas: 160,
    horasApropriadasJan: 132,
    horasApropriadasFev: 140,
    horasApropriadasMar: 156,
    percentualJan: 82.5,
    percentualFev: 87.5,
    percentualMar: 97.5,
  },
  {
    disciplina: "Elétrica",
    engenheiro: "Ana Oliveira",
    cca: "CCA-001",
    horasAlocadas: 160,
    horasApropriadasJan: 112,
    horasApropriadasFev: 128,
    horasApropriadasMar: 144,
    percentualJan: 70,
    percentualFev: 80,
    percentualMar: 90,
  }
];

const getStatusColor = (percentual: number) => {
  if (percentual >= 80) return "text-green-600";
  if (percentual >= 70) return "text-yellow-600";
  return "text-red-600";
};

const getStatusBadge = (percentual: number) => {
  if (percentual >= 80) return <Badge variant="secondary" className="bg-green-100 text-green-800">Adequado</Badge>;
  if (percentual >= 70) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
  return <Badge variant="destructive">Crítico</Badge>;
};

// Dados para gráficos
const dadosGraficoBarras = mockHHData.map(item => ({
  nome: item.engenheiro.split(' ')[0],
  jan: item.percentualJan,
  fev: item.percentualFev,
  mar: item.percentualMar,
  disciplina: item.disciplina
}));

const dadosGraficoLinha = [
  { mes: 'Jan/24', percentualMedio: 76.9, meta: 80 },
  { mes: 'Fev/24', percentualMedio: 85.6, meta: 80 },
  { mes: 'Mar/24', percentualMedio: 93.8, meta: 80 }
];

const dadosGraficoPizza = [
  { name: 'Adequado (≥80%)', value: 75, fill: '#16a34a' },
  { name: 'Atenção (70-79%)', value: 17, fill: '#eab308' },
  { name: 'Crítico (<70%)', value: 8, fill: '#dc2626' }
];

const COLORS = ['#16a34a', '#eab308', '#dc2626'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-semibold">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Relatorios() {
  const { osList } = useOS();
  const [filtroAno, setFiltroAno] = useState("2024");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");

  // Dados das OS reais
  const osAtivas = osList.filter(os => ['aberta', 'aguardando-aceite', 'em-execucao'].includes(os.status));
  const osConcluidas = osList.filter(os => os.status === 'concluida');
  const osCanceladas = osList.filter(os => os.status === 'cancelada');
  
  // Dados consolidados por disciplina
  const dadosPorDisciplina = osList.reduce((acc, os) => {
    const disciplina = os.disciplina;
    if (!acc[disciplina]) {
      acc[disciplina] = {
        disciplina,
        totalOS: 0,
        osAbertas: 0,
        osEmExecucao: 0,
        osConcluidas: 0,
        osCanceladas: 0,
        valorTotal: 0,
        hhTotal: 0,
        hhAdicional: 0
      };
    }
    
    acc[disciplina].totalOS++;
    acc[disciplina].valorTotal += os.valorOrcamento || 0;
    acc[disciplina].hhTotal += os.hhPlanejado || 0;
    acc[disciplina].hhAdicional += os.hhAdicional || 0;
    
    if (os.status === 'aberta') acc[disciplina].osAbertas++;
    if (os.status === 'em-execucao') acc[disciplina].osEmExecucao++;
    if (os.status === 'concluida') acc[disciplina].osConcluidas++;
    if (os.status === 'cancelada') acc[disciplina].osCanceladas++;
    
    return acc;
  }, {} as Record<string, any>);
  
  const dadosGraficoDisciplina = Object.values(dadosPorDisciplina);

  // Dados para gráfico de status
  const statusOSData = [
    { name: 'Ativas', value: osAtivas.length, color: '#0088FE' },
    { name: 'Concluídas', value: osConcluidas.length, color: '#00C49F' },
    { name: 'Canceladas', value: osCanceladas.length, color: '#FF8042' }
  ];

  const disciplinas = [...new Set(mockHHData.map(item => item.disciplina))];
  
  const dadosFiltrados = mockHHData.filter(item => 
    filtroDisciplina === "todas" || item.disciplina === filtroDisciplina
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Acompanhamento de indicadores e performance</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={filtroAno} onValueChange={setFiltroAno}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {disciplinas.map(disciplina => (
                <SelectItem key={disciplina} value={disciplina}>{disciplina}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="os" className="w-full">
        <TabsList>
          <TabsTrigger value="os">Ordens de Serviço</TabsTrigger>
          <TabsTrigger value="hh">Horas Homem (HH)</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="custos">Custos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="os" className="space-y-6">
          {/* Cards de resumo OS - Status em destaque */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{osList.length}</div>
                <p className="text-xs text-muted-foreground">Total OS</p>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {osList.filter(os => os.status === 'aberta').length}
                </div>
                <p className="text-xs text-muted-foreground">Abertas</p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {osList.filter(os => os.status === 'em-execucao').length}
                </div>
                <p className="text-xs text-muted-foreground">Em Execução</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{osConcluidas.length}</div>
                <p className="text-xs text-muted-foreground">Concluídas</p>
              </CardContent>
            </Card>
            
            <Card className="border-red-200">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{osCanceladas.length}</div>
                <p className="text-xs text-muted-foreground">Canceladas</p>
              </CardContent>
            </Card>
          </div>

          {/* Resumo por Disciplina */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Disciplina</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Disciplina</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Abertas</TableHead>
                      <TableHead className="text-center">Em Execução</TableHead>
                      <TableHead className="text-center">Concluídas</TableHead>
                      <TableHead className="text-center">Canceladas</TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dadosGraficoDisciplina.length > 0 ? (
                      dadosGraficoDisciplina.map((disciplina: any) => (
                        <TableRow key={disciplina.disciplina}>
                          <TableCell className="font-medium">{disciplina.disciplina}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{disciplina.totalOS}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              {disciplina.osAbertas}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              {disciplina.osEmExecucao}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {disciplina.osConcluidas}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              {disciplina.osCanceladas || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            R$ {disciplina.valorTotal?.toLocaleString('pt-BR') || '0'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                          Nenhuma OS cadastrada ainda
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Gráficos OS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico por disciplina */}
            <Card>
              <CardHeader>
                <CardTitle>Quantidade por Disciplina</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosGraficoDisciplina}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="disciplina" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalOS" fill="#3b82f6" name="Total OS" />
                    <Bar dataKey="osConcluidas" fill="#10b981" name="Concluídas" />
                    <Bar dataKey="osEmExecucao" fill="#f59e0b" name="Em Execução" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de status */}
            <Card>
              <CardHeader>
                <CardTitle>Status das OS</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusOSData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusOSData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Lista detalhada de OS */}
          <Card>
            <CardHeader>
              <CardTitle>Lista Detalhada de Ordens de Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OS</TableHead>
                      <TableHead>CCA</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-center">HH Plan.</TableHead>
                      <TableHead className="text-center">HH Adic.</TableHead>
                      <TableHead>Data Abertura</TableHead>
                      <TableHead>Responsável EM</TableHead>
                      <TableHead>Solicitante</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {osList.length > 0 ? (
                      osList
                        .sort((a, b) => b.id - a.id) // Mais recentes primeiro
                        .map((os) => (
                      <TableRow key={os.id}>
                        <TableCell className="font-medium">#{os.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{os.cca}</Badge>
                        </TableCell>
                        <TableCell>{getClienteNome(os.cca, os.cliente)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={
                              os.disciplina === 'Elétrica' ? 'bg-blue-100 text-blue-800' :
                              os.disciplina === 'Mecânica' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {os.disciplina}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              os.status === 'concluida' ? 'default' : 
                              os.status === 'em-execucao' ? 'secondary' : 
                              os.status === 'cancelada' ? 'destructive' : 
                              os.status === 'aguardando-aceite' ? 'outline' : 'outline'
                            } className={
                              os.status === 'aberta' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                              os.status === 'em-execucao' ? 'bg-orange-100 text-orange-800' :
                              os.status === 'concluida' ? 'bg-green-100 text-green-800' :
                              os.status === 'cancelada' ? '' :
                              os.status === 'aguardando-aceite' ? 'bg-blue-50 text-blue-700 border-blue-300' : ''
                            }>
                              {os.status === 'aberta' ? 'Aberta' :
                               os.status === 'aguardando-aceite' ? 'Aguardando Aceite' :
                               os.status === 'em-execucao' ? 'Em Execução' :
                               os.status === 'concluida' ? 'Concluída' :
                               os.status === 'cancelada' ? 'Cancelada' : os.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            R$ {os.valorOrcamento?.toLocaleString('pt-BR') || '0'}
                          </TableCell>
                          <TableCell className="text-center">
                            {os.hhPlanejado > 0 ? `${os.hhPlanejado}h` : '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {os.hhAdicional > 0 ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                {os.hhAdicional}h
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(os.dataAbertura).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-sm">{os.responsavelEM}</TableCell>
                          <TableCell className="text-sm">{os.nomeSolicitante}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-4xl">📋</div>
                            <div className="font-medium">Nenhuma OS cadastrada ainda</div>
                            <div className="text-sm">
                              Crie uma nova OS para ver os relatórios com dados reais
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hh" className="space-y-6">
          {/* Link para página detalhada */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">HH Apropriado por Competência</h3>
                  <p className="text-sm text-muted-foreground">
                    Relatório detalhado com drill-down por CCA, filtros avançados e análise completa
                  </p>
                </div>
                <a 
                  href="/relatorios/hh"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Acessar Relatório Completo
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Cards de resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Engenheiros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dadosFiltrados.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">HH Média Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">160h</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">% Média Apropriação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">84.2%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Meta KI (&gt;80%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">75%</div>
                <p className="text-xs text-muted-foreground">dos engenheiros</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de barras - Evolução mensal */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal por Engenheiro</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosGraficoBarras}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="jan" fill="#8884d8" name="Janeiro" />
                    <Bar dataKey="fev" fill="#82ca9d" name="Fevereiro" />
                    <Bar dataKey="mar" fill="#ffc658" name="Março" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de pizza - Status KI */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição Status KI</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosGraficoPizza}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosGraficoPizza.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de linha - Tendência geral */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tendência Percentual Médio vs Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dadosGraficoLinha}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="percentualMedio" 
                      stroke="#16a34a" 
                      strokeWidth={3}
                      name="% Médio Apropriação"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="meta" 
                      stroke="#dc2626" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Meta KI (80%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabela detalhada */}
          <Card>
            <CardHeader>
              <CardTitle>Acompanhamento mensal por disciplina e engenheiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Engenheiro</TableHead>
                      <TableHead>CCA</TableHead>
                      <TableHead>HH Alocadas</TableHead>
                      <TableHead>Jan/24</TableHead>
                      <TableHead>Fev/24</TableHead>
                      <TableHead>Mar/24</TableHead>
                      <TableHead>Status KI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dadosFiltrados.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.disciplina}</TableCell>
                        <TableCell>{item.engenheiro}</TableCell>
                        <TableCell>{item.cca}</TableCell>
                        <TableCell>{item.horasAlocadas}h</TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.horasApropriadasJan}h</span>
                              <span className={`text-xs font-semibold ${getStatusColor(item.percentualJan)}`}>
                                ({item.percentualJan}%)
                              </span>
                            </div>
                            <Progress value={item.percentualJan} className="h-1" />
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.horasApropriadasFev}h</span>
                              <span className={`text-xs font-semibold ${getStatusColor(item.percentualFev)}`}>
                                ({item.percentualFev}%)
                              </span>
                            </div>
                            <Progress value={item.percentualFev} className="h-1" />
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.horasApropriadasMar}h</span>
                              <span className={`text-xs font-semibold ${getStatusColor(item.percentualMar)}`}>
                                ({item.percentualMar}%)
                              </span>
                            </div>
                            <Progress value={item.percentualMar} className="h-1" />
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {getStatusBadge(item.percentualMar)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <p>Relatório de performance em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custos">
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <p>Relatório de custos em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}