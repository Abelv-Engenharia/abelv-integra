import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Users, Trash2, Search, Send, Clock, CheckCircle2, XCircle, AlertCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PreviewEmailEfetivo from '@/components/controle-mao-obra/PreviewEmailEfetivo';
interface Destinatario {
  id: number;
  cca: string;
  email: string;
  label: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}
interface LogEnvio {
  id: number;
  dataHora: string;
  cca: string;
  destinatarios: number;
  registros: number;
  status: 'sucesso' | 'erro' | 'pendente';
}
const mockObras = [{
  id: "CCA-001",
  nome: "CCA 001 - Projeto Alpha"
}, {
  id: "CCA-002",
  nome: "CCA 002 - Projeto Beta"
}, {
  id: "CCA-003",
  nome: "CCA 003 - Projeto Gamma"
}];
const mockDestinatarios: Destinatario[] = [{
  id: 1,
  cca: "CCA-001",
  email: "coordenador.alpha@abelv.com",
  label: "Coordenador de Obra",
  ativo: true,
  criadoEm: "2025-01-15",
  atualizadoEm: "2025-01-15"
}, {
  id: 2,
  cca: "CCA-001",
  email: "rh.alpha@abelv.com",
  label: "Departamento RH",
  ativo: true,
  criadoEm: "2025-01-20",
  atualizadoEm: "2025-01-20"
}, {
  id: 3,
  cca: "CCA-002",
  email: "gerente.beta@abelv.com",
  label: "Gerente de Projeto",
  ativo: false,
  criadoEm: "2025-02-01",
  atualizadoEm: "2025-02-10"
}];
const mockLogsEnvio: LogEnvio[] = [{
  id: 1,
  dataHora: "2025-09-22 09:00:00",
  cca: "CCA-001",
  destinatarios: 2,
  registros: 15,
  status: "sucesso"
}, {
  id: 2,
  dataHora: "2025-09-15 09:00:00",
  cca: "CCA-002",
  destinatarios: 1,
  registros: 8,
  status: "sucesso"
}, {
  id: 3,
  dataHora: "2025-09-08 09:00:00",
  cca: "CCA-001",
  destinatarios: 2,
  registros: 0,
  status: "pendente"
}];
export default function DestinatariosEfetivo() {
  const {
    toast
  } = useToast();
  const [filtroCCA, setFiltroCCA] = useState('');
  const [busca, setBusca] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>(mockDestinatarios);
  const [logsEnvio] = useState<LogEnvio[]>(mockLogsEnvio);
  const [novoDestinatario, setNovoDestinatario] = useState({
    cca: '',
    emails: '',
    label: ''
  });
  const [dadosPreview, setDadosPreview] = useState({
    cca: '',
    data: new Date().toLocaleDateString('pt-BR'),
    colaboradoresAbelv: [],
    colaboradoresTerceiros: []
  });
  const destinatariosFiltrados = destinatarios.filter(dest => {
    const matchCCA = !filtroCCA || dest.cca === filtroCCA;
    const matchBusca = !busca || dest.email.toLowerCase().includes(busca.toLowerCase()) || dest.label.toLowerCase().includes(busca.toLowerCase());
    return matchCCA && matchBusca;
  });
  const handleAdicionar = () => {
    if (!novoDestinatario.cca || !novoDestinatario.emails) {
      toast({
        title: "Campos obrigatórios",
        description: "CCA e E-mail são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Process multiple emails (comma or newline separated)
    const emailList = novoDestinatario.emails.split(/[,\n]/).map(e => e.trim().toLowerCase()).filter(e => e.length > 0);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(e => !emailRegex.test(e));
    if (invalidEmails.length > 0) {
      toast({
        title: "E-mails inválidos",
        description: `Formato inválido: ${invalidEmails.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Check for duplicates
    const duplicados = emailList.filter(email => destinatarios.some(d => d.cca === novoDestinatario.cca && d.email === email));
    if (duplicados.length > 0) {
      toast({
        title: "E-mails duplicados",
        description: `Já cadastrados: ${duplicados.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Add new recipients
    const novosDestinatarios = emailList.map((email, index) => ({
      id: Math.max(...destinatarios.map(d => d.id), 0) + index + 1,
      cca: novoDestinatario.cca,
      email: email,
      label: novoDestinatario.label,
      ativo: true,
      criadoEm: new Date().toISOString().split('T')[0],
      atualizadoEm: new Date().toISOString().split('T')[0]
    }));
    setDestinatarios([...destinatarios, ...novosDestinatarios]);
    toast({
      title: "Destinatários adicionados",
      description: `${novosDestinatarios.length} destinatário(s) cadastrado(s) com sucesso`
    });
    setNovoDestinatario({
      cca: '',
      emails: '',
      label: ''
    });
    setMostrarFormulario(false);
  };
  const handleExcluir = (id: number) => {
    setDestinatarios(destinatarios.filter(d => d.id !== id));
    toast({
      title: "Removido",
      description: "Destinatário removido da lista"
    });
  };
  const handleToggleAtivo = (id: number) => {
    setDestinatarios(destinatarios.map(d => d.id === id ? {
      ...d,
      ativo: !d.ativo,
      atualizadoEm: new Date().toISOString().split('T')[0]
    } : d));
  };
  const buscarDadosEfetivo = async (cca?: string) => {
    try {
      // Buscar colaboradores ABELV
      let queryAbelv = supabase
        .from('colaboradores_efetivo')
        .select('nome, funcao, disciplina, classificacao')
        .in('tipo_colaborador', ['abelv', 'abelv_pj'])
        .eq('status', 'ativo')
        .order('data_inclusao', { ascending: false });
      
      if (cca) {
        queryAbelv = queryAbelv.eq('cca_codigo', cca);
      }

      const { data: abelvData, error: abelvError } = await queryAbelv;
      
      if (abelvError) throw abelvError;

      // Buscar colaboradores Terceiros
      let queryTerceiros = supabase
        .from('colaboradores_efetivo')
        .select('nome, funcao, disciplina, classificacao, empresa')
        .eq('tipo_colaborador', 'terceiro')
        .eq('status', 'ativo')
        .order('data_inclusao', { ascending: false });
      
      if (cca) {
        queryTerceiros = queryTerceiros.eq('cca_codigo', cca);
      }

      const { data: terceirosData, error: terceirosError } = await queryTerceiros;
      
      if (terceirosError) throw terceirosError;

      setDadosPreview({
        cca: cca || 'Todas as CCAs',
        data: new Date().toLocaleDateString('pt-BR'),
        colaboradoresAbelv: abelvData || [],
        colaboradoresTerceiros: terceirosData || []
      });

    } catch (error) {
      console.error('Erro ao buscar dados do efetivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados para preview",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    buscarDadosEfetivo(filtroCCA);
  }, [filtroCCA]);

  const handleEnviarTeste = async () => {
    const destinatariosAtivos = destinatarios.filter(d => d.ativo);
    if (destinatariosAtivos.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum destinatário ativo cadastrado",
        variant: "destructive"
      });
      return;
    }
    const emails = destinatariosAtivos.map(d => d.email);

    // Buscar dados reais antes de enviar
    await buscarDadosEfetivo(filtroCCA);
    
    const dadosRelatorio = {
      cca: dadosPreview.cca,
      data: dadosPreview.data,
      colaboradoresAbelv: dadosPreview.colaboradoresAbelv,
      colaboradoresTerceiros: dadosPreview.colaboradoresTerceiros,
      destinatarios: emails
    };
    
    toast({
      title: "Enviando relatório",
      description: "Aguarde enquanto o relatório está sendo enviado..."
    });
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('enviar-relatorio-efetivo', {
        body: dadosRelatorio
      });
      if (error) throw error;
      toast({
        title: "Sucesso!",
        description: `Relatório enviado para ${emails.length} destinatário(s)`
      });
    } catch (error: any) {
      console.error("Erro ao enviar relatório:", error);
      toast({
        title: "Erro",
        description: "Erro ao enviar relatório: " + error.message,
        variant: "destructive"
      });
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sucesso':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'erro':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pendente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary"> = {
      sucesso: "default",
      erro: "destructive",
      pendente: "secondary"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };
  return <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Destinatários - Efetivo Diário</h1>
            <p className="text-muted-foreground">Configuração de destinatários para relatórios automáticos</p>
          </div>
        </div>

        {/* Tabs for Recipients and Preview */}
        <Tabs defaultValue="destinatarios" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="destinatarios" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Destinatários
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview do Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="destinatarios" className="space-y-6 mt-6">

        {/* Alert Schedule Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Envio automático configurado:</strong> Diário às 11:30 (horário de Brasília). 
            O administrativo da obra deve preencher o controle diário até as 09:00 da manhã.
            O relatório será enviado quando houver atualização de efetivo.
          </AlertDescription>
        </Alert>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros e ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Obra/CCA</Label>
                <Select value={filtroCCA} onValueChange={setFiltroCCA}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as obras" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockObras.map(obra => <SelectItem key={obra.id} value={obra.id}>{obra.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="E-mail ou label..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-8" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Adicionar destinatário
                </Button>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button variant="outline" onClick={handleEnviarTeste} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar teste agora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inline Form */}
        {mostrarFormulario && <Card className="border-primary">
            <CardHeader>
              <CardTitle>Adicionar novos destinatários</CardTitle>
              <CardDescription>Você pode adicionar múltiplos e-mails separados por vírgula ou quebra de linha</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-destructive">CCA *</Label>
                  <Select value={novoDestinatario.cca} onValueChange={value => setNovoDestinatario({
                    ...novoDestinatario,
                    cca: value
                  })}>
                    <SelectTrigger className={!novoDestinatario.cca ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Selecione o CCA" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockObras.map(obra => <SelectItem key={obra.id} value={obra.id}>{obra.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-destructive">E-mail(s) *</Label>
                  <Input placeholder="email@exemplo.com, outro@exemplo.com" value={novoDestinatario.emails} onChange={e => setNovoDestinatario({
                    ...novoDestinatario,
                    emails: e.target.value
                  })} className={!novoDestinatario.emails ? 'border-destructive' : ''} />
                </div>

                <div className="space-y-2">
                  <Label>Label/Observação</Label>
                  <Input placeholder="Ex: Coordenador de Obra" value={novoDestinatario.label} onChange={e => setNovoDestinatario({
                    ...novoDestinatario,
                    label: e.target.value
                  })} />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAdicionar}>
                  <Users className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>}

        {/* Recipients Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Destinatários cadastrados
            </CardTitle>
            <CardDescription>
              {destinatariosFiltrados.length} destinatário(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CCA</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Label/Observação</TableHead>
                    <TableHead className="text-center">Ativo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Atualizado em</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinatariosFiltrados.length === 0 ? <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        Nenhum destinatário cadastrado
                      </TableCell>
                    </TableRow> : destinatariosFiltrados.map(destinatario => <TableRow key={destinatario.id}>
                        <TableCell className="font-medium">{destinatario.cca}</TableCell>
                        <TableCell className="font-mono text-sm">{destinatario.email}</TableCell>
                        <TableCell>{destinatario.label || '-'}</TableCell>
                        <TableCell className="text-center">
                          <Switch checked={destinatario.ativo} onCheckedChange={() => handleToggleAtivo(destinatario.id)} />
                        </TableCell>
                        <TableCell>{new Date(destinatario.criadoEm).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>{new Date(destinatario.atualizadoEm).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button variant="outline" size="sm" onClick={() => handleExcluir(destinatario.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Sending Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de envios</CardTitle>
            <CardDescription>Últimos 10 disparos de relatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>CCA</TableHead>
                    <TableHead className="text-center">Destinatários</TableHead>
                    <TableHead className="text-center">Registros enviados</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logsEnvio.map(log => <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.dataHora}</TableCell>
                      <TableCell>{log.cca}</TableCell>
                      <TableCell className="text-center">{log.destinatarios}</TableCell>
                      <TableCell className="text-center">{log.registros}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(log.status)}
                          {getStatusBadge(log.status)}
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-6">
            <PreviewEmailEfetivo 
              cca={dadosPreview.cca} 
              data={dadosPreview.data} 
              colaboradoresAbelv={dadosPreview.colaboradoresAbelv}
              colaboradoresTerceiros={dadosPreview.colaboradoresTerceiros} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}