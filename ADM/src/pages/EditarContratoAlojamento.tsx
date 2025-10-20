import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Validação de CPF/CNPJ simplificada
const validarCpfCnpj = (valor: string) => {
  const numeros = valor.replace(/\D/g, '');
  return numeros.length === 11 || numeros.length === 14;
};

// Validação de CEP
const validarCep = (cep: string) => {
  const numeros = cep.replace(/\D/g, '');
  return numeros.length === 8;
};

// Schema de validação
const contratoSchema = z.object({
  // Identificação
  cca: z.string().min(1, "CCA é obrigatório"),
  tipoimovel: z.string().min(1, "Tipo de imóvel é obrigatório"),
  
  // Localização
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  municipio: z.string().min(1, "Município é obrigatório"),
  uf: z.string().min(1, "UF é obrigatório"),
  cep: z.string().refine(validarCep, "CEP inválido"),
  
  // Características do alojamento
  capacidadecontratada: z.coerce.number().min(1, "Capacidade deve ser maior que 0"),
  ocupacaoatual: z.coerce.number().min(0, "Ocupação não pode ser negativa"),
  
  // Caução
  caucao: z.string().min(1, "Valor da caução é obrigatório"),
  
  // Dados contratuais
  datainicio: z.date({
    required_error: "Data de início é obrigatória",
  }),
  datafim: z.date({
    required_error: "Data de término é obrigatória",
  }),
  valormensal: z.string().min(1, "Valor mensal é obrigatório"),
  diadevencimento: z.coerce.number().min(1).max(31, "Dia deve estar entre 1 e 31"),
  formadepagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
  clausulareajuste: z.string().optional(),
  observacoes: z.string().optional(),
  
  // Proprietário
  nomeproprietario: z.string().min(1, "Nome do proprietário é obrigatório"),
  cpfcnpj: z.string().refine(validarCpfCnpj, "CPF/CNPJ inválido"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  
  // Dados bancários
  banco: z.string().min(1, "Banco é obrigatório"),
  agencia: z.string().min(1, "Agência é obrigatória"),
  conta: z.string().min(1, "Conta é obrigatória"),
  tipochavepix: z.string().optional(),
  chavepix: z.string().optional(),
}).refine(
  (data) => data.datafim > data.datainicio,
  {
    message: "Data de término deve ser posterior à data de início",
    path: ["datafim"],
  }
).refine(
  (data) => data.ocupacaoatual <= data.capacidadecontratada,
  {
    message: "Ocupação atual não pode exceder capacidade contratada",
    path: ["ocupacaoatual"],
  }
);

type ContratoFormData = z.infer<typeof contratoSchema>;


// Estados brasileiros
const estados = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

// Tipos de imóvel
const tiposImovel = [
  { value: "casa", label: "Casa" },
  { value: "apartamento", label: "Apartamento" },
  { value: "pousada", label: "Pousada" },
  { value: "hotel", label: "Hotel" },
  { value: "alojamento", label: "Alojamento" },
  { value: "outro", label: "Outro" }
];

// Tipos de chave PIX
const tiposChavePix = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "E-mail" },
  { value: "telefone", label: "Telefone" },
  { value: "aleatoria", label: "Chave aleatória" }
];

// Formas de pagamento
const formasPagamento = [
  { value: "transferencia", label: "Transferência Bancária" },
  { value: "ted", label: "TED" },
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" }
];

export default function EditarContratoAlojamento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: contrato, isLoading } = useQuery({
    queryKey: ["contrato", id],
    queryFn: async () => {
      if (!id) throw new Error("ID não fornecido");
      const { data, error } = await supabase
        .from("contratos_alojamento")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Contrato não encontrado");
      return data;
    },
    enabled: !!id,
  });

  const form = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      cca: "",
      tipoimovel: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      municipio: "",
      uf: "",
      cep: "",
      capacidadecontratada: 0,
      ocupacaoatual: 0,
      caucao: "",
      valormensal: "",
      diadevencimento: 10,
      formadepagamento: "",
      clausulareajuste: "",
      observacoes: "",
      nomeproprietario: "",
      cpfcnpj: "",
      telefone: "",
      email: "",
      banco: "",
      agencia: "",
      conta: "",
      tipochavepix: "",
      chavepix: ""
    },
  });

  // Carregar dados do contrato ao montar o componente
  useEffect(() => {
    if (contrato) {
      form.reset({
        cca: "CCA - Em desenvolvimento",
        tipoimovel: contrato.tipo_imovel,
        logradouro: contrato.logradouro,
        numero: "",
        complemento: contrato.complemento || "",
        bairro: contrato.bairro,
        municipio: contrato.municipio,
        uf: contrato.uf,
        cep: contrato.cep,
        capacidadecontratada: contrato.lotacao_maxima,
        ocupacaoatual: contrato.lotacao_atual,
        caucao: contrato.valor_caucao.toString(),
        datainicio: new Date(contrato.inicio_locacao),
        datafim: new Date(contrato.fim_locacao),
        valormensal: contrato.valor_aluguel.toString(),
        diadevencimento: 10,
        formadepagamento: contrato.forma_pagamento,
        clausulareajuste: "",
        observacoes: contrato.observacoes || "",
        nomeproprietario: contrato.proprietario,
        cpfcnpj: contrato.cpf_cnpj_proprietario,
        telefone: "",
        email: "",
        banco: contrato.banco,
        agencia: contrato.agencia,
        conta: contrato.conta_corrente,
        tipochavepix: contrato.tipo_chave_pix || "",
        chavepix: ""
      });
    }
  }, [contrato, form]);

  const onSubmit = async (data: ContratoFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        tipo_imovel: data.tipoimovel,
        logradouro: data.logradouro,
        complemento: data.complemento || null,
        bairro: data.bairro,
        municipio: data.municipio,
        uf: data.uf,
        cep: data.cep,
        lotacao_maxima: data.capacidadecontratada,
        lotacao_atual: data.ocupacaoatual,
        valor_caucao: Number(data.caucao),
        inicio_locacao: format(data.datainicio, 'yyyy-MM-dd'),
        fim_locacao: format(data.datafim, 'yyyy-MM-dd'),
        valor_aluguel: Number(data.valormensal),
        forma_pagamento: data.formadepagamento,
        observacoes: data.observacoes || null,
        proprietario: data.nomeproprietario,
        cpf_cnpj_proprietario: data.cpfcnpj,
        banco: data.banco,
        agencia: data.agencia,
        conta_corrente: data.conta,
        tipo_chave_pix: data.tipochavepix || null,
      };

      const { error } = await supabase
        .from("contratos_alojamento")
        .update(payload)
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Contrato atualizado com sucesso!");
      navigate("/contratos-alojamento");
    } catch (error) {
      console.error("Erro ao atualizar contrato:", error);
      toast.error("Não foi possível atualizar o contrato");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={() => navigate("/contratos-alojamento")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <div className="text-center py-8">Carregando dados do contrato...</div>
        </div>
      </div>
    );
  }

  if (!contrato) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={() => navigate("/contratos-alojamento")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <div className="text-center py-8 text-muted-foreground">Contrato não encontrado</div>
        </div>
      </div>
    );
  }

  const formatarCpfCnpj = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatarCep = (cep: string) => {
    return cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  return (
    <div className="min-h-screen p-8 animate-in fade-in-0 duration-500">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/contratos-alojamento")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Contrato de Alojamento</h1>
            <p className="text-muted-foreground">Contrato {id}</p>
          </div>
        </div>

        {/* Formulário */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle>Identificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CCA</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: CCA001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tipoimovel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Imóvel</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposImovel.map(tipo => (
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
              </CardContent>
            </Card>

            
            
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="logradouro"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Logradouro</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, Avenida..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="complemento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Apto, Bloco..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="municipio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Município</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da cidade" {...field} />
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
                        <FormLabel>UF</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estados.map(estado => (
                              <SelectItem key={estado} value={estado}>
                                {estado}
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
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="00000-000" 
                            {...field}
                            onChange={(e) => field.onChange(formatarCep(e.target.value))}
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

            <Card>
              <CardHeader>
                <CardTitle>Características do Alojamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacidadecontratada"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacidade Contratada</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ocupacaoatual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ocupação Atual</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="35" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Caução</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="caucao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Caução (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="5000.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados Contratuais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="datainicio"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Início</FormLabel>
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
                                  format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                  <span>Selecione a data</span>
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
                              locale={ptBR}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="datafim"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Término</FormLabel>
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
                                  format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                  <span>Selecione a data</span>
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
                              locale={ptBR}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="valormensal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor Mensal (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="5000.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="diadevencimento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dia de Vencimento</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="31" placeholder="10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="formadepagamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forma de Pagamento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {formasPagamento.map(forma => (
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

                <FormField
                  control={form.control}
                  name="clausulareajuste"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cláusula de Reajuste</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: IPCA, IGP-M" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Informações adicionais sobre o contrato..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proprietário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nomeproprietario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do proprietário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cpfcnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF/CNPJ</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="000.000.000-00" 
                            {...field}
                            onChange={(e) => field.onChange(formatarCpfCnpj(e.target.value))}
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
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados Bancários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="banco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banco</FormLabel>
                        <FormControl>
                          <Input placeholder="001" {...field} />
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
                        <FormLabel>Agência</FormLabel>
                        <FormControl>
                          <Input placeholder="1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="conta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conta</FormLabel>
                        <FormControl>
                          <Input placeholder="12345-6" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipochavepix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Chave PIX</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposChavePix.map(tipo => (
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
                    name="chavepix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chave PIX</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite a chave PIX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/contratos-alojamento")}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

