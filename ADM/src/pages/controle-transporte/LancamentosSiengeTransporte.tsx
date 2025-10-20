import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, CheckCircle, AlertCircle, DollarSign, FileText, Eye, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PdfViewerModal from '@/components/pdf/PdfViewerModal';

interface MedicaoTransporte {
  id: string;
  numero_medicao: string;
  fornecedor: string;
  cnpj: string;
  cca: string;
  periodo: string;
  valor_total: number;
  itens: any[];
  status: string;
  data_emissao: string | null;
  prazo_pagamento: string | null;
  titulo_sienge?: string | null;
  numero_titulo?: string | null;
  situacao_sienge?: string | null;
  anexo_nf_url: string | null;
  anexo_nf_nome: string | null;
  anexo_xml_url: string | null;
  dados_nf: any;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pendente: { variant: 'secondary' as const, text: 'Recebida da Obra' },
    em_validacao: { variant: 'outline' as const, text: 'Em Validação' },
    aprovada: { variant: 'default' as const, text: 'Aprovada' },
    lancado_sienge: { variant: 'outline' as const, text: 'Lançado no Sienge' },
    liquidada: { variant: 'default' as const, text: 'Liquidada' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
  
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default function LancamentosSiengeTransporte() {
  const [medicoes, setMedicoes] = useState<MedicaoTransporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [medicaoSelecionada, setMedicaoSelecionada] = useState<string>('');
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [pdfTitle, setPdfTitle] = useState<string>('Visualizar Anexo');
  const [dadosSienge, setDadosSienge] = useState({
    favorecido: '',
    banco: '',
    agencia: '',
    conta: '',
    operacao: '',
    formaPagamento: 'TED',
    titulo: '',
    cca: '',
    contaContabil: '',
    historico: '',
    valor: '',
    vencimento: '',
    competencia: '',
    dataEmissao: ''
  });

  const medicao = medicoes.find(m => m.id === medicaoSelecionada);

  // Carregar medições do banco de dados
  useEffect(() => {
    carregarMedicoes();

    // Configurar real-time updates
    const channel = supabase
      .channel('medicoes-transporte-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medicoes_transporte'
        },
        () => {
          carregarMedicoes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const carregarMedicoes = async () => {
    try {
      const { data, error } = await supabase
        .from('medicoes_transporte')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Converter dados do Supabase para o formato esperado
      const medicoesFormatadas: MedicaoTransporte[] = (data || []).map(m => ({
        id: m.id,
        numero_medicao: m.numero_medicao,
        fornecedor: m.fornecedor,
        cnpj: m.cnpj || '',
        cca: m.cca,
        periodo: m.periodo,
        valor_total: Number(m.valor_total),
        itens: (m.itens as any) || [],
        status: m.status,
        data_emissao: m.data_emissao,
        prazo_pagamento: m.prazo_pagamento,
        titulo_sienge: m.titulo_sienge,
        numero_titulo: m.numero_sienge,
        situacao_sienge: m.situacao_sienge,
        anexo_nf_url: m.anexo_nf_url,
        anexo_nf_nome: m.anexo_nf_nome,
        anexo_xml_url: m.anexo_xml_url,
        dados_nf: m.dados_nf
      }));

      setMedicoes(medicoesFormatadas);
    } catch (error) {
      console.error('Erro ao carregar medições:', error);
      toast.error('Não foi possível carregar as medições');
    } finally {
      setLoading(false);
    }
  };

  const handleGerarLancamentoSienge = async () => {
    // Validações obrigatórias
    if (!dadosSienge.favorecido || !dadosSienge.banco || !dadosSienge.agencia || !dadosSienge.conta) {
      toast.error('Preencha todos os campos obrigatórios antes de gerar o lançamento');
      return;
    }

    if (!medicaoSelecionada) return;

    try {
      const numeroTitulo = `TIT-2025-${Date.now().toString().slice(-3)}`;
      const vencimento = new Date();
      vencimento.setDate(vencimento.getDate() + 15);

      const { error } = await supabase
        .from('medicoes_transporte')
        .update({
          titulo_sienge: dadosSienge.titulo,
          numero_sienge: numeroTitulo,
          prazo_pagamento: vencimento.toISOString().split('T')[0],
          situacao_sienge: 'lancado',
          dados_sienge: dadosSienge,
          status: 'lancado_sienge'
        })
        .eq('id', medicaoSelecionada);

      if (error) throw error;

      toast.success(`Título de transporte criado no Sienge - Nº ${numeroTitulo}`);
      carregarMedicoes();
    } catch (error) {
      console.error('Erro ao gerar lançamento:', error);
      toast.error('Não foi possível gerar o lançamento no Sienge');
    }
  };

  const handleAprovarMedicao = async (medicaoId: string) => {
    try {
      const { error } = await supabase
        .from('medicoes_transporte')
        .update({ status: 'aprovada' })
        .eq('id', medicaoId);

      if (error) throw error;

      toast.success('Medição aprovada e liberada para lançamento no Sienge');
      carregarMedicoes();
    } catch (error) {
      console.error('Erro ao aprovar medição:', error);
      toast.error('Não foi possível aprovar a medição');
    }
  };

  const handleRejeitarMedicao = async (medicaoId: string) => {
    try {
      const { error } = await supabase
        .from('medicoes_transporte')
        .update({ status: 'rejeitada' })
        .eq('id', medicaoId);

      if (error) throw error;

      toast.error('Medição rejeitada e retornada para a obra');
      carregarMedicoes();
    } catch (error) {
      console.error('Erro ao rejeitar medição:', error);
      toast.error('Não foi possível rejeitar a medição');
    }
  };

  const handleVisualizarNF = async (url: string | null, nome: string | null) => {
    if (!url) {
      toast.error('Não há nota fiscal anexada nesta medição');
      return;
    }

    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const ab = await blob.arrayBuffer();
      setPdfData(new Uint8Array(ab));
      setPdfTitle(nome || 'Nota Fiscal');
      setPdfOpen(true);
    } catch (e) {
      console.error('Falha ao abrir anexo', e);
      toast.error('Erro ao abrir anexo. Tente baixar o arquivo.');
    }
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transporte - Lançamentos Sienge</h1>
          <p className="text-muted-foreground">Gestão de transporte e integração com Sienge</p>
        </div>

        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Medições Pendentes</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {medicoes.filter(m => m.status === 'pendente').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aprovadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {medicoes.filter(m => m.status === 'aprovada').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">
                    R$ {medicoes.reduce((sum, m) => sum + Number(m.valor_total), 0).toLocaleString('pt-BR')}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Itens</p>
                  <p className="text-2xl font-bold">
                    {medicoes.reduce((sum, m) => sum + (m.itens?.length || 0), 0)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Medições */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Medições de Transporte para Validação e Lançamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Cca</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Carregando medições...
                    </TableCell>
                  </TableRow>
                ) : medicoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Nenhuma medição encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  medicoes.map((medicao) => (
                    <TableRow key={medicao.id}>
                      <TableCell className="font-medium">{medicao.numero_medicao}</TableCell>
                      <TableCell>{medicao.fornecedor}</TableCell>
                      <TableCell>{medicao.cca}</TableCell>
                      <TableCell>{medicao.periodo}</TableCell>
                      <TableCell>{medicao.itens?.length || 0}</TableCell>
                      <TableCell>R$ {Number(medicao.valor_total).toLocaleString('pt-BR')}</TableCell>
                      <TableCell>{getStatusBadge(medicao.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setMedicaoSelecionada(medicao.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Validar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Validação e Lançamento - {medicao.numero_medicao}</DialogTitle>
                              </DialogHeader>
                            
                            <div className="space-y-6">
                              {/* Botão Visualizar NF */}
                              {medicao.anexo_nf_url && (
                                <div className="flex justify-end">
                                  <Button 
                                    variant="outline"
                                    onClick={() => handleVisualizarNF(medicao.anexo_nf_url, medicao.anexo_nf_nome)}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Visualizar Nota Fiscal
                                  </Button>
                                </div>
                              )}

                              {/* Dados da Medição */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Dados do Transporte</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Fornecedor</label>
                                      <div className="p-2 bg-muted rounded">{medicao.fornecedor}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Cnpj</label>
                                      <div className="p-2 bg-muted rounded">{medicao.cnpj}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Obra/cca</label>
                                      <div className="p-2 bg-muted rounded">{medicao.cca}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Período</label>
                                      <div className="p-2 bg-muted rounded">{medicao.periodo}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Valor Total</label>
                                      <div className="p-2 bg-muted rounded font-bold">
                                        R$ {Number(medicao.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Total de Itens</label>
                                      <div className="p-2 bg-muted rounded">{medicao.itens?.length || 0} itens</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Lista de Itens/Trajetos */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Itens da Medição</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Qtde</TableHead>
                                        <TableHead>Valor Unit.</TableHead>
                                        <TableHead>Valor Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {medicao.itens && medicao.itens.length > 0 ? (
                                        medicao.itens.map((item: any, idx: number) => (
                                          <TableRow key={idx}>
                                            <TableCell>{item.descricao}</TableCell>
                                            <TableCell>{item.qtde}</TableCell>
                                            <TableCell>R$ {Number(item.valorUnit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                            <TableCell>R$ {Number(item.valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                          </TableRow>
                                        ))
                                      ) : (
                                        <TableRow>
                                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            Nenhum item cadastrado
                                          </TableCell>
                                        </TableRow>
                                      )}
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>

                              {/* Botões de Aprovação/Rejeição */}
                              {medicao.status === 'pendente' && (
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleRejeitarMedicao(medicao.id)}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Rejeitar Medição
                                  </Button>
                                  <Button
                                    onClick={() => handleAprovarMedicao(medicao.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Aprovar Medição
                                  </Button>
                                </div>
                              )}

                              {/* Formulário de Lançamento no Sienge */}
                              {medicao.status === 'aprovada' && (
                                <Card className="border-green-200 bg-green-50/50">
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                      <Send className="h-5 w-5" />
                                      Lançamento no Sienge
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label className="text-red-500">Favorecido *</Label>
                                          <Input
                                            placeholder="Nome do favorecido"
                                            value={dadosSienge.favorecido}
                                            onChange={(e) => setDadosSienge({...dadosSienge, favorecido: e.target.value})}
                                            className={!dadosSienge.favorecido ? 'border-red-300' : ''}
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label className="text-red-500">Banco *</Label>
                                          <Input
                                            placeholder="Ex: 001 - Banco do Brasil"
                                            value={dadosSienge.banco}
                                            onChange={(e) => setDadosSienge({...dadosSienge, banco: e.target.value})}
                                            className={!dadosSienge.banco ? 'border-red-300' : ''}
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label className="text-red-500">Agência *</Label>
                                          <Input
                                            placeholder="0000"
                                            value={dadosSienge.agencia}
                                            onChange={(e) => setDadosSienge({...dadosSienge, agencia: e.target.value})}
                                            className={!dadosSienge.agencia ? 'border-red-300' : ''}
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label className="text-red-500">Conta *</Label>
                                          <Input
                                            placeholder="00000-0"
                                            value={dadosSienge.conta}
                                            onChange={(e) => setDadosSienge({...dadosSienge, conta: e.target.value})}
                                            className={!dadosSienge.conta ? 'border-red-300' : ''}
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label>Operação</Label>
                                          <Input
                                            placeholder="Ex: 001"
                                            value={dadosSienge.operacao}
                                            onChange={(e) => setDadosSienge({...dadosSienge, operacao: e.target.value})}
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label>Forma de Pagamento</Label>
                                          <Select
                                            value={dadosSienge.formaPagamento}
                                            onValueChange={(v) => setDadosSienge({...dadosSienge, formaPagamento: v})}
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="TED">Ted</SelectItem>
                                              <SelectItem value="PIX">Pix</SelectItem>
                                              <SelectItem value="BOLETO">Boleto</SelectItem>
                                              <SelectItem value="DOC">Doc</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="space-y-2 col-span-2">
                                          <Label>Título Sienge</Label>
                                          <Input
                                            placeholder="Descrição do título"
                                            value={dadosSienge.titulo}
                                            onChange={(e) => setDadosSienge({...dadosSienge, titulo: e.target.value})}
                                          />
                                        </div>

                                        <div className="space-y-2 col-span-2">
                                          <Label>Histórico</Label>
                                          <Textarea
                                            placeholder="Histórico do lançamento"
                                            value={dadosSienge.historico}
                                            onChange={(e) => setDadosSienge({...dadosSienge, historico: e.target.value})}
                                            rows={3}
                                          />
                                        </div>
                                      </div>

                                      <div className="flex justify-end">
                                        <Button
                                          onClick={handleGerarLancamentoSienge}
                                          size="lg"
                                        >
                                          <Send className="h-4 w-4 mr-2" />
                                          Gerar Lançamento no Sienge
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Info de Lançamento Realizado */}
                              {medicao.status === 'lancado_sienge' && (
                                <Card className="border-blue-200 bg-blue-50/50">
                                  <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 text-blue-700">
                                      <CheckCircle className="h-5 w-5" />
                                      <span className="font-medium">
                                        Medição já lançada no Sienge - Título Nº {medicao.numero_titulo}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modal de PDF */}
      <PdfViewerModal
        open={pdfOpen}
        setOpen={setPdfOpen}
        data={pdfData}
        title={pdfTitle}
      />
    </div>
  );
}