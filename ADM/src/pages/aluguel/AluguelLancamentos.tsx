import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, CheckCircle, AlertCircle, DollarSign, Upload, FileText, Eye, Send, Paperclip, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ResumoCCRObra from '@/components/ResumoCCRObra';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usarGeradorPDFMedicaoAluguel } from '@/components/alojamento/GeradorPDFMedicaoAluguel';

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

export default function AluguelLancamentos() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { gerarEDownload } = usarGeradorPDFMedicaoAluguel();
  const [medicaoSelecionada, setMedicaoSelecionada] = useState<string>('');
  const [anexosModalOpen, setAnexosModalOpen] = useState(false);
  const [gerandoPDF, setGerandoPDF] = useState(false);
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

  // Buscar medições do banco de dados
  const { data: medicoesDb, isLoading } = useQuery({
    queryKey: ['medicoes_aluguel'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medicoes_aluguel')
        .select(`
          *,
          contratos_alojamento (
            codigo,
            proprietario,
            cpf_cnpj_proprietario
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Realtime updates
  React.useEffect(() => {
    const channel = supabase
      .channel('medicoes_aluguel_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'medicoes_aluguel' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['medicoes_aluguel'] });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Mapear medições do banco para formato usado no componente
  const medicoes = (medicoesDb || []).map(m => ({
    id: m.id,
    numeroMedicao: m.numero_medicao,
    contrato: m.contratos_alojamento?.codigo || '',
    obra: m.obra,
    fornecedor: m.contratos_alojamento?.proprietario || '',
    cpfCnpj: m.contratos_alojamento?.cpf_cnpj_proprietario || '',
    competencia: m.competencia,
    valor: Number(m.valor_total),
    colaboradores: Array.isArray(m.colaboradores) ? m.colaboradores.length : 0,
    status: m.status,
    dataEnvio: m.data_envio ? new Date(m.data_envio).toLocaleDateString('pt-BR') : '',
    validadorResponsavel: m.validador_responsavel || '',
    tituloSienge: m.titulo_sienge || '',
    numeroTitulo: m.numero_titulo || '',
    vencimento: m.vencimento || '',
    situacaoSienge: m.situacao_sienge || '',
    anexos: m.anexos || [],
    observacoes: m.observacoes || '',
    diasAluguel: m.dias_aluguel,
    dataInicio: m.data_inicio,
    dataFim: m.data_fim,
    empresa: m.empresa || ''
  }));

  const medicao = medicoes.find(m => m.id === medicaoSelecionada);

  const handleGerarLancamentoSienge = () => {
    // Validações obrigatórias
    if (!dadosSienge.favorecido || !dadosSienge.banco || !dadosSienge.agencia || !dadosSienge.conta) {
      toast({
        title: "Campos Obrigatórios",
        description: "Preencha todos os campos obrigatórios antes de gerar o lançamento",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Lançamento Gerado",
      description: "Título criado no Sienge com sucesso - Nº TIT-2025-003",
    });

    // Simular retorno do Sienge
    setTimeout(() => {
      toast({
        title: "Integração Sienge",
        description: "Título: TIT-2025-003 | Vencimento: 02/02/2025 | Status: Ativo"
      });
    }, 2000);
  };

  const handleGerarPDFMedicao = async () => {
    if (!medicao) return;
    
    setGerandoPDF(true);
    try {
      const medicaoCompleta = medicoesDb?.find(m => m.id === medicao.id);
      const colaboradores = Array.isArray(medicaoCompleta?.colaboradores) 
        ? medicaoCompleta.colaboradores 
        : [];
      
      await gerarEDownload({
        id: medicao.id,
        numeroMedicao: medicao.numeroMedicao,
        contrato: medicao.contrato,
        obra: medicao.obra,
        fornecedor: medicao.fornecedor,
        cpfCnpj: medicao.cpfCnpj,
        competencia: medicao.competencia,
        valor: medicao.valor,
        diasAluguel: medicao.diasAluguel,
        dataInicio: medicao.dataInicio,
        dataFim: medicao.dataFim,
        empresa: medicao.empresa,
        colaboradores: colaboradores,
        observacoes: medicao.observacoes
      });
    } finally {
      setGerandoPDF(false);
    }
  };

  const gerarEAnexarPDF = async (medicaoId: string) => {
    const medicaoData = medicoes.find(m => m.id === medicaoId);
    if (!medicaoData) return null;

    try {
      const medicaoCompleta = medicoesDb?.find(m => m.id === medicaoId);
      const colaboradores = Array.isArray(medicaoCompleta?.colaboradores) 
        ? medicaoCompleta.colaboradores 
        : [];

      // Importar a função de geração
      const { gerarPDFMedicaoAluguel } = await import('@/components/alojamento/GeradorPDFMedicaoAluguel');
      
      const pdfBlob = await gerarPDFMedicaoAluguel({
        id: medicaoData.id,
        numeroMedicao: medicaoData.numeroMedicao,
        contrato: medicaoData.contrato,
        obra: medicaoData.obra,
        fornecedor: medicaoData.fornecedor,
        cpfCnpj: medicaoData.cpfCnpj,
        competencia: medicaoData.competencia,
        valor: medicaoData.valor,
        diasAluguel: medicaoData.diasAluguel,
        dataInicio: medicaoData.dataInicio,
        dataFim: medicaoData.dataFim,
        empresa: medicaoData.empresa,
        colaboradores: colaboradores,
        observacoes: medicaoData.observacoes
      });

      // Upload para Supabase Storage
      const fileName = `medicao_${medicaoData.numeroMedicao}_${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hospedagem-anexos')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('hospedagem-anexos')
        .getPublicUrl(fileName);

      // Atualizar medição com o PDF anexado
      const anexosAtuais = Array.isArray(medicaoCompleta?.anexos) ? medicaoCompleta.anexos : [];
      const novosAnexos = [
        ...anexosAtuais,
        {
          nome: `Espelho_Medicao_${medicaoData.numeroMedicao}.pdf`,
          url: publicUrl,
          tipo: 'application/pdf',
          tamanho: pdfBlob.size,
          data_upload: new Date().toISOString()
        }
      ];

      await supabase
        .from('medicoes_aluguel')
        .update({ anexos: novosAnexos })
        .eq('id', medicaoId);

      queryClient.invalidateQueries({ queryKey: ['medicoes_aluguel'] });

      return publicUrl;
    } catch (error: any) {
      console.error('Erro ao gerar e anexar PDF:', error);
      toast({
        title: "Erro ao anexar PDF",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }
  };

  const extractStoragePathFromUrl = (url: string): string | null => {
    const marker = '/object/public/hospedagem-anexos/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return url.substring(idx + marker.length);
  };

  const limparEspelhosAntigos = async (medicaoId: string) => {
    try {
      const medicaoCompleta = medicoesDb?.find(m => m.id === medicaoId);
      const anexos = Array.isArray(medicaoCompleta?.anexos) ? medicaoCompleta!.anexos : [];
      const toRemove = anexos.filter((a: any) => a?.nome?.includes('Espelho_Medicao') || a?.url?.includes('/medicao_'));

      if (toRemove.length > 0) {
        const paths = toRemove
          .map((a: any) => extractStoragePathFromUrl(a.url))
          .filter((p): p is string => !!p);

        if (paths.length > 0) {
          await supabase.storage.from('hospedagem-anexos').remove(paths);
        }

        const restantes = anexos.filter((a: any) => !toRemove.includes(a));
        await supabase
          .from('medicoes_aluguel')
          .update({ anexos: restantes })
          .eq('id', medicaoId);

        await queryClient.invalidateQueries({ queryKey: ['medicoes_aluguel'] });
      }
    } catch (e) {
      console.error('Erro ao limpar PDFs anteriores:', e);
    }
  };

  const handleAbrirValidacao = async (medicaoId: string) => {
    setMedicaoSelecionada(medicaoId);
    setGerandoPDF(true);
    
    toast({
      title: "Gerando PDF",
      description: "Preparando espelho da medição...",
    });

    await limparEspelhosAntigos(medicaoId);
    await gerarEAnexarPDF(medicaoId);
    setGerandoPDF(false);
  };

  const handleAprovarMedicao = (medicaoId: string) => {
    toast({
      title: "Medição Aprovada",
      description: "Medição aprovada e liberada para lançamento no Sienge"
    });
  };

  const handleRejeitarMedicao = (medicaoId: string) => {
    toast({
      title: "Medição Rejeitada",
      description: "Medição rejeitada e retornada para a obra",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aluguel - Gestão Matricial</h1>
          <p className="text-muted-foreground">Lançamentos Sienge e Resumo CCR da Obra</p>
        </div>

        <Tabs defaultValue="lancamentos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lancamentos">Lançamentos – Integração Sienge</TabsTrigger>
            <TabsTrigger value="resumo-ccr">Resumo CCR da Obra</TabsTrigger>
          </TabsList>

          <TabsContent value="lancamentos" className="space-y-6">

        {/* Lista de Medições */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Medições para Validação e Lançamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Obra</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Carregando medições...
                    </TableCell>
                  </TableRow>
                ) : medicoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhuma medição disponível
                    </TableCell>
                  </TableRow>
                ) : (
                  medicoes.map((medicao) => (
                    <TableRow key={medicao.id}>
                      <TableCell className="font-medium">{medicao.numeroMedicao}</TableCell>
                      <TableCell>{medicao.contrato}</TableCell>
                      <TableCell>{medicao.obra}</TableCell>
                      <TableCell>{medicao.fornecedor}</TableCell>
                      <TableCell>{medicao.competencia}</TableCell>
                      <TableCell>R$ {medicao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{getStatusBadge(medicao.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setMedicaoSelecionada(medicao.id);
                              setAnexosModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Visualizar Medições
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleAbrirValidacao(medicao.id)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Validar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Validação e Lançamento - {medicao?.numeroMedicao}</DialogTitle>
                                <DialogDescription>
                                  Valide os dados da medição e gere o lançamento no Sienge
                                </DialogDescription>
                              </DialogHeader>
                            
                            <div className="space-y-6">
                              {/* Dados da Medição */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Dados da Medição</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Contrato</label>
                                      <div className="p-2 bg-muted rounded">{medicao.contrato}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Obra/CCA</label>
                                      <div className="p-2 bg-muted rounded">{medicao.obra}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Fornecedor</label>
                                      <div className="p-2 bg-muted rounded">{medicao.fornecedor}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
                                      <div className="p-2 bg-muted rounded">{medicao.cpfCnpj}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Competência</label>
                                      <div className="p-2 bg-muted rounded">{medicao.competencia}</div>
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Colaboradores</label>
                                      <div className="p-2 bg-muted rounded">{medicao.colaboradores} colaboradores</div>
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
                                        value={dadosSienge.favorecido || medicao.fornecedor}
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
                                        value={dadosSienge.titulo || `${medicao.competencia} - ALUGUEL ALOJAMENTO`}
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
                                        placeholder="3.1.1.01.001"
                                        value={dadosSienge.contaContabil}
                                        onChange={(e) => setDadosSienge({...dadosSienge, contaContabil: e.target.value})}
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Valor</label>
                                      <Input
                                        value={`R$ ${medicao.valor.toLocaleString('pt-BR')}`}
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
                                      placeholder="Histórico padrão do lançamento..."
                                      value={dadosSienge.historico}
                                      onChange={(e) => setDadosSienge({...dadosSienge, historico: e.target.value})}
                                    />
                                  </div>
                                </CardContent>
                              </Card>

                              {/* PDF da Medição Anexado */}
                              {gerandoPDF ? (
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg">Espelho da Medição</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex items-center justify-center p-4">
                                      <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                        <p className="text-sm text-muted-foreground">Gerando PDF...</p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ) : (
                                (() => {
                                  const medicaoCompleta = medicoesDb?.find(m => m.id === medicao?.id);
                                  const anexosEspelho = Array.isArray(medicaoCompleta?.anexos)
                                    ? medicaoCompleta.anexos.filter((anexo: any) => anexo.nome?.includes('Espelho_Medicao'))
                                    : [];

                                  const primeiroAnexo = anexosEspelho[0] as any;

                                  return primeiroAnexo ? (
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-lg">Espelho da Medição</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                                          <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-green-600" />
                                            <span className="font-medium text-sm">{primeiroAnexo.nome}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Badge variant="default">Anexado</Badge>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                console.log('URL do anexo:', primeiroAnexo.url);
                                                const link = document.createElement('a');
                                                link.href = primeiroAnexo.url;
                                                link.target = '_blank';
                                                link.rel = 'noopener noreferrer';
                                                link.download = primeiroAnexo.nome;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                              }}
                                            >
                                              <Eye className="h-4 w-4 mr-1" />
                                              Visualizar PDF
                                            </Button>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ) : null;
                                })()
                              )}

                              {/* Histórico */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Histórico</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Textarea
                                    placeholder="Histórico padrão do lançamento..."
                                    value={dadosSienge.historico}
                                    onChange={(e) => setDadosSienge({...dadosSienge, historico: e.target.value})}
                                    rows={3}
                                  />
                                </CardContent>
                              </Card>

                              {/* Ações */}
                              <div className="flex justify-end space-x-4">
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleRejeitarMedicao(medicao.id)}
                                >
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  Rejeitar
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleAprovarMedicao(medicao.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Aprovar
                                </Button>
                                <Button 
                                  onClick={handleGerarLancamentoSienge}
                                  disabled={gerandoPDF}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Gerar Lançamento no Sienge
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

        {/* Status dos Lançamentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Status dos Lançamentos no Sienge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">TIT-2025-001 - CCA 25052</div>
                  <div className="text-sm text-muted-foreground">Maria Silva Santos - Jan/2025</div>
                </div>
                <div className="text-right">
                  <Badge variant="default">Ativo</Badge>
                  <div className="text-sm text-muted-foreground mt-1">Venc: 02/02/2025</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">TIT-2025-002 - CCA 25051</div>
                  <div className="text-sm text-muted-foreground">Ricardo Queiroga - Dez/2024</div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Liquidado</Badge>
                  <div className="text-sm text-muted-foreground mt-1">Pago em: 15/01/2025</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="resumo-ccr">
            <ResumoCCRObra />
          </TabsContent>
        </Tabs>

        {/* Modal de Visualização de Medição */}
        <Dialog open={anexosModalOpen} onOpenChange={setAnexosModalOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Medição - {medicao?.numeroMedicao}</DialogTitle>
              <DialogDescription>Informações completas da medição de aluguel</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Card 1: Informações Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Contrato</label>
                      <div className="p-2 bg-muted rounded font-medium">{medicao?.contrato}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Fornecedor</label>
                      <div className="p-2 bg-muted rounded font-medium">{medicao?.fornecedor}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Obra/CCA</label>
                      <div className="p-2 bg-muted rounded font-medium">{medicao?.obra}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Competência</label>
                      <div className="p-2 bg-muted rounded font-medium">{medicao?.competencia}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Empresa</label>
                      <div className="p-2 bg-muted rounded font-medium">{medicao?.empresa || 'Não informado'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">CPF/CNPJ</label>
                      <div className="p-2 bg-muted rounded font-medium">{medicao?.cpfCnpj}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Período e Valores */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Período e Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Data Início</label>
                      <div className="p-2 bg-muted rounded font-medium">
                        {medicao?.dataInicio ? new Date(medicao.dataInicio).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Data Fim</label>
                      <div className="p-2 bg-muted rounded font-medium">
                        {medicao?.dataFim ? new Date(medicao.dataFim).toLocaleDateString('pt-BR') : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Dias de Aluguel</label>
                      <div className="p-2 bg-muted rounded font-medium">{medicao?.diasAluguel || 0} dias</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Valor Diária</label>
                      <div className="p-2 bg-muted rounded font-medium">
                        R$ {((medicao?.valor || 0) / (medicao?.diasAluguel || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Valor Total</label>
                      <div className="p-2 bg-primary/10 rounded font-bold text-lg text-primary">
                        R$ {(medicao?.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Colaboradores Alocados */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Colaboradores Alocados</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const medicaoCompleta = medicoesDb?.find(m => m.id === medicao?.id);
                    const colaboradores = Array.isArray(medicaoCompleta?.colaboradores) ? medicaoCompleta.colaboradores : [];
                    
                    return colaboradores.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Empresa</TableHead>
                            <TableHead>Período</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {colaboradores.map((colab: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{colab.nome || 'N/A'}</TableCell>
                              <TableCell>{colab.funcao || 'N/A'}</TableCell>
                              <TableCell>{colab.empresa || 'N/A'}</TableCell>
                              <TableCell>
                                {colab.dataInicio && colab.dataFim 
                                  ? `${new Date(colab.dataInicio).toLocaleDateString('pt-BR')} - ${new Date(colab.dataFim).toLocaleDateString('pt-BR')}`
                                  : 'N/A'
                                }
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum colaborador alocado
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Card 4: Observações */}
              {medicao?.observacoes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-muted rounded whitespace-pre-wrap">
                      {medicao.observacoes}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleGerarPDFMedicao} disabled={gerandoPDF}>
                <Download className="h-4 w-4 mr-2" />
                {gerandoPDF ? 'Gerando PDF...' : 'Gerar PDF'}
              </Button>
              <Button variant="outline" onClick={() => setAnexosModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}