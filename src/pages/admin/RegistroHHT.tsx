
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for CCA options
const ccaOptions = [
  { id: "1", name: "CCA 001 - Administração" },
  { id: "2", name: "CCA 002 - Manutenção" },
  { id: "3", name: "CCA 003 - Operação" },
  { id: "4", name: "CCA 004 - Logística" },
  { id: "5", name: "CCA 005 - Segurança" },
];

// Get current year and past 3 years for the year options
const getCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
};

// Get month options with names
const getMonths = () => {
  return [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];
};

// Form schema using zod
const hhtFormSchema = z.object({
  month: z.string({
    required_error: "Selecione um mês",
  }),
  year: z.string({
    required_error: "Selecione um ano",
  }),
  cca: z.string({
    required_error: "Selecione um CCA",
  }),
  hoursWorked: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    {
      message: "Horas trabalhadas deve ser um número maior que zero",
    }
  ),
});

type HHTFormValues = z.infer<typeof hhtFormSchema>;

const RegistroHHT = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<HHTFormValues>({
    resolver: zodResolver(hhtFormSchema),
    defaultValues: {
      month: new Date().getMonth() + 1 + "", // Current month
      year: new Date().getFullYear() + "", // Current year
      cca: "",
      hoursWorked: "",
    },
  });

  const onSubmit = async (data: HHTFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would save data to the backend
      console.log("HHT data to submit:", data);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registro de HHT salvo com sucesso",
        description: `${data.hoursWorked} horas registradas para ${getCCANameById(data.cca)} em ${getMonthName(data.month)}/${data.year}`,
      });
      
      // Reset form or navigate back
      form.reset();
    } catch (error) {
      console.error("Error submitting HHT data:", error);
      toast({
        title: "Erro ao salvar registro",
        description: "Ocorreu um erro ao salvar o registro de HHT. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get CCA name by ID
  const getCCANameById = (id: string) => {
    const cca = ccaOptions.find(cca => cca.id === id);
    return cca ? cca.name : id;
  };

  // Helper function to get month name by number
  const getMonthName = (monthNumber: string) => {
    const month = getMonths().find(m => m.value === monthNumber);
    return month ? month.label : monthNumber;
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Registro de HHT</h1>
        <p className="text-muted-foreground">
          Registre as horas-homem trabalhadas por centro de custo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Registro de HHT</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mês</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o mês" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getMonths().map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
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
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o ano" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getCurrentYear().map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
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
                name="cca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CCA</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o CCA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ccaOptions.map((cca) => (
                          <SelectItem key={cca.id} value={cca.id}>
                            {cca.name}
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
                name="hoursWorked"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horas Trabalhadas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Digite o número de horas trabalhadas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar registro"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistroHHT;
