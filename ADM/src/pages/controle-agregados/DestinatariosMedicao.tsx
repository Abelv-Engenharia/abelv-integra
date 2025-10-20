import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pencil, Trash2, Send, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Destinatario {
  id: string;
  cca: string;
  email: string;
  label: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

interface LogEnvio {
  id: string;
  data: string;
  cca: string;
  destinatarios: number;
  itensPendentes: number;
  competencia: string;
  status: 'sucesso' | 'erro';
}

const mockDestinatarios: Destinatario[] = [
  {
    id: '1',
    cca: 'CCA 001',
    email: 'admin@obra001.com.br',
    label: 'Administrativo Obra 001',
    ativo: true,
    criadoEm: '2025-01-15',
    atualizadoEm: '2025-01-15',
  },
  {
    id: '2',
    cca: 'CCA 001',
    email: 'financeiro@obra001.com.br',
    label: 'Financeiro',
    ativo: true,
    criadoEm: '2025-01-20',
    atualizadoEm: '2025-01-20',
  },
];

const mockLogs: LogEnvio[] = [
  {
    id: '1',
    data: '2025-02-02 09:00',
    cca: 'CCA 001',
    destinatarios: 2,
    itensPendentes: 3,
    competencia: '02/2025',
    status: 'sucesso',
  },
  {
    id: '2',
    data: '2025-01-02 09:00',
    cca: 'CCA 001',
    destinatarios: 2,
    itensPendentes: 1,
    competencia: '01/2025',
    status: 'sucesso',
  },
];

export default function DestinatariosMedicao() {
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>(mockDestinatarios);
  const [logs] = useState<LogEnvio[]>(mockLogs);
  const [ccaSelecionado, setCcaSelecionado] = useState('');
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState<string | null>(null);

  // Formulário
  const [novoEmail, setNovoEmail] = useState('');
  const [novaLabel, setNovaLabel] = useState('');
  const [novoAtivo, setNovoAtivo] = useState(true);

  const destinatariosFiltrados = destinatarios.filter((dest) => {
    const matchCca = !ccaSelecionado || dest.cca === ccaSelecionado;
    const matchBusca =
      !busca ||
      dest.email.toLowerCase().includes(busca.toLowerCase()) ||
      dest.label.toLowerCase().includes(busca.toLowerCase());
    return matchCca && matchBusca;
  });

  const handleAdicionarDestinatario = () => {
    if (!ccaSelecionado) {
      toast.error('Selecione um CCA');
      return;
    }

    if (!novoEmail) {
      toast.error('Informe o e-mail');
      return;
    }

    // Process multiple emails (comma or newline separated)
    const emailList = novoEmail.split(/[,\n]/).map(e => e.trim().toLowerCase()).filter(e => e.length > 0);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(e => !emailRegex.test(e));
    if (invalidEmails.length > 0) {
      toast.error(`E-mails inválidos: ${invalidEmails.join(', ')}`);
      return;
    }

    // Check for duplicates
    const duplicados = emailList.filter(email => 
      destinatarios.some(d => d.cca === ccaSelecionado && d.email === email)
    );
    if (duplicados.length > 0) {
      toast.error(`E-mails já cadastrados: ${duplicados.join(', ')}`);
      return;
    }

    // Add new recipients
    const novosDestinatarios = emailList.map((email, index) => ({
      id: `${Date.now()}_${index}`,
      cca: ccaSelecionado,
      email: email,
      label: novaLabel,
      ativo: novoAtivo,
      criadoEm: new Date().toISOString().split('T')[0],
      atualizadoEm: new Date().toISOString().split('T')[0]
    }));
    
    // In production, would save to database here
    toast.success(`${novosDestinatarios.length} destinatário(s) adicionado(s) com sucesso`);
    setNovoEmail('');
    setNovaLabel('');
    setNovoAtivo(true);
  };

  const handleEnviarTeste = () => {
    if (!ccaSelecionado) {
      toast.error('Selecione um CCA para enviar o teste');
      return;
    }
    toast.success('E-mail de teste enviado com sucesso');
  };

  const handleExcluir = (id: string) => {
    toast.success('Destinatário excluído com sucesso');
  };

  const handleEditar = (id: string) => {
    setEditando(editando === id ? null : id);
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Destinatários (Medição)</h1>
          <p className="text-muted-foreground">
            Configure e-mails para alertas automáticos de medição mensal não lançada
          </p>
        </div>

        {/* Alerta de Agendamento */}
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            <strong>Disparo automático:</strong> Todo dia 2 de cada mês às 09:00 (horário de São
            Paulo). O e-mail é enviado apenas se a medição mensal para pagamento de aluguel não
            estiver lançada/validada no sistema.
          </AlertDescription>
        </Alert>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label>Obra/Projeto (Cca)</Label>
                <Select value={ccaSelecionado} onValueChange={setCcaSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CCA 001">Cca 001 - Projeto Alpha</SelectItem>
                    <SelectItem value="CCA 002">Cca 002 - Projeto Beta</SelectItem>
                    <SelectItem value="CCA 003">Cca 003 - Projeto Gamma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label>Buscar</Label>
                <Input
                  placeholder="E-mail ou observação..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleEnviarTeste} variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar teste agora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário Adicionar */}
        <Card>
          <CardHeader>
            <CardTitle>Adicionar destinatário</CardTitle>
            <CardDescription>
              Você pode adicionar múltiplos e-mails separados por vírgula ou quebra de linha
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-destructive">E-mail *</Label>
                <Textarea
                  placeholder="email1@dominio.com, email2@dominio.com..."
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  rows={3}
                  className={!novoEmail ? 'border-destructive' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label>Observação</Label>
                <Textarea
                  placeholder="Ex: Administrativo, Financeiro..."
                  value={novaLabel}
                  onChange={(e) => setNovaLabel(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch checked={novoAtivo} onCheckedChange={setNovoAtivo} id="ativo-novo" />
              <Label htmlFor="ativo-novo">Ativo</Label>
            </div>

            <Button onClick={handleAdicionarDestinatario} disabled={!ccaSelecionado}>
              Adicionar destinatário
            </Button>
          </CardContent>
        </Card>

        {/* Lista de Destinatários */}
        <Card>
          <CardHeader>
            <CardTitle>Destinatários cadastrados</CardTitle>
            <CardDescription>
              {destinatariosFiltrados.length} destinatário(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cca</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Observação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Atualizado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinatariosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        <AlertCircle className="w-4 h-4 inline mr-2" />
                        Nenhum destinatário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    destinatariosFiltrados.map((dest) => (
                      <TableRow key={dest.id}>
                        <TableCell className="font-medium">{dest.cca}</TableCell>
                        <TableCell>{dest.email}</TableCell>
                        <TableCell>{dest.label || '-'}</TableCell>
                        <TableCell>
                          {dest.ativo ? (
                            <Badge variant="default">Ativo</Badge>
                          ) : (
                            <Badge variant="secondary">Inativo</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(dest.criadoEm).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          {new Date(dest.atualizadoEm).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditar(dest.id)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExcluir(dest.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
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

        {/* Histórico de Envios */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de envios (últimos 10)</CardTitle>
            <CardDescription>
              Registro dos e-mails automáticos disparados pelo sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/hora</TableHead>
                    <TableHead>Cca</TableHead>
                    <TableHead>Competência</TableHead>
                    <TableHead>Itens pendentes</TableHead>
                    <TableHead>Destinatários</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Nenhum envio registrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.data}</TableCell>
                        <TableCell className="font-medium">{log.cca}</TableCell>
                        <TableCell>{log.competencia}</TableCell>
                        <TableCell>{log.itensPendentes}</TableCell>
                        <TableCell>{log.destinatarios}</TableCell>
                        <TableCell>
                          {log.status === 'sucesso' ? (
                            <Badge variant="default">Sucesso</Badge>
                          ) : (
                            <Badge variant="destructive">Erro</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
