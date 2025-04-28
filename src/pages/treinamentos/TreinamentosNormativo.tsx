import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays } from "date-fns";
import { CalendarIcon, Check, Save, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  MOCK_FUNCIONARIOS, 
  MOCK_TREINAMENTOS,
  Funcionario
} from "@/types/treinamentos";
import { calcularDataValidade, calcularStatusTreinamento } from "@/utils/treinamentosUtils";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  funcionarioId: z.string({
    required_error: "O funcionário é obrigatório",
  }),
  treinamentoId: z.string({
    required_error: "O treinamento é obrigatório",
  }),
  tipo: z.enum(["Formação", "Reciclagem"], {
    required_error: "O tipo de treinamento é obrigatório",
  }),
  dataRealizacao: z.date({
    required_error: "A data de realização é obrigatória",
  }),
  certificado: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TreinamentosNormativo = () => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [dataValidade, setDataValidade] = useState<Date | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "Formação",
    },
  });

  const watchFuncionarioId = form.watch("funcionarioId");
  const watchTreinamentoId = form.watch("treinamentoId");
  const watchDataRealizacao = form.watch("dataRealizacao");
  
  React.useEffect(() => {
    if (watchFuncionarioId) {
      const funcionario = MOCK_FUNCIONARIOS.find(f => f.id === watchFuncionarioId);
      setSelectedFuncionario(funcionario || null);
    } else {
      setSelectedFuncionario(null);
    }
  }, [watchFuncionarioId]);
  
  React.useEffect(() => {
    if (watchTreinamentoId && watchDataRealizacao) {
      const novaDataValidade = calcularDataValidade(watchTreinamentoId, watchDataRealizacao);
      setDataValidade(novaDataValidade);
    } else {
      setDataValidade(null);
    }
  }, [watchTreinamentoId, watchDataRealizacao]);

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    
    const file = data.certificado?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erro ao salvar",
        description: "O arquivo deve ter no máximo 2MB",
        variant: "destructive",
      });
      return;
    }
    
    const novoTreinamento = {
      id: `new-${Date.now()}`,
      funcionarioId: data.funcionarioId,
      treinamentoId: data.treinamentoId,
      tipo: data.tipo,
      dataRealizacao: data.dataRealizacao,
      dataValidade: dataValidade as Date,
      certificadoUrl: file ? URL.createObjectURL(file) : undefined,
      status: calcularStatusTreinamento(dataValidade as Date),
      arquivado: false,
    };
    
    console.log("Novo treinamento normativo:", novoTreinamento);
    
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
              O registro de treinamento normativo foi salvo com sucesso.
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
                setSelectedFuncionario(null);
                setDataValidade(null);
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
        <h1 className="text-3xl font-bold tracking-tight">Registro de Treinamentos Normativos</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informações do Treinamento Normativo</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para registrar um treinamento normativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="funcionarioId"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Funcionário</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o funcionário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MOCK_FUNCIONARIOS.map((funcionario) => (
                            <SelectItem key={funcionario.id} value={funcionario.id}>
                              {funcionario.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormItem className="flex-1">
                  <FormLabel>Função</FormLabel>
                  <Input 
                    value={selectedFuncionario?.funcao || ""} 
                    disabled 
                  />
                </FormItem>
                
                <FormItem className="flex-1">
                  <FormLabel>Matrícula</FormLabel>
                  <Input 
                    value={selectedFuncionario?.matricula || ""} 
                    disabled 
                  />
                </FormItem>
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de treinamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Formação">Formação</SelectItem>
                        <SelectItem value="Reciclagem">Reciclagem</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataRealizacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da realização</FormLabel>
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

              <FormItem>
                <FormLabel>Data de validade</FormLabel>
                <Input
                  value={dataValidade ? format(dataValidade, "dd/MM/yyyy") : ""}
                  disabled
                />
                {dataValidade && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {calcularStatusTreinamento(dataValidade) === "Válido" ? (
                      <span className="text-green-600">Válido até esta data</span>
                    ) : calcularStatusTreinamento(dataValidade) === "Próximo ao vencimento" ? (
                      <span className="text-amber-600">Próximo ao vencimento</span>
                    ) : (
                      <span className="text-red-600">Vencido</span>
                    )}
                  </div>
                )}
              </FormItem>

              <FormField
                control={form.control}
                name="certificado"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Anexar certificado (PDF, máx. 2MB)</FormLabel>
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

export default TreinamentosNormativo;
