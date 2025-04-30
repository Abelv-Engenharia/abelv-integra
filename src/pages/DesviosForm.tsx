
import React, { useEffect, useState } from "react";
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
  XCircle,
  ArrowRight,
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
import { useToast } from "@/hooks/use-toast";
import { 
  fetchCCAs, 
  fetchEmpresas, 
  fetchBaseLegalOpcoes, 
  fetchEngenheiros, 
  fetchSupervisores, 
  fetchEncarregados, 
  fetchFuncionarios,
  CCA,
  Empresa,
  BaseLegalOpcao,
  Engenheiro,
  Supervisor,
  Encarregado,
  Funcionario
} from "@/services/desviosService";

const formSchema = z.object({
  data: z.date({
    required_error: "Data é obrigatória",
  }),
  hora: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)"),
  ano: z.string(),
  mes: z.string(),
  cca: z.string({
    required_error: "O CCA é obrigatório.",
  }),
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
  empresa: z.string({
    required_error: "A empresa é obrigatória",
  }),
  disciplina: z.string({
    required_error: "Selecione a disciplina",
  }),
  engenheiro_responsavel: z.string({
    required_error: "O engenheiro responsável é obrigatório",
  }),
  
  descricao: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  base_legal: z.string({
    required_error: "A base legal é obrigatória",
  }),
  supervisor_responsavel: z.string({
    required_error: "O supervisor responsável é obrigatório",
  }),
  encarregado_responsavel: z.string({
    required_error: "O encarregado responsável é obrigatório",
  }),
  colaborador_infrator: z.string().optional(),
  funcao_colaborador: z.string().optional(),
  matricula_colaborador: z.string().optional(),
  
  tratativa_aplicada: z.string().min(10, "Tratativa aplicada deve ter no mínimo 10 caracteres"),
  responsavel_acao: z.string().min(3, "Responsável pela ação deve ter no mínimo 3 caracteres"),
  prazo_correcao: z.date().optional(),
  situacao_acao: z.enum(["PENDENTE", "EM_TRATATIVA", "TRATADO"]),
  aplicacao_medida_disciplinar: z.boolean().default(false),
  
  exposicao: z.enum(["1", "2", "3"]),
  controle: z.enum(["0", "1", "2", "3"]),
  deteccao: z.enum(["1", "2", "3"]),
  severidade: z.enum(["1", "2", "3", "4", "5"]),
  impacto: z.enum(["1", "2", "3"]),
});

type FormValues = z.infer<typeof formSchema>;

const calculateRiskLevel = (formValues: Partial<FormValues>) => {
  if (!formValues.exposicao || !formValues.controle || !formValues.deteccao || !formValues.severidade || !formValues.impacto) {
    return "Não definido";
  }
  
  const exposicaoValue = parseInt(formValues.exposicao);
  const controleValue = parseInt(formValues.controle);
  const deteccaoValue = parseInt(formValues.deteccao);
  const severidadeValue = parseInt(formValues.severidade);
  const impactoValue = parseInt(formValues.impacto);
  
  const riskValue = ((exposicaoValue + controleValue + deteccaoValue) * (severidadeValue + impactoValue));
  
  if (riskValue <= 10) return "TRIVIAL";
  if (riskValue <= 21) return "TOLERÁVEL";
  if (riskValue <= 40) return "MODERADO";
  if (riskValue <= 56) return "SUBSTANCIAL";
  return "INTOLERÁVEL";
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
  
  // State for dropdown options from Supabase
  const [ccaOptions, setCCAOptions] = useState<CCA[]>([]);
  const [empresasOptions, setEmpresasOptions] = useState<Empresa[]>([]);
  const [baseLegalOptions, setBaseLegalOptions] = useState<BaseLegalOpcao[]>([]);
  const [engenheirosOptions, setEngenheirosOptions] = useState<Engenheiro[]>([]);
  const [supervisoresOptions, setSupervisoresOptions] = useState<Supervisor[]>([]);
  const [encarregadosOptions, setEncarregadosOptions] = useState<Encarregado[]>([]);
  const [colaboradoresOptions, setColaboradoresOptions] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ccas, empresas, baseLegal, engenheiros, supervisores, encarregados, funcionarios] = await Promise.all([
          fetchCCAs(),
          fetchEmpresas(),
          fetchBaseLegalOpcoes(),
          fetchEngenheiros(),
          fetchSupervisores(),
          fetchEncarregados(),
          fetchFuncionarios()
        ]);
        
        setCCAOptions(ccas);
        setEmpresasOptions(empresas);
        setBaseLegalOptions(baseLegal);
        setEngenheirosOptions(engenheiros);
        setSupervisoresOptions(supervisores);
        setEncarregadosOptions(encarregados);
        setColaboradoresOptions(funcionarios);
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as opções do formulário",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const defaultValues: Partial<FormValues> = {
    data: new Date(),
    hora: format(new Date(), "HH:mm"),
    ano: new Date().getFullYear().toString(),
    mes: format(new Date(), "MMMM", { locale: ptBR }),
    situacao_acao: "PENDENTE",
    aplicacao_medida_disciplinar: false,
    exposicao: "1",
    controle: "0",
    deteccao: "1",
    severidade: "1",
    impacto: "1",
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'data' && value.data) {
        const date = value.data as Date;
        form.setValue('ano', date.getFullYear().toString());
        form.setValue('mes', format(date, "MMMM", { locale: ptBR }));
      }
      
      // Autofill function and matricula when colaborador_infrator changes
      if (name === 'colaborador_infrator' && value.colaborador_infrator) {
        const selectedColaborador = colaboradoresOptions.find(
          col => col.id === value.colaborador_infrator
        );
        
        if (selectedColaborador) {
          form.setValue('funcao_colaborador', selectedColaborador.funcao);
          form.setValue('matricula_colaborador', selectedColaborador.matricula);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, colaboradoresOptions]);
  
  const formValues = form.watch();
  const riskLevel = calculateRiskLevel(formValues);
  const actionStatus = calculateActionStatus(formValues.situacao_acao, formValues.prazo_correcao);
  
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    toast({
      title: "Formulário enviado",
      description: "O desvio foi registrado com sucesso!",
    });
    
    form.reset(defaultValues);
  };
  
  const navigateToNextTab = (currentTab: string) => {
    const tabOrder = ["identificacao", "informacoes", "acao-corretiva", "classificacao-risco"];
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      const nextTab = tabOrder[currentIndex + 1];
      const tabElement = document.querySelector(`[data-state="inactive"][value="${nextTab}"]`) as HTMLElement;
      if (tabElement) {
        tabElement.click();
      }
    }
  };
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "TRIVIAL": return "bg-green-100 text-green-800 border-green-300";
      case "TOLERÁVEL": return "bg-blue-100 text-blue-800 border-blue-300";
      case "MODERADO": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "SUBSTANCIAL": return "bg-orange-100 text-orange-800 border-orange-300";
      case "INTOLERÁVEL": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  // Fallback options in case fetching fails
  const disciplinaOptions = [
    { value: "civil", label: "Civil" },
    { value: "mecanica", label: "Mecânica" },
    { value: "eletrica", label: "Elétrica" },
    { value: "automacao", label: "Automação" },
    { value: "instrumentacao", label: "Instrumentação" },
    { value: "seguranca", label: "Segurança" },
    { value: "meio_ambiente", label: "Meio Ambiente" },
  ];
  
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
      
      {loading ? (
        <Card>
          <CardContent className="pt-6 flex justify-center items-center h-[200px]">
            <p>Carregando opções do formulário...</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="identificacao" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
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
                  </TabsList>
                  
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o CCA" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ccaOptions.map((option) => (
                                  <SelectItem key={option.id} value={option.codigo}>
                                    {option.codigo} - {option.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a empresa" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {empresasOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.id.toString()}>
                                      {option.nome}
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
                                  {disciplinaOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
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
                        name="engenheiro_responsavel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Engenheiro Responsável*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o engenheiro responsável" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {engenheirosOptions.map((option) => (
                                  <SelectItem key={option.id} value={option.id}>
                                    {option.nome} ({option.funcao})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button type="button" onClick={() => navigateToNextTab("identificacao")}>
                          Próximo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a base legal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {baseLegalOptions.map((option) => (
                                  <SelectItem key={option.id} value={option.id.toString()}>
                                    {option.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o supervisor" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {supervisoresOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                      {option.nome} ({option.funcao})
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
                          name="encarregado_responsavel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Encarregado Responsável*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o encarregado" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {encarregadosOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                      {option.nome} ({option.funcao})
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
                          name="colaborador_infrator"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Colaborador Infrator</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o colaborador" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {colaboradoresOptions.map((option) => (
                                    <SelectItem key={option.id} value={option.id}>
                                      {option.nome}
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
                          name="funcao_colaborador"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Função</FormLabel>
                              <FormControl>
                                <Input {...field} readOnly />
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
                                <Input {...field} readOnly />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="button" onClick={() => navigateToNextTab("informacoes")}>
                          Próximo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
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
                      
                      <FormField
                        control={form.control}
                        name="aplicacao_medida_disciplinar"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Aplicação de Medida Disciplinar</FormLabel>
                              <FormDescription>
                                Será aplicada medida disciplinar ao colaborador infrator?
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
                      
                      <div className="flex justify-end">
                        <Button type="button" onClick={() => navigateToNextTab("acao-corretiva")}>
                          Próximo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="classificacao-risco" className="pt-4">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
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
                                          <RadioGroupItem value="1" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          1 - Rara
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="2" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          2 - Ocasional
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="3" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          3 - Frequente
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <FormField
                              control={form.control}
                              name="controle"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel>Controles*</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col space-y-1"
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="0" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          0 - Adequados
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="1" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          1 - Moderados
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="2" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          2 - Inadequados
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="3" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          3 - Inexistentes
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
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
                                          <RadioGroupItem value="1" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          1 - Fácil
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="2" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          2 - Moderada
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="3" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          3 - Difícil
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
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
                                          <RadioGroupItem value="1" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          1 - Leve (pequenos ferimentos sem afastamento)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="2" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          2 - Moderada (lesões com afastamento temporário)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="3" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          3 - Crítica (ferimentos graves, incapacidade parcial)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="4" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          4 - Catastrófica (incapacidade permanente)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="5" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          5 - Fatal (morte)
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
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
                                          <RadioGroupItem value="1" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          1 - Baixo (impacto pequeno/restrito)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="2" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          2 - Médio (impacto moderado/local)
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="3" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          3 - Alto (impacto grave/amplo)
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col space-y-3">
                            <h3 className="text-lg font-medium">Classificação de Risco:</h3>
                            <div
                              className={`px-4 py-3 rounded-md border ${getRiskColor(
                                riskLevel
                              )}`}
                            >
                              <div className="font-semibold">{riskLevel}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="flex justify-end space-x-2">
                        <Button type="submit" className="gap-1">
                          <Save className="h-4 w-4" /> Salvar Desvio
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DesviosForm;
