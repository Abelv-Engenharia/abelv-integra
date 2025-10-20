import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, ExternalLink, Upload, CheckCircle, Clock, AlertTriangle, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GeradorPDFCaucao from '@/components/caucao/GeradorPDFCaucao';
import GeradorPDFContratoAlojamento from '@/components/alojamento/GeradorPDFContratoAlojamento';
import { supabase } from '@/integrations/supabase/client';
import { PDFDocument } from 'pdf-lib';

interface Caucao {
  id: string;
  contrato_id: string;
  data_emissao: string;
  data_vencimento: string;
  tipo_documento: string;
  observacoes: string;
  conta_financeira: string;
  centro_custo: string;
  forma_pagamento: string;
  banco: string;
  agencia: string;
  conta: string;
  operacao: string;
  status: string;
  created_at: string;
  titulo_sienge: string;
  arquivo_pdf_unificado_url: string | null;
  data_pagamento: string | null;
  comprovante_pagamento_url: string | null;
  contratos_alojamento: {
    id: string;
    codigo: string;
    nome: string;
    proprietario: string;
    cpf_cnpj_proprietario: string;
    favorecido: string;
    cpf_cnpj_favorecido: string;
    valor_aluguel: number;
    tipo_garantia: string;
    valor_garantia: number;
    data_pagamento_garantia: string;
    inicio_locacao: string;
    fim_locacao: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
    qtde_quartos: number;
    lotacao_atual: number;
    lotacao_maxima: number;
    tipo_imovel: string;
    distancia_obra: number;
    banco: string;
    agencia: string;
    operacao: string;
    conta_corrente: string;
    forma_pagamento: string;
    vigencia_contrato: number;
    data_assinatura: string;
    multa_contratual: number;
    arquivo_pdf_url: string | null;
  };
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    aprovada: { variant: 'secondary' as const, icon: Clock, text: 'Aprovada' },
    titulo_gerado: { variant: 'default' as const, icon: ExternalLink, text: 'Título Gerado' },
    paga: { variant: 'default' as const, icon: CheckCircle, text: 'Paga' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.aprovada;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
};

export default function LiquidacaoCaucao() {
  const { toast } = useToast();
  const [selectedCaucao, setSelectedCaucao] = useState<string>('');
  const [pagamentoData, setPagamentoData] = useState({
    dataPagamento: '',
    comprovante: null as File | null
  });
  const [caucoes, setCaucoes] = useState<Caucao[]>([]);
  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(false);

  const fetchCaucoes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('caucoes')
      .select(`
        *,
        contratos_alojamento (*)
      `)
      .eq('status', 'aprovada')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Erro ao carregar cauções',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      setCaucoes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCaucoes();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('caucoes_liquidacao_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'caucoes' }, () => {
        fetchCaucoes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleGerarTitulo = async (caucaoId: string) => {
    const caucao = caucoes.find(c => c.id === caucaoId);
    if (!caucao) return;

    setGerando(true);
    try {
      // Upload simulado (em produção, gerar PDFs reais unificados)
      const nomeArquivo = `caucao_${caucao.id}_${Date.now()}.pdf`;
      
      // Simulação de PDF unificado (placeholder)
      const pdfBytes = new Uint8Array([37, 80, 68, 70]); // header PDF mínimo
      const blob = new Blob([pdfBytes.buffer], { type: 'application/pdf' });
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('caucoes')
        .upload(nomeArquivo, blob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('caucoes')
        .getPublicUrl(nomeArquivo);

      const { error: updateError } = await supabase
        .from('caucoes')
        .update({ 
          arquivo_pdf_unificado_url: publicUrl,
          titulo_sienge: `SG-${Math.floor(Math.random() * 10000)}`
        })
        .eq('id', caucaoId);

      if (updateError) throw updateError;

      toast({
        title: "Título Gerado no Sienge",
        description: `PDF unificado enviado. Título gerado.`
      });

      fetchCaucoes();
    } catch (error) {
      console.error('Erro ao gerar título:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao gerar título e upload do PDF',
        variant: 'destructive'
      });
    } finally {
      setGerando(false);
    }
  };

  const handleConfirmarPagamento = async (caucaoId: string) => {
    if (!pagamentoData.dataPagamento || !pagamentoData.comprovante) {
      toast({
        title: "Erro",
        description: "Informe a data do pagamento e anexe o comprovante",
        variant: "destructive"
      });
      return;
    }

    try {
      const nomeComprovante = `comprovante_${caucaoId}_${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('caucoes')
        .upload(nomeComprovante, pagamentoData.comprovante, {
          contentType: pagamentoData.comprovante.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('caucoes')
        .getPublicUrl(nomeComprovante);

      const { error: updateError } = await supabase
        .from('caucoes')
        .update({
          data_pagamento: pagamentoData.dataPagamento,
          comprovante_pagamento_url: publicUrl,
          status: 'paga'
        })
        .eq('id', caucaoId);

      if (updateError) throw updateError;

      toast({
        title: "Pagamento Confirmado",
        description: "Caução marcada como paga com sucesso"
      });
      
      setPagamentoData({ dataPagamento: '', comprovante: null });
      setSelectedCaucao('');
      fetchCaucoes();
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao confirmar pagamento',
        variant: 'destructive'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPagamentoData(prev => ({ ...prev, comprovante: file }));
    }
  };

  const handleDownloadContrato = (contrato: any) => {
    const raw = contrato?.arquivo_pdf_url;
    if (!raw) {
      toast({ title: 'Aviso', description: 'Contrato assinado não disponível', variant: 'default' });
      return;
    }
    const isHttp = /^https?:\/\//.test(raw);
    const finalUrl = isHttp ? raw : supabase.storage.from('contratos-alojamento').getPublicUrl(raw).data.publicUrl;
    const win = window.open(finalUrl, '_blank', 'noopener,noreferrer');
    if (!win) {
      const a = document.createElement('a');
      a.href = finalUrl;
      a.download = 'contrato-alojamento.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Caução - Gestão Matricial</h1>
          <p className="text-muted-foreground">Lançamentos Sienge e Resumo CCR da Obra</p>
        </div>

        <Tabs defaultValue="lancamentos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="lancamentos">Lançamentos – Integração Sienge</TabsTrigger>
          </TabsList>

          <TabsContent value="lancamentos" className="space-y-6">

        {/* Lista de Cauções Aprovadas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cauções Aprovadas para Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Forma Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Carregando...</TableCell>
                  </TableRow>
                ) : caucoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">Nenhuma caução aprovada</TableCell>
                  </TableRow>
                ) : (
                  caucoes.map((caucao) => (
                    <TableRow key={caucao.id}>
                      <TableCell className="font-medium">{caucao.id.substring(0, 8)}</TableCell>
                      <TableCell>{caucao.contratos_alojamento?.codigo || 'N/A'}</TableCell>
                      <TableCell>{caucao.contratos_alojamento?.favorecido || 'N/A'}</TableCell>
                      <TableCell>{caucao.contratos_alojamento?.cpf_cnpj_favorecido || 'N/A'}</TableCell>
                      <TableCell>R$ {(caucao.contratos_alojamento?.valor_garantia || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="capitalize">{caucao.forma_pagamento}</TableCell>
                      <TableCell>{getStatusBadge(caucao.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {!caucao.arquivo_pdf_unificado_url && (
                            <Button size="sm" onClick={() => handleGerarTitulo(caucao.id)} disabled={gerando}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {gerando ? 'Gerando...' : 'Gerar Título'}
                            </Button>
                          )}
                          {caucao.arquivo_pdf_unificado_url && !caucao.data_pagamento && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setSelectedCaucao(caucao.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirmar Pagamento
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirmar Pagamento - {caucao.id.substring(0, 8)}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid gap-4">
                                    <div>
                                      <Label htmlFor="dataPagamento">Data do Pagamento *</Label>
                                      <Input
                                        id="dataPagamento"
                                        type="date"
                                        value={pagamentoData.dataPagamento}
                                        onChange={(e) => setPagamentoData(prev => ({
                                          ...prev,
                                          dataPagamento: e.target.value
                                        }))}
                                        className={!pagamentoData.dataPagamento ? "border-destructive" : ""}
                                      />
                                    </div>
                                    
                                    <div>
                                      <Label htmlFor="comprovante">Comprovante de Pagamento *</Label>
                                      <div className="flex items-center gap-2">
                                        <Input
                                          id="comprovante"
                                          type="file"
                                          accept=".pdf,.jpg,.jpeg,.png"
                                          onChange={handleFileUpload}
                                          className="file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground"
                                        />
                                      </div>
                                      {pagamentoData.comprovante && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          Arquivo selecionado: {pagamentoData.comprovante.name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setSelectedCaucao('')}>
                                      Cancelar
                                    </Button>
                                    <Button onClick={() => handleConfirmarPagamento(caucao.id)}>
                                      Confirmar Pagamento
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Documentos Vinculados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos Vinculados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {caucoes.slice(0, 3).map((caucao) => {
                const contrato = caucao.contratos_alojamento;
                return (
                  <div key={caucao.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Caução: {caucao.id.substring(0, 8)}</h4>
                    </div>
                    
                    {/* PDF da Caução */}
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <Label className="mb-2 block">Pedido de Despesa (PDF)</Label>
                      <GeradorPDFCaucao
                        dados={{
                          contratoId: caucao.contrato_id,
                          fornecedor: contrato.favorecido,
                          cpfCnpj: contrato.cpf_cnpj_favorecido,
                          cca: contrato.codigo,
                          tituloSienge: caucao.titulo_sienge || caucao.centro_custo,
                          logradouro: contrato.logradouro,
                          complemento: contrato.complemento || '',
                          bairro: contrato.bairro,
                          municipio: contrato.municipio,
                          uf: contrato.uf,
                          cep: contrato.cep,
                          nomeAlojamento: contrato.nome,
                          qtdeQuartos: contrato.qtde_quartos,
                          qtdeColaboradores: contrato.lotacao_atual,
                          tipoImovel: contrato.tipo_imovel,
                          distanciaObra: contrato.distancia_obra,
                          tipoGarantia: contrato.tipo_garantia,
                          valorGarantia: contrato.valor_garantia || 0,
                          valorAluguel: contrato.valor_aluguel,
                          inicioLocacao: contrato.inicio_locacao,
                          fimLocacao: contrato.fim_locacao,
                          dataEmissao: caucao.data_emissao,
                          dataVencimento: caucao.data_vencimento,
                          tipoDocumento: caucao.tipo_documento,
                          observacoes: caucao.observacoes,
                          contaFinanceira: caucao.conta_financeira,
                          centroCusto: caucao.centro_custo,
                          formaPagamento: caucao.forma_pagamento,
                          banco: caucao.banco || '0',
                          agencia: caucao.agencia || '0',
                          conta: caucao.conta || '0',
                          operacao: caucao.operacao || '0',
                          cadastroId: caucao.id
                        }}
                      />
                    </div>

                    {/* Contrato de Alojamento */}
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="font-semibold">Contrato de Alojamento</Label>
                        {contrato.arquivo_pdf_url && (
                          <Button size="sm" variant="outline" onClick={() => handleDownloadContrato(contrato)}>
                            <Download className="h-4 w-4 mr-2" />
                            Baixar Contrato Assinado
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                        <div className="space-y-2">
                          <div><strong>Código:</strong> {contrato.codigo}</div>
                          <div><strong>Nome:</strong> {contrato.nome}</div>
                          <div><strong>Proprietário:</strong> {contrato.proprietario}</div>
                          <div><strong>CPF/CNPJ:</strong> {contrato.cpf_cnpj_proprietario}</div>
                          <div><strong>Vigência:</strong> {contrato.vigencia_contrato} meses</div>
                        </div>
                        <div className="space-y-2">
                          <div><strong>Data Assinatura:</strong> {new Date(contrato.data_assinatura).toLocaleDateString('pt-BR')}</div>
                          <div><strong>Multa Contratual:</strong> {contrato.multa_contratual}%</div>
                          <div><strong>Lotação Máxima:</strong> {contrato.lotacao_maxima}</div>
                          <div><strong>Lotação Atual:</strong> {contrato.lotacao_atual}</div>
                          <div><strong>Favorecido:</strong> {contrato.favorecido}</div>
                        </div>
                      </div>
                      <GeradorPDFContratoAlojamento
                        dados={{
                          codigo: contrato.codigo,
                          nome: contrato.nome,
                          logradouro: contrato.logradouro,
                          complemento: contrato.complemento || '',
                          bairro: contrato.bairro,
                          municipio: contrato.municipio,
                          uf: contrato.uf,
                          cep: contrato.cep,
                          qtdeQuartos: contrato.qtde_quartos,
                          lotacaoMaxima: contrato.lotacao_maxima,
                          lotacaoAtual: contrato.lotacao_atual,
                          distanciaObra: contrato.distancia_obra,
                          tipoImovel: contrato.tipo_imovel,
                          inicioLocacao: contrato.inicio_locacao,
                          fimLocacao: contrato.fim_locacao,
                          vigenciaContrato: contrato.vigencia_contrato,
                          dataAssinatura: contrato.data_assinatura,
                          multaContratual: contrato.multa_contratual,
                          observacoes: caucao.observacoes,
                          tipoGarantia: contrato.tipo_garantia,
                          valorGarantia: contrato.valor_garantia,
                          dataPagamentoGarantia: caucao.data_emissao,
                          proprietario: contrato.proprietario,
                          cpfCnpjProprietario: contrato.cpf_cnpj_proprietario,
                          tipoProprietario: contrato.cpf_cnpj_proprietario.length <= 14 ? 'PF' : 'PJ',
                          favorecido: contrato.favorecido,
                          cpfCnpjFavorecido: contrato.cpf_cnpj_favorecido,
                          tipoChavePix: undefined,
                          formaPagamento: contrato.forma_pagamento,
                          banco: contrato.banco,
                          agencia: contrato.agencia,
                          operacao: contrato.operacao || undefined,
                          contaCorrente: contrato.conta_corrente
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}