import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Bell, Users, FileX, Calendar, DollarSign, Settings, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const mockAlertas = [
  {
    id: "1",
    tipo: "colaborador_sem_alojamento",
    titulo: "Colaborador ativo sem alojamento vinculado",
    descricao: "João Silva (RE: 12350) está ativo mas não possui alojamento vinculado",
    colaborador: "João Silva",
    re: "12350",
    cca: "24043",
    gravidade: "alta",
    data_criacao: "2024-09-23T10:30:00",
    status: "pendente"
  },
  {
    id: "2",
    tipo: "capacidade_excedida",
    titulo: "Alojamento acima da capacidade contratual",
    descricao: "MOD 01 - Operários tem 18 ocupantes para capacidade de 20 (90% ocupado)",
    alojamento: "MOD 01 - Operários",
    capacidade: 20,
    ocupacao: 18,
    gravidade: "media",
    data_criacao: "2024-09-23T09:15:00",
    status: "pendente"
  },
  {
    id: "3",
    tipo: "sem_lancamento_mensal",
    titulo: "Alojamento sem lançamento mensal",
    descricao: "Técnicos Suporte não possui lançamento para o mês 09/2024",
    alojamento: "Técnicos Suporte",
    mes_referencia: "09/2024",
    gravidade: "alta",
    data_criacao: "2024-09-22T16:45:00",
    status: "pendente"
  },
  {
    id: "4",
    tipo: "nf_sem_vinculo",
    titulo: "NF sem contrato/fornecedor vinculado",
    descricao: "Nota fiscal 003456 não possui contrato ou fornecedor vinculado",
    nf_numero: "003456",
    valor: 2800.00,
    gravidade: "media",
    data_criacao: "2024-09-22T14:20:00",
    status: "pendente"
  },
  {
    id: "5",
    tipo: "diferenca_percentual",
    titulo: "Diferença maior que 5% entre contrato e NF",
    descricao: "MOD 01 - Operários: diferença de +R$ 150,00 (3.33%) entre contrato e NF",
    alojamento: "MOD 01 - Operários",
    valor_contrato: 4500.00,
    valor_nf: 4650.00,
    diferenca: 150.00,
    percentual: 3.33,
    gravidade: "baixa",
    data_criacao: "2024-09-21T11:10:00",
    status: "resolvido"
  }
];

const mockNotificacoes = [
  {
    id: "1",
    destinatario: "Administrativo da Obra",
    tipo: "pendencia_alocacao",
    quantidade: 3,
    ultima_enviada: "2024-09-23T08:00:00"
  },
  {
    id: "2",
    destinatario: "Administração Matricial",
    tipo: "pendencia_custo_nf",
    quantidade: 2,
    ultima_enviada: "2024-09-23T09:30:00"
  },
  {
    id: "3",
    destinatario: "Coordenação",
    tipo: "inconsistencia_fechamento",
    quantidade: 1,
    ultima_enviada: "2024-09-22T17:00:00"
  }
];

