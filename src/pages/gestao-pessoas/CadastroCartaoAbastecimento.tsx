import { useState, useEffect } from "react"
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
import { supabase } from "@/integrations/supabase/client"
import { useVeiculos } from "@/hooks/gestao-pessoas/useVeiculos"

const formSchema = z.object({
  status: z.string().min(1, "Status é obrigatório"),
  tipo_cartao: z.string().min(1, "Tipo de cartão é obrigatório"),
  limite_credito: z.number().optional(),
  veiculo_id: z.string().min(1, "Veículo é obrigatório"),
  condutor_id: z.string().optional(),
  condutor_nome: z.string().min(1, "Condutor é obrigatório"),
  placa: z.string().min(1, "Placa é obrigatória"),
  veiculo_modelo: z.string().optional(),
  numero_cartao: z.string().min(1, "Número do cartão é obrigatório"),
  data_validade: z.date({
    required_error: "Data de validade é obrigatória",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function CadastroCartaoAbastecimento() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { data: veiculos, isLoading: loadingVeiculos } = useVeiculos()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      tipo_cartao: "",
      limite_credito: undefined,
      veiculo_id: "",
      condutor_id: "",
      condutor_nome: "",
      placa: "",
      veiculo_modelo: "",
      numero_cartao: "",
      data_validade: undefined,
    },
  })

  // Auto-preencher condutor e placa ao selecionar veículo
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'veiculo_id' && value.veiculo_id && veiculos) {
        const veiculoSelecionado = veiculos.find(v => v.id === value.veiculo_id)
        if (veiculoSelecionado) {
          form.setValue('placa', veiculoSelecionado.placa)
          form.setValue('veiculo_modelo', veiculoSelecionado.modelo)
          
          if (veiculoSelecionado.condutor) {
            form.setValue('condutor_id', veiculoSelecionado.condutor.id)
            form.setValue('condutor_nome', veiculoSelecionado.condutor.nome_condutor)
          } else {
            form.setValue('condutor_id', '')
            form.setValue('condutor_nome', '')
          }
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, veiculos])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      // Verificar se o número do cartão já existe
      const numeroCartaoLimpo = values.numero_cartao.replace(/\s/g, "")
      
      const { data: cartaoExistente, error: errorCheck } = await supabase
        .from('veiculos_cartoes_abastecimento')
        .select('id')
        .eq('numero_cartao_hash', numeroCartaoLimpo)
        .maybeSingle()

      if (errorCheck) throw errorCheck

      if (cartaoExistente) {
        toast({
          title: "Erro",
          description: "Este número de cartão já está cadastrado.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Construir objeto para inserir no Supabase
      const cartaoParaSalvar = {
        id: crypto.randomUUID(),
        status: values.status,
        condutor_id: values.condutor_id || null,
        condutor_nome: values.condutor_nome,
        placa: values.placa,
        veiculo_id: values.veiculo_id,
        veiculo_modelo: values.veiculo_modelo || null,
        numero_cartao: numeroCartaoLimpo,
        numero_cartao_hash: numeroCartaoLimpo,
        data_validade: format(values.data_validade, 'yyyy-MM-dd'),
        tipo_cartao: values.tipo_cartao,
        limite_credito: values.limite_credito || null,
        bandeira: null,
        observacoes: null,
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null,
      }

      // Inserir no Supabase
      const { data, error } = await supabase
        .from('veiculos_cartoes_abastecimento')
        .insert(cartaoParaSalvar)
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Cartão cadastrado com sucesso!",
      })

      form.reset()
    } catch (error) {
      console.error('Erro ao cadastrar cartão:', error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cadastrar cartão. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <nav className="text-sm mb-4 text-muted-foreground">
        Gestão de Pessoas &gt; Recursos & Benefícios &gt; Gestão de Veículos &gt;
        <span className="text-foreground font-medium"> Cadastro de Cartão</span>
      </nav>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cadastro de Cartão de Abastecimento</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie cartões de combustível
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados do Cartão</CardTitle>
          <CardDescription>Informações do cartão de abastecimento</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* LINHA 1: Status | Tipo de Cartão | Limite de Crédito */}
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
                          <SelectItem value="bloqueado">Bloqueado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tipo_cartao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Tipo de Cartão *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="combustivel">Combustível</SelectItem>
                          <SelectItem value="pedagio">Pedágio</SelectItem>
                          <SelectItem value="multiplo">Múltiplo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="limite_credito"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite de Crédito</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00" 
                          value={field.value ? field.value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }) : ""}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "")
                            const numValue = Number(value) / 100
                            field.onChange(numValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* LINHA 2: Veículo | Condutor | Placa */}
                <FormField
                  control={form.control}
                  name="veiculo_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Veículo *
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={loadingVeiculos}
                      >
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione o veículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {veiculos?.map((veiculo) => (
                            <SelectItem key={veiculo.id} value={veiculo.id}>
                              {veiculo.modelo} - {veiculo.placa}
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
                  name="condutor_nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Condutor *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Condutor" 
                          className={cn(!field.value && "border-destructive", "bg-muted")}
                          readOnly
                          {...field} 
                        />
                      </FormControl>
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
                          placeholder="AAA-0000" 
                          className={cn(!field.value && "border-destructive", "bg-muted")}
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* LINHA 3: Número do Cartão | Data de Validade */}
                <FormField
                  control={form.control}
                  name="numero_cartao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Número do Cartão *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0000 0000 0000 0000" 
                          className={cn(!field.value && "border-destructive")}
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\s/g, "").replace(/\D/g, "")
                            value = value.match(/.{1,4}/g)?.join(" ") || value
                            field.onChange(value)
                          }}
                          maxLength={19}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="data_validade"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Data de Validade *
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
                  onClick={() => navigate("/gestao-veiculos")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
