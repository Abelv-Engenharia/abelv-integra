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

const formSchema = z.object({
  status: z.string().min(1, "Status é obrigatório"),
  condutor: z.string().min(1, "Condutor é obrigatório"),
  placa: z.string().min(1, "Placa é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  numeroCartao: z.string().min(1, "Número do cartão é obrigatório"),
  dataValidade: z.date({
    required_error: "Data de validade é obrigatória",
  }),
  tipoCartao: z.string().min(1, "Tipo de cartão é obrigatório"),
  limiteCredito: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CadastroCartaoAbastecimento() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      condutor: "",
      placa: "",
      modelo: "",
      numeroCartao: "",
      tipoCartao: "",
      limiteCredito: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const existingCartoes = JSON.parse(localStorage.getItem("cartoes") || "[]")
      const cartaoExiste = existingCartoes.some((cartao: any) => 
        cartao.numeroCartao.replace(/\s/g, "") === values.numeroCartao.replace(/\s/g, "")
      )

      if (cartaoExiste) {
        toast({
          title: "Erro",
          description: "Este número de cartão já está cadastrado.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const novoCartao = {
        id: crypto.randomUUID(),
        ...values,
        createdAt: new Date().toISOString(),
      }

      const cartoes = [...existingCartoes, novoCartao]
      localStorage.setItem("cartoes", JSON.stringify(cartoes))

      toast({
        title: "Sucesso",
        description: "Cartão cadastrado com sucesso!",
      })

      form.reset()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar cartão. Tente novamente.",
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
                  name="condutor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Condutor *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome do condutor" 
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
                  name="placa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Placa *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="AAA-0000" 
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
                          placeholder="Modelo do veículo" 
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
                  name="numeroCartao"
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
                  name="dataValidade"
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

                <FormField
                  control={form.control}
                  name="tipoCartao"
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
                  name="limiteCredito"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite de Crédito</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00" 
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "")
                            value = (Number(value) / 100).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                            field.onChange(value)
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
