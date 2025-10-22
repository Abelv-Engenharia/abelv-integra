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
import { useCcas } from "@/hooks/useMedidasDisciplinares"

const formSchema = z.object({
  // Linha 1
  cca_id: z.string().min(1, "CCA é obrigatório"),
  
  // Linha 2
  veiculo_id: z.string().min(1, "Veículo é obrigatório"),
  condutor_id: z.string().optional(),
  condutor_nome: z.string().min(1, "Condutor é obrigatório"),
  placa: z.string().min(1, "Placa é obrigatória"),
  veiculo_modelo: z.string().optional(),
  
  // Linha 3
  local: z.string().min(1, "Local é obrigatório"),
  data_utilizacao: z.date({
    required_error: "Data de utilização é obrigatória",
  }),
  horario: z.string().min(1, "Horário é obrigatório"),
  
  // Linha 4
  tipo_servico: z.string().min(1, "Tipo de serviço é obrigatório"),
  finalidade: z.string().optional(),
  valor: z.number().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CadastroPedagioEstacionamento() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { data: ccas, isLoading: loadingCcas } = useCcas()
  const { data: veiculos, isLoading: loadingVeiculos } = useVeiculos()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cca_id: "",
      veiculo_id: "",
      condutor_id: "",
      condutor_nome: "",
      placa: "",
      veiculo_modelo: "",
      local: "",
      data_utilizacao: undefined,
      horario: "",
      tipo_servico: "",
      finalidade: "",
      valor: undefined,
    },
  })

  // Auto-preencher condutor e placa ao selecionar veículo
  useEffect(() => {
    const veiculoId = form.watch('veiculo_id')
    if (veiculoId && veiculos) {
      const veiculoSelecionado = veiculos.find(v => v.id === veiculoId)
      if (veiculoSelecionado) {
        form.setValue('placa', veiculoSelecionado.placa)
        form.setValue('veiculo_modelo', veiculoSelecionado.modelo)
        
        // Preencher condutor se existir
        if (veiculoSelecionado.condutor) {
          form.setValue('condutor_id', veiculoSelecionado.condutor.id)
          form.setValue('condutor_nome', veiculoSelecionado.condutor.nome_condutor)
        } else {
          form.setValue('condutor_id', '')
          form.setValue('condutor_nome', '')
        }
      }
    }
  }, [form.watch('veiculo_id'), veiculos, form])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      // Converter valor para número se existir
      const valorNumerico = values.valor || null

      // Construir objeto para inserir no Supabase
      const pedagogioParaSalvar = {
        id: crypto.randomUUID(),
        cca_id: parseInt(values.cca_id),
        veiculo_id: values.veiculo_id,
        condutor_id: values.condutor_id || null,
        condutor_nome: values.condutor_nome,
        placa: values.placa,
        data_utilizacao: format(values.data_utilizacao, 'yyyy-MM-dd'),
        horario: values.horario + ':00', // Adicionar segundos
        local: values.local,
        tipo_servico: values.tipo_servico,
        finalidade: values.finalidade || null,
        valor: valorNumerico,
        observacoes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Inserir no Supabase
      const { error } = await supabase
        .from('veiculos_pedagogios_estacionamentos')
        .insert(pedagogioParaSalvar)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Registro cadastrado com sucesso!",
      })

      // Resetar todos os campos
      form.reset({
        cca_id: "",
        veiculo_id: "",
        condutor_id: "",
        condutor_nome: "",
        placa: "",
        veiculo_modelo: "",
        local: "",
        data_utilizacao: undefined,
        horario: "",
        tipo_servico: "",
        finalidade: "",
        valor: undefined,
      })
    } catch (error) {
      console.error('Erro ao cadastrar registro:', error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cadastrar registro. Tente novamente.",
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
        <span className="text-foreground font-medium"> Cadastro de Pedágio</span>
      </nav>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cadastro de Pedágio/Estacionamento (Sem Parar)</h1>
        <p className="text-muted-foreground mt-2">
          Registre transações de pedágio e estacionamento
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados da Transação</CardTitle>
          <CardDescription>Informações do serviço utilizado</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* LINHA 1: CCA (linha inteira) */}
              <FormField
                control={form.control}
                name="cca_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      CCA *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(!field.value && "border-destructive")}>
                          <SelectValue placeholder="Selecione o CCA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ccas?.map((cca) => (
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

              {/* LINHA 2: Veículo | Condutor | Placa */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="veiculo_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Veículo *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                          placeholder="Selecionado automaticamente" 
                          className={cn("bg-muted", !field.value && "border-destructive")}
                          {...field}
                          readOnly
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
                          className={cn("bg-muted", !field.value && "border-destructive")}
                          {...field}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* LINHA 3: Local | Data de Utilização | Horário */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="local"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Local *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Local de utilização" 
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
                  name="data_utilizacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Data de Utilização *
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
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione</span>
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
                  name="horario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Horário *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          className={cn(!field.value && "border-destructive")}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* LINHA 4: Tipo de Serviço | Finalidade | Valor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="tipo_servico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Tipo de Serviço *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pedagio">Pedágio</SelectItem>
                          <SelectItem value="estacionamento">Estacionamento</SelectItem>
                          <SelectItem value="lavagem">Lavagem</SelectItem>
                          <SelectItem value="posto">Posto de Combustível</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="finalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Finalidade</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a finalidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="trabalho">Trabalho</SelectItem>
                          <SelectItem value="pessoal">Pessoal</SelectItem>
                          <SelectItem value="emergencia">Emergência</SelectItem>
                          <SelectItem value="manutencao">Manutenção</SelectItem>
                          <SelectItem value="outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00" 
                          value={field.value ? `R$ ${field.value.toFixed(2).replace('.', ',')}` : ''}
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
