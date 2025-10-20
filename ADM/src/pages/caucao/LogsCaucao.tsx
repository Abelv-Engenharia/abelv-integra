import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClipboardList, Download, Search, FileCheck, AlertCircle, CheckCircle, Clock, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data para logs de auditoria
const mockLogs = [
  {
    id: 1,
    caucaoId: 'CAU-001',
    data: '2025-01-20T10:30:00',
    usuario: 'João Silva',
    acao: 'Cadastro criado',
    detalhes: 'Caução cadastrada para contrato CONT-001',
    ip: '192.168.1.100'
  },
  {
    id: 2,
    caucaoId: 'CAU-001',
    data: '2025-01-20T14:15:00',
    usuario: 'Maria Santos',
    acao: 'Documento anexado',
    detalhes: 'Contrato PDF anexado',
    ip: '192.168.1.105'
  },
  {
    id: 3,
    caucaoId: 'CAU-001',
    data: '2025-01-21T09:00:00',
    usuario: 'Pedro Oliveira',
    acao: 'Aprovação - Engenheiro',
    detalhes: 'Aprovado pelo engenheiro responsável',
    ip: '192.168.1.110'
  },
  {
    id: 4,
    caucaoId: 'CAU-001',
    data: '2025-01-21T16:45:00',
    usuario: 'Ana Costa',
    acao: 'Aprovação - Gerente',
    detalhes: 'Aprovado pelo gerente de contratos',
    ip: '192.168.1.115'
  },
  {
    id: 5,
    caucaoId: 'CAU-001',
    data: '2025-01-22T08:20:00',
    usuario: 'Carlos Ferreira',
    acao: 'Título gerado',
    detalhes: 'Título SG-1234 gerado no Sienge',
    ip: '192.168.1.120'
  }
];

// Mock data para checklist
const mockChecklist = [
  {
    caucaoId: 'CAU-001',
    itens: [
      { item: 'Contrato vinculado', status: 'ok', data: '2025-01-20' },
      { item: 'CPF/CNPJ válido', status: 'ok', data: '2025-01-20' },
      { item: 'Valor informado', status: 'ok', data: '2025-01-20' },
      { item: 'Conta contábil definida', status: 'ok', data: '2025-01-20' },
      { item: 'Forma de pagamento', status: 'ok', data: '2025-01-20' },
      { item: 'Dados bancários', status: 'ok', data: '2025-01-20' },
      { item: 'Contrato anexado', status: 'ok', data: '2025-01-20' },
      { item: 'Termo de caução', status: 'pendente', data: '' },
      { item: 'Dados bancários locador', status: 'ok', data: '2025-01-20' },
      { item: 'Comprovante titularidade', status: 'pendente', data: '' },
      { item: 'Aprovação completa', status: 'ok', data: '2025-01-21' },
      { item: 'Título no Sienge', status: 'ok', data: '2025-01-22' },
      { item: 'Comprovante pagamento', status: 'pendente', data: '' }
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ok':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pendente':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'erro':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  const config = {
    ok: { variant: 'default' as const, text: 'OK' },
    pendente: { variant: 'secondary' as const, text: 'Pendente' },
    erro: { variant: 'destructive' as const, text: 'Erro' }
  };
  
  const statusConfig = config[status as keyof typeof config];
  
  return (
    <Badge variant={statusConfig.variant}>
      {statusConfig.text}
    </Badge>
  );
};

export default function LogsCaucao() {
  const { toast } = useToast();
  const [filtros, setFiltros] = useState({
    caucaoId: '',
    usuario: '',
    dataInicio: '',
    dataFim: ''
  });

  const handleExportarDossie = (caucaoId: string) => {
    toast({
      title: "Exportação Iniciada",
      description: `Dossiê da caução ${caucaoId} está sendo gerado`
    });
  };

  const handleExportarLogs = () => {
    toast({
      title: "Exportação Iniciada",
      description: "Relatório de logs está sendo gerado"
    });
  };

  const logsAnimados = mockLogs.filter(log => {
    return (!filtros.caucaoId || log.caucaoId.includes(filtros.caucaoId)) &&
           (!filtros.usuario || log.usuario.toLowerCase().includes(filtros.usuario.toLowerCase()));
  });

  const checklist = mockChecklist[0];

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs & Evidências</h1>
          <p className="text-muted-foreground">Auditoria completa e evidências das cauções processadas</p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="ID da Caução"
                  value={filtros.caucaoId}
                  onChange={(e) => setFiltros(prev => ({ ...prev, caucaoId: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  placeholder="Usuário"
                  value={filtros.usuario}
                  onChange={(e) => setFiltros(prev => ({ ...prev, usuario: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  type="date"
                  placeholder="Data início"
                  value={filtros.dataInicio}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  type="date"
                  placeholder="Data fim"
                  value={filtros.dataFim}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist de Conformidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Checklist de Conformidade - CAU-001
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {checklist.itens.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <span className="text-sm">{item.item}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.data && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.data).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={() => handleExportarDossie('CAU-001')}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Dossiê CAU-001
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Linha do Tempo de Auditoria */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Linha do Tempo - Auditoria
              </CardTitle>
              <Button onClick={handleExportarLogs}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Logs
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Caução</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logsAnimados.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm">
                            {new Date(log.data).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(log.data).toLocaleTimeString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.caucaoId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {log.usuario}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.acao}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.detalhes}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Resumo de Atividades */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Cauções Completas</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Em Andamento</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-sm text-muted-foreground">Com Pendências</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">245</div>
                  <div className="text-sm text-muted-foreground">Total de Logs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}