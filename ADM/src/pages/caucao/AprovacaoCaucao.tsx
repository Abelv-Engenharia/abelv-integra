import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, User, AlertTriangle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import GeradorPDFCaucao from '@/components/caucao/GeradorPDFCaucao';
import { supabase } from '@/integrations/supabase/client';

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
    arquivo_pdf_url?: string | null;
    forma_pagamento: string;
    vigencia_contrato: number;
    data_assinatura: string;
    multa_contratual: number;
  };
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pendente: { variant: 'secondary' as const, icon: Clock, text: 'Pendente' },
    aprovado: { variant: 'default' as const, icon: CheckCircle, text: 'Aprovado' },
    reprovado: { variant: 'destructive' as const, icon: XCircle, text: 'Reprovado' },
    aguardando_aprovacao: { variant: 'secondary' as const, icon: Clock, text: 'Aguardando Aprovação' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
};

export default function AprovacaoCaucao() {
  const { toast } = useToast();
  const [selectedCaucao, setSelectedCaucao] = useState<string>('');
  const [motivoReprovacao, setMotivoReprovacao] = useState('');
  const [caucoes, setCaucoes] = useState<Caucao[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCaucoes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('caucoes')
      .select(`
        *,
        contratos_alojamento (*)
      `)
      .eq('status', 'pendente')
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
      .channel('caucoes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'caucoes' }, () => {
        fetchCaucoes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAprovar = async (caucaoId: string) => {
    const { error } = await supabase
      .from('caucoes')
      .update({
        status: 'aprovada',
        aprovado_por: 'Sistema',
        data_aprovacao: new Date().toISOString()
      })
      .eq('id', caucaoId);

    if (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Caução aprovada com sucesso"
    });
    
    setSelectedCaucao('');
    fetchCaucoes();
  };

  const handleReprovar = async (caucaoId: string) => {
    if (!motivoReprovacao.trim()) {
      toast({
        title: "Erro",
        description: "Informe o motivo da reprovação",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('caucoes')
      .update({
        status: 'reprovada',
        motivo_reprovacao: motivoReprovacao
      })
      .eq('id', caucaoId);

    if (error) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: "Caução Reprovada",
      description: "A caução foi reprovada e retornará para revisão"
    });
    setMotivoReprovacao('');
    setSelectedCaucao('');
    fetchCaucoes();
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aprovação de Cauções</h1>
          <p className="text-muted-foreground">Aprove ou reprove cauções pendentes no fluxo de aprovação</p>
        </div>

        {/* Lista de Cauções Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Cauções Pendentes de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>CCA</TableHead>
                  <TableHead>Etapa Atual</TableHead>
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
                    <TableCell colSpan={8} className="text-center">Nenhuma caução pendente</TableCell>
                  </TableRow>
                ) : (
                  caucoes.map((caucao) => (
                    <TableRow key={caucao.id}>
                      <TableCell className="font-medium">{caucao.id.substring(0, 8)}</TableCell>
                      <TableCell>{caucao.contratos_alojamento?.codigo || 'N/A'}</TableCell>
                      <TableCell>{caucao.contratos_alojamento?.favorecido || 'N/A'}</TableCell>
                      <TableCell>R$ {(caucao.contratos_alojamento?.valor_garantia || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{caucao.contratos_alojamento?.codigo || 'N/A'}</TableCell>
                      <TableCell>Análise</TableCell>
                      <TableCell>{getStatusBadge(caucao.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => setSelectedCaucao(caucao.id)}>
                            <User className="h-4 w-4 mr-2" />
                            Avaliar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal de Aprovação */}
        {selectedCaucao && caucoes.find(c => c.id === selectedCaucao) && (() => {
          const caucao = caucoes.find(c => c.id === selectedCaucao)!;
          const contrato = caucao.contratos_alojamento;
          
          return (
            <Card>
              <CardHeader>
                <CardTitle>Avaliação de Caução - {caucao.id.substring(0, 8)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Dados da Caução */}
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <div><strong>Fornecedor:</strong> {contrato.favorecido}</div>
                      <div><strong>CPF/CNPJ:</strong> {contrato.cpf_cnpj_favorecido}</div>
                      <div><strong>Contrato:</strong> {contrato.codigo}</div>
                      <div><strong>Valor Garantia:</strong> R$ {contrato.valor_garantia?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="space-y-2">
                      <div><strong>Data Emissão:</strong> {new Date(caucao.data_emissao).toLocaleDateString('pt-BR')}</div>
                      <div><strong>Data Vencimento:</strong> {new Date(caucao.data_vencimento).toLocaleDateString('pt-BR')}</div>
                      <div><strong>Tipo Documento:</strong> {caucao.tipo_documento}</div>
                      <div><strong>Forma Pagamento:</strong> {caucao.forma_pagamento}</div>
                    </div>
                  </div>

                  {/* Ações de Aprovação */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Motivo da Reprovação (se aplicável)
                      </label>
                      <Textarea
                        placeholder="Descreva o motivo da reprovação..."
                        value={motivoReprovacao}
                        onChange={(e) => setMotivoReprovacao(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Documentos */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <label className="block text-sm font-medium mb-3">Pedido de Despesa</label>
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
                      
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <label className="block text-sm font-medium mb-3">Contrato de Alojamento</label>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const raw = contrato.arquivo_pdf_url;
                              if (!raw) {
                                toast({
                                  title: 'Contrato não encontrado',
                                  description: 'Nenhum PDF assinado vinculado ao contrato',
                                  variant: 'destructive',
                                });
                                return;
                              }
                              const isHttp = /^https?:\/\//.test(raw);
                              const finalUrl = isHttp
                                ? raw
                                : supabase.storage.from('contratos-alojamento').getPublicUrl(raw).data.publicUrl;
                              const win = window.open(finalUrl, '_blank', 'noopener,noreferrer');
                              if (!win) {
                                const a = document.createElement('a');
                                a.href = finalUrl;
                                a.download = 'contrato-alojamento.pdf';
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                              }
                            }}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Visualizar PDF
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline" onClick={() => setSelectedCaucao('')}>
                        Cancelar
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleReprovar(selectedCaucao)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reprovar
                      </Button>
                      <Button onClick={() => handleAprovar(selectedCaucao)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Histórico de Aprovações */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">CAU-002 - Maria Santos</div>
                  <div className="text-sm text-muted-foreground">Aprovada em 14/01/2025</div>
                </div>
                <Badge variant="default">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Aprovada
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">CAU-003 - Pedro Oliveira</div>
                  <div className="text-sm text-muted-foreground">Reprovada em 13/01/2025</div>
                </div>
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Reprovada
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}