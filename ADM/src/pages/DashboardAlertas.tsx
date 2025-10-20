import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  TrendingUp,
  Bell,
  Send,
  Eye,
  XCircle,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Mail
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import type { KPIMobilizacao, AlertaMobilizacao } from "@/types/mobilizacao";

interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  obra: string;
  foto?: string;
  percentualDocumentos: number;
  status: "critico" | "atencao" | "ok" | "parado";
  documentosCriticos: string[];
  ultimoMovimento: string;
  diasParados: number;
}

const mockColaboradores: Colaborador[] = [
  {
    id: "1",
    nome: "João Silva Santos",
    cpf: "123.456.789-01",
    obra: "Obra Alpha",
    percentualDocumentos: 45,
    status: "critico",
    documentosCriticos: ["PIS", "Contrato de Experiência"],
    ultimoMovimento: "2024-01-10",
    diasParados: 5
  },
  {
    id: "2", 
    nome: "Maria Oliveira",
    cpf: "987.654.321-02",
    obra: "Obra Beta",
    percentualDocumentos: 85,
    status: "atencao",
    documentosCriticos: [],
    ultimoMovimento: "2024-01-12",
    diasParados: 3
  },
  {
    id: "3",
    nome: "Pedro Costa",
    cpf: "456.789.123-03", 
    obra: "Obra Gamma",
    percentualDocumentos: 100,
    status: "ok",
    documentosCriticos: [],
    ultimoMovimento: "2024-01-14",
    diasParados: 0
  }
];

