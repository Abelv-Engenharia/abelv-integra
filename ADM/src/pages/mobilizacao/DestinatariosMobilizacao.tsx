import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Download, Send, Mail, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Destinatario {
  id: string;
  cca: string;
  email: string;
  label: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

interface LogEnvio {
  id: string;
  data_hora: string;
  cca: string;
  destinatarios: number;
  pendencias: number;
  status: 'sucesso' | 'erro';
  mensagem?: string;
}

export default function DestinatariosMobilizacao() {
  const [filtroCCA, setFiltroCCA] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  
  // Formulário
  const [formData, setFormData] = useState({
    emails: "",
    label: "",
    ativo: true
  });

  // Mock data - destinatários
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([
    {
      id: "1",
      cca: "CCA 023101",
      email: "administracao@nexa.com",
      label: "Administração Obra",
      ativo: true,
      criado_em: "2025-01-15T10:00:00",
      atualizado_em: "2025-01-15T10:00:00"
    },
    {
      id: "2",
      cca: "CCA 023101",
      email: "rh@nexa.com",
      label: "Recursos Humanos",
      ativo: true,
      criado_em: "2025-01-15T10:30:00",
      atualizado_em: "2025-01-15T10:30:00"
    },
    {
      id: "3",
      cca: "CCA 024502",
      email: "gestao.alpha@empresa.com",
      label: "Gestão Projeto Alpha",
      ativo: true,
      criado_em: "2025-01-16T09:00:00",
      atualizado_em: "2025-01-16T09:00:00"
    },
    {
      id: "4",
      cca: "CCA 023101",
      email: "auditoria@nexa.com",
      label: "Auditoria",
      ativo: false,
      criado_em: "2025-01-10T14:00:00",
      atualizado_em: "2025-01-20T11:00:00"
    }
  ]);

  // Mock data - logs de envio
  const logsEnvio: LogEnvio[] = [
    {
      id: "1",
      data_hora: "2025-01-27T09:00:00",
      cca: "CCA 023101",
      destinatarios: 3,
      pendencias: 5,
      status: "sucesso",
      mensagem: "Relatório semanal enviado com sucesso"
    },
    {
      id: "2",
      data_hora: "2025-01-20T09:00:00",
      cca: "CCA 023101",
      destinatarios: 3,
      pendencias: 8,
      status: "sucesso",
      mensagem: "Relatório semanal enviado com sucesso"
    },
    {
      id: "3",
      data_hora: "2025-01-20T09:00:00",
      cca: "CCA 024502",
      destinatarios: 1,
      pendencias: 2,
      status: "sucesso",
      mensagem: "Relatório semanal enviado com sucesso"
    },
    {
      id: "4",
      data_hora: "2025-01-13T09:00:00",
      cca: "CCA 023101",
      destinatarios: 3,
      pendencias: 0,
      status: "sucesso",
      mensagem: "Sem pendências - envio não realizado"
    }
  ];

  const obras = [
    { id: "CCA 023101", nome: "Nexa PDSR" },
    { id: "CCA 024502", nome: "Projeto Alpha" },
    { id: "CCA 025603", nome: "Vale S11D" }
  ];

  const destinatariosFiltrados = destinatarios.filter(dest => {
    const matchCCA = filtroCCA === "todos" || dest.cca === filtroCCA;
    const matchBusca = busca === "" || 
      dest.email.toLowerCase().includes(busca.toLowerCase()) ||
      dest.label.toLowerCase().includes(busca.toLowerCase());
    return matchCCA && matchBusca;
  });

  const handleAdicionarDestinatario = () => {
    if (!filtroCCA || filtroCCA === "todos") {
      toast({
        title: "Erro",
        description: "Selecione um CCA antes de adicionar destinatários.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.emails.trim()) {
      toast({
        title: "Erro",
        description: "Informe pelo menos um e-mail.",
        variant: "destructive"
      });
      return;
    }

    // Processar múltiplos emails (separados por vírgula ou quebra de linha)
    const emailsArray = formData.emails
      .split(/[,\n]/)
      .map(email => email.trim().toLowerCase())
      .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (emailsArray.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum e-mail válido encontrado.",
        variant: "destructive"
      });
      return;
    }

    // Verificar duplicidade
    const duplicados = emailsArray.filter(email =>
      destinatarios.some(d => d.cca === filtroCCA && d.email === email)
    );

    if (duplicados.length > 0) {
      toast({
        title: "Erro",
        description: `E-mail(s) já cadastrado(s): ${duplicados.join(", ")}`,
        variant: "destructive"
      });
      return;
    }

    // Adicionar novos destinatários
    const novosDestinatarios: Destinatario[] = emailsArray.map(email => ({
      id: `${Date.now()}_${Math.random()}`,
      cca: filtroCCA,
      email,
      label: formData.label,
      ativo: formData.ativo,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    }));

    setDestinatarios([...destinatarios, ...novosDestinatarios]);

    toast({
      title: "Sucesso",
      description: `${novosDestinatarios.length} destinatário(s) adicionado(s) com sucesso.`
    });

    // Limpar formulário
    setFormData({ emails: "", label: "", ativo: true });
    setMostrarFormulario(false);
  };

  const handleExcluirDestinatario = (id: string) => {
    setDestinatarios(destinatarios.filter(d => d.id !== id));
    toast({
      title: "Sucesso",
      description: "Destinatário excluído com sucesso."
    });
  };

  const handleToggleAtivo = (id: string) => {
    setDestinatarios(destinatarios.map(d =>
      d.id === id ? { ...d, ativo: !d.ativo, atualizado_em: new Date().toISOString() } : d
    ));
    toast({
      title: "Sucesso",
      description: "Status atualizado com sucesso."
    });
  };

  const handleEnviarTeste = () => {
    if (filtroCCA === "todos") {
      toast({
        title: "Erro",
        description: "Selecione um CCA para enviar o teste.",
        variant: "destructive"
      });
      return;
    }

    const destinatariosAtivos = destinatarios.filter(d => d.cca === filtroCCA && d.ativo);

    if (destinatariosAtivos.length === 0) {
      toast({
        title: "Erro",
        description: "Não há destinatários ativos para este CCA.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "E-mail de teste enviado",
      description: `Teste enviado para ${destinatariosAtivos.length} destinatário(s) do ${filtroCCA}.`
    });
  };

  const getStatusLogColor = (status: string) => {
    switch (status) {
      case "sucesso": return "text-green-600";
      case "erro": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusLogIcon = (status: string) => {
    switch (status) {
      case "sucesso": return <CheckCircle className="h-4 w-4" />;
      case "erro": return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Destinatários de relatórios</h1>
            <p className="text-muted-foreground">
              Configure os destinatários para receber alertas semanais de documentação por CCA
            </p>
          </div>

          {/* Info sobre agendamento */}
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Envio automático:</strong> Toda segunda-feira às 09:00 (horário de Brasília), 
              o sistema enviará um relatório consolidado apenas se houver pendências ou documentos em atraso no CCA.
            </AlertDescription>
          </Alert>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="filtro-cca">Obra/Projeto (CCA)</Label>
              <Select value={filtroCCA} onValueChange={setFiltroCCA}>
                <SelectTrigger id="filtro-cca">
                  <SelectValue placeholder="Selecione CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os CCAs</SelectItem>
                  {obras.map(obra => (
                    <SelectItem key={obra.id} value={obra.id}>
                      {obra.id} - {obra.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label htmlFor="busca">Buscar</Label>
              <Input
                id="busca"
                placeholder="E-mail ou observação..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Ações principais */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold">Lista de destinatários</h3>
            <p className="text-sm text-muted-foreground">
              {destinatariosFiltrados.length} destinatário(s) encontrado(s)
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={handleEnviarTeste}>
              <Send className="h-4 w-4 mr-2" />
              Enviar teste agora
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar destinatário
            </Button>
          </div>
        </div>

        {/* Formulário inline */}
        {mostrarFormulario && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-lg">Adicionar novo(s) destinatário(s)</CardTitle>
              <CardDescription>
                Você pode adicionar múltiplos e-mails separados por vírgula ou quebra de linha
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emails">
                    E-mail(s) <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="emails"
                    placeholder="email1@exemplo.com, email2@exemplo.com&#10;ou um por linha"
                    value={formData.emails}
                    onChange={(e) => setFormData({ ...formData, emails: e.target.value })}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separe múltiplos e-mails por vírgula ou quebra de linha
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="label">Label/Observação</Label>
                  <Input
                    id="label"
                    placeholder="Ex: Administração, RH, Auditoria..."
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Identificação opcional para o destinatário
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
                <Label htmlFor="ativo" className="cursor-pointer">
                  Ativo (receberá os relatórios semanais)
                </Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setFormData({ emails: "", label: "", ativo: true });
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAdicionarDestinatario}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela de destinatários */}
        <Card>
          <CardContent className="p-0">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CCA</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Label/Observação</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Atualizado em</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinatariosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum destinatário encontrado com os filtros aplicados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    destinatariosFiltrados.map((dest) => (
                      <TableRow key={dest.id}>
                        <TableCell className="font-medium font-mono">{dest.cca}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {dest.email}
                          </div>
                        </TableCell>
                        <TableCell>{dest.label || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={dest.ativo}
                              onCheckedChange={() => handleToggleAtivo(dest.id)}
                            />
                            <Badge variant={dest.ativo ? "default" : "secondary"}>
                              {dest.ativo ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(dest.criado_em).toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {new Date(dest.atualizado_em).toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleExcluirDestinatario(dest.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Logs de envio */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Histórico de envios (últimos 10)
            </CardTitle>
            <CardDescription>
              Registro de envios automáticos e testes realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logsEnvio.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={getStatusLogColor(log.status)}>
                      {getStatusLogIcon(log.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.cca}</span>
                        <Badge variant="outline" className="text-xs">
                          {log.destinatarios} destinatário(s)
                        </Badge>
                        {log.pendencias > 0 && (
                          <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                            {log.pendencias} pendência(s)
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{log.mensagem}</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(log.data_hora).toLocaleString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
