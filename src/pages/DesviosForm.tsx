
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  Save,
  AlertTriangle,
  ClipboardList,
  User,
  Wrench,
  BarChart4,
  Lightbulb,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toggle, ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";

// Define the form schema with Zod
const formSchema = z.object({
  // Identificação
  data: z.date({
    required_error: "Data é obrigatória",
  }),
  hora: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)"),
  ano: z.string(),
  mes: z.string(),
  cca: z.string().min(2, "CCA deve ter no mínimo 2 caracteres"),
  tipo_registro: z.string({
    required_error: "Selecione o tipo de registro",
  }),
  processo: z.string({
    required_error: "Selecione o processo",
  }),
  evento_identificado: z.string({
    required_error: "Selecione o evento identificado",
  }),
  causa_provavel: z.string({
    required_error: "Selecione a causa provável",
  }),
  responsavel_inspecao: z.string().min(3, "Responsável deve ter no mínimo 3 caracteres"),
  empresa: z.string().min(2, "Empresa deve ter no mínimo 2 caracteres"),
  disciplina: z.string({
    required_error: "Selecione a disciplina",
  }),
  engenheiro_responsavel: z.string().min(3, "Engenheiro responsável deve ter no mínimo 3 caracteres"),
  
  // Informações
  descricao: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  base_legal: z.string().min(3, "Base legal deve ter no mínimo 3 caracteres"),
  supervisor_responsavel: z.string().min(3, "Supervisor responsável deve ter no mínimo 3 caracteres"),
  encarregado_responsavel: z.string().min(3, "Encarregado responsável deve ter no mínimo 3 caracteres"),
  colaborador_infrator: z.string().optional(),
  funcao_colaborador: z.string().optional(),
  matricula_colaborador: z.string().optional(),
  
  // Ação corretiva
  tratativa_aplicada: z.string().min(10, "Tratativa aplicada deve ter no mínimo 10 caracteres"),
  responsavel_acao: z.string().min(3, "Responsável pela ação deve ter no mínimo 3 caracteres"),
  prazo_correcao: z.date().optional(),
  situacao_acao: z.enum(["PENDENTE", "EM_TRATATIVA", "TRATADO"]),
  aplicacao_medida_disciplinar: z.boolean().default(false),
  
  // Classificação de risco
  exposicao: z.enum(["BAIXA", "MEDIA", "ALTA"]),
  controle: z.enum(["BAIXO", "MEDIO", "ALTO"]),
  deteccao: z.enum(["BAIXA", "MEDIA", "ALTA"]),
  severidade: z.enum(["BAIXA", "MEDIA", "ALTA"]),
  impacto: z.enum(["BAIXO", "MEDIO", "ALTO"]),
});

type FormValues = z.infer<typeof formSchema>;

const calculateRiskLevel = (formValues: Partial<FormValues>) => {
  if (!formValues.exposicao || !formValues.controle || !formValues.deteccao || !formValues.severidade || !formValues.impacto) {
    return "Não definido";
  }
  
  // Criando um sistema de pontuação simples
  const scoringMap = {
    BAIXA: 1,
    BAIXO: 1,
    MEDIA: 2,
    MEDIO: 2,
    ALTA: 3,
    ALTO: 3
  };
  
  const exposicaoScore = scoringMap[formValues.exposicao];
  const controleScore = scoringMap[formValues.controle];
  const deteccaoScore = scoringMap[formValues.deteccao];
  const severidadeScore = scoringMap[formValues.severidade];
  const impactoScore = scoringMap[formValues.impacto];
  
  // Calculando a pontuação de probabilidade e efeito
  const probabilidadeScore = (exposicaoScore + controleScore + deteccaoScore) / 3;
  const efeitoScore = (severidadeScore + impactoScore) / 2;
  
  // Calculando o risco total
  const riscoTotal = probabilidadeScore * efeitoScore;
  
  // Determinando o nível de risco
  if (riscoTotal <= 2) return "BAIXO";
  if (riscoTotal <= 6) return "MÉDIO";
  return "ALTO";
};

const calculateActionStatus = (situacao: string | undefined, prazo: Date | undefined) => {
  if (!situacao) return "PENDENTE";
  
  if (situacao === "TRATADO") return "CONCLUÍDO";
  
  if (situacao === "EM_TRATATIVA" && prazo) {
    return new Date() > prazo ? "PENDENTE" : "EM ANDAMENTO";
  }
  
  return "PENDENTE";
};

const DesviosForm = () => {
  const { toast } = useToast();
  
  // Set default values for the form fields
  const defaultValues: Partial<FormValues> = {
    data: new Date(),
    hora: format(new Date(), "HH:mm"),
    ano: new Date().getFullYear().toString(),
    mes: format(new Date(), "MMMM", { locale: ptBR }),
    situacao_acao: "PENDENTE",
    aplicacao_medida_disciplinar: false,
    exposicao: "BAIXA",
    controle: "BAIXO",
    deteccao: "BAIXA",
    severidade: "BAIXA",
    impacto: "BAIXO",
  };
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Update year and month when date changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'data' && value.data) {
        const date = value.data as Date;
        form.setValue('ano', date.getFullYear().toString());
        form.setValue('mes', format(date, "MMMM", { locale: ptBR }));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Get current values for risk calculation
  const formValues = form.watch();
  const riskLevel = calculateRiskLevel(formValues);
  const actionStatus = calculateActionStatus(formValues.situacao_acao, formValues.prazo_correcao);
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    toast({
      title: "Formulário enviado",
      description: "O desvio foi registrado com sucesso!",
    });
    
    // Reset the form after submission
    form.reset(defaultValues);
  };
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "BAIXO": return "bg-green-100 text-green-800 border-green-300";
      case "MÉDIO": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "ALTO": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cadastro de Desvios</h1>
        <p className="text-muted-foreground">
          Registre um novo desvio no sistema
        </p>
      </div>
      
      <Alert variant="default">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Atenção</AlertTitle>
        <AlertDescription>
          Preencha todos os campos obrigatórios marcados com *. Este formulário ainda não está conectado ao banco de dados.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="identificacao" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="identificacao" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    <span className="hidden md:inline">Identificação</span>
                  </TabsTrigger>
                  <TabsTrigger value="informacoes" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">Informações</span>
                  </TabsTrigger>
                  <TabsTrigger value="acao-corretiva" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span className="hidden md:inline">Ação Corretiva</span>
                  </TabsTrigger>
                  <TabsTrigger value="classificacao-risco" className="flex items-center gap-2">
                    <BarChart4 className="h-4 w-4" />
                    <span className="hidden md:inline">Classificação de Risco</span>
                  </TabsTrigger>
                  <TabsTrigger value="sugestao-acao" className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    <span className="hidden md:inline">Sugestão de Ação</span>
                  </TabsTrigger>
                </TabsList>
                
                {/* Tab 1: Identificação */}
                <TabsContent value="identificacao" className="pt-4">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="data"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data*</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
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
                        name="hora"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hora*</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ano"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ano</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="mes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mês</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="cca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CCA*</FormLabel>
                          <FormControl>
                            <Input placeholder="Centro de Custo Aplicado" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tipo_registro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Registro*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo de registro" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="desvio">Desvio</SelectItem>
                                <SelectItem value="nao_conformidade">Não Conformidade</SelectItem>
                                <SelectItem value="ocorrencia">Ocorrência</SelectItem>
                                <SelectItem value="incidente">Incidente</SelectItem>
                                <SelectItem value="acidente">Acidente</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="processo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Processo*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o processo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="operacional">Operacional</SelectItem>
                                <SelectItem value="administrativo">Administrativo</SelectItem>
                                <SelectItem value="seguranca">Segurança</SelectItem>
                                <SelectItem value="saude">Saúde</SelectItem>
                                <SelectItem value="meio_ambiente">Meio Ambiente</SelectItem>
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
                        name="evento_identificado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Evento Identificado*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o evento" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="comportamento_inseguro">Comportamento Inseguro</SelectItem>
                                <SelectItem value="condicao_insegura">Condição Insegura</SelectItem>
                                <SelectItem value="falha_equipamento">Falha de Equipamento</SelectItem>
                                <SelectItem value="falha_processo">Falha de Processo</SelectItem>
                                <SelectItem value="falha_comunicacao">Falha de Comunicação</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="causa_provavel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Causa Provável*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a causa" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="falta_treinamento">Falta de Treinamento</SelectItem>
                                <SelectItem value="falta_procedimento">Falta de Procedimento</SelectItem>
                                <SelectItem value="negligencia">Negligência</SelectItem>
                                <SelectItem value="imprudencia">Imprudência</SelectItem>
                                <SelectItem value="falha_projeto">Falha de Projeto</SelectItem>
                                <SelectItem value="falha_manutencao">Falha de Manutenção</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="responsavel_inspecao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsável pela Inspeção*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do responsável" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="empresa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa*</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome da empresa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="disciplina"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Disciplina*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a disciplina" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="civil">Civil</SelectItem>
                                <SelectItem value="mecanica">Mecânica</SelectItem>
                                <SelectItem value="eletrica">Elétrica</SelectItem>
                                <SelectItem value="automacao">Automação</SelectItem>
                                <SelectItem value="instrumentacao">Instrumentação</SelectItem>
                                <SelectItem value="seguranca">Segurança</SelectItem>
                                <SelectItem value="meio_ambiente">Meio Ambiente</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="engenheiro_responsavel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Engenheiro Responsável*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do engenheiro responsável" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                {/* Tab 2: Informações */}
                <TabsContent value="informacoes" className="pt-4">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="descricao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva detalhadamente o desvio identificado"
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="base_legal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Legal*</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: NR-10, NR-35, ISO 45001, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="supervisor_responsavel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Supervisor Responsável*</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do supervisor" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="encarregado_responsavel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Encarregado Responsável*</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do encarregado" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="colaborador_infrator"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Colaborador Infrator</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do colaborador" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="funcao_colaborador"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Função</FormLabel>
                            <FormControl>
                              <Input placeholder="Função do colaborador" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="matricula_colaborador"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Matrícula</FormLabel>
                            <FormControl>
                              <Input placeholder="Número de matrícula" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="button" variant="outline" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        Cadastrar Novo Funcionário
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab 3: Ação Corretiva */}
                <TabsContent value="acao-corretiva" className="pt-4">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="tratativa_aplicada"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tratativa Aplicada*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva detalhadamente a tratativa aplicada para correção do desvio"
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="responsavel_acao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsável pela Ação*</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do responsável pela ação corretiva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="prazo_correcao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prazo para Correção*</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
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
                                  disabled={(date) => date < new Date()}
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
                        name="situacao_acao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Situação da Ação*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a situação" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PENDENTE">Pendente</SelectItem>
                                <SelectItem value="EM_TRATATIVA">Em Tratativa</SelectItem>
                                <SelectItem value="TRATADO">Tratado</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="font-semibold mb-2">Status da Ação:</div>
                      <div className={cn(
                        "inline-block px-3 py-1 rounded-full text-sm font-medium border",
                        actionStatus === "CONCLUÍDO" ? "bg-green-100 text-green-800 border-green-300" :
                        actionStatus === "EM ANDAMENTO" ? "bg-blue-100 text-blue-800 border-blue-300" :
                        "bg-yellow-100 text-yellow-800 border-yellow-300"
                      )}>
                        {actionStatus}
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="aplicacao_medida_disciplinar"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Aplicação de Medida Disciplinar
                            </FormLabel>
                            <FormDescription>
                              Ative caso seja necessário aplicar uma medida disciplinar
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                {/* Tab 4: Classificação de Risco */}
                <TabsContent value="classificacao-risco" className="pt-4">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Probabilidade</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="exposicao"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Exposição*</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="BAIXA" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Baixa
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="MEDIA" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Média
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="ALTA" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Alta
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="controle"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Controle*</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="BAIXO" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Baixo
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="MEDIO" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Médio
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="ALTO" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Alto
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="deteccao"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Detecção*</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="BAIXA" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Baixa
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="MEDIA" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Média
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="ALTA" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Alta
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Efeito de Falha</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="severidade"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Severidade*</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="BAIXA" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Baixa
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="MEDIA" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Média
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="ALTA" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Alta
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="impacto"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Impacto*</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="BAIXO" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Baixo
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="MEDIO" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Médio
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="ALTO" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Alto
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Gradação de Risco</h3>
                      
                      <div className="p-6 border rounded-md flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold mb-2">Nível de Risco</div>
                        <div className={cn(
                          "text-4xl font-bold px-8 py-4 rounded-md",
                          getRiskColor(riskLevel)
                        )}>
                          {riskLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Tab 5: Sugestão de Ação */}
                <TabsContent value="sugestao-acao" className="pt-4">
                  <div className="space-y-6">
                    <div className="p-6 border rounded-md">
                      <h3 className="text-lg font-medium flex items-center mb-4">
                        <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                        Sugestão de Ação Baseada em IA
                      </h3>
                      
                      <div className="bg-muted p-4 rounded-md">
                        <p className="text-muted-foreground italic">
                          Este recurso utilizará a descrição do desvio e a classificação de risco para sugerir ações corretivas utilizando inteligência artificial.
                        </p>
                        
                        <div className="mt-4 p-4 bg-card rounded-md border">
                          <p className="font-medium mb-2">Baseado na descrição e nível de risco ({riskLevel}), recomendamos:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Implementar treinamento específico para os colaboradores envolvidos</li>
                            <li>Revisar procedimentos operacionais relacionados à atividade</li>
                            <li>Realizar inspeção detalhada dos equipamentos utilizados</li>
                            <li>Implementar checklist diário de verificação antes do início das atividades</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Registro
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DesviosForm;