export default function DashboardAlertas() {
  const [filtroObra, setFiltroObra] = useState("all");
  const [filtroStatus, setFiltroStatus] = useState("all");
  const [filtroPeriodo, setFiltroPeriodo] = useState("30");
  const [kpis, setKpis] = useState<KPIMobilizacao | null>(null);
  const [alertas, setAlertas] = useState<AlertaMobilizacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [colaboradores] = useState<Colaborador[]>(mockColaboradores);

  // Cores para gráficos
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

  useEffect(() => {
    carregarDados();
  }, [filtroObra, filtroStatus, filtroPeriodo]);

  const carregarDados = async () => {
    setLoading(true);
    setTimeout(() => {
      setKpis({
        total_colaboradores: 147,
        colaboradores_aptos: 124,
        colaboradores_pendentes: 15,
        colaboradores_vencidos: 8,
        documentos_a_vencer: 23,
        documentos_vencidos: 12,
        percentual_aptos: 84.4
      });

      setAlertas(alertasMock);
      setLoading(false);
    }, 500);
  };

  const admissoesPendentes = colaboradores.filter(c => c.percentualDocumentos < 100).length;
  const documentosCriticosFaltando = colaboradores.filter(c => c.documentosCriticos.length > 0).length;
  const admissoesAtrasadas = colaboradores.filter(c => c.diasParados >= 7).length;
  const admissoesParadas = colaboradores.filter(c => c.diasParados >= 3).length;

  // Mock data para alertas
  const alertasMock: AlertaMobilizacao[] = [
    {
      id: '1',
      colaborador_id: '1',
      colaborador_nome: 'Jean Anderson Correia',
      colaborador_re: '3910',
      obra_nome: 'Nexa PDSR',
      tipo_documento: 'Exame Toxicológico',
      situacao: 'vencido',
      validade: '2025-09-01',
      gravidade: 'alta',
      dt_criacao: '2025-09-20T10:00:00Z'
    },
    {
      id: '2',
      colaborador_id: '3',
      colaborador_nome: 'Carlos Eduardo Mendes',
      colaborador_re: '3856',
      obra_nome: 'Projeto Alpha',
      tipo_documento: 'ASO',
      situacao: 'vencido',
      validade: '2024-08-15',
      gravidade: 'critica',
      dt_criacao: '2025-09-18T14:30:00Z'
    }
  ];

  // Data para gráficos
  const dadosStatusPorObra = [
    { obra: 'Nexa PDSR', aptos: 45, pendentes: 8, vencidos: 3 },
    { obra: 'Projeto Alpha', aptos: 32, pendentes: 4, vencidos: 2 },
    { obra: 'Projeto Beta', aptos: 28, pendentes: 2, vencidos: 1 },
    { obra: 'Mineração Sul', aptos: 19, pendentes: 1, vencidos: 2 }
  ];

  const dadosDistribuicaoDocumentos = [
    { name: 'ASO', value: 35 },
    { name: 'Toxicológico', value: 28 },
    { name: 'NR-35', value: 22 },
    { name: 'Integração SMS', value: 15 }
  ];

  const dadosEvolucaoPendencias = [
    { data: '01/07', pendencias: 45, vencidos: 12 },
    { data: '15/07', pendencias: 38, vencidos: 8 },
    { data: '01/08', pendencias: 42, vencidos: 15 },
    { data: '15/08', pendencias: 35, vencidos: 10 },
    { data: '01/09', pendencias: 28, vencidos: 7 },
    { data: '15/09', pendencias: 23, vencidos: 12 },
    { data: '23/09', pendencias: 23, vencidos: 12 }
  ];

  const enviarAlertaEmail = (colaborador: Colaborador) => {
    toast({
      title: "Alerta enviado",
      description: `E-mail de alerta enviado para ${colaborador.nome}`,
    });
  };

  const handleEnviarNotificacao = async (alertaId: string) => {
    toast({
      title: "Notificação Enviada",
      description: "E-mail de alerta enviado com sucesso."
    });
  };

  const handleMarcarComoLido = (alertaId: string) => {
    setAlertas(prev => prev.filter(a => a.id !== alertaId));
    toast({
      title: "Alerta Marcado",
      description: "Alerta marcado como resolvido."
    });
  };

  const getGravidadeColor = (gravidade: string) => {
    switch (gravidade) {
      case 'critica': return 'bg-red-600';
      case 'alta': return 'bg-red-500';
      case 'media': return 'bg-yellow-500';
      case 'baixa': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSituacaoText = (alerta: AlertaMobilizacao) => {
    switch (alerta.situacao) {
      case 'vencido':
        return `Vencido há ${Math.abs(Math.ceil((new Date().getTime() - new Date(alerta.validade!).getTime()) / (1000 * 60 * 60 * 24)))} dias`;
      case 'a_vencer':
        return `Vence em ${alerta.dias_para_vencimento} dias`;
      case 'pendente':
        return 'Pendente de envio';
      default:
        return alerta.situacao;
    }
  };

  // Cards de KPIs principais
  const kpisCards = [
    {
      titulo: "Total Colaboradores",
      valor: kpis?.total_colaboradores || 0,
      descricao: "ativos no sistema",
      icon: Users,
      tendencia: "+12%",
      cor: "text-blue-600"
    },
    {
      titulo: "Documentos a Vencer",
      valor: kpis?.documentos_a_vencer || 0,
      descricao: "próximos 7 dias",
      icon: Clock,
      tendencia: "+3%",
      cor: "text-yellow-600"
    },
    {
      titulo: "Documentos Vencidos",
      valor: kpis?.documentos_vencidos || 0,
      descricao: "requerem atenção",
      icon: XCircle,
      tendencia: "-8%",
      cor: "text-red-600"
    },
    {
      titulo: "Taxa de Conformidade",
      valor: `${kpis?.percentual_aptos.toFixed(1) || 0}%`,
      descricao: "documentos em dia",
      icon: CheckCircle,
      tendencia: "+5%",
      cor: "text-green-600"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Dashboard & Alertas</h1>
          <p className="text-muted-foreground">
            Visão geral da documentação de mobilização e alertas críticos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Obra/Projeto</Label>
              <Select value={filtroObra} onValueChange={(value) => setFiltroObra(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as obras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as obras</SelectItem>
                  <SelectItem value="1">Nexa PDSR</SelectItem>
                  <SelectItem value="2">Projeto Alpha</SelectItem>
                  <SelectItem value="3">Projeto Beta</SelectItem>
                  <SelectItem value="4">Mineração Sul</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gravidade</Label>
              <Select value={filtroStatus} onValueChange={(value) => setFiltroStatus(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as gravidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as gravidades</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Situação</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as situações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as situações</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="a_vencer">A Vencer</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="alertas">Central de Alertas</TabsTrigger>
          <TabsTrigger value="admissoes">Admissões</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Cards de KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpisCards.map((kpi, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.titulo}</CardTitle>
                  <kpi.icon className={`h-4 w-4 ${kpi.cor}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.valor}</div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{kpi.descricao}</p>
                    <span className={`text-xs font-medium ${
                      kpi.tendencia.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.tendencia}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras - Status por Obra */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Status por Obra
                </CardTitle>
                <CardDescription>
                  Distribuição de colaboradores por status e obra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosStatusPorObra}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="obra" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="aptos" stackId="a" fill="#10b981" name="Aptos" />
                    <Bar dataKey="pendentes" stackId="a" fill="#f59e0b" name="Pendentes" />
                    <Bar dataKey="vencidos" stackId="a" fill="#ef4444" name="Vencidos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Documentos por Tipo
                </CardTitle>
                <CardDescription>
                  Distribuição dos principais tipos de documento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart width={400} height={300}>
                    <RechartsTooltip />
                    <Pie
                      data={dadosDistribuicaoDocumentos}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }: any) => `${name} ${((value / dadosDistribuicaoDocumentos.reduce((sum: number, item: any) => sum + item.value, 0)) * 100).toFixed(0)}%`}
                    >
                      {dadosDistribuicaoDocumentos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Linha - Evolução das Pendências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Evolução das Pendências
              </CardTitle>
              <CardDescription>
                Tendência de pendências e vencimentos nos últimos 90 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosEvolucaoPendencias}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="pendencias" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Pendências"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vencidos" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Vencidos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-6">
          {/* Central de Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Central de Alertas
              </CardTitle>
              <CardDescription>
                Alertas críticos que requerem atenção imediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando alertas...</div>
              ) : alertas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>Nenhum alerta ativo no momento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alertas.map((alerta) => (
                    <Card key={alerta.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center gap-2">
                            <Badge className={`${getGravidadeColor(alerta.gravidade)} text-white`}>
                              {alerta.gravidade.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{alerta.colaborador_nome}</h4>
                              <Badge variant="outline">RE: {alerta.colaborador_re}</Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {alerta.obra_nome}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-medium">{alerta.tipo_documento}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className={`font-medium ${
                                alerta.situacao === 'vencido' ? 'text-red-600' :
                                alerta.situacao === 'a_vencer' ? 'text-yellow-600' :
                                'text-blue-600'
                              }`}>
                                {getSituacaoText(alerta)}
                              </span>
                            </div>
                            
                            {alerta.validade && (
                              <p className="text-xs text-muted-foreground">
                                Validade: {new Date(alerta.validade).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEnviarNotificacao(alerta.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMarcarComoLido(alerta.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admissoes" className="space-y-6">
          {/* Cards de resumo das admissões */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admissões pendentes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{admissoesPendentes}</div>
                <p className="text-xs text-muted-foreground">
                  Colaboradores com documentação incompleta
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documentos críticos faltando</CardTitle>
                <FileText className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{documentosCriticosFaltando}</div>
                <p className="text-xs text-muted-foreground">
                  Exame, Contrato, PIS em falta
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admissões atrasadas</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{admissoesAtrasadas}</div>
                <p className="text-xs text-muted-foreground">
                  Sem avanço há 7+ dias
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas ativos</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{admissoesParadas}</div>
                <p className="text-xs text-muted-foreground">
                  Precisam de atenção imediata
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Colaboradores em Admissão */}
          <Card>
            <CardHeader>
              <CardTitle>Colaboradores em processo de admissão</CardTitle>
              <CardDescription>
                Status detalhado da documentação de cada colaborador
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Obra</TableHead>
                    <TableHead>% Docs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colaboradores.map((colaborador) => (
                    <TableRow key={colaborador.id}>
                      <TableCell>
                        <div className="font-medium">{colaborador.nome}</div>
                        {colaborador.documentosCriticos.length > 0 && (
                          <div className="text-xs text-red-600">
                            Faltam: {colaborador.documentosCriticos.join(", ")}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{colaborador.cpf}</TableCell>
                      <TableCell>{colaborador.obra}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${colaborador.percentualDocumentos}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{colaborador.percentualDocumentos}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={colaborador.status === 'critico' ? 'destructive' : 'default'}>
                          {colaborador.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => enviarAlertaEmail(colaborador)}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            Ver checklist
                          </Button>
                        </div>
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
}