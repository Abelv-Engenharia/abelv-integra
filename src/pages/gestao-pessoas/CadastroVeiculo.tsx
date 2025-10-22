import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useCondutores } from "@/hooks/gestao-pessoas/useCondutores"
import { useLocadoras } from "@/hooks/gestao-pessoas/useLocadoras"
import { supabase } from "@/integrations/supabase/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const formSchema = z.object({
  status: z.string().min(1, "Status é obrigatório"),
  locadora: z.string().min(1, "Locadora é obrigatória"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  placa: z.string()
    .min(1, "Placa é obrigatória")
    .regex(/^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/i, "Formato de placa inválido (AAA-0000 ou AAA-0A00)"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  franquiaKm: z.string().min(1, "Franquia KM é obrigatória"),
  condutorPrincipal: z.string().min(1, "Condutor principal é obrigatório"),
  dataRetirada: z.date({
    required_error: "Data de retirada é obrigatória",
  }),
  dataDevolucao: z.date({
    required_error: "Data de devolução é obrigatória",
  }),
}).refine((data) => {
  if (data.dataRetirada && data.dataDevolucao) {
    return data.dataDevolucao >= data.dataRetirada
  }
  return true
}, {
  message: "Data de devolução deve ser igual ou posterior à data de retirada",
  path: ["dataDevolucao"],
})

type FormValues = z.infer<typeof formSchema>

export default function CadastroVeiculo() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { data: condutores, isLoading: loadingCondutores } = useCondutores()
  const { data: locadoras, isLoading: loadingLocadoras } = useLocadoras()
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      locadora: "",
      tipo: "",
      placa: "",
      modelo: "",
      franquiaKm: "",
      condutorPrincipal: "",
    },
  })

  const createVeiculoMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Verificar duplicação de placa
      const { data: existing } = await supabase
        .from('veiculos')
        .select('placa')
        .eq('placa', values.placa.toUpperCase().replace("-", ""))
        .maybeSingle()

      if (existing) {
        throw new Error('Placa já cadastrada')
      }

      // Inserir novo veículo
      const { data, error } = await supabase
        .from('veiculos')
        .insert([{
          status: values.status,
          locadora_id: values.locadora,
          tipo_locacao: values.tipo,
          placa: values.placa.toUpperCase(),
          modelo: values.modelo,
          franquia_km: values.franquiaKm,
          condutor_principal_nome: values.condutorPrincipal,
          data_retirada: values.dataRetirada.toISOString(),
          data_devolucao: values.dataDevolucao.toISOString(),
          ativo: true
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Veículo cadastrado com sucesso!",
      })
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['veiculos'] })
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message === 'Placa já cadastrada' 
          ? "Esta placa já está cadastrada." 
          : "Erro ao cadastrar veículo. Tente novamente.",
        variant: "destructive",
      })
    }
  })

  const onSubmit = (values: FormValues) => {
    createVeiculoMutation.mutate(values)
  }

  return (
    <div className="container mx-auto p-6">
      <nav className="text-sm mb-4 text-muted-foreground">
        Gestão de Pessoas &gt; Recursos & Benefícios &gt; Gestão de Veículos &gt;
        <span className="text-foreground font-medium"> Cadastro de Veículo</span>
      </nav>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cadastro de Veículo</h1>
        <p className="text-muted-foreground mt-2">
          Registre novos veículos no sistema
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados do Veículo</CardTitle>
          <CardDescription>Preencha as informações do veículo</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Status *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="encerrado">Encerrado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="locadora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Locadora *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione a locadora" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingLocadoras ? (
                            <SelectItem value="loading" disabled>Carregando locadoras...</SelectItem>
                          ) : locadoras && locadoras.length > 0 ? (
                            locadoras.map((locadora) => (
                              <SelectItem key={locadora.id} value={locadora.id.toString()}>
                                {locadora.nome}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>Nenhuma locadora cadastrada</SelectItem>
                          )}
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
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Tipo *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mensal">Mensal</SelectItem>
                          <SelectItem value="esporadico">Esporádico</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Placa *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="AAA-0000 ou AAA-0A00" 
                          className={cn(!field.value && "border-destructive")}
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value.toUpperCase()
                            if (value.length === 3) value += "-"
                            field.onChange(value)
                          }}
                          maxLength={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Modelo *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Honda Civic 2020" 
                          className={cn(!field.value && "border-destructive")}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="franquiaKm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Franquia Km *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 2000 km" 
                          className={cn(!field.value && "border-destructive")}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condutorPrincipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Condutor Principal *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione condutor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingCondutores ? (
                            <SelectItem value="loading" disabled>Carregando condutores...</SelectItem>
                          ) : condutores && condutores.length > 0 ? (
                            condutores.map((condutor) => (
                              <SelectItem key={condutor.id} value={condutor.id.toString()}>
                                {condutor.nome_condutor}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>Nenhum condutor cadastrado</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataRetirada"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Data de Retirada *
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground border-destructive"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
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
                  name="dataDevolucao"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Data de Devolução *
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground border-destructive"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
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
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/gestao-pessoas/dashboard-veiculos")}
                  disabled={createVeiculoMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createVeiculoMutation.isPending}>
                  {createVeiculoMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
