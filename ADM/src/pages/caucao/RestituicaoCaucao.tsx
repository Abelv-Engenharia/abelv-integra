import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RefreshCw, DollarSign, Upload, Calculator, FileCheck, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data para cauções próximas do fim do contrato
const mockCaucoesFinalizacao = [
  {
    id: 'CAU-001',
    contrato: 'CONT-001',
    fornecedor: 'Ricardo Queiroga Bueno',
    valorCaucao: 8700,
    valorOriginal: 8700,
    fimLocacao: '2025-02-15',
    statusVistoria: 'realizada',
    laudoVistoria: true,
    debitos: [
      { descricao: 'Dano na parede da sala', valor: 450 },
      { descricao: 'Substituição de fechadura', valor: 120 }
    ],
    valorDebitos: 570,
    valorRestituir: 8130,
    status: 'aguardando_restituicao'
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    aguardando_vistoria: { variant: 'secondary' as const, text: 'Aguardando Vistoria' },
    aguardando_restituicao: { variant: 'default' as const, text: 'Aguardando Restituição' },
    restituida: { variant: 'default' as const, text: 'Restituída' },
    compensada: { variant: 'default' as const, text: 'Compensada' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig];
  
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default function RestituicaoCaucao() {
  const { toast } = useToast();
  const [selectedCaucao, setSelectedCaucao] = useState<string>('');
  const [tipoProcessamento, setTipoProcessamento] = useState('');
  const [dadosRestituicao, setDadosRestituicao] = useState({
    valorFinal: '',
    justificativa: '',
    anexoLaudo: null as File | null,
    dadosPagamento: {
      banco: '',
      agencia: '',
      conta: '',
      chavePixx: ''
    }
  });

  const caucaoSelecionada = mockCaucoesFinalizacao.find(c => c.id === selectedCaucao);

  const calcularValorFinal = () => {
    if (!caucaoSelecionada) return 0;
    return caucaoSelecionada.valorCaucao - caucaoSelecionada.valorDebitos;
  };

  const handleProcessarRestituicao = () => {
    if (!tipoProcessamento) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de processamento (Restituir ou Compensar)",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Processamento Iniciado",
      description: `${tipoProcessamento === 'restituir' ? 'Restituição' : 'Compensação'} processada com sucesso`
    });
    
    setSelectedCaucao('');
    setTipoProcessamento('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDadosRestituicao(prev => ({ ...prev, anexoLaudo: file }));
    }
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restituição/Compensação de Cauções</h1>
          <p className="text-muted-foreground">Processe restituições e compensações de cauções ao final dos contratos</p>
        </div>

        {/* Lista de Cauções para Finalização */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Cauções Próximas ao Fim do Contrato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Valor Original</TableHead>
                  <TableHead>Fim Locação</TableHead>
                  <TableHead>Vistoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCaucoesFinalizacao.map((caucao) => (
                  <TableRow key={caucao.id}>
                    <TableCell className="font-medium">{caucao.id}</TableCell>
                    <TableCell>{caucao.contrato}</TableCell>
                    <TableCell>{caucao.fornecedor}</TableCell>
                    <TableCell>R$ {caucao.valorOriginal.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{new Date(caucao.fimLocacao).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant={caucao.statusVistoria === 'realizada' ? 'default' : 'secondary'}>
                        {caucao.statusVistoria === 'realizada' ? 'Realizada' : 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(caucao.status)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedCaucao(caucao.id)}>
                            <Calculator className="h-4 w-4 mr-2" />
                            Processar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Processamento de Caução - {caucao.id}</DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Resumo da Caução */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Resumo da Caução</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <div><strong>Fornecedor:</strong> {caucao.fornecedor}</div>
                                    <div><strong>Valor Original:</strong> R$ {caucao.valorOriginal.toLocaleString('pt-BR')}</div>
                                    <div><strong>Fim da Locação:</strong> {new Date(caucao.fimLocacao).toLocaleDateString('pt-BR')}</div>
                                  </div>
                                  <div>
                                    <div><strong>Status da Vistoria:</strong> 
                                      <Badge className="ml-2" variant={caucao.statusVistoria === 'realizada' ? 'default' : 'secondary'}>
                                        {caucao.statusVistoria === 'realizada' ? 'Realizada' : 'Pendente'}
                                      </Badge>
                                    </div>
                                    <div><strong>Laudo Anexado:</strong> 
                                      <Badge className="ml-2" variant={caucao.laudoVistoria ? 'default' : 'secondary'}>
                                        {caucao.laudoVistoria ? 'Sim' : 'Não'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Débitos Apurados */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Débitos Apurados</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Descrição</TableHead>
                                      <TableHead>Valor</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {caucao.debitos.map((debito, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{debito.descricao}</TableCell>
                                        <TableCell>R$ {debito.valor.toLocaleString('pt-BR')}</TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow className="font-bold">
                                      <TableCell>Total de Débitos</TableCell>
                                      <TableCell>R$ {caucao.valorDebitos.toLocaleString('pt-BR')}</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </CardContent>
                            </Card>

                            {/* Cálculo Final */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Cálculo Final</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2 text-lg">
                                  <div className="flex justify-between">
                                    <span>Valor da Caução:</span>
                                    <span>R$ {caucao.valorOriginal.toLocaleString('pt-BR')}</span>
                                  </div>
                                  <div className="flex justify-between text-red-600">
                                    <span>(-) Débitos Apurados:</span>
                                    <span>R$ {caucao.valorDebitos.toLocaleString('pt-BR')}</span>
                                  </div>
                                  <div className="border-t pt-2 font-bold flex justify-between">
                                    <span>Valor Final:</span>
                                    <span>R$ {calcularValorFinal().toLocaleString('pt-BR')}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Tipo de Processamento */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Tipo de Processamento</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <Select value={tipoProcessamento} onValueChange={setTipoProcessamento}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o tipo de processamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="restituir">Restituir ao Locador</SelectItem>
                                      <SelectItem value="compensar">Compensar em Último Aluguel/Despesas</SelectItem>
                                    </SelectContent>
                                  </Select>

                                  {tipoProcessamento === 'restituir' && (
                                    <div className="space-y-4">
                                      <h4 className="font-semibold">Dados para Pagamento</h4>
                                      <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                          <Label>Banco</Label>
                                          <Input placeholder="Código do banco" />
                                        </div>
                                        <div>
                                          <Label>Agência</Label>
                                          <Input placeholder="0000" />
                                        </div>
                                        <div>
                                          <Label>Conta</Label>
                                          <Input placeholder="Número da conta" />
                                        </div>
                                        <div>
                                          <Label>Chave PIX (opcional)</Label>
                                          <Input placeholder="Chave PIX" />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {tipoProcessamento === 'compensar' && (
                                    <div className="space-y-4">
                                      <h4 className="font-semibold">Título para Compensação</h4>
                                      <Select>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o título a compensar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="aluguel-jan">Aluguel Janeiro 2025</SelectItem>
                                          <SelectItem value="aluguel-fev">Aluguel Fevereiro 2025</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}

                                  <div>
                                    <Label>Justificativa</Label>
                                    <Textarea 
                                      placeholder="Justificativa do processamento..."
                                      value={dadosRestituicao.justificativa}
                                      onChange={(e) => setDadosRestituicao(prev => ({
                                        ...prev,
                                        justificativa: e.target.value
                                      }))}
                                    />
                                  </div>

                                  <div>
                                    <Label>Anexar Laudo/Termo Final</Label>
                                    <Input
                                      type="file"
                                      accept=".pdf"
                                      onChange={handleFileUpload}
                                      className="file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            <div className="flex justify-end space-x-4">
                              <Button variant="outline" onClick={() => setSelectedCaucao('')}>
                                Cancelar
                              </Button>
                              <Button onClick={() => handleProcessarRestituicao()}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Gerar no Sienge
                              </Button>
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

        {/* Histórico de Restituições */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Restituições/Compensações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">CAU-002 - Maria Santos</div>
                  <div className="text-sm text-muted-foreground">
                    Restituída em 10/01/2025 • Valor: R$ 4.800,00
                  </div>
                </div>
                <Badge variant="default">Restituída</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">CAU-003 - Pedro Oliveira</div>
                  <div className="text-sm text-muted-foreground">
                    Compensada em 08/01/2025 • Valor: R$ 2.900,00
                  </div>
                </div>
                <Badge variant="default">Compensada</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}