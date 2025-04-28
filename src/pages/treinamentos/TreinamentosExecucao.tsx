import React, { useState } from "react";
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
import { MOCK_TREINAMENTOS, OPCOES_CCA, OPCOES_PROCESSO_TREINAMENTO, OPCOES_TIPO_TREINAMENTO } from "@/types/treinamentos";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  data: z.date({
    required_error: "A data é obrigatória",
  }),
  cca: z.string({
    required_error: "O CCA é obrigatório",
  }),
  processoTreinamento: z.string({
    required_error: "O processo de treinamento é obrigatório",
  }),
  tipoTreinamento: z.string({
    required_error: "O tipo de treinamento é obrigatório",
  }),
  treinamentoId: z.string({
    required_error: "O treinamento realizado é obrigatório",
  }).or(z.literal("outro")),
  treinamentoNome: z.string().optional(),
  cargaHoraria: z.coerce.number({
    required_error: "A carga horária é obrigatória",
    invalid_type_error: "A carga horária deve ser um número",
  }).min(0, "A carga horária não pode ser negativa"),
  observacoes: z.string().optional(),
  listaPresenca: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TreinamentosExecucao = () => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isOutroTreinamento, setIsOutroTreinamento] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      processoTreinamento: "",
      tipoTreinamento: "",
      treinamentoId: "",
      cargaHoraria: 0,
    },
  });

  const treinamentoSelecionado = form.watch("treinamentoId");
  
  React.useEffect(() => {
    if (treinamentoSelecionado === "outro") {
      setIsOutroTreinamento(true);
      form.setValue("cargaHoraria", 0);
    } else if (treinamentoSelecionado) {
      setIsOutroTreinamento(false);
      const treinamento = MOCK_TREINAMENTOS.find(t => t.id === treinamentoSelecionado);
      if (treinamento && treinamento.cargaHoraria) {
        form.setValue("cargaHoraria", treinamento.cargaHoraria);
      }
    }
  }, [treinamentoSelecionado, form]);

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    
    const file = data.listaPresenca?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro ao salvar",
        description: "O arquivo deve ter no máximo 2MB",
        variant: "destructive",
      });
      return;
    }
    
    if (data.treinamentoId === "outro" && !data.treinamentoNome) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o nome do treinamento",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: "Registro realizado com sucesso!",
      variant: "default",
    });
    
    setIsSubmitSuccess(true);
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
                name="cca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CCA</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o CCA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {OPCOES_CCA.map((cca) => (
                          <SelectItem key={cca} value={cca}>
                            {cca}
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
                  name="processoTreinamento"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Processo de treinamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o processo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OPCOES_PROCESSO_TREINAMENTO.map((processo) => (
                            <SelectItem key={processo} value={processo}>
                              {processo}
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
                  name="tipoTreinamento"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tipo de treinamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OPCOES_TIPO_TREINAMENTO.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>
                              {tipo}
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
                name="treinamentoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Treinamento realizado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o treinamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_TREINAMENTOS.map((treinamento) => (
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
                  name="treinamentoNome"
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

              <FormField
                control={form.control}
                name="cargaHoraria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carga horária (horas)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        disabled={!isOutroTreinamento && !!treinamentoSelecionado}
                      />
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
                name="listaPresenca"
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
                <Button type="submit" className="gap-1">
                  <Save className="h-4 w-4" />
                  Salvar registro
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinamentosExecucao;