export default function AlertasAgregados() {
  const [gravidadeFiltro, setGravidadeFiltro] = useState("all");
  const [statusFiltro, setStatusFiltro] = useState("all");
  const [tipoFiltro, setTipoFiltro] = useState("all");

  const alertasFiltrados = mockAlertas.filter(alerta => {
    const matchGravidade = gravidadeFiltro === "all" || !gravidadeFiltro || alerta.gravidade === gravidadeFiltro;
    const matchStatus = statusFiltro === "all" || !statusFiltro || alerta.status === statusFiltro;
    const matchTipo = tipoFiltro === "all" || !tipoFiltro || alerta.tipo === tipoFiltro;
    
    return matchGravidade && matchStatus && matchTipo;
  });

  const getGravidadeBadge = (gravidade: string) => {
    switch (gravidade) {
      case "critica":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Crítica
        </Badge>;
      case "alta":
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800 border-orange-300">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Alta
        </Badge>;
      case "media":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Média
        </Badge>;
      case "baixa":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Baixa
        </Badge>;
      default:
        return <Badge variant="outline">Gravidade Desconhecida</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Pendente
        </Badge>;
      case "resolvido":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Resolvido
        </Badge>;
      case "em_andamento":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Settings className="w-3 h-3 mr-1" />
          Em andamento
        </Badge>;
      default:
        return <Badge variant="outline">Status Desconhecido</Badge>;
    }
  };

  const getTipoTexto = (tipo: string) => {
    switch (tipo) {
      case "colaborador_sem_alojamento":
        return "Colaborador sem alojamento";
      case "capacidade_excedida":
        return "Capacidade excedida";
      case "sem_lancamento_mensal":
        return "Sem lançamento mensal";
      case "nf_sem_vinculo":
        return "NF sem vínculo";
      case "diferenca_percentual":
        return "Diferença percentual";
      default:
        return "Tipo desconhecido";
    }
  };

  const handleMarcarResolvido = (alertaId: string) => {
    toast.success("Alerta marcado como resolvido");
  };

  const handleEnviarNotificacao = (destinatario: string) => {
    toast.success(`Notificação enviada para ${destinatario}`);
  };

  // Estatísticas dos alertas
  const totalAlertas = alertasFiltrados.length;
  const alertasPendentes = alertasFiltrados.filter(a => a.status === "pendente").length;
  const alertasCriticos = alertasFiltrados.filter(a => a.gravidade === "critica" || a.gravidade === "alta").length;
  const alertasResolvidos = alertasFiltrados.filter(a => a.status === "resolvido").length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertas</h1>
          <p className="text-muted-foreground">Alertas automáticos e notificações do sistema</p>
        </div>
      </div>

      {/* Estatísticas dos Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Total de alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlertas}</div>
            <p className="text-xs text-muted-foreground">
              Filtros aplicados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{alertasPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Necessitam atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Críticos/Altos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{alertasCriticos}</div>
            <p className="text-xs text-muted-foreground">
              Prioridade máxima
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Resolvidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{alertasResolvidos}</div>
            <p className="text-xs text-muted-foreground">
              Este período
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Select value={gravidadeFiltro} onValueChange={setGravidadeFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por gravidade" />
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
              <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="colaborador_sem_alojamento">Colaborador sem alojamento</SelectItem>
                  <SelectItem value="capacidade_excedida">Capacidade excedida</SelectItem>
                  <SelectItem value="sem_lancamento_mensal">Sem lançamento mensal</SelectItem>
                  <SelectItem value="nf_sem_vinculo">NF sem vínculo</SelectItem>
                  <SelectItem value="diferenca_percentual">Diferença percentual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setGravidadeFiltro("all");
                  setStatusFiltro("all");
                  setTipoFiltro("all");
                }}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Lista de alertas ({alertasFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Gravidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertasFiltrados.map((alerta) => (
                <TableRow key={alerta.id}>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getTipoTexto(alerta.tipo)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium max-w-xs">
                    {alerta.titulo}
                  </TableCell>
                  <TableCell className="max-w-md text-sm text-muted-foreground">
                    {alerta.descricao}
                  </TableCell>
                  <TableCell>{getGravidadeBadge(alerta.gravidade)}</TableCell>
                  <TableCell>{getStatusBadge(alerta.status)}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(alerta.data_criacao).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {alerta.status === "pendente" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarcarResolvido(alerta.id)}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sistema de Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Sistema de notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Notificações automáticas são enviadas para os responsáveis quando novos alertas são criados.
            </p>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Tipo de notificação</TableHead>
                  <TableHead>Quantidade pendente</TableHead>
                  <TableHead>Última enviada</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockNotificacoes.map((notif) => (
                  <TableRow key={notif.id}>
                    <TableCell className="font-medium">{notif.destinatario}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {notif.tipo.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={notif.quantidade > 0 ? "destructive" : "outline"} className="text-xs">
                        {notif.quantidade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(notif.ultima_enviada).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEnviarNotificacao(notif.destinatario)}
                      >
                        <Bell className="w-3 h-3 mr-1" />
                        Enviar agora
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}