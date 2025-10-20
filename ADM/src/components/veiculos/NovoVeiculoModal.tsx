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
  locadora: z.string().min(1, "Locadora é obrigatória"),
  placa: z.string()
    .min(1, "Placa é obrigatória")
    .regex(/^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/i, "Formato de placa inválido (AAA-0000 ou AAA-0A00)"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  condutorPrincipal: z.string().optional(),
  condutor2: z.string().optional(),
  condutor3: z.string().optional(),
  valor: z.string().optional(),
  cca: z.string().optional(),
  franquiaContratada: z.string().optional(),
  numeroContrato: z.string().optional(),
  numeroReserva: z.string().optional(),
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

interface NovoVeiculoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NovoVeiculoModal({ open, onOpenChange }: NovoVeiculoModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "",
      locadora: "",
      placa: "",
      modelo: "",
      condutorPrincipal: "",
      condutor2: "",
      condutor3: "",
      valor: "",
      cca: "",
      franquiaContratada: "",
      numeroContrato: "",
      numeroReserva: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      // Verificar se a placa já existe no localStorage
      const existingVeiculos = JSON.parse(localStorage.getItem("veiculos") || "[]")
      const placaExiste = existingVeiculos.some((veiculo: any) => 
        veiculo.placa.toLowerCase().replace("-", "") === values.placa.toLowerCase().replace("-", "")
      )

      if (placaExiste) {
        toast({
          title: "Erro",
          description: "Esta placa já está cadastrada.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Criar novo veículo
      const novoVeiculo = {
        id: crypto.randomUUID(),
        ...values,
        createdAt: new Date().toISOString(),
      }

      // Salvar no localStorage
      const veiculos = [...existingVeiculos, novoVeiculo]
      localStorage.setItem("veiculos", JSON.stringify(veiculos))

      toast({
        title: "Sucesso",
        description: "Veículo cadastrado com sucesso!",
      })

      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar veículo. Tente novamente.",
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
          <DialogTitle>Novo Veículo</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações do Veículo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações do Veículo</h3>
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
                          <SelectItem value="em_uso">Em uso</SelectItem>
                          <SelectItem value="disponivel">Disponível</SelectItem>
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
                      <FormControl>
                        <Input 
                          placeholder="Nome da locadora" 
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
                        Modelo do Veículo *
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
                  name="condutorPrincipal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condutor Principal</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do condutor principal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condutor2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condutor 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do segundo condutor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condutor3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condutor 3</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do terceiro condutor" {...field} />
                      </FormControl>
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

                <FormField
                  control={form.control}
                  name="cca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CCA (Centro de Custo)</FormLabel>
                      <FormControl>
                        <Input placeholder="Centro de custo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Informações do Contrato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações do Contrato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="franquiaContratada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Franquia Contratada</FormLabel>
                      <FormControl>
                        <Input placeholder="Valor da franquia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numeroContrato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº do Contrato</FormLabel>
                      <FormControl>
                        <Input placeholder="Número do contrato" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numeroReserva"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nº da Reserva</FormLabel>
                      <FormControl>
                        <Input placeholder="Número da reserva" {...field} />
                      </FormControl>
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
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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