import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DocumentUploadField } from "./DocumentUploadField"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { supabase } from "@/integrations/supabase/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const formSchema = z.object({
  numeroAutoInfracao: z.string().min(1, "Número do auto de infração é obrigatório"),
  dataMulta: z.date({ required_error: "Data da multa é obrigatória" }),
  horario: z.string().min(1, "Horário é obrigatório"),
  ocorrencia: z.string().min(1, "Ocorrência é obrigatória"),
  pontos: z.number().min(1, "Pontos são obrigatórios"),
  condutorInfrator: z.string().min(1, "Condutor infrator é obrigatório"),
  placa: z.string().min(1, "Placa é obrigatória"),
  dataNotificacao: z.date().optional(),
  responsavel: z.string().optional(),
  veiculo: z.string().optional(),
  locadora: z.string().optional(),
  valor: z.number().optional(),
  localCompleto: z.string().optional(),
  emailCondutor: z.string().email("E-mail inválido").optional().or(z.literal("")),
  numeroFatura: z.string().optional(),
  tituloSienge: z.string().optional(),
  indicadoOrgao: z.enum(["Sim", "Não", "Pendente"]).default("Pendente"),
  observacoesGerais: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface NovaMultaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  multaParaEdicao?: any | null
  onUpdate?: () => void
}

export function NovaMultaModal({ 
  open, 
  onOpenChange, 
  multaParaEdicao = null,
  onUpdate 
}: NovaMultaModalProps) {
  const { toast } = useToast()
  const [documentoNotificacao, setDocumentoNotificacao] = useState<File | null>(null)
  const [formularioPreenchido, setFormularioPreenchido] = useState<File | null>(null)
  const [comprovanteIndicacao, setComprovanteIndicacao] = useState<File | null>(null)
  const queryClient = useQueryClient()
  
  const isEdicao = !!multaParaEdicao
  const modalTitle = isEdicao ? "Editar Multa" : "Nova Multa"

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroAutoInfracao: "",
      horario: "",
      ocorrencia: "",
      pontos: 0,
      responsavel: "",
      condutorInfrator: "",
      placa: "",
      veiculo: "",
      locadora: "",
      numeroFatura: "",
      tituloSienge: "",
      valor: 0,
      indicadoOrgao: "Pendente" as const,
      localCompleto: "",
      emailCondutor: "",
      observacoesGerais: "",
    },
  })

  useEffect(() => {
    if (isEdicao && multaParaEdicao) {
      form.reset({
        numeroAutoInfracao: multaParaEdicao.numero_auto_infracao || "",
        dataMulta: new Date(multaParaEdicao.data_multa),
        horario: multaParaEdicao.horario || "",
        ocorrencia: multaParaEdicao.ocorrencia || "",
        pontos: multaParaEdicao.pontos || 0,
        dataNotificacao: multaParaEdicao.data_notificacao ? new Date(multaParaEdicao.data_notificacao) : undefined,
        responsavel: multaParaEdicao.responsavel || "",
        condutorInfrator: multaParaEdicao.condutor_infrator || "",
        placa: multaParaEdicao.placa || "",
        veiculo: multaParaEdicao.veiculo || "",
        locadora: multaParaEdicao.locadora || "",
        numeroFatura: multaParaEdicao.numero_fatura || "",
        tituloSienge: multaParaEdicao.titulo_sienge || "",
        valor: multaParaEdicao.valor || 0,
        indicadoOrgao: multaParaEdicao.indicado_orgao || "Pendente",
        localCompleto: multaParaEdicao.local_completo || "",
        emailCondutor: multaParaEdicao.email_condutor || "",
        observacoesGerais: "",
      })
    }
  }, [isEdicao, multaParaEdicao, form])

  const createMultaMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data, error } = await supabase
        .from('veiculos_multas')
        .insert([{
          numero_auto_infracao: values.numeroAutoInfracao,
          data_multa: values.dataMulta.toISOString(),
          horario: values.horario,
          ocorrencia: values.ocorrencia,
          pontos: values.pontos,
          condutor_infrator_nome: values.condutorInfrator,
          placa: values.placa.toUpperCase(),
          data_notificacao: values.dataNotificacao?.toISOString(),
          responsavel: values.responsavel,
          veiculo_modelo: values.veiculo,
          locadora_nome: values.locadora,
          valor: values.valor,
          local_completo: values.localCompleto,
          email_condutor: values.emailCondutor,
          numero_fatura: values.numeroFatura,
          titulo_sienge: values.tituloSienge,
          indicado_orgao: values.indicadoOrgao,
          status_multa: 'Registrada',
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
        description: "Multa cadastrada com sucesso!",
      })
      form.reset()
      setDocumentoNotificacao(null)
      setFormularioPreenchido(null)
      setComprovanteIndicacao(null)
      queryClient.invalidateQueries({ queryKey: ['multas'] })
      onOpenChange(false)
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar multa. Tente novamente.",
        variant: "destructive",
      })
    }
  })

  const updateMultaMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const { error } = await supabase
        .from('veiculos_multas')
        .update({
          numero_auto_infracao: values.numeroAutoInfracao,
          data_multa: values.dataMulta.toISOString(),
          horario: values.horario,
          ocorrencia: values.ocorrencia,
          pontos: values.pontos,
          condutor_infrator_nome: values.condutorInfrator,
          placa: values.placa.toUpperCase(),
          data_notificacao: values.dataNotificacao?.toISOString(),
          responsavel: values.responsavel,
          veiculo_modelo: values.veiculo,
          locadora_nome: values.locadora,
          valor: values.valor,
          local_completo: values.localCompleto,
          email_condutor: values.emailCondutor,
          numero_fatura: values.numeroFatura,
          titulo_sienge: values.tituloSienge,
          indicado_orgao: values.indicadoOrgao,
        })
        .eq('id', multaParaEdicao.id)

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Multa atualizada com sucesso!",
      })
      form.reset()
      setDocumentoNotificacao(null)
      setFormularioPreenchido(null)
      setComprovanteIndicacao(null)
      queryClient.invalidateQueries({ queryKey: ['multas'] })
      if (onUpdate) onUpdate()
      onOpenChange(false)
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar multa. Tente novamente.",
        variant: "destructive",
      })
    }
  })

  const onSubmit = (values: FormValues) => {
    if (isEdicao) {
      updateMultaMutation.mutate(values)
    } else {
      createMultaMutation.mutate(values)
    }
  }

  const isLoading = createMultaMutation.isPending || updateMultaMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{modalTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dados Básicos */}
            <Card>
              <CardHeader>
                <CardTitle>Dados da Infração</CardTitle>
              </CardHeader>
              <CardContent>
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
                    name="dataMulta"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className={cn(!field.value && "text-destructive")}>
                          DT Multa *
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
                            type="number"
                            placeholder="Quantidade de pontos" 
                            className={cn(!field.value && "border-destructive")}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
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
                        <FormLabel className={cn(!field.value && "text-destructive")}>
                          Condutor Infrator *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nome do condutor infrator" 
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
                    name="indicadoOrgao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indicado ao Órgão</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sim">Sim</SelectItem>
                            <SelectItem value="Não">Não</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                          </SelectContent>
                        </Select>
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
                    name="valor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEdicao && (
                    <>
                      <FormField
                        control={form.control}
                        name="numeroFatura"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nº Fatura</FormLabel>
                            <FormControl>
                              <Input placeholder="Número da fatura" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tituloSienge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título Sienge</FormLabel>
                            <FormControl>
                              <Input placeholder="Título SIENGE" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documentação */}
            <Card>
              <CardHeader>
                <CardTitle>Documentação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DocumentUploadField
                  label="Documento de Notificação"
                  value={documentoNotificacao?.name || null}
                  onChange={setDocumentoNotificacao}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required={false}
                />

                {isEdicao && (
                  <>
                    <DocumentUploadField
                      label="Formulário Preenchido"
                      value={formularioPreenchido?.name || null}
                      onChange={setFormularioPreenchido}
                      accept=".pdf,.jpg,.jpeg,.png"
                      required={false}
                    />

                    <DocumentUploadField
                      label="Comprovante de Indicação"
                      value={comprovanteIndicacao?.name || null}
                      onChange={setComprovanteIndicacao}
                      accept=".pdf,.jpg,.jpeg,.png"
                      required={false}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? "Salvando..." : isEdicao ? "Atualizar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}