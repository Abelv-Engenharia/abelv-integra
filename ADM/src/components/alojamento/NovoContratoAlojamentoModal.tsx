import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Validação de CPF/CNPJ simples
const validarCpfCnpj = (valor: string) => {
  const numeros = valor.replace(/\D/g, '');
  return numeros.length === 11 || numeros.length === 14;
};

// Validação de CEP
const validarCep = (cep: string) => {
  const regex = /^\d{5}-?\d{3}$/;
  return regex.test(cep);
};

const contratoSchema = z.object({
  // Identificação
  codigo: z.string().min(1, 'Código é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),

  // Dados da Localização
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  municipio: z.string().min(1, 'Município é obrigatório'),
  uf: z.string().min(1, 'UF é obrigatória'),
  cep: z.string().min(1, 'CEP é obrigatório').refine(validarCep, 'CEP deve estar no formato 00000-000'),

  // Características do Alojamento
  qtdeQuartos: z.number().min(1, 'Quantidade de quartos deve ser maior que 0'),
  lotacaoMaxima: z.number().min(1, 'Lotação máxima deve ser maior que 0'),
  lotacaoAtual: z.number().min(0, 'Lotação atual não pode ser negativa'),
  distanciaObra: z.number().min(0, 'Distância não pode ser negativa'),
  tipoImovel: z.string().min(1, 'Tipo de imóvel é obrigatório'),
  inicioLocacao: z.date({ required_error: 'Data de início é obrigatória' }),
  fimLocacao: z.date({ required_error: 'Data de fim é obrigatória' }),

  // Dados Contratuais
  vigenciaContrato: z.number().min(1, 'Vigência deve ser maior que 0'),
  dataAssinatura: z.date({ required_error: 'Data de assinatura é obrigatória' }),
  multaContratual: z.number().min(0, 'Multa não pode ser negativa').max(100, 'Multa não pode ser maior que 100%'),
  observacoes: z.string().optional(),

  // Proprietário
  proprietario: z.string().min(1, 'Nome do proprietário é obrigatório'),
  cpfCnpjProprietario: z.string().min(1, 'CPF/CNPJ é obrigatório').refine(validarCpfCnpj, 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos'),
  tipoProprietario: z.string().min(1, 'Tipo é obrigatório'),

  // Dados Bancários
  favorecido: z.string().min(1, 'Favorecido é obrigatório'),
  cpfCnpjFavorecido: z.string().min(1, 'CPF/CNPJ do favorecido é obrigatório').refine(validarCpfCnpj, 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos'),
  tipoChavePix: z.string().optional(),
  formaPagamento: z.string().min(1, 'Forma de pagamento é obrigatória'),
  banco: z.string().min(1, 'Banco é obrigatório'),
  agencia: z.string().min(1, 'Agência é obrigatória'),
  operacao: z.string().optional(),
  contaCorrente: z.string().min(1, 'Conta corrente é obrigatória'),
}).refine((data) => data.fimLocacao > data.inicioLocacao, {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['fimLocacao'],
}).refine((data) => data.lotacaoAtual <= data.lotacaoMaxima, {
  message: 'Lotação atual não pode ultrapassar a máxima',
  path: ['lotacaoAtual'],
});

type ContratoFormData = z.infer<typeof contratoSchema>;

interface NovoContratoAlojamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ccaCodigo?: string;
}

const estados = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const tiposImovel = [
  { value: 'casa', label: 'Casa' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'pousada', label: 'Pousada' },
  { value: 'alojamento', label: 'Alojamento' },
  { value: 'outros', label: 'Outros' }
];

const tiposChavePix = [
  { value: 'cpf', label: 'CPF' },
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'email', label: 'E-mail' },
  { value: 'telefone', label: 'Telefone' },
  { value: 'aleatoria', label: 'Chave Aleatória' }
];

const formasPagamento = [
  { value: 'pix', label: 'PIX' },
  { value: 'ted', label: 'TED' },
  { value: 'doc', label: 'DOC' },
  { value: 'boleto', label: 'Boleto' }
];

export const NovoContratoAlojamentoModal = ({ open, onOpenChange, ccaCodigo }: NovoContratoAlojamentoModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analisesSelecionada, setAnaliseSelecionada] = useState<string | null>(null);

  // Buscar análises contratuais aprovadas do CCA
  const { data: analisesAprovadas } = useQuery({
    queryKey: ['analises-aprovadas', ccaCodigo],
    queryFn: async () => {
      if (!ccaCodigo) return [];
      
      const { data, error } = await supabase
        .from('analises_contratuais')
        .select('*')
        .eq('cca_codigo', ccaCodigo)
        .eq('status_geral', 'aprovado')
        .eq('contrato_criado', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!ccaCodigo && open,
  });

  const form = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      codigo: '',
      lotacaoAtual: 0,
      multaContratual: 0,
      distanciaObra: 0,
      vigenciaContrato: 12,
      tipoProprietario: 'PF',
      formaPagamento: 'pix'
    },
  });

  // Preencher formulário quando uma análise for selecionada
  useEffect(() => {
    if (analisesSelecionada && analisesAprovadas) {
      const analise = analisesAprovadas.find(a => a.id === analisesSelecionada);
      if (analise) {
        form.reset({
          codigo: analise.numero_contrato,
          nome: `${analise.tipo_alojamento} - ${analise.fornecedor_nome}`,
          logradouro: analise.logradouro,
          complemento: analise.complemento || '',
          bairro: analise.bairro,
          municipio: analise.cidade,
          uf: analise.uf,
          cep: analise.cep,
          qtdeQuartos: analise.quantidade_quartos || 0,
          lotacaoMaxima: analise.capacidade_total || 0,
          lotacaoAtual: 0,
          distanciaObra: analise.distancia_obra || 0,
          tipoImovel: 'alojamento',
          inicioLocacao: new Date(analise.data_inicio_contrato),
          fimLocacao: new Date(analise.data_fim_contrato),
          vigenciaContrato: analise.prazo_contratual || 12,
          dataAssinatura: analise.data_assinatura ? new Date(analise.data_assinatura) : new Date(),
          multaContratual: analise.multa_rescisoria_percentual || 0,
          observacoes: analise.observacoes_imovel || '',
          proprietario: analise.nome_proprietario,
          cpfCnpjProprietario: analise.cpf_proprietario || '',
          tipoProprietario: analise.tipo_locador === 'PESSOA FÍSICA' ? 'PF' : 'PJ',
          favorecido: analise.fornecedor_nome,
          cpfCnpjFavorecido: analise.fornecedor_cnpj,
          tipoChavePix: '',
          formaPagamento: analise.forma_pagamento?.toLowerCase() || 'pix',
          banco: '',
          agencia: '',
          operacao: '',
          contaCorrente: '',
        });
      }
    }
  }, [analisesSelecionada, analisesAprovadas]);

  const onSubmit = async (data: ContratoFormData) => {
    if (!analisesSelecionada) {
      toast.error('Selecione uma análise contratual aprovada');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const analise = analisesAprovadas?.find(a => a.id === analisesSelecionada);
      if (!analise) throw new Error('Análise não encontrada');

      // Obter próximo número sequencial
      const { data: proximoNumero } = await supabase.rpc('obter_proximo_numero_alojamento', {
        p_cca_codigo: ccaCodigo,
        p_tipo_alojamento: analise.tipo_alojamento
      });

      const codigo = `${analise.tipo_alojamento} ALOJAMENTO ${String(proximoNumero).padStart(2, '0')}`;

      // Inserir contrato
      const { data: contrato, error: contratoError } = await supabase
        .from('contratos_alojamento')
        .insert({
          analise_contratual_id: analise.id,
          cca_codigo: ccaCodigo,
          tipo_alojamento: analise.tipo_alojamento,
          numero_sequencial: proximoNumero,
          codigo: codigo,
          nome: data.nome,
          logradouro: data.logradouro,
          complemento: data.complemento,
          bairro: data.bairro,
          municipio: data.municipio,
          uf: data.uf,
          cep: data.cep,
          qtde_quartos: data.qtdeQuartos,
          lotacao_maxima: data.lotacaoMaxima,
          lotacao_atual: data.lotacaoAtual,
          distancia_obra: data.distanciaObra,
          tipo_imovel: data.tipoImovel,
          inicio_locacao: data.inicioLocacao.toISOString().split('T')[0],
          fim_locacao: data.fimLocacao.toISOString().split('T')[0],
          vigencia_contrato: data.vigenciaContrato,
          data_assinatura: data.dataAssinatura.toISOString().split('T')[0],
          multa_contratual: data.multaContratual,
          observacoes: data.observacoes,
          proprietario: data.proprietario,
          cpf_cnpj_proprietario: data.cpfCnpjProprietario,
          tipo_proprietario: data.tipoProprietario,
          favorecido: data.favorecido,
          cpf_cnpj_favorecido: data.cpfCnpjFavorecido,
          tipo_chave_pix: data.tipoChavePix,
          forma_pagamento: data.formaPagamento,
          banco: data.banco,
          agencia: data.agencia,
          operacao: data.operacao,
          conta_corrente: data.contaCorrente,
          valor_aluguel: analise.valor_mensal,
          valor_caucao: analise.caucao,
          valor_caucao_previsto: analise.caucao,
          meses_caucao: analise.meses_caucao,
          dia_vencimento_aluguel: analise.dia_vencimento,
          forma_pagamento_aluguel: analise.forma_pagamento,
          tem_ir: analise.tem_ir,
          valor_ir: analise.ir_valor_retido,
          possui_caucao: analise.caucao > 0,
          status: 'ativo',
        })
        .select()
        .single();

      if (contratoError) throw contratoError;

      // Atualizar análise como contrato criado
      const { error: updateError } = await supabase
        .from('analises_contratuais')
        .update({
          contrato_criado: true,
          contrato_definitivo_id: contrato.id,
          data_criacao_contrato_definitivo: new Date().toISOString(),
        })
        .eq('id', analise.id);

      if (updateError) throw updateError;

      // Gerar alertas de medição mensal
      const dataInicio = new Date(data.inicioLocacao);
      const dataFim = new Date(data.fimLocacao);
      const alertas = [];

      for (let d = new Date(dataInicio); d <= dataFim; d.setMonth(d.getMonth() + 1)) {
        const competencia = format(d, 'yyyy-MM');
        const dataReferencia = new Date(d.getFullYear(), d.getMonth(), 1);
        
        alertas.push({
          contrato_id: contrato.id,
          cca_codigo: ccaCodigo,
          data_referencia: dataReferencia.toISOString().split('T')[0],
          competencia,
          status: 'pendente',
        });
      }

      if (alertas.length > 0) {
        await supabase.from('alertas_medicao_aluguel').insert(alertas);
      }
      
      toast.success('Contrato cadastrado com sucesso!');
      form.reset();
      setAnaliseSelecionada(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao cadastrar contrato:', error);
      toast.error('Erro ao cadastrar contrato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatarCpfCnpj = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const formatarCep = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    return numeros.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Novo Contrato de Alojamento</SheetTitle>
          <SheetDescription>
            Cadastre um novo contrato de alojamento preenchendo todas as informações obrigatórias
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            {/* Seleção de Análise Contratual */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Análise Contratual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-destructive">Selecione a Análise Aprovada *</Label>
                  <Select value={analisesSelecionada || ''} onValueChange={setAnaliseSelecionada}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma análise aprovada" />
                    </SelectTrigger>
                    <SelectContent>
                      {analisesAprovadas?.map((analise) => (
                        <SelectItem key={analise.id} value={analise.id}>
                          {analise.numero_contrato} - {analise.fornecedor_nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Identificação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Código *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="CT000001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Nome *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do contrato" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dados da Localização */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados da Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="logradouro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Logradouro *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Rua, Avenida, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="complemento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Apto, Bloco, etc." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Bairro *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do bairro" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="municipio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Município *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome da cidade" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="uf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">UF *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estados.map((estado) => (
                              <SelectItem key={estado.value} value={estado.value}>
                                {estado.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">CEP *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="00000-000"
                            onChange={(e) => {
                              const formatted = formatarCep(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={9}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Características do Alojamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Características do Alojamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="qtdeQuartos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Qtde de Quartos *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                            min="1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lotacaoMaxima"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Lotação Máxima *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                            min="1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lotacaoAtual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Lotação Atual *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                            min="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="distanciaObra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Distância da Obra (km) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipoImovel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Tipo de Imóvel *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposImovel.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="inicioLocacao"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-destructive">Início da Locação *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fimLocacao"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-destructive">Fim da Locação *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dados Contratuais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados Contratuais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="vigenciaContrato"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Vigência do Contrato (meses) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="12"
                            min="1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataAssinatura"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-destructive">Data de Assinatura *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="multaContratual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Multa Contratual (%) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder="0"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cláusulas / Observações</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Observações adicionais do contrato" rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Proprietário */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proprietário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="proprietario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Proprietário *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome completo" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpfCnpjProprietario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">CPF / CNPJ *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="000.000.000-00"
                            onChange={(e) => {
                              const formatted = formatarCpfCnpj(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={18}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tipoProprietario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Tipo *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PF">Pessoa Física</SelectItem>
                            <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dados Bancários */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados Bancários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="favorecido"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Favorecido *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do favorecido" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpfCnpjFavorecido"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">CPF / CNPJ *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="000.000.000-00"
                            onChange={(e) => {
                              const formatted = formatarCpfCnpj(e.target.value);
                              field.onChange(formatted);
                            }}
                            maxLength={18}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipoChavePix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Chave PIX</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposChavePix.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="formaPagamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Forma de Pagamento *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {formasPagamento.map((forma) => (
                              <SelectItem key={forma.value} value={forma.value}>
                                {forma.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="banco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Banco *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="agencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Agência *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="0000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="operacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operação</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contaCorrente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">Conta Corrente *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="00000-0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};