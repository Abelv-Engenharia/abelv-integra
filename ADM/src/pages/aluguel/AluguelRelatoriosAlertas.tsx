import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Download, CheckCircle2, Clock, XCircle, Building2, Users, DollarSign, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

// Mock Data - Relatórios consolidados por competência
const mockRelatoriosAluguel = [
  {
    id: 'REL-ALG-001',
    periodo: '2025-01',
    obra: 'CCA 25051',
    contrato: 'CONT-001',
    fornecedor: 'Ricardo Queiroga Bueno',
    totalColaboradores: 3,
    valorTotal: 8700,
    status: 'aprovada',
    dataCriacao: '2025-01-25',
    prazoEnvio: '2025-02-05'
  },
  {
    id: 'REL-ALG-002',
    periodo: '2025-02',
    obra: 'CCA 25051',
    contrato: 'CONT-001',
    fornecedor: 'Ricardo Queiroga Bueno',
    totalColaboradores: 3,
    valorTotal: 8700,
    status: 'pendente',
    dataCriacao: '2025-02-25',
    prazoEnvio: '2025-03-05'
  },
  {
    id: 'REL-ALG-003',
    periodo: '2025-01',
    obra: 'CCA 24078',
    contrato: 'CONT-002',
    fornecedor: 'Fornecedor ABC Ltda',
    totalColaboradores: 5,
    valorTotal: 14500,
    status: 'aprovada',
    dataCriacao: '2025-01-25',
    prazoEnvio: '2025-02-05'
  },
  {
    id: 'REL-ALG-004',
    periodo: '2025-02',
    obra: 'CCA 24078',
    contrato: 'CONT-002',
    fornecedor: 'Fornecedor ABC Ltda',
    totalColaboradores: 5,
    valorTotal: 14500,
    status: 'em_atraso',
    dataCriacao: '2025-02-25',
    prazoEnvio: '2025-03-05'
  },
];

// Mock Data - Alertas de medições pendentes/atrasadas
const mockAlertasAluguel = [
  {
    id: 'ALT-ALG-001',
    tipo: 'medicao_pendente',
    obra: 'CCA 25051',
    contrato: 'CONT-001',
    fornecedor: 'Ricardo Queiroga Bueno',
    competencia: '2025-02',
    prazoVencimento: '2025-03-05',
    prioridade: 'alta',
    descricao: 'Medição de aluguel pendente - vence em 2 dias',
    contratoVigente: true
  },
  {
    id: 'ALT-ALG-002',
    tipo: 'medicao_atrasada',
    obra: 'CCA 24078',
    contrato: 'CONT-002',
    fornecedor: 'Fornecedor ABC Ltda',
    competencia: '2025-02',
    prazoVencimento: '2025-03-05',
    prioridade: 'critica',
    descricao: 'Medição de aluguel vencida há 3 dias',
    contratoVigente: true
  },
  {
    id: 'ALT-ALG-003',
    tipo: 'medicao_pendente',
    obra: 'CCA 23045',
    contrato: 'CONT-003',
    fornecedor: 'Imobiliária XYZ',
    competencia: '2025-02',
    prazoVencimento: '2025-03-10',
    prioridade: 'media',
    descricao: 'Medição de aluguel em aberto - dentro do prazo',
    contratoVigente: true
  },
];

// Mock Data - Dashboard consolidado
const mockDashboardAluguel = {
  contratosAtivos: 15,
  valorTotalMes: 145000,
  medicoesPendentes: 5,
  colaboradoresAlocados: 48,
  medicoesAprovadas: 10,
  medicoesEmAtraso: 2
};

// Dados para gráfico de evolução mensal
const dadosEvolucaoMensal = [
  { mes: 'Nov/24', valor: 132000, medicoes: 12 },
  { mes: 'Dez/24', valor: 138000, medicoes: 14 },
  { mes: 'Jan/25', valor: 145000, medicoes: 15 },
  { mes: 'Fev/25', valor: 145000, medicoes: 15 },
];

// Dados para gráfico por obra
const dadosPorObra = [
  { obra: 'CCA 25051', valor: 28700, contratos: 3 },
  { obra: 'CCA 24078', valor: 42500, contratos: 5 },
  { obra: 'CCA 23045', valor: 35800, contratos: 4 },
  { obra: 'CCA 22012', valor: 38000, contratos: 3 },
];

// Helper functions
const getPrioridadeBadge = (prioridade: string) => {
  switch (prioridade) {
    case 'critica':
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Crítica</Badge>;
    case 'alta':
      return <Badge variant="default" className="gap-1 bg-orange-500"><AlertTriangle className="h-3 w-3" />Alta</Badge>;
    case 'media':
      return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Média</Badge>;
    default:
      return <Badge variant="outline">{prioridade}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'aprovada':
      return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle2 className="h-3 w-3" />Aprovada</Badge>;
    case 'pendente':
      return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Pendente</Badge>;
    case 'em_atraso':
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Em Atraso</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function AluguelRelatoriosAlertas() {
  const [filtroObra, setFiltroObra] = useState<string>('todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('todos');
  const [filtroFornecedor, setFiltroFornecedor] = useState<string>('todos');

  const handleExportarRelatorio = () => {
    toast.success('Relatório exportado com sucesso!');
  };

  const handleResolverAlerta = (alertaId: string) => {
    toast.success('Redirecionando para medições...');
    // Aqui iria a navegação: navigate('/aluguel/medicoes')
  };

  // Filtrar relatórios
  const relatoriosFiltrados = mockRelatoriosAluguel.filter(rel => {
    const matchObra = filtroObra === 'todas' || rel.obra === filtroObra;
    const matchPeriodo = filtroPeriodo === 'todos' || rel.periodo === filtroPeriodo;
    const matchFornecedor = filtroFornecedor === 'todos' || rel.fornecedor === filtroFornecedor;
    return matchObra && matchPeriodo && matchFornecedor;
  });

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios e Alertas - Aluguel</h1>
          <p className="text-muted-foreground">Acompanhe medições e alertas de contratos de locação</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockDashboardAluguel.contratosAtivos}</div>
                  <p className="text-xs text-muted-foreground">contratos vigentes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Valor Total Mês</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockDashboardAluguel.valorTotalMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <p className="text-xs text-muted-foreground">valor mensal consolidado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Colaboradores Alocados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockDashboardAluguel.colaboradoresAlocados}</div>
                  <p className="text-xs text-muted-foreground">colaboradores em alojamento</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Medições Pendentes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{mockDashboardAluguel.medicoesPendentes}</div>
                  <p className="text-xs text-muted-foreground">aguardando lançamento</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Medições Aprovadas</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{mockDashboardAluguel.medicoesAprovadas}</div>
                  <p className="text-xs text-muted-foreground">medições finalizadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Medições em Atraso</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{mockDashboardAluguel.medicoesEmAtraso}</div>
                  <p className="text-xs text-muted-foreground">vencidas</p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Mensal</CardTitle>
                  <CardDescription>Valor total de aluguel por mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dadosEvolucaoMensal}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="valor" stroke="hsl(var(--primary))" name="Valor (R$)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aluguel por Obra</CardTitle>
                  <CardDescription>Distribuição de valores por CCA</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dadosPorObra}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="obra" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="valor" fill="hsl(var(--primary))" name="Valor (R$)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Relatórios Tab */}
          <TabsContent value="relatorios" className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filtroObra} onValueChange={setFiltroObra}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Selecione Obra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as Obras</SelectItem>
                      <SelectItem value="CCA 25051">CCA 25051</SelectItem>
                      <SelectItem value="CCA 24078">CCA 24078</SelectItem>
                      <SelectItem value="CCA 23045">CCA 23045</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Selecione Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Períodos</SelectItem>
                      <SelectItem value="2025-01">Janeiro/2025</SelectItem>
                      <SelectItem value="2025-02">Fevereiro/2025</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtroFornecedor} onValueChange={setFiltroFornecedor}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Selecione Fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Fornecedores</SelectItem>
                      <SelectItem value="Ricardo Queiroga Bueno">Ricardo Queiroga Bueno</SelectItem>
                      <SelectItem value="Fornecedor ABC Ltda">Fornecedor ABC Ltda</SelectItem>
                      <SelectItem value="Imobiliária XYZ">Imobiliária XYZ</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleExportarRelatorio} className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabela de Relatórios */}
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Consolidados</CardTitle>
                <CardDescription>Medições de aluguel por competência</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Obra</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Colaboradores</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Prazo Envio</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatoriosFiltrados.map((relatorio) => (
                      <TableRow key={relatorio.id}>
                        <TableCell className="font-medium">{relatorio.periodo}</TableCell>
                        <TableCell>{relatorio.obra}</TableCell>
                        <TableCell>{relatorio.fornecedor}</TableCell>
                        <TableCell>{relatorio.totalColaboradores}</TableCell>
                        <TableCell>
                          {relatorio.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                        <TableCell>{new Date(relatorio.prazoEnvio).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{getStatusBadge(relatorio.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alertas Tab */}
          <TabsContent value="alertas" className="space-y-6">
            {/* Cards de Resumo de Alertas */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {mockAlertasAluguel.filter(a => a.prioridade === 'critica').length}
                  </div>
                  <p className="text-xs text-muted-foreground">requerem atenção imediata</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertas de Alta Prioridade</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {mockAlertasAluguel.filter(a => a.prioridade === 'alta').length}
                  </div>
                  <p className="text-xs text-muted-foreground">próximas ao vencimento</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertas Médios</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {mockAlertasAluguel.filter(a => a.prioridade === 'media').length}
                  </div>
                  <p className="text-xs text-muted-foreground">dentro do prazo</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Alertas */}
            <Card>
              <CardHeader>
                <CardTitle>Alertas Ativos</CardTitle>
                <CardDescription>Medições pendentes e em atraso</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Obra</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Competência</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAlertasAluguel.map((alerta) => (
                      <TableRow key={alerta.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {alerta.tipo === 'medicao_pendente' ? 'Pendente' : 'Atrasada'}
                          </Badge>
                        </TableCell>
                        <TableCell>{alerta.obra}</TableCell>
                        <TableCell>{alerta.fornecedor}</TableCell>
                        <TableCell className="font-medium">{alerta.competencia}</TableCell>
                        <TableCell>{new Date(alerta.prazoVencimento).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{getPrioridadeBadge(alerta.prioridade)}</TableCell>
                        <TableCell className="max-w-xs truncate">{alerta.descricao}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleResolverAlerta(alerta.id)}
                          >
                            Resolver
                          </Button>
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
    </div>
  );
}
