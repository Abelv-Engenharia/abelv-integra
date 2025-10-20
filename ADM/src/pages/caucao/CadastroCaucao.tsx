import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Save, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GeradorPDFCaucao from '@/components/caucao/GeradorPDFCaucao';
import { supabase } from '@/integrations/supabase/client';

interface Contrato {
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
  tipo_imovel: string;
  distancia_obra: number;
  banco: string;
  agencia: string;
  operacao: string;
  conta_corrente: string;
  forma_pagamento: string;
}

export default function CadastroCaucao() {
  const { toast } = useToast();
  const [contratoSelecionado, setContratoSelecionado] = useState('');
  const [cadastroSalvo, setCadastroSalvo] = useState(false);
  const [cadastroId, setCadastroId] = useState('');
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    dataEmissao: '',
    dataVencimento: '',
    tipoDocumento: '',
    observacoes: '',
    contaFinanceira: '',
    centroCusto: '',
    formaPagamento: '',
    banco: '',
    agencia: '',
    conta: '',
    operacao: ''
  });
  
  useEffect(() => {
    const fetchContratos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('contratos_alojamento')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Erro ao carregar contratos',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        setContratos(data || []);
      }
      setLoading(false);
    };

    fetchContratos();
  }, [toast]);
  
  const contrato = contratos.find(c => c.id === contratoSelecionado);
  
  useEffect(() => {
    const channel = supabase
      .channel('contratos_alojamento_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contratos_alojamento' }, async () => {
        const { data } = await supabase
          .from('contratos_alojamento')
          .select('*')
          .eq('status', 'ativo')
          .order('created_at', { ascending: false });
        setContratos(data || []);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  React.useEffect(() => {
    if (contrato && !formData.observacoes) {
      const enderecoCompleto = `${contrato.logradouro}${contrato.complemento ? ', ' + contrato.complemento : ''} - ${contrato.bairro} - ${contrato.municipio}/${contrato.uf} - CEP: ${contrato.cep}`;
      setFormData(prev => ({
        ...prev,
        observacoes: `Imóvel localizado em: ${enderecoCompleto}`
      }));
    }
  }, [contrato]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!contratoSelecionado) {
      toast({
        title: "Erro",
        description: "Selecione um contrato para cadastrar a caução",
        variant: "destructive"
      });
      return;
    }

    const camposObrigatorios = ['dataEmissao', 'dataVencimento', 'tipoDocumento', 'contaFinanceira', 'centroCusto', 'formaPagamento'];
    const camposFaltando = camposObrigatorios.filter(campo => !formData[campo as keyof typeof formData]);
    
    if (camposFaltando.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios marcados em vermelho",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('caucoes')
        .insert({
          contrato_id: contratoSelecionado,
          data_emissao: formData.dataEmissao,
          data_vencimento: formData.dataVencimento,
          tipo_documento: formData.tipoDocumento,
          observacoes: formData.observacoes,
          conta_financeira: formData.contaFinanceira,
          centro_custo: formData.centroCusto,
          forma_pagamento: formData.formaPagamento,
          banco: formData.banco || null,
          agencia: formData.agencia || null,
          conta: formData.conta || null,
          operacao: formData.operacao || null,
          status: 'pendente'
        })
        .select()
        .single();

      if (error) throw error;

      setCadastroId(data.id);
      setCadastroSalvo(true);

      toast({
        title: "Caução Validada",
        description: "Caução cadastrada e encaminhada para aprovação. Após aprovação, será lançada automaticamente no Sienge."
      });
    } catch (error) {
      console.error('Erro ao salvar caução:', error);
      toast({
        title: 'Erro ao Salvar',
        description: 'Ocorreu um erro ao salvar a caução',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Caução</h1>
          <p className="text-muted-foreground">Cadastre uma nova caução vinculada a um contrato de alojamento</p>
        </div>

        {/* Seleção de Contrato */}
        <Card>
          <CardHeader>
            <CardTitle>Vínculo ao Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="contrato">Contrato *</Label>
                <Select value={contratoSelecionado} onValueChange={setContratoSelecionado} disabled={loading}>
                  <SelectTrigger className={!contratoSelecionado ? "border-destructive" : ""}>
                    <SelectValue placeholder={loading ? "Carregando contratos..." : "Selecione um contrato"} />
                  </SelectTrigger>
                  <SelectContent>
                    {contratos.map((contrato) => (
                      <SelectItem key={contrato.id} value={contrato.id}>
                        {contrato.codigo} - {contrato.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {contrato && (
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <div><strong>Proprietário:</strong> {contrato.proprietario}</div>
                    <div><strong>CPF/CNPJ:</strong> {contrato.cpf_cnpj_proprietario}</div>
                    <div><strong>Código:</strong> {contrato.codigo}</div>
                    <div><strong>Nome do Alojamento:</strong> {contrato.nome}</div>
                    <div><strong>Tipo de Garantia:</strong> 
                      <Badge variant={contrato.tipo_garantia === 'caucao' ? 'default' : 'secondary'} className="ml-2">
                        {contrato.tipo_garantia === 'caucao' ? 'Caução' : contrato.tipo_garantia === 'titulo-capitalizacao' ? 'Título de Capitalização' : contrato.tipo_garantia}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div><strong>Valor da Garantia:</strong> R$ {contrato.valor_garantia?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</div>
                    <div><strong>Valor de Aluguel:</strong> R$ {contrato.valor_aluguel?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</div>
                    <div><strong>Período:</strong> {new Date(contrato.inicio_locacao).toLocaleDateString('pt-BR')} a {new Date(contrato.fim_locacao).toLocaleDateString('pt-BR')}</div>
                    <div><strong>Endereço:</strong> {contrato.logradouro}{contrato.complemento ? ', ' + contrato.complemento : ''} - {contrato.bairro} - {contrato.municipio}/{contrato.uf}</div>
                    <div><strong>Quartos:</strong> {contrato.qtde_quartos} | <strong>Tipo:</strong> {contrato.tipo_imovel}</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dados da Caução/Título */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Caução/Título de Capitalização</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoGarantia">Caução</Label>
                <Input
                  id="tipoGarantia"
                  value={contrato?.tipo_garantia === 'caucao' ? 'Caução' : contrato?.tipo_garantia === 'titulo-capitalizacao' ? 'Título de Capitalização' : ''}
                  readOnly
                  className="bg-muted"
                />
              </div>
              
              <div>
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  value={contrato?.valor_garantia ? `R$ ${contrato.valor_garantia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ''}
                  readOnly
                  className="bg-muted font-semibold"
                />
              </div>

              <div>
                <Label htmlFor="dataEmissao">Emissão *</Label>
                <Input
                  id="dataEmissao"
                  type="date"
                  value={formData.dataEmissao}
                  onChange={(e) => handleInputChange('dataEmissao', e.target.value)}
                  className={!formData.dataEmissao ? "border-destructive" : ""}
                />
              </div>

              <div>
                <Label htmlFor="dataVencimento">Vencimento *</Label>
                <Input
                  id="dataVencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={(e) => handleInputChange('dataVencimento', e.target.value)}
                  className={!formData.dataVencimento ? "border-destructive" : ""}
                />
              </div>

              <div className="md:col-span-1">
                <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                <Select value={formData.tipoDocumento} onValueChange={(value) => handleInputChange('tipoDocumento', value)}>
                  <SelectTrigger className={!formData.tipoDocumento ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seguro-garantia">Seguro Garantia</SelectItem>
                    <SelectItem value="caucao-dinheiro">Caução em Dinheiro</SelectItem>
                    <SelectItem value="titulo-capitalizacao">Título de Capitalização</SelectItem>
                    <SelectItem value="fianca-bancaria">Fiança Bancária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Financeiros */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Financeiros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contaFinanceira">Conta Financeira *</Label>
                <Select value={formData.contaFinanceira} onValueChange={(value) => handleInputChange('contaFinanceira', value)}>
                  <SelectTrigger className={!formData.contaFinanceira ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione conta financeira" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.1.01.001">1.1.01.001 - Depósitos Caução</SelectItem>
                    <SelectItem value="1.1.01.002">1.1.01.002 - Cauções Contratuais</SelectItem>
                    <SelectItem value="1.1.01.003">1.1.01.003 - Seguros Garantia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="centroCusto">Centro de Custo *</Label>
                <Select value={formData.centroCusto} onValueChange={(value) => handleInputChange('centroCusto', value)}>
                  <SelectTrigger className={!formData.centroCusto ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione centro de custo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC001">CC001 - Alojamentos</SelectItem>
                    <SelectItem value="CC002">CC002 - Administração</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Dados de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                <Select value={formData.formaPagamento} onValueChange={(value) => handleInputChange('formaPagamento', value)}>
                  <SelectTrigger className={!formData.formaPagamento ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boleto">Boleto Bancário</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="ted">TED</SelectItem>
                    <SelectItem value="doc">DOC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="banco">Banco</Label>
                <Input
                  id="banco"
                  value={formData.banco}
                  onChange={(e) => handleInputChange('banco', e.target.value)}
                  placeholder="Ex: 001 - Banco do Brasil"
                />
              </div>

              <div>
                <Label htmlFor="agencia">Agência</Label>
                <Input
                  id="agencia"
                  value={formData.agencia}
                  onChange={(e) => handleInputChange('agencia', e.target.value)}
                  placeholder="Ex: 1234"
                />
              </div>

              <div>
                <Label htmlFor="conta">Conta</Label>
                <Input
                  id="conta"
                  value={formData.conta}
                  onChange={(e) => handleInputChange('conta', e.target.value)}
                  placeholder="Ex: 12345-6"
                />
              </div>

              <div>
                <Label htmlFor="operacao">Operação</Label>
                <Input
                  id="operacao"
                  value={formData.operacao}
                  onChange={(e) => handleInputChange('operacao', e.target.value)}
                  placeholder="Ex: 013"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Adicione observações sobre esta caução..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {cadastroSalvo && (
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Caução salva - ID: {cadastroId}</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            {cadastroSalvo && contrato && (
              <GeradorPDFCaucao
                dados={{
                  contratoId: contratoSelecionado,
                  fornecedor: contrato.favorecido,
                  cpfCnpj: contrato.cpf_cnpj_favorecido,
                  cca: contrato.codigo,
                  tituloSienge: formData.centroCusto,
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
                  dataEmissao: formData.dataEmissao,
                  dataVencimento: formData.dataVencimento,
                  tipoDocumento: formData.tipoDocumento,
                  observacoes: formData.observacoes,
                  contaFinanceira: formData.contaFinanceira,
                  centroCusto: formData.centroCusto,
                  formaPagamento: formData.formaPagamento,
                  banco: formData.banco,
                  agencia: formData.agencia,
                  conta: formData.conta,
                  operacao: formData.operacao,
                  cadastroId: cadastroId
                }}
              />
            )}
            
            <Button 
              onClick={handleSave} 
              disabled={cadastroSalvo}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {cadastroSalvo ? 'Caução Salva' : 'Salvar Caução'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}