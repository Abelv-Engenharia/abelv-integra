import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, Eye, FileText, Download, AlertTriangle, CheckCircle } from "lucide-react";

export default function AuditoriaFolgaCampo() {
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");

  // Mock data para auditoria
  const trilhaAuditoria = [
    {
      id: 1,
      dataHora: "18/01/2024 14:30",
      usuario: "admin@obra-alpha.com",
      acao: "criacao",
      recurso: "Folga",
      descricao: "Criou folga para João Silva (12345)",
      detalhes: {
        colaborador: "João Silva",
        periodo: "30/01/2024 - 15/02/2024",
        obra: "Obra Alpha"
      },
      ip: "192.168.1.100"
    },
    {
      id: 2,
      dataHora: "18/01/2024 15:45",
      usuario: "sistema@bizztrip.com",
      acao: "integracao",
      recurso: "BIZZTRIP",
      descricao: "Confirmação de compra de passagem",
      detalhes: {
        transacaoId: "BZ123456",
        status: "emitida",
        valor: 850.00,
        localizador: "ABC123"
      },
      ip: "integração"
    },
    {
      id: 3,
      dataHora: "19/01/2024 09:15",
      usuario: "supervisor@obra-beta.com",
      acao: "aprovacao",
      recurso: "Folga",
      descricao: "Aprovou folga de Maria Santos (12346)",
      detalhes: {
        colaborador: "Maria Santos",
        statusAnterior: "pendente",
        statusNovo: "aprovada"
      },
      ip: "192.168.1.150"
    },
    {
      id: 4,
      dataHora: "19/01/2024 16:20",
      usuario: "colaborador@empresa.com",
      acao: "anexo",
      recurso: "Evidência",
      descricao: "Anexou comprovante de passagem",
      detalhes: {
        arquivo: "voucher_onfly_456.pdf",
        tamanho: "245KB",
        folga: "Pedro Costa - Obra Gamma"
      },
      ip: "192.168.1.200"
    }
  ];

  const relatorioConformidade = [
    {
      id: 1,
      colaborador: "João Silva",
      obra: "Obra Alpha",
      folga: "30/01/2024 - 15/02/2024",
      regraD45: "conforme",
      regraD30: "conforme",
      politicaOrigem: "conforme",
      politicaDestino: "conforme",
      politicaHorarios: "violada",
      observacoes: "Horário fora da política padrão"
    },
    {
      id: 2,
      colaborador: "Maria Santos",
      obra: "Obra Beta", 
      folga: "05/02/2024 - 20/02/2024",
      regraD45: "violada",
      regraD30: "conforme",
      politicaOrigem: "conforme",
      politicaDestino: "conforme",
      politicaHorarios: "conforme",
      observacoes: "Alerta D-45 não enviado no prazo"
    }
  ];

  const getAcaoBadge = (acao: string) => {
    const variants = {
      criacao: { variant: "default" as const, label: "Criação", color: "bg-blue-500" },
      alteracao: { variant: "secondary" as const, label: "Alteração", color: "bg-yellow-500" },
      aprovacao: { variant: "default" as const, label: "Aprovação", color: "bg-green-500" },
      integracao: { variant: "outline" as const, label: "Integração", color: "bg-purple-500" },
      anexo: { variant: "secondary" as const, label: "Anexo", color: "bg-orange-500" },
      exclusao: { variant: "destructive" as const, label: "Exclusão", color: "bg-red-500" }
    };
    const config = variants[acao as keyof typeof variants] || variants.alteracao;
    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>
    );
  };

  const getConformidadeBadge = (status: string) => {
    const variants = {
      conforme: { variant: "default" as const, label: "Conforme", icon: CheckCircle },
      violada: { variant: "destructive" as const, label: "Violada", icon: AlertTriangle }
    };
    const config = variants[status as keyof typeof variants] || variants.violada;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditoria</h1>
          <p className="text-muted-foreground">Trilha de auditoria e relatório de conformidade</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar auditoria
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Relatório completo
          </Button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos hoje</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Ações registradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrações</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">BIZZTRIP/ONFLY</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformidade</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Regras atendidas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violações</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Auditoria</CardTitle>
          <CardDescription>Filtre os eventos por tipo, usuário ou período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as ações</SelectItem>
                  <SelectItem value="criacao">Criação</SelectItem>
                  <SelectItem value="alteracao">Alteração</SelectItem>
                  <SelectItem value="aprovacao">Aprovação</SelectItem>
                  <SelectItem value="integracao">Integração</SelectItem>
                  <SelectItem value="anexo">Anexo</SelectItem>
                  <SelectItem value="exclusao">Exclusão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <Input 
                placeholder="Usuário"
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <Input 
                type="date"
                placeholder="Data"
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trilha de Auditoria */}
      <Card>
        <CardHeader>
          <CardTitle>Trilha de Auditoria por Folga</CardTitle>
          <CardDescription>Histórico completo de ações e eventos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trilhaAuditoria.map((evento) => (
                <TableRow key={evento.id}>
                  <TableCell className="font-mono text-sm">{evento.dataHora}</TableCell>
                  <TableCell>{evento.usuario}</TableCell>
                  <TableCell>{getAcaoBadge(evento.acao)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{evento.recurso}</Badge>
                  </TableCell>
                  <TableCell>{evento.descricao}</TableCell>
                  <TableCell className="font-mono text-xs">{evento.ip}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Ver</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalhes do Evento</DialogTitle>
                          <DialogDescription>
                            {evento.descricao} - {evento.dataHora}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Usuário</label>
                              <p>{evento.usuario}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Ação</label>
                              <p>{evento.acao}</p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium">Detalhes técnicos</label>
                            <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                              {JSON.stringify(evento.detalhes, null, 2)}
                            </pre>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">IP de origem</label>
                              <p className="font-mono">{evento.ip}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Recurso</label>
                              <p>{evento.recurso}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Relatório de Conformidade */}
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Conformidade</CardTitle>
          <CardDescription>Verificação de regras e políticas por folga</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Período da folga</TableHead>
                <TableHead>D-45</TableHead>
                <TableHead>D-30</TableHead>
                <TableHead>Política origem</TableHead>
                <TableHead>Política destino</TableHead>
                <TableHead>Política horários</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relatorioConformidade.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.colaborador}</TableCell>
                  <TableCell>{item.obra}</TableCell>
                  <TableCell>{item.folga}</TableCell>
                  <TableCell>{getConformidadeBadge(item.regraD45)}</TableCell>
                  <TableCell>{getConformidadeBadge(item.regraD30)}</TableCell>
                  <TableCell>{getConformidadeBadge(item.politicaOrigem)}</TableCell>
                  <TableCell>{getConformidadeBadge(item.politicaDestino)}</TableCell>
                  <TableCell>{getConformidadeBadge(item.politicaHorarios)}</TableCell>
                  <TableCell>
                    {item.observacoes && (
                      <p className="text-sm text-muted-foreground">{item.observacoes}</p>
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