import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, Save, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Treinamento } from "@/types/treinamentos";
import { cn } from "@/lib/utils";
import { fetchCCAs, CCAOption } from "@/services/treinamentos/ccaService";
import { fetchProcessosTreinamento, ProcessoTreinamentoOption } from "@/services/treinamentos/processoTreinamentoService";
import { fetchTiposTreinamento, TipoTreinamentoOption } from "@/services/treinamentos/tipoTreinamentoService";
import { criarExecucaoTreinamento } from "@/services/treinamentos/execucaoTreinamentoService";
import { fetchTreinamentos } from "@/utils/treinamentosUtils";

const formSchema = z.object({
  data: z.date({
    required_error: "A data é obrigatória",
  }),
  cca_id: z.number({
    required_error: "O CCA é obrigatório",
  }),
  processo_treinamento_id: z.string({
    required_error: "O processo de treinamento é obrigatório",
  }),
  tipo_treinamento_id: z.string({
    required_error: "O tipo de treinamento é obrigatório",
  }),
  treinamento_id: z.string({
    required_error: "O treinamento realizado é obrigatório",
  }).or(z.literal("outro")),
  treinamento_nome: z.string().optional(),
  carga_horaria: z.coerce.number({
    required_error: "A carga horária é obrigatória",
    invalid_type_error: "A carga horária deve ser um número",
  }).min(0, "A carga horária não pode ser negativa"),
  efetivo_mod: z.coerce.number({
    required_error: "O efetivo MOD é obrigatório",
    invalid_type_error: "O efetivo MOD deve ser um número",
  }).min(0, "O efetivo MOD não pode ser negativo"),
  efetivo_moi: z.coerce.number({
    required_error: "O efetivo MOI é obrigatório",
    invalid_type_error: "O efetivo MOI deve ser um número",
  }).min(0, "O efetivo MOI não pode ser negativo"),
  observacoes: z.string().optional(),
  lista_presenca: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TreinamentosExecucao = () => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isOutroTreinamento, setIsOutroTreinamento] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [horasTotais, setHorasTotais] = useState<number>(0);
  
  // Estado para as opções dos selects
  const [ccaOptions, setCCAOptions] = useState<CCAOption[]>([]);
  const [processoOptions, setProcessoOptions] = useState<ProcessoTreinamentoOption[]>([]);
  const [tipoOptions, setTipoOptions] = useState<TipoTreinamentoOption[]>([]);
  const [treinamentosOptions, setTreinamentosOptions] = useState<Treinamento[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      processo_treinamento_id: "",
      tipo_treinamento_id: "",
      treinamento_id: "",
      carga_horaria: 0,
      efetivo_mod: 0,
      efetivo_moi: 0,
    },
  });

  const treinamentoSelecionado = form.watch("treinamento_id");
  const cargaHoraria = form.watch("carga_horaria");
  const efetivoMod = form.watch("efetivo_mod");
  const efetivoMoi = form.watch("efetivo_moi");
  
  // Atualiza horas totais - Fix the calculation
  useEffect(() => {
    // Correctly calculate total hours by multiplying carga_horaria by the sum of both efetivos
    const total = cargaHoraria * (efetivoMod + efetivoMoi);
    setHorasTotais(total);
  }, [cargaHoraria, efetivoMod, efetivoMoi]);
  
  // Buscar dados das tabelas
  useEffect(() => {
    const loadFormOptions = async () => {
      setIsLoading(true);
      try {
        const [ccas, processos, tipos, treinamentos] = await Promise.all([
          fetchCCAs(),
          fetchProcessosTreinamento(),
          fetchTiposTreinamento(),
          fetchTreinamentos()
        ]);
        
        setCCAOptions(ccas);
        setProcessoOptions(processos);
        setTipoOptions(tipos);
        setTreinamentosOptions(treinamentos);
      } catch (error) {
        console.error("Erro ao carregar opções do formulário:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as opções do formulário",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFormOptions();
  }, []);
  
  // Gerenciar o campo de outro treinamento
  React.useEffect(() => {
    if (treinamentoSelecionado === "outro") {
      setIsOutroTreinamento(true);
      form.setValue("carga_horaria", 0);
    } else if (treinamentoSelecionado) {
      setIsOutroTreinamento(false);
      const treinamento = treinamentosOptions.find(t => t.id === treinamentoSelecionado);
      if (treinamento && treinamento.carga_horaria) {
        form.setValue("carga_horaria", treinamento.carga_horaria);
      }
    }
  }, [treinamentoSelecionado, form, treinamentosOptions]);

  const onSubmit = async (data: FormValues) => {
    console.log("Form data:", data);
    
    const file = data.lista_presenca?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro ao salvar",
        description: "O arquivo deve ter no máximo 2MB",
        variant: "destructive",
      });
      return;
    }
    
    if (data.treinamento_id === "outro" && !data.treinamento_nome) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do treinamento",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Calculate the total hours explicitly to ensure accuracy
      const calculatedHorasTotais = data.carga_horaria * (data.efetivo_mod + data.efetivo_moi);
      
      const resultado = await criarExecucaoTreinamento({
        data: data.data,
        cca_id: data.cca_id,
        processo_treinamento_id: data.processo_treinamento_id,
        tipo_treinamento_id: data.tipo_treinamento_id,
        treinamento_id: data.treinamento_id !== "outro" ? data.treinamento_id : undefined,
        treinamento_nome: data.treinamento_id === "outro" ? data.treinamento_nome : undefined,
        carga_horaria: data.carga_horaria,
        efetivo_mod: data.efetivo_mod,
        efetivo_moi: data.efetivo_moi,
        horas_totais: calculatedHorasTotais, // Use the calculated value instead of state
        observacoes: data.observacoes,
        lista_presenca_url: data.lista_presenca?.[0] // This should be lista_presenca_url instead of lista_presenca
      });
      
      if (resultado.success) {
        toast({
          title: "Sucesso!",
          description: "Registro realizado com sucesso!",
          variant: "default",
        });
        
        setIsSubmitSuccess(true);
      } else {
        toast({
          title: "Erro ao salvar",
          description: resultado.error || "Ocorreu um erro ao registrar o treinamento",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitSuccess) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Registro Concluído!</CardTitle>
            <CardDescription className="text-center">
              O registro de execução de treinamento foi salvo com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => {
                form.reset();
                setIsSubmitSuccess(false);
              }}
            >
              Registrar novo treinamento
            </Button>
            <Button asChild>
              <Link to="/treinamentos/dashboard">
                Menu principal
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link to="/treinamentos/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Registro de Execução de Treinamentos</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informações do Treinamento</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para registrar a execução de um treinamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <p>Carregando...</p>
            </div>
          )}
          
          {!isLoading && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Data</FormLabel>
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
                                  format(field.value, "dd/MM/yyyy")
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
                              disabled={(date) => date > new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormItem className="flex-1">
                    <FormLabel>Mês</FormLabel>
                    <Input 
                      value={form.watch("data") ? format(form.watch("data"), "MMMM") : ""} 
                      disabled 
                    />
                  </FormItem>
                  
                  <FormItem className="flex-1">
                    <FormLabel>Ano</FormLabel>
                    <Input 
                      value={form.watch("data") ? format(form.watch("data"), "yyyy") : ""} 
                      disabled 
                    />
                  </FormItem>
                </div>

                <FormField
                  control={form.control}
                  name="cca_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CCA</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        value={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o CCA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ccaOptions.map((cca) => (
                            <SelectItem key={cca.id} value={cca.id.toString()}>
                              {cca.codigo} - {cca.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="processo_treinamento_id"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Processo de treinamento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o processo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {processoOptions.map((processo) => (
                              <SelectItem key={processo.id} value={processo.id}>
                                {processo.nome}
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
                    name="tipo_treinamento_id"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Tipo de treinamento</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tipoOptions.map((tipo) => (
                              <SelectItem key={tipo.id} value={tipo.id}>
                                {tipo.nome}
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
                  name="treinamento_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treinamento realizado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o treinamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {treinamentosOptions.map((treinamento) => (
                            <SelectItem key={treinamento.id} value={treinamento.id}>
                              {treinamento.nome}
                            </SelectItem>
                          ))}
                          <SelectItem value="outro">Outro (informar manualmente)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isOutroTreinamento && (
                  <FormField
                    control={form.control}
                    name="treinamento_nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do treinamento</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Informe o nome do treinamento" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <FormField
                    control={form.control}
                    name="carga_horaria"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Carga horária (horas)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            disabled={!isOutroTreinamento && !!treinamentoSelecionado && treinamentoSelecionado !== "outro"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormItem className="flex-1">
                    <FormLabel>Horas totais do treinamento</FormLabel>
                    <Input
                      type="number"
                      value={horasTotais}
                      disabled
                      className="bg-gray-100"
                    />
                  </FormItem>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="efetivo_mod"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Efetivo MOD treinado</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="efetivo_moi"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Efetivo MOI treinado</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" />
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
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informações adicionais sobre o treinamento"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lista_presenca"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Anexar lista de presença (PDF, máx. 2MB)</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" className="gap-1" disabled={isLoading}>
                    <Save className="h-4 w-4" />
                    {isLoading ? "Salvando..." : "Salvar registro"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinamentosExecucao;
