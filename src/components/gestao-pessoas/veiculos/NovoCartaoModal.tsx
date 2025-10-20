import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  status: z.string().min(1, "Status é obrigatório"),  
  motorista: z.string().min(1, "Motorista é obrigatório"),
  placa: z.string().min(1, "Placa é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  numeroCartao: z.string().min(1, "Número do cartão é obrigatório"),
  vencimento: z.date({
    required_error: "Data de vencimento é obrigatória",
  }),
  tipoCartao: z.string().min(1, "Tipo do cartão é obrigatório"),
  limiteCredito: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface NovoCartaoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NovoCartaoModal({ open, onOpenChange }: NovoCartaoModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      motorista: "",
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
      // Verificar se o número do cartão já existe
      const existingCartoes = JSON.parse(localStorage.getItem("cartoes") || "[]")
      const cartaoExiste = existingCartoes.some((cartao: any) => 
        cartao.numeroCartao === values.numeroCartao
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

      // Salvar no localStorage
      const cartoes = [...existingCartoes, novoCartao]
      localStorage.setItem("cartoes", JSON.stringify(cartoes))

      toast({
        title: "Sucesso",
        description: "Cartão de abastecimento cadastrado com sucesso!",
      })

      form.reset()
      onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cartão de Abastecimento</DialogTitle>
        </DialogHeader>

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
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motorista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Motorista *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome do motorista" 
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
                          let value = e.target.value.replace(/\D/g, "")
                          value = value.replace(/(\d{4})(?=\d)/g, "$1 ")
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
                name="vencimento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Vencimento *
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
                name="tipoCartao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Tipo do Cartão *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(!field.value && "border-destructive")}>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixo">Fixo</SelectItem>
                        <SelectItem value="estoque">Estoque</SelectItem>
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
                onClick={() => onOpenChange(false)}
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
      </DialogContent>
    </Dialog>
  )
}