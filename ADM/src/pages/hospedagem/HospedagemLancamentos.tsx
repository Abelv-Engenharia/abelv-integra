import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, CheckCircle, AlertCircle, DollarSign, FileText, Eye, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PdfViewerModal from '@/components/pdf/PdfViewerModal';

interface MedicaoHospedagem {
  id: string;
  numero_medicao: string;
  fornecedor_nome: string;
  fornecedor_cpf_cnpj: string;
  obra: string;
  competencia: string;
  valor_total: number;
  colaboradores: any[];
  dias_hospedagem: number;
  valor_diaria: number;
  status: string;
  data_envio: string | null;
  titulo_sienge: string | null;
  numero_titulo: string | null;
  vencimento: string | null;
  situacao_sienge: string | null;
  anexos: {name: string, url: string, path: string}[];
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    recebida_obra: { variant: 'secondary' as const, text: 'Recebida da Obra' },
    em_validacao: { variant: 'outline' as const, text: 'Em Validação' },
    aprovada: { variant: 'default' as const, text: 'Aprovada' },
    lancado_sienge: { variant: 'outline' as const, text: 'Lançado no Sienge' },
    liquidada: { variant: 'default' as const, text: 'Liquidada' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.recebida_obra;
  
  return (
    <Badge variant={config.variant}>
      {config.text}
    </Badge>
  );
};

export default function HospedagemLancamentos() {
  const { toast } = useToast();
  const [medicoes, setMedicoes] = useState<MedicaoHospedagem[]>([]);
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
      .channel('medicoes-hospedagem-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'medicoes_hospedagem'
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
        .from('medicoes_hospedagem')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Converter dados do Supabase para o formato esperado
      const medicoesFormatadas: MedicaoHospedagem[] = (data || []).map(m => ({
        id: m.id,
        numero_medicao: m.numero_medicao,
        fornecedor_nome: m.fornecedor_nome,
        fornecedor_cpf_cnpj: m.fornecedor_cpf_cnpj,
        obra: m.obra,
        competencia: m.competencia,
        valor_total: Number(m.valor_total),
        colaboradores: (m.colaboradores as any) || [],
        dias_hospedagem: m.dias_hospedagem,
        valor_diaria: Number(m.valor_diaria),
        status: m.status,
        data_envio: m.data_envio,
        titulo_sienge: m.titulo_sienge,
        numero_titulo: m.numero_titulo,
        vencimento: m.vencimento,
        situacao_sienge: m.situacao_sienge,
        anexos: (m.anexos as any) || []
      }));

      setMedicoes(medicoesFormatadas);
    } catch (error) {
      console.error('Erro ao carregar medições:', error);
      toast({
        title: "Erro ao Carregar",
        description: "Não foi possível carregar as medições",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGerarLancamentoSienge = async () => {
    // Validações obrigatórias
    if (!dadosSienge.favorecido || !dadosSienge.banco || !dadosSienge.agencia || !dadosSienge.conta) {
      toast({
        title: "Campos Obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de gerar o lançamento",
        variant: "destructive"
      });
      return;
    }

    if (!medicaoSelecionada) return;

    try {
      const numeroTitulo = `TIT-2025-${Date.now().toString().slice(-3)}`;
      const vencimento = new Date();
      vencimento.setDate(vencimento.getDate() + 15);

      const { error } = await supabase
        .from('medicoes_hospedagem')
        .update({
          titulo_sienge: dadosSienge.titulo,
          numero_titulo: numeroTitulo,
          vencimento: vencimento.toISOString().split('T')[0],
          situacao_sienge: 'lancado',
          dados_sienge: dadosSienge,
          status: 'lancado_sienge'
        })
        .eq('id', medicaoSelecionada);

      if (error) throw error;

      toast({
        title: "Lançamento Gerado",
        description: `Título de hospedagem criado no Sienge - Nº ${numeroTitulo}`,
      });

      carregarMedicoes();
    } catch (error) {
      console.error('Erro ao gerar lançamento:', error);
      toast({
        title: "Erro ao Gerar Lançamento",
        description: "Não foi possível gerar o lançamento no Sienge",
        variant: "destructive"
      });
    }
  };

  const handleAprovarMedicao = async (medicaoId: string) => {
    try {
      const { error } = await supabase
        .from('medicoes_hospedagem')
        .update({ status: 'aprovada' })
        .eq('id', medicaoId);

      if (error) throw error;

      toast({
        title: "Medição Aprovada",
        description: "Medição de hospedagem aprovada e liberada para lançamento no Sienge"
      });

      carregarMedicoes();
    } catch (error) {
      console.error('Erro ao aprovar medição:', error);
      toast({
        title: "Erro ao Aprovar",
        description: "Não foi possível aprovar a medição",
        variant: "destructive"
      });
    }
  };

  const handleRejeitarMedicao = async (medicaoId: string) => {
    try {
      const { error } = await supabase
        .from('medicoes_hospedagem')
        .update({ status: 'rejeitada' })
        .eq('id', medicaoId);

      if (error) throw error;

      toast({
        title: "Medição Rejeitada", 
        description: "Medição de hospedagem rejeitada e retornada para a obra",
        variant: "destructive"
      });

      carregarMedicoes();
    } catch (error) {
      console.error('Erro ao rejeitar medição:', error);
      toast({
        title: "Erro ao Rejeitar",
        description: "Não foi possível rejeitar a medição",
        variant: "destructive"
      });
    }
  };

  const handleVisualizarNF = async (anexos: any[]) => {
    if (!anexos || anexos.length === 0) {
      toast({
        title: "Nenhum Anexo",
        description: "Não há nota fiscal anexada nesta medição",
        variant: "destructive"
      });
      return;
    }

    const primeiro = anexos[0];
    try {
      let blob: Blob;
      if (primeiro.path) {
        const { data, error } = await supabase.storage
          .from('hospedagem-anexos')
          .download(primeiro.path);
        if (error) throw error;
        blob = data as Blob;
      } else if (primeiro.url) {
        const resp = await fetch(primeiro.url);
        blob = await resp.blob();
      } else {
        throw new Error('URL do anexo inválida');
      }

      const ab = await blob.arrayBuffer();
      setPdfData(new Uint8Array(ab));
      setPdfTitle(primeiro.name || 'Nota Fiscal');
      setPdfOpen(true);
    } catch (e) {
      console.error('Falha ao abrir anexo', e);
      toast({
        title: 'Erro ao abrir anexo',
        description: 'Tente baixar o arquivo ou anexar novamente.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospedagem - Lançamentos Sienge</h1>
          <p className="text-muted-foreground">Gestão matricial de hospedagem e integração com Sienge</p>
        </div>

        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Medições Pendentes</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {medicoes.filter(m => m.status === 'recebida_obra').length}
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
                  <p className="text-sm text-muted-foreground">Total Colaboradores</p>
                  <p className="text-2xl font-bold">
                    {medicoes.reduce((sum, m) => sum + (m.colaboradores?.length || 0), 0)}
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
              Medições de Hospedagem para Validação e Lançamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Obra</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Colaboradores</TableHead>
                  <TableHead>Dias</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Carregando medições...
                    </TableCell>
                  </TableRow>
                ) : medicoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      Nenhuma medição encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  medicoes.map((medicao) => (
                    <TableRow key={medicao.id}>
                      <TableCell className="font-medium">{medicao.numero_medicao}</TableCell>
                      <TableCell>{medicao.fornecedor_nome}</TableCell>
                      <TableCell>{medicao.obra}</TableCell>
                      <TableCell>{medicao.competencia}</TableCell>
                      <TableCell>{medicao.colaboradores?.length || 0}</TableCell>
                      <TableCell>{medicao.dias_hospedagem} dias</TableCell>
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
                              {medicao.anexos && medicao.anexos.length > 0 && (
                                <div className="flex justify-end">
                                  <Button 
                                    variant="outline"
                                    onClick={() => handleVisualizarNF(medicao.anexos)}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Visualizar Nota Fiscal
                                  </Button>
                                </div>
                              )}

                              {/* Dados da Medição */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Dados da Hospedagem</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Fornecedor</label>
                                      <div className="p-2 bg-muted rounded">{medicao.fornecedor_nome}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
                                      <div className="p-2 bg-muted rounded">{medicao.fornecedor_cpf_cnpj}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Obra/CCA</label>
                                      <div className="p-2 bg-muted rounded">{medicao.obra}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Competência</label>
                                      <div className="p-2 bg-muted rounded">{medicao.competencia}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Valor da Diária</label>
                                      <div className="p-2 bg-muted rounded">R$ {Number(medicao.valor_diaria).toLocaleString('pt-BR')}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Dias × Colaboradores</label>
                                      <div className="p-2 bg-muted rounded">{medicao.dias_hospedagem} dias × {medicao.colaboradores?.length || 0} colaboradores</div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Integração Sienge */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Dados para Sienge</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Favorecido <span className="text-red-500">*</span></label>
                                      <Input
                                        value={dadosSienge.favorecido || medicao.fornecedor_nome}
                                        onChange={(e) => setDadosSienge({...dadosSienge, favorecido: e.target.value})}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Forma de Pagamento <span className="text-red-500">*</span></label>
                                      <Select 
                                        value={dadosSienge.formaPagamento} 
                                        onValueChange={(value) => setDadosSienge({...dadosSienge, formaPagamento: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="TED">TED</SelectItem>
                                          <SelectItem value="PIX">PIX</SelectItem>
                                          <SelectItem value="BOLETO">Boleto</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Banco <span className="text-red-500">*</span></label>
                                      <Select 
                                        value={dadosSienge.banco} 
                                        onValueChange={(value) => setDadosSienge({...dadosSienge, banco: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o banco" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="001">001 - Banco do Brasil</SelectItem>
                                          <SelectItem value="104">104 - Caixa Econômica</SelectItem>
                                          <SelectItem value="237">237 - Bradesco</SelectItem>
                                          <SelectItem value="341">341 - Itaú</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Agência <span className="text-red-500">*</span></label>
                                      <Input
                                        placeholder="0000"
                                        value={dadosSienge.agencia}
                                        onChange={(e) => setDadosSienge({...dadosSienge, agencia: e.target.value})}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Conta <span className="text-red-500">*</span></label>
                                      <Input
                                        placeholder="00000-0"
                                        value={dadosSienge.conta}
                                        onChange={(e) => setDadosSienge({...dadosSienge, conta: e.target.value})}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Operação</label>
                                      <Input
                                        placeholder="013"
                                        value={dadosSienge.operacao}
                                        onChange={(e) => setDadosSienge({...dadosSienge, operacao: e.target.value})}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Título/Competência</label>
                                      <Input
                                        value={dadosSienge.titulo || `${medicao.competencia} - HOSPEDAGEM COLABORADORES`}
                                        onChange={(e) => setDadosSienge({...dadosSienge, titulo: e.target.value})}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">CCA</label>
                                      <Input
                                        value={dadosSienge.cca || medicao.obra}
                                        onChange={(e) => setDadosSienge({...dadosSienge, cca: e.target.value})}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Conta Contábil</label>
                                      <Input
                                        placeholder="3.1.1.02.001"
                                        value={dadosSienge.contaContabil}
                                        onChange={(e) => setDadosSienge({...dadosSienge, contaContabil: e.target.value})}
                                      />
                                    </div>

                                     <div>
                                       <label className="block text-sm font-medium mb-2">Valor</label>
                                       <Input
                                         value={`R$ ${Number(medicao.valor_total).toLocaleString('pt-BR')}`}
                                         disabled
                                         className="bg-muted"
                                       />
                                     </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Vencimento</label>
                                      <Input
                                        type="date"
                                        value={dadosSienge.vencimento}
                                        onChange={(e) => setDadosSienge({...dadosSienge, vencimento: e.target.value})}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Data de Emissão</label>
                                      <Input
                                        type="date"
                                        value={dadosSienge.dataEmissao}
                                        onChange={(e) => setDadosSienge({...dadosSienge, dataEmissao: e.target.value})}
                                      />
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <label className="block text-sm font-medium mb-2">Histórico</label>
                                    <Textarea
                                      placeholder="Histórico padrão do lançamento de hospedagem..."
                                      value={dadosSienge.historico}
                                      onChange={(e) => setDadosSienge({...dadosSienge, historico: e.target.value})}
                                    />
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Ações */}
                              <div className="flex justify-between">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    onClick={() => handleRejeitarMedicao(medicao.id)}
                                  >
                                    Rejeitar
                                  </Button>
                                  <Button 
                                    variant="default" 
                                    onClick={() => handleAprovarMedicao(medicao.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Aprovar Medição
                                  </Button>
                                </div>
                                
                                <Button onClick={handleGerarLancamentoSienge}>
                                  <Send className="h-4 w-4 mr-2" />
                                  Gerar Lançamento Sienge
                                </Button>
                              </div>
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

        {/* Visualizador de PDF */}
        <PdfViewerModal 
          open={pdfOpen} 
          setOpen={setPdfOpen} 
          data={pdfData} 
          title={`Visualizar Anexo - ${pdfTitle}`} 
        />
      </div>
    </div>
  );
}