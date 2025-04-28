import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const ccaOptions = [
  { value: "CCA001", label: "CCA 001" },
  { value: "CCA002", label: "CCA 002" },
  { value: "CCA003", label: "CCA 003" },
];

const inspecaoOptions = [
  { value: "DDS", label: "Diálogo Diário de Segurança (DDS)" },
  { value: "IB", label: "Inspeção de Barricada" },
  { value: "IT", label: "Inspeção de Trabalho em Altura" },
  { value: "IES", label: "Inspeção de Equipamentos de Segurança" },
  { value: "ISA", label: "Inspeção de Sistema Anti-queda" },
];

const responsaveisOptions = [
  { value: "RESP001", label: "João Silva", funcao: "Técnico de Segurança" },
  { value: "RESP002", label: "Maria Oliveira", funcao: "Engenheira de Segurança" },
  { value: "RESP003", label: "Carlos Santos", funcao: "Supervisor de Segurança" },
  { value: "outro", label: "Outro (Informar manualmente)" },
];

const formSchema = z.object({
  dataInspecao: z.date({
    required_error: "A data da inspeção é obrigatória.",
  }),
  mes: z.string().optional(),
  ano: z.string().optional(),
  cca: z.string({
    required_error: "O CCA é obrigatório.",
  }),
  inspecao: z.string({
    required_error: "A inspeção é obrigatória.",
  }),
  responsavel: z.string({
    required_error: "O responsável é obrigatório.",
  }),
  responsavelManual: z.string().optional(),
  funcao: z.string().optional(),
  desviosIdentificados: z.number()
    .int("O número de desvios deve ser um número inteiro.")
    .min(0, "O número de desvios não pode ser negativo.")
    .optional(),
});

const InspecoesNaoProgramadas = () => {
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsavelManual: "",
      funcao: "",
      desviosIdentificados: 0,
    },
  });

  const watchResponsavel = form.watch("responsavel");
  const isOutroResponsavel = watchResponsavel === "outro";

  const onDateChange = (date: Date) => {
    form.setValue("dataInspecao", date);
    form.setValue("mes", format(date, "MMMM"));
    form.setValue("ano", format(date, "yyyy"));
  };

  const onResponsavelChange = (value: string) => {
    form.setValue("responsavel", value);
    
    if (value !== "outro") {
      const selectedResponsavel = responsaveisOptions.find(resp => resp.value === value);
      if (selectedResponsavel) {
        form.setValue("funcao", selectedResponsavel.funcao);
      }
    } else {
      form.setValue("funcao", "");
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Dados da inspeção não programada:", data);
    
    const inspecaoData = {
      ...data,
      status: "REALIZADA NÃO PROGRAMADA",
    };
    
    console.log("Dados completos da inspeção não programada:", inspecaoData);
    
    toast({
      title: "Sucesso!",
      description: "Inspeção não programada cadastrada com sucesso!",
    });
    
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6 flex flex-col items-center justify-center space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold">Inspeção não programada cadastrada com sucesso!</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Button className="flex-1" onClick={() => {
                form.reset();
                setSuccess(false);
              }}>
                Registrar nova inspeção não programada
              </Button>
              <Button className="flex-1" variant="outline" asChild>
                <Link to="/hora-seguranca/dashboard">Menu principal (Dashboard)</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cadastro de Inspeções Não Programadas</h2>
          <p className="text-muted-foreground">
            Preencha os campos abaixo para cadastrar uma nova inspeção não programada
          </p>
        </div>

        {!success && (
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="dataInspecao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da inspeção</FormLabel>
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
                                onSelect={(date) => {
                                  if (date) onDateChange(date);
                                }}
                                disabled={(date) => date < new Date("1900-01-01")}
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
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
                            <Input {...field} readOnly disabled />
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
                            <Input {...field} readOnly disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                            {ccaOptions.map((option) => (
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

                  <FormField
                    control={form.control}
                    name="inspecao"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Inspeção programada</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de inspeção" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inspecaoOptions.map((option) => (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="responsavel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável pela inspeção</FormLabel>
                        <Select 
                          onValueChange={onResponsavelChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o responsável" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {responsaveisOptions.map((option) => (
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

                  <FormField
                    control={form.control}
                    name="funcao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            readOnly={!isOutroResponsavel} 
                            disabled={!isOutroResponsavel}
                            placeholder={isOutroResponsavel ? "Digite a função do responsável" : ""} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                  {isOutroResponsavel && (
                    <FormField
                      control={form.control}
                      name="responsavelManual"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do responsável</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Digite o nome do responsável" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="desviosIdentificados"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desvios identificados</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" size="default">Cadastrar inspeção</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InspecoesNaoProgramadas;
