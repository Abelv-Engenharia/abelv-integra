
import { useState, useEffect } from "react";
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
import { createHorasTrabalhadas } from "@/services/horaSegurancaService";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HHTTable } from "@/components/hora-seguranca/HHTTable";
import { HHTMonthChart } from "@/components/hora-seguranca/HHTMonthChart";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { InlineLoader } from "@/components/common/PageLoader";

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
  observacoes: z.string().optional(),
});

type HHTFormValues = z.infer<typeof hhtFormSchema>;

const RegistroHHT = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("registro");
  
  // Use user CCAs hook
  const { data: userCCAs = [], isLoading: isLoadingCCAs } = useUserCCAs();

  // Initialize form with default values
  const form = useForm<HHTFormValues>({
    resolver: zodResolver(hhtFormSchema),
    defaultValues: {
      month: new Date().getMonth() + 1 + "", // Current month
      year: new Date().getFullYear() + "", // Current year
      cca: "",
      hoursWorked: "",
      observacoes: "",
    },
  });

  const onSubmit = async (data: HHTFormValues) => {
    setIsSubmitting(true);
    try {
      // Save data to Supabase
      const hhtData = {
        cca_id: parseInt(data.cca),
        mes: parseInt(data.month),
        ano: parseInt(data.year),
        horas_trabalhadas: parseFloat(data.hoursWorked),
        observacoes: data.observacoes || undefined,
      };
      
      const result = await createHorasTrabalhadas(hhtData);
      
      if (result) {
        // Find the selected CCA to get its full name
        const selectedCca = userCCAs.find(cca => cca.id.toString() === data.cca);
        
        toast({
          title: "Registro de HHT salvo com sucesso",
          description: `${data.hoursWorked} horas registradas para ${selectedCca ? `${selectedCca.codigo} - ${selectedCca.nome}` : data.cca} em ${getMonthName(data.month)}/${data.year}`,
        });
        
        // Reset form
        form.reset({
          month: new Date().getMonth() + 1 + "",
          year: new Date().getFullYear() + "",
          cca: "",
          hoursWorked: "",
          observacoes: "",
        });
        
        // Mudar para a aba de visualização após o registro bem-sucedido
        setActiveTab("visualizar");
      } else {
        toast({
          title: "Erro ao salvar registro",
          description: "Ocorreu um erro ao salvar o registro de HHT. Tente novamente.",
          variant: "destructive",
        });
      }
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
        <h1 className="text-2xl font-bold tracking-tight">Horas-Homem Trabalhadas (HHT)</h1>
        <p className="text-muted-foreground">
          Registre e visualize as horas-homem trabalhadas por centro de custo
        </p>
      </div>

      <Tabs defaultValue="registro" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="registro">Registrar HHT</TabsTrigger>
          <TabsTrigger value="visualizar">Visualizar HHT</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registro" className="space-y-6">
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
                          disabled={isLoadingCCAs}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={isLoadingCCAs ? "Carregando CCAs..." : "Selecione o CCA"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {userCCAs.map((cca) => (
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

                  {isLoadingCCAs && (
                    <div className="text-center">
                      <InlineLoader text="Carregando CCAs permitidos..." />
                    </div>
                  )}

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
                            step="0.01"
                            min="0.01"
                            {...field}
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
                        <FormLabel>Observações (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações adicionais sobre o registro"
                            className="resize-none"
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
                    <Button type="submit" disabled={isSubmitting || isLoadingCCAs}>
                      {isSubmitting ? "Salvando..." : "Salvar registro"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualizar" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <HHTMonthChart />
            
            <Card>
              <CardHeader>
                <CardTitle>Horas Trabalhadas por CCA</CardTitle>
              </CardHeader>
              <CardContent>
                <HHTTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegistroHHT;
