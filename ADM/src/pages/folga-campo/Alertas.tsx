import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Clock, Send, Mail, CheckCircle, Settings } from "lucide-react";

export default function AlertasFolgaCampo() {
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  // Mock data para alertas
  const alertasD45 = [
    {
      id: 1,
      colaborador: "João Silva",
      matricula: "12345",
      obra: "Obra Alpha",
      dataFolga: "30/01/2024",
      diasRestantes: 12,
      status: "pendente",
      ultimoEnvio: "15/01/2024",
      destinatarios: ["admin@obra-alpha.com", "supervisor@obra-alpha.com"],
      tentativas: 1
    },
    {
      id: 2,
      colaborador: "Maria Santos",
      matricula: "12346",
      obra: "Obra Beta", 
      dataFolga: "05/02/2024",
      diasRestantes: 18,
      status: "enviado",
      ultimoEnvio: "18/01/2024",
      destinatarios: ["admin@obra-beta.com", "supervisor@obra-beta.com"],
      tentativas: 1
    }
  ];

  const alertasD30 = [
    {
      id: 3,
      colaborador: "Pedro Costa",
      matricula: "12347",
      obra: "Obra Gamma",
      dataFolga: "25/01/2024",
      diasRestantes: 3,
      status: "reenviado",
      ultimoEnvio: "22/01/2024",
      destinatarios: ["admin@obra-gamma.com", "engenheiro@obra-gamma.com"],
      tentativas: 2,
      statusCompra: "solicitada"
    }
  ];

  const todosAlertas = [...alertasD45, ...alertasD30];

  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: { variant: "destructive" as const, label: "Pendente" },
      enviado: { variant: "secondary" as const, label: "Enviado" },
      reenviado: { variant: "default" as const, label: "Reenviado" },
      confirmado: { variant: "outline" as const, label: "Confirmado" }
    };
    const config = variants[status as keyof typeof variants] || variants.pendente;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTipoAlerta = (diasRestantes: number) => {
    if (diasRestantes <= 30 && diasRestantes > 15) return "D-30";
    if (diasRestantes <= 45 && diasRestantes > 30) return "D-45";
    return "Urgente";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertas Automáticos</h1>
          <p className="text-muted-foreground">Gestão de alertas D-45 e D-30 para folgas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurar templates
          </Button>
          <Button size="sm">
            <Send className="h-4 w-4 mr-2" />
            Enviar pendentes
          </Button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas D-45</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertasD45.length}</div>
            <p className="text-xs text-muted-foreground">
              {alertasD45.filter(a => a.status === "pendente").length} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas D-30</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertasD30.length}</div>
            <p className="text-xs text-muted-foreground">
              {alertasD30.filter(a => a.status === "reenviado").length} reenviados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviados hoje</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">E-mails disparados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa resposta</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Última semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre os alertas por tipo ou status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de alerta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="D-45">D-45</SelectItem>
                  <SelectItem value="D-30">D-30</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status do alerta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="reenviado">Reenviado</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alertas</CardTitle>
          <CardDescription>Todos os alertas D-45 e D-30 configurados</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Data folga</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último envio</TableHead>
                <TableHead>Tentativas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todosAlertas.map((alerta) => (
                <TableRow key={alerta.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{alerta.colaborador}</div>
                      <div className="text-sm text-muted-foreground">{alerta.matricula}</div>
                    </div>
                  </TableCell>
                  <TableCell>{alerta.obra}</TableCell>
                  <TableCell>{alerta.dataFolga}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTipoAlerta(alerta.diasRestantes)}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(alerta.status)}</TableCell>
                  <TableCell>{alerta.ultimoEnvio}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{alerta.tentativas}x</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Detalhes</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes do Alerta</DialogTitle>
                            <DialogDescription>
                              Histórico de envios para {alerta.colaborador}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Colaborador</label>
                                <p>{alerta.colaborador}</p>
                                <p className="text-sm text-muted-foreground">{alerta.matricula}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Obra</label>
                                <p>{alerta.obra}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Data da folga</label>
                              <p>{alerta.dataFolga}</p>
                              <p className="text-sm text-muted-foreground">
                                {alerta.diasRestantes} dias restantes
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Destinatários</label>
                              <div className="space-y-1">
                                {alerta.destinatarios.map((email, index) => (
                                  <p key={index} className="text-sm font-mono">{email}</p>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Status</label>
                              <div className="flex items-center gap-2 mt-1">
                                {getStatusBadge(alerta.status)}
                                <span className="text-sm text-muted-foreground">
                                  ({alerta.tentativas} tentativa{alerta.tentativas > 1 ? 's' : ''})
                                </span>
                              </div>
                            </div>
                            {'statusCompra' in alerta && (
                              <div>
                                <label className="text-sm font-medium">Status da compra</label>
                                <p className="capitalize">{(alerta as any).statusCompra}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {alerta.status === "pendente" && (
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Enviar
                        </Button>
                      )}
                      
                      {alerta.status === "enviado" && getTipoAlerta(alerta.diasRestantes) === "D-30" && (
                        <Button variant="outline" size="sm">Reenviar</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Configuração de Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Templates de E-mail</CardTitle>
          <CardDescription>Templates utilizados nos alertas automáticos (preservados do sistema atual)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Template D-45</h4>
              <p className="text-sm text-muted-foreground">
                Template automático disparado 45 dias antes da folga. Inclui informações do colaborador, 
                obra e instruções para preenchimento do formulário.
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">Preservado do sistema atual</Badge>
                <Badge variant="secondary">Automático</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Template D-30</h4>
              <p className="text-sm text-muted-foreground">
                Template de reforço enviado 30 dias antes da folga. Inclui status da compra de passagem 
                e lembretes adicionais.
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">Preservado do sistema atual</Badge>
                <Badge variant="secondary">Reforço</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}