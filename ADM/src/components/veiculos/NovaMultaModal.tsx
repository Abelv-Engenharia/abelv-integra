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
  numeroAutoInfracao: z.string().min(1, "Número do auto de infração é obrigatório"),
  dataHorarioMulta: z.date({
    required_error: "Data e horário da multa são obrigatórios",
  }),
  ocorrencia: z.string().min(1, "Ocorrência é obrigatória"),
  pontos: z.string().min(1, "Pontos são obrigatórios"),
  dataNotificacao: z.date().optional(),
  responsavel: z.string().optional(),
  condutorInfrator: z.string().optional(),
  placa: z.string().min(1, "Placa é obrigatória"),
  veiculo: z.string().optional(),
  locadora: z.string().optional(),
  numeroFaturaTitulo: z.string().optional(),
  sienge: z.string().optional(),
  valor: z.string().optional(),
  indicadoOrgao: z.string().optional(),
  descontoRh: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface NovaMultaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NovaMultaModal({ open, onOpenChange }: NovaMultaModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroAutoInfracao: "",
      ocorrencia: "",
      pontos: "",
      responsavel: "",
      condutorInfrator: "",
      placa: "",
      veiculo: "",
      locadora: "",
      numeroFaturaTitulo: "",
      sienge: "",
      valor: "",
      indicadoOrgao: "",
      descontoRh: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const novaMulta = {
        id: crypto.randomUUID(),
        ...values,
        createdAt: new Date().toISOString(),
      }

      // Salvar no localStorage
      const existingMultas = JSON.parse(localStorage.getItem("multas") || "[]")
      const multas = [...existingMultas, novaMulta]
      localStorage.setItem("multas", JSON.stringify(multas))

      toast({
        title: "Sucesso",
        description: "Multa cadastrada com sucesso!",
      })

      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar multa. Tente novamente.",
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
          <DialogTitle>Nova Multa</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="numeroAutoInfracao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Nº Auto Infração *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Número do auto de infração" 
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
                name="dataHorarioMulta"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Data/Horário Multa *
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
                name="ocorrencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Ocorrência *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Descrição da ocorrência" 
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
                name="pontos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(!field.value && "text-destructive")}>
                      Pontos *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Quantidade de pontos" 
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
                name="dataNotificacao"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Notificação</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
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
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="condutorInfrator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condutor Infrator</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do condutor infrator" {...field} />
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
                name="veiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veículo</FormLabel>
                    <FormControl>
                      <Input placeholder="Modelo do veículo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locadora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locadora</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da locadora" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numeroFaturaTitulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº Fatura/Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Número da fatura" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sienge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SIENGE</FormLabel>
                    <FormControl>
                      <Input placeholder="Código SIENGE" {...field} />
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
                name="indicadoOrgao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indicado ao Órgão</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descontoRh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto RH</FormLabel>
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