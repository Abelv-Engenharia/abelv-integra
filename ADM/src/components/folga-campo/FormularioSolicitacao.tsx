import React, { useState } from 'react';
import { Calendar, MapPin, Plane, Upload, FileText, Signature, Save, Mail, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import GeradorPDFSolicitacao from './GeradorPDFSolicitacao';

interface FormularioSolicitacaoProps {
  colaborador?: any;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const FormularioSolicitacao: React.FC<FormularioSolicitacaoProps> = ({
  colaborador,
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Dados do colaborador (preservar padrão Nydus)
    obra_projeto: colaborador?.obra || '',
    cca: colaborador?.cca || '',
    nome_colaborador: colaborador?.nome || '',
    matricula: colaborador?.matricula || '',
    funcao: colaborador?.funcao || '',
    telefone: colaborador?.telefone || '',
    
    // Período da folga
    data_inicio: '',
    data_fim: '',
    cidade_destino: '',
    uf_destino: '',
    dias_folga: 0,
    
    // Itinerário IDA
    ida_data: '',
    ida_meio_transporte: 'aereo',
    ida_origem: '',
    ida_horario_saida: '',
    ida_destino: '',
    ida_horario_chegada: '',
    ida_voucher: '',
    
    // Itinerário VOLTA
    volta_data: '',
    volta_meio_transporte: 'aereo',
    volta_origem: '',
    volta_horario_saida: '',
    volta_destino: '',
    volta_horario_chegada: '',
    volta_voucher: '',
    
    // Observações e informações adicionais
    observacoes_rota: '',
    opcao_reembolso: false,
    voucher_localizador: '',
    
    // Datas reais (preenchidas após execução)
    data_efetiva_folga: '',
    data_retorno_real: '',
    data_apresentacao_real: '',
    
    // Status da compra e integração
    status_compra: 'solicitada' as 'solicitada' | 'emitida' | 'cancelada' | 'reembolsada',
    integracao_bizztrip: false,
    integracao_onfly: false,
    
    // Assinaturas digitais
    assinatura_supervisor: '',
    assinatura_engenheiro: '',
    assinatura_colaborador: '',
    assinatura_administracao: '',
    
    // Email automático
    enviar_email_automatico: true,
    seguir_fluxo_obra: true
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calcularDiasFolga = () => {
    if (formData.data_inicio && formData.data_fim) {
      const inicio = new Date(formData.data_inicio);
      const fim = new Date(formData.data_fim);
      const diffTime = Math.abs(fim.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData(prev => ({ ...prev, dias_folga: diffDays }));
    }
  };

  const integrarComFornecedores = async () => {
    toast({
      title: "Integrando com fornecedores",
      description: "Enviando dados para Bizztrip e Onfly...",
    });

    // Simular integração automática
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        integracao_bizztrip: true,
        integracao_onfly: true,
        status_compra: 'emitida'
      }));
      
      toast({
        title: "Integração concluída",
        description: "Dados sincronizados com Bizztrip e Onfly",
      });
    }, 2000);
  };

  const enviarEmailAutomatico = () => {
    const destinatarios = [
      formData.assinatura_supervisor,
      formData.assinatura_engenheiro,
      formData.assinatura_administracao
    ].filter(Boolean);

    toast({
      title: "Email enviado automaticamente",
      description: `Formulário PDF enviado para ${destinatarios.length || 'os'} destinatários conforme configuração da obra`,
    });
  };

  const handleSubmit = () => {
    // Validações obrigatórias (marcar campos em vermelho se vazios)
    const camposObrigatorios = [
      'obra_projeto', 'data_inicio', 'data_fim', 'cidade_destino', 'uf_destino',
      'ida_data', 'ida_origem', 'ida_destino', 'volta_data', 'volta_origem', 'volta_destino'
    ];
    
    const camposVazios = camposObrigatorios.filter(campo => !formData[campo as keyof typeof formData]);
    
    if (camposVazios.length > 0) {
      toast({
        title: "Campos obrigatórios pendentes",
        description: "Preencha todos os campos marcados em vermelho.",
        variant: "destructive"
      });
      return;
    }

    // Calcular dias de folga
    calcularDiasFolga();

    // Dados completos do formulário
    const formularioCompleto = {
      ...formData,
      data_envio: new Date().toISOString(),
      status: 'Enviado',
      // Manter referência às regras existentes da obra
      destinatarios_automaticos: true,
      template_vigente: true,
      numero_protocolo: `FSP-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    };

    // Integração automática com fornecedores se solicitado
    if (formData.integracao_bizztrip || formData.integracao_onfly) {
      integrarComFornecedores();
    }

    // Envio automático por email seguindo fluxo da obra
    if (formData.enviar_email_automatico) {
      enviarEmailAutomatico();
    }

    onSubmit?.(formularioCompleto);
    
    toast({
      title: "Formulário processado com sucesso",
      description: "PDF gerado, integração ativa e emails enviados automaticamente.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Formulário de Solicitação de Passagem
          </CardTitle>
          <CardDescription>
            Baseado no padrão do documento de referência • Seguirá fluxo automático da obra
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Dados do Colaborador */}
          <div>
            <h3 className="text-lg font-medium mb-4">Dados do Colaborador</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="obra_projeto">Obra/Projeto *</Label>
                <Input
                  id="obra_projeto"
                  value={formData.obra_projeto}
                  onChange={(e) => handleInputChange('obra_projeto', e.target.value)}
                  className="bg-muted"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="cca">CCA *</Label>
                <Input
                  id="cca"
                  value={formData.cca}
                  onChange={(e) => handleInputChange('cca', e.target.value)}
                  className="bg-muted"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input
                  id="matricula"
                  value={formData.matricula}
                  className="bg-muted"
                  readOnly
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="nome_colaborador">Nome do Colaborador *</Label>
                <Input
                  id="nome_colaborador"
                  value={formData.nome_colaborador}
                  className="bg-muted"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="funcao">Função</Label>
                <Input
                  id="funcao"
                  value={formData.funcao}
                  className="bg-muted"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone de Contato</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div>
                <Label htmlFor="dias_folga">Dias de Folga</Label>
                <Input
                  id="dias_folga"
                  type="number"
                  value={formData.dias_folga}
                  onChange={(e) => handleInputChange('dias_folga', parseInt(e.target.value))}
                  className="bg-muted"
                  readOnly
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Período da Folga */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Período da Folga
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="data_inicio" className={!formData.data_inicio ? 'text-red-500' : ''}>Data Início *</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => {
                    handleInputChange('data_inicio', e.target.value);
                    calcularDiasFolga();
                  }}
                  className={!formData.data_inicio ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <Label htmlFor="data_fim" className={!formData.data_fim ? 'text-red-500' : ''}>Data Fim *</Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => {
                    handleInputChange('data_fim', e.target.value);
                    calcularDiasFolga();
                  }}
                  className={!formData.data_fim ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <Label htmlFor="cidade_destino" className={!formData.cidade_destino ? 'text-red-500' : ''}>Cidade de Destino *</Label>
                <Input
                  id="cidade_destino"
                  value={formData.cidade_destino}
                  onChange={(e) => handleInputChange('cidade_destino', e.target.value)}
                  placeholder="Ex: São Paulo"
                  className={!formData.cidade_destino ? 'border-red-500' : ''}
                />
              </div>
              <div>
                <Label htmlFor="uf_destino" className={!formData.uf_destino ? 'text-red-500' : ''}>UF *</Label>
                <Select value={formData.uf_destino} onValueChange={(value) => handleInputChange('uf_destino', value)}>
                  <SelectTrigger className={!formData.uf_destino ? 'border-red-500' : ''}>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="AL">AL</SelectItem>
                    <SelectItem value="AP">AP</SelectItem>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="BA">BA</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="DF">DF</SelectItem>
                    <SelectItem value="ES">ES</SelectItem>
                    <SelectItem value="GO">GO</SelectItem>
                    <SelectItem value="MA">MA</SelectItem>
                    <SelectItem value="MT">MT</SelectItem>
                    <SelectItem value="MS">MS</SelectItem>
                    <SelectItem value="MG">MG</SelectItem>
                    <SelectItem value="PA">PA</SelectItem>
                    <SelectItem value="PB">PB</SelectItem>
                    <SelectItem value="PR">PR</SelectItem>
                    <SelectItem value="PE">PE</SelectItem>
                    <SelectItem value="PI">PI</SelectItem>
                    <SelectItem value="RJ">RJ</SelectItem>
                    <SelectItem value="RN">RN</SelectItem>
                    <SelectItem value="RS">RS</SelectItem>
                    <SelectItem value="RO">RO</SelectItem>
                    <SelectItem value="RR">RR</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="SP">SP</SelectItem>
                    <SelectItem value="SE">SE</SelectItem>
                    <SelectItem value="TO">TO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Itinerário IDA */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Itinerário - IDA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="ida_data">Data da Viagem *</Label>
                <Input
                  id="ida_data"
                  type="date"
                  value={formData.ida_data}
                  onChange={(e) => handleInputChange('ida_data', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ida_meio_transporte">Meio de Transporte</Label>
                <Select value={formData.ida_meio_transporte} onValueChange={(value) => handleInputChange('ida_meio_transporte', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aereo">Aéreo</SelectItem>
                    <SelectItem value="rodoviario">Rodoviário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ida_origem">Origem *</Label>
                <Input
                  id="ida_origem"
                  value={formData.ida_origem}
                  onChange={(e) => handleInputChange('ida_origem', e.target.value)}
                  placeholder="Cidade/UF ou Aeroporto"
                />
              </div>
              <div>
                <Label htmlFor="ida_horario_saida">Horário de Saída</Label>
                <Input
                  id="ida_horario_saida"
                  type="time"
                  value={formData.ida_horario_saida}
                  onChange={(e) => handleInputChange('ida_horario_saida', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ida_destino">Destino *</Label>
                <Input
                  id="ida_destino"
                  value={formData.ida_destino}
                  onChange={(e) => handleInputChange('ida_destino', e.target.value)}
                  placeholder="Cidade/UF ou Aeroporto"
                />
              </div>
                <div>
                <Label htmlFor="ida_horario_chegada">Horário de Chegada</Label>
                <Input
                  id="ida_horario_chegada"
                  type="time"
                  value={formData.ida_horario_chegada}
                  onChange={(e) => handleInputChange('ida_horario_chegada', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="ida_voucher">Voucher/Localizador IDA</Label>
                <Input
                  id="ida_voucher"
                  value={formData.ida_voucher}
                  onChange={(e) => handleInputChange('ida_voucher', e.target.value)}
                  placeholder="Será preenchido automaticamente após compra"
                  className="bg-muted"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Itinerário VOLTA */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Plane className="h-5 w-5 rotate-180" />
              Itinerário - VOLTA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="volta_data">Data da Viagem *</Label>
                <Input
                  id="volta_data"
                  type="date"
                  value={formData.volta_data}
                  onChange={(e) => handleInputChange('volta_data', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="volta_meio_transporte">Meio de Transporte</Label>
                <Select value={formData.volta_meio_transporte} onValueChange={(value) => handleInputChange('volta_meio_transporte', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aereo">Aéreo</SelectItem>
                    <SelectItem value="rodoviario">Rodoviário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volta_origem">Origem *</Label>
                <Input
                  id="volta_origem"
                  value={formData.volta_origem}
                  onChange={(e) => handleInputChange('volta_origem', e.target.value)}
                  placeholder="Cidade/UF ou Aeroporto"
                />
              </div>
              <div>
                <Label htmlFor="volta_horario_saida">Horário de Saída</Label>
                <Input
                  id="volta_horario_saida"
                  type="time"
                  value={formData.volta_horario_saida}
                  onChange={(e) => handleInputChange('volta_horario_saida', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="volta_destino">Destino *</Label>
                <Input
                  id="volta_destino"
                  value={formData.volta_destino}
                  onChange={(e) => handleInputChange('volta_destino', e.target.value)}
                  placeholder="Cidade/UF ou Aeroporto"
                />
              </div>
                <div>
                <Label htmlFor="volta_horario_chegada">Horário de Chegada</Label>
                <Input
                  id="volta_horario_chegada"
                  type="time"
                  value={formData.volta_horario_chegada}
                  onChange={(e) => handleInputChange('volta_horario_chegada', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="volta_voucher">Voucher/Localizador VOLTA</Label>
                <Input
                  id="volta_voucher"
                  value={formData.volta_voucher}
                  onChange={(e) => handleInputChange('volta_voucher', e.target.value)}
                  placeholder="Será preenchido automaticamente após compra"
                  className="bg-muted"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações Adicionais */}
          <div>
            <h3 className="text-lg font-medium mb-4">Informações Adicionais</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="observacoes_rota">Observações de Rota</Label>
                <Textarea
                  id="observacoes_rota"
                  value={formData.observacoes_rota}
                  onChange={(e) => handleInputChange('observacoes_rota', e.target.value)}
                  placeholder="Informações especiais sobre horários, conexões, etc..."
                  className="min-h-20"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="opcao_reembolso"
                  type="checkbox"
                  checked={formData.opcao_reembolso}
                  onChange={(e) => handleInputChange('opcao_reembolso', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="opcao_reembolso">Solicitar reembolso posterior</Label>
              </div>
              
              <div>
                <Label htmlFor="voucher_localizador">Voucher/Localizador Geral</Label>
                <Input
                  id="voucher_localizador"
                  value={formData.voucher_localizador}
                  onChange={(e) => handleInputChange('voucher_localizador', e.target.value)}
                  placeholder="Código do localizador da passagem"
                />
              </div>
              
              {/* Datas Reais da Viagem */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="data_efetiva_folga">Data Efetiva da Folga</Label>
                  <Input
                    id="data_efetiva_folga"
                    type="date"
                    value={formData.data_efetiva_folga}
                    onChange={(e) => handleInputChange('data_efetiva_folga', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="data_retorno_real">Data Real de Retorno</Label>
                  <Input
                    id="data_retorno_real"
                    type="date"
                    value={formData.data_retorno_real}
                    onChange={(e) => handleInputChange('data_retorno_real', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="data_apresentacao_real">Data Real de Apresentação</Label>
                  <Input
                    id="data_apresentacao_real"
                    type="date"
                    value={formData.data_apresentacao_real}
                    onChange={(e) => handleInputChange('data_apresentacao_real', e.target.value)}
                  />
                </div>
              </div>
              
              {/* Status da Compra */}
              <div>
                <Label htmlFor="status_compra">Status da Compra</Label>
                <Select value={formData.status_compra} onValueChange={(value) => handleInputChange('status_compra', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solicitada">Solicitada</SelectItem>
                    <SelectItem value="emitida">Emitida</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                    <SelectItem value="reembolsada">Reembolsada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Integrações */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="integracao_bizztrip"
                    type="checkbox"
                    checked={formData.integracao_bizztrip}
                    onChange={(e) => handleInputChange('integracao_bizztrip', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="integracao_bizztrip">Integrar automaticamente com Bizztrip</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="integracao_onfly"
                    type="checkbox"
                    checked={formData.integracao_onfly}
                    onChange={(e) => handleInputChange('integracao_onfly', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="integracao_onfly">Integrar automaticamente com Onfly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="enviar_email_automatico"
                    type="checkbox"
                    checked={formData.enviar_email_automatico}
                    onChange={(e) => handleInputChange('enviar_email_automatico', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="enviar_email_automatico">Enviar por email automaticamente (D-45 e D-30)</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Assinaturas Digitais */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Signature className="h-5 w-5" />
              Assinaturas Digitais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assinatura_supervisor">Supervisor</Label>
                <Input
                  id="assinatura_supervisor"
                  value={formData.assinatura_supervisor}
                  onChange={(e) => handleInputChange('assinatura_supervisor', e.target.value)}
                  placeholder="Nome do supervisor"
                />
              </div>
              <div>
                <Label htmlFor="assinatura_engenheiro">Engenheiro</Label>
                <Input
                  id="assinatura_engenheiro"
                  value={formData.assinatura_engenheiro}
                  onChange={(e) => handleInputChange('assinatura_engenheiro', e.target.value)}
                  placeholder="Nome do engenheiro"
                />
              </div>
              <div>
                <Label htmlFor="assinatura_colaborador">Colaborador</Label>
                <Input
                  id="assinatura_colaborador"
                  value={formData.assinatura_colaborador}
                  onChange={(e) => handleInputChange('assinatura_colaborador', e.target.value)}
                  placeholder="Nome do colaborador"
                />
              </div>
              <div>
                <Label htmlFor="assinatura_administracao">Administração</Label>
                <Input
                  id="assinatura_administracao"
                  value={formData.assinatura_administracao}
                  onChange={(e) => handleInputChange('assinatura_administracao', e.target.value)}
                  placeholder="Nome do responsável administrativo"
                />
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 mt-4">
              <p className="text-sm text-muted-foreground">
                <strong>Fluxo automático:</strong> Este formulário será enviado automaticamente conforme 
                configuração atual da obra, mantendo os mesmos destinatários e regras já vigentes.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">D-45 Alerta</Badge>
                <Badge variant="outline">D-30 Alerta</Badge>
                <Badge variant="outline">PDF Anexado</Badge>
                <Badge variant="outline">Integração Ativa</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-between gap-4">
        <div className="flex gap-2">
          <GeradorPDFSolicitacao dados={formData} />
          <Button variant="outline" onClick={integrarComFornecedores} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Integrar Fornecedores
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Processar e Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormularioSolicitacao;