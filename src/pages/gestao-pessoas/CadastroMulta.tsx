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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DocumentUploadField } from "@/components/gestao-pessoas/veiculos/DocumentUploadField"
import { MultaCompleta } from "@/types/multa"
import { cn } from "@/lib/utils"

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

export default function CadastroMulta() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [documentoNotificacao, setDocumentoNotificacao] = useState<File | null>(null)
  const [formularioPreenchido, setFormularioPreenchido] = useState<File | null>(null)
  const [comprovanteIndicacao, setComprovanteIndicacao] = useState<File | null>(null)

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

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const novaMulta: MultaCompleta = {
        id: crypto.randomUUID(),
        numeroAutoInfracao: values.numeroAutoInfracao,
        dataMulta: values.dataMulta,
        horario: values.horario,
        ocorrencia: values.ocorrencia,
        pontos: values.pontos,
        condutorInfrator: values.condutorInfrator,
        placa: values.placa,
        dataNotificacao: values.dataNotificacao,
        responsavel: values.responsavel,
        veiculo: values.veiculo,
        locadora: values.locadora,
        valor: values.valor,
        localCompleto: values.localCompleto,
        emailCondutor: values.emailCondutor,
        numeroFatura: values.numeroFatura,
        tituloSienge: values.tituloSienge,
        indicadoOrgao: values.indicadoOrgao,
        statusMulta: 'Registrada',
        documentoNotificacao: documentoNotificacao?.name,
        formularioPreenchido: formularioPreenchido?.name,
        comprovanteIndicacao: comprovanteIndicacao?.name,
        descontoConfirmado: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user',
      }

      const existingMultas = JSON.parse(localStorage.getItem("multas") || "[]")
      localStorage.setItem("multas", JSON.stringify([...existingMultas, novaMulta]))

      toast({
        title: "Sucesso",
        description: "Multa cadastrada com sucesso!",
      })

      form.reset()
      setDocumentoNotificacao(null)
      setFormularioPreenchido(null)
      setComprovanteIndicacao(null)
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
    <div className="container mx-auto p-6">
      <nav className="text-sm mb-4 text-muted-foreground">
        Gestão de Pessoas &gt; Recursos & Benefícios &gt; Gestão de Veículos &gt;
        <span className="text-foreground font-medium"> Cadastro de Multa</span>
      </nav>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cadastro de Multa</h1>
        <p className="text-muted-foreground mt-2">
          Registre novas multas de trânsito
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Infração</CardTitle>
              <CardDescription>Informações básicas da multa</CardDescription>
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
                        Dt Multa *
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

                <FormField
                  control={form.control}
                  name="localCompleto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local</FormLabel>
                      <FormControl>
                        <Input placeholder="Local da infração" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailCondutor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Condutor</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4 space-y-4">
                <h3 className="text-lg font-semibold">Documentação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DocumentUploadField
                    label="Documento Notificação"
                    value={documentoNotificacao?.name || null}
                    onChange={setDocumentoNotificacao}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <DocumentUploadField
                    label="Formulário Preenchido"
                    value={formularioPreenchido?.name || null}
                    onChange={setFormularioPreenchido}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <DocumentUploadField
                    label="Comprovante Indicação"
                    value={comprovanteIndicacao?.name || null}
                    onChange={setComprovanteIndicacao}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>

              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="observacoesGerais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Gerais</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Observações adicionais"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
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
    </div>
  )
}
