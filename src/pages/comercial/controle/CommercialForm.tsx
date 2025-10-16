import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { statusOptions } from "@/data/commercialMockData";
import { useToast } from "@/hooks/use-toast";
import { useSegmentos } from "@/hooks/comercial/useSegmentos";
import { useVendedores } from "@/hooks/comercial/useVendedores";
import { usePropostasComerciais, useProposta } from "@/hooks/comercial/usePropostasComerciais";

const commercialSchema = z.object({
  pc: z.string()
    .min(1, "PC é obrigatório")
    .regex(/^\d{5}$/, "PC deve conter exatamente 5 dígitos"),
  dataSaidaProposta: z.string()
    .min(1, "Data de Saída da Proposta é obrigatória")
    .refine((date) => {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return inputDate <= today;
    }, "Data de Saída não pode ser futura"),
  orcamentoDuplicado: z.enum(["Sim", "Não"], {
    required_error: "Orçamento Duplicado é obrigatório"
  }),
  segmento: z.string().min(1, "Segmento é obrigatório"),
  cliente: z.string().min(1, "Cliente é obrigatório"),
  obra: z.string().min(1, "Obra é obrigatória"),
  vendedor: z.string().min(1, "Vendedor é obrigatório"),
  numeroRevisao: z.coerce.number().min(0, "Número da Revisão deve ser maior ou igual a 0"),
  valorVenda: z.coerce.number().min(0, "Valor de Venda deve ser maior que 0"),
  margemPercentual: z.coerce.number().min(0, "Margem Percentual deve ser maior ou igual a 0").max(100, "Margem não pode ser maior que 100%"),
  margemValor: z.coerce.number().min(0, "Margem em Valor deve ser maior ou igual a 0"),
  status: z.string().min(1, "Status é obrigatório")
});

type CommercialFormData = z.infer<typeof commercialSchema>;

const CommercialForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = !!id;
  
  const { segmentos, isLoading: isLoadingSegmentos } = useSegmentos();
  const { vendedores, isLoading: isLoadingVendedores } = useVendedores();
  const { createProposta, updateProposta, isCreating, isUpdating } = usePropostasComerciais();
  const { proposta, isLoading: isLoadingProposta } = useProposta(id);

  const form = useForm<CommercialFormData>({
    resolver: zodResolver(commercialSchema),
    defaultValues: {
      pc: "",
      dataSaidaProposta: "",
      orcamentoDuplicado: "Não",
      segmento: "",
      cliente: "",
      obra: "",
      vendedor: "",
      numeroRevisao: 1,
      valorVenda: 0,
      margemPercentual: 0,
      margemValor: 0,
      status: ""
    }
  });

  useEffect(() => {
    if (proposta && isEditing) {
      form.reset({
        pc: proposta.pc,
        dataSaidaProposta: proposta.data_saida_proposta,
        orcamentoDuplicado: proposta.orcamento_duplicado,
        segmento: proposta.segmento_id,
        cliente: proposta.cliente,
        obra: proposta.obra,
        vendedor: proposta.vendedor_id,
        numeroRevisao: proposta.numero_revisao,
        valorVenda: proposta.valor_venda,
        margemPercentual: proposta.margem_percentual,
        margemValor: proposta.margem_valor,
        status: proposta.status
      });
    }
  }, [proposta, isEditing, form]);

  const onSubmit = (data: CommercialFormData) => {
    const propostaData = {
      pc: data.pc,
      data_saida_proposta: data.dataSaidaProposta,
      orcamento_duplicado: data.orcamentoDuplicado,
      segmento_id: data.segmento,
      cliente: data.cliente,
      obra: data.obra,
      vendedor_id: data.vendedor,
      numero_revisao: data.numeroRevisao,
      valor_venda: data.valorVenda,
      margem_percentual: data.margemPercentual,
      margem_valor: data.margemValor,
      status: data.status
    };

    if (isEditing && id) {
      updateProposta({ id, ...propostaData });
    } else {
      createProposta(propostaData);
    }
    
    navigate("/comercial/controle/performance");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/comercial/controle/performance")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Cadastro de Proposta
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEditing ? "Altere os dados do registro comercial" : "Preencha os dados para criar um novo registro comercial"}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dados do Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="pc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          PC *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="12345"
                            maxLength={5}
                            className={!field.value ? "border-destructive" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataSaidaProposta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Data de Saída da Proposta *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            className={!field.value ? "border-destructive" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orcamentoDuplicado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Orçamento Duplicado *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sim">Sim</SelectItem>
                            <SelectItem value="Não">Não</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="segmento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Segmento *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingSegmentos}>
                          <FormControl>
                            <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                              <SelectValue placeholder={isLoadingSegmentos ? "Carregando..." : "Selecione um segmento"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {segmentos.filter(s => s.ativo).map(segmento => (
                              <SelectItem key={segmento.id} value={segmento.id}>
                                {segmento.nome}
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
                    name="cliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Cliente *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nome do cliente"
                            className={!field.value ? "border-destructive" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="obra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Obra *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nome da obra"
                            className={!field.value ? "border-destructive" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vendedor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Vendedor *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingVendedores}>
                          <FormControl>
                            <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                              <SelectValue placeholder={isLoadingVendedores ? "Carregando..." : "Selecione um vendedor"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vendedores.filter(v => v.ativo).map(vendedor => (
                              <SelectItem key={vendedor.id} value={vendedor.id}>
                                {vendedor.profiles.nome}
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
                    name="numeroRevisao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Número da Revisão *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            placeholder="0"
                            className={!field.value ? "border-destructive" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                   <FormField
                    control={form.control}
                    name="valorVenda"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Valor de Venda (R$) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0,00"
                            className={!field.value ? "border-destructive" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="margemPercentual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Margem Percentual (%) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            placeholder="0,0"
                            className={!field.value ? "border-destructive" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="margemValor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Margem Valor (R$) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0,00"
                            className={!field.value ? "border-destructive" : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-destructive">
                          Status *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={!field.value ? "border-destructive" : ""}>
                              <SelectValue placeholder="Selecione um status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map(status => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="submit" className="gap-2" disabled={isCreating || isUpdating || isLoadingProposta}>
                    <Save className="h-4 w-4" />
                    {isCreating || isUpdating ? "Salvando..." : "Salvar"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/comercial/controle/performance")} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommercialForm;