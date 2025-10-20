import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CheckCircle, Upload, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import TimelineAprovacao from '@/components/controle-transporte/TimelineAprovacao';
import UploadNotaFiscal from '@/components/controle-transporte/UploadNotaFiscal';

// Mock data da medição
const mockMedicao = {
  id: 'T01.M01',
  numeroMedicao: 'Med 01',
  cca: 'ABELV 24021 - ROUSSELOT - CANINDÉ',
  fornecedor: 'JESSICA MARIA ESPINHOSA CARDOSO',
  cnpj: '59.391.341/0001-88',
  periodo: '01/fev',
  valorTotal: 1000.00,
  statusIntegracao: 'Pendente de NF',
  itens: [
    { descricao: 'Aeroporto Pres. Prudente X Hotel Maanaim', qtde: 2, valorUnit: 250.00, valorTotal: 500.00 },
    { descricao: 'Hotel Maanaim X Aeroporto Pres. Prudente', qtde: 2, valorUnit: 250.00, valorTotal: 500.00 }
  ],
  timeline: [
    {
      etapa: 'Rascunho',
      status: 'concluido' as const,
      usuario: 'João Silva',
      data: '15/02/2025 10:30',
      comentario: 'Medição criada'
    },
    {
      etapa: 'Enviado p/ Aprovação',
      status: 'concluido' as const,
      usuario: 'João Silva',
      data: '15/02/2025 14:00',
      comentario: 'Enviado para análise do ADM de Obra'
    },
    {
      etapa: 'Aprovado ADM Obra',
      status: 'concluido' as const,
      usuario: 'Maria Santos - ADM Obra',
      data: '16/02/2025 09:15',
      comentario: 'Valores conferidos e aprovados'
    },
    {
      etapa: 'Aprovado Matricial',
      status: 'concluido' as const,
      usuario: 'Carlos Oliveira - ADM Matricial',
      data: '16/02/2025 16:45',
      comentario: 'Medição aprovada. Pronto para integração.'
    },
    {
      etapa: 'Pronto p/ Integração',
      status: 'concluido' as const,
      usuario: 'Sistema',
      data: '16/02/2025 16:46',
      comentario: 'Aguardando anexo de NF e envio ao Sienge'
    }
  ],
  logs: [
    {
      id: 1,
      data: '16/02/2025 16:46',
      usuario: 'Sistema',
      acao: 'Status alterado',
      descricao: 'Status alterado para "Pronto p/ Integração"'
    }
  ]
};

export default function DetalheLancamentoSienge() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [statusIntegracao, setStatusIntegracao] = useState(mockMedicao.statusIntegracao);
  const [nfData, setNfData] = useState<any>(null);
  const [contaContabil, setContaContabil] = useState('3.1.2.05');
  const [historicoPadrao, setHistoricoPadrao] = useState('Transporte — Medição fev/2025');
  const [natureza, setNatureza] = useState('Serviços de Terceiros');
  const [tipoDoc, setTipoDoc] = useState('NF-e');
  const [condicaoPagto, setCondicaoPagto] = useState('28D');
  const [observacoes, setObservacoes] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente de nf':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-lg px-3 py-1">Pendente de NF</Badge>;
      case 'validado':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-lg px-3 py-1">Validado</Badge>;
      case 'integrado':
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-lg px-3 py-1">Integrado</Badge>;
      case 'erro':
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-lg px-3 py-1">Erro</Badge>;
      default:
        return <Badge variant="secondary" className="text-lg px-3 py-1">{status}</Badge>;
    }
  };

  const handleValidar = () => {
    if (!nfData || !nfData.xmlFile || !nfData.pdfFile) {
      toast.error('Anexe os arquivos XML e PDF da NF antes de validar');
      return;
    }
    setStatusIntegracao('Validado');
    toast.success('Lançamento validado com sucesso! Dados travados.');
  };

  const handleLancarSienge = () => {
    if (statusIntegracao !== 'Validado') {
      toast.error('É necessário validar o lançamento antes de enviar ao Sienge');
      return;
    }
    
    toast.success('Enviando para o Sienge...');
    setTimeout(() => {
      setStatusIntegracao('Integrado');
      toast.success('Integração realizada com sucesso! Nº Sienge: DOC-2025-001234');
    }, 2000);
  };

  const handleCancelarVinculacao = () => {
    setNfData(null);
    setStatusIntegracao('Pendente de NF');
    toast.success('Vinculação de NF cancelada');
  };

  const isReadOnly = statusIntegracao === 'Integrado';

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/controle-transporte/lancamentos-sienge')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Detalhe do Lançamento</h1>
            <p className="text-muted-foreground">
              {mockMedicao.numeroMedicao} - {mockMedicao.fornecedor}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(statusIntegracao)}
          </div>
        </div>

        {/* Card de Resumo */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">CCA/Obra</p>
                <p className="font-semibold">{mockMedicao.cca}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fornecedor</p>
                <p className="font-semibold">{mockMedicao.fornecedor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Período</p>
                <p className="font-semibold">{mockMedicao.periodo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="font-semibold text-lg">
                  R$ {mockMedicao.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações Fixas */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleValidar}
                disabled={statusIntegracao !== 'Pendente de NF' || !nfData?.xmlFile}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Validar
              </Button>
              <Button
                onClick={handleLancarSienge}
                disabled={statusIntegracao !== 'Validado'}
              >
                <Send className="h-4 w-4 mr-2" />
                Lançar no Sienge
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelarVinculacao}
                disabled={statusIntegracao === 'Integrado' || !nfData}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar Vinculação NF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="historico" className="space-y-4">
          <TabsList>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="fiscal">Dados Fiscais</TabsTrigger>
            <TabsTrigger value="logs">Logs de Integração</TabsTrigger>
          </TabsList>

          {/* Tab Histórico */}
          <TabsContent value="historico" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Linha do Tempo da Medição</CardTitle>
                <CardDescription>
                  Histórico completo de aprovações e mudanças de status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimelineAprovacao etapas={mockMedicao.timeline} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Medição Original</CardTitle>
                <CardDescription>Itens/Trajetos registrados na medição</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trajeto/Descrição</TableHead>
                        <TableHead className="text-center">Qtde</TableHead>
                        <TableHead className="text-right">Valor Unit</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMedicao.itens.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.descricao}</TableCell>
                          <TableCell className="text-center">{item.qtde.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            R$ {item.valorUnit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell colSpan={3} className="text-right">Total:</TableCell>
                        <TableCell className="text-right">
                          R$ {mockMedicao.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Dados Fiscais */}
          <TabsContent value="fiscal" className="space-y-4">
            <UploadNotaFiscal
              onDataChange={setNfData}
              valorMedicao={mockMedicao.valorTotal}
              readOnly={isReadOnly}
            />

            <Card>
              <CardHeader>
                <CardTitle>Dados Contábeis e Financeiros</CardTitle>
                <CardDescription>Configuração de contabilização e pagamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contaContabil">Conta Contábil</Label>
                    <Input
                      id="contaContabil"
                      value={contaContabil}
                      onChange={(e) => setContaContabil(e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="historicoPadrao">Histórico Padrão</Label>
                    <Input
                      id="historicoPadrao"
                      value={historicoPadrao}
                      onChange={(e) => setHistoricoPadrao(e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="natureza">Natureza/Classe</Label>
                    <Select value={natureza} onValueChange={setNatureza} disabled={isReadOnly}>
                      <SelectTrigger id="natureza">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Serviços de Terceiros">Serviços de Terceiros</SelectItem>
                        <SelectItem value="Transporte">Transporte</SelectItem>
                        <SelectItem value="Logística">Logística</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipoDoc">Tipo de Documento</Label>
                    <Select value={tipoDoc} onValueChange={setTipoDoc} disabled={isReadOnly}>
                      <SelectTrigger id="tipoDoc">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NF-e">NF-e</SelectItem>
                        <SelectItem value="NFS-e">NFS-e</SelectItem>
                        <SelectItem value="Recibo">Recibo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condicaoPagto">Condição de Pagamento</Label>
                    <Select value={condicaoPagto} onValueChange={setCondicaoPagto} disabled={isReadOnly}>
                      <SelectTrigger id="condicaoPagto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="28D">28 dias</SelectItem>
                        <SelectItem value="30D">30 dias</SelectItem>
                        <SelectItem value="À vista">À vista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <Label htmlFor="observacoes">Observações para Sienge</Label>
                    <Textarea
                      id="observacoes"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      rows={3}
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Logs */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Integração</CardTitle>
                <CardDescription>
                  Histórico de tentativas de integração com o Sienge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMedicao.logs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            Nenhum log de integração registrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        mockMedicao.logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-mono text-sm">{log.data}</TableCell>
                            <TableCell>{log.usuario}</TableCell>
                            <TableCell>{log.acao}</TableCell>
                            <TableCell>{log.descricao}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
