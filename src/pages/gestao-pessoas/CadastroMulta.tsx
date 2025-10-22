import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { DocumentUploadField } from "@/components/gestao-pessoas/veiculos/DocumentUploadField"
import { MultaCompleta } from "@/types/gestao-pessoas/multa"
import { useVeiculos } from "@/hooks/gestao-pessoas/useVeiculos"
import { useCondutores } from "@/hooks/gestao-pessoas/useCondutores"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  // Campos obrigatórios
  veiculo_id: z.string().min(1, "Veículo é obrigatório"),
  condutor_infrator_id: z.string().min(1, "Condutor infrator é obrigatório"),
  numeroAutoInfracao: z.string().min(1, "Número do auto de infração é obrigatório"),
  dataMulta: z.date({ required_error: "Data da multa é obrigatória" }),
  horario: z.string().min(1, "Horário é obrigatório"),
  ocorrencia: z.string().min(1, "Ocorrência é obrigatória"),
  pontos: z.number().min(1, "Pontos são obrigatórios"),
  placa: z.string().min(1, "Placa é obrigatória"),
  
  // Campos opcionais
  valor: z.number().optional(),
  gravidade: z.enum(["Leve", "Média", "Grave", "Gravíssima"]).optional(),
  dataNotificacao: z.date().optional(),
  responsavel: z.string().optional(),
  numeroFatura: z.string().optional(),
  tituloSienge: z.string().optional(),
  indicadoOrgao: z.enum(["Sim", "Não", "Pendente"]).default("Pendente"),
  observacoesGerais: z.string().optional(),
  
  // Campos para outro condutor
  indicar_outro_condutor: z.boolean().default(false),
  outro_condutor_id: z.string().optional(),
  
  // Campos preenchidos automaticamente (não estão no form visível)
  condutor_infrator_nome: z.string().optional(),
  veiculo_modelo: z.string().optional(),
  locadora_nome: z.string().optional(),
}).refine((data) => {
  if (data.indicar_outro_condutor) {
    return !!data.outro_condutor_id
  }
  return true
}, {
  message: "Selecione o outro condutor",
  path: ["outro_condutor_id"]
})

type FormValues = z.infer<typeof formSchema>

export default function CadastroMulta() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [documentoNotificacao, setDocumentoNotificacao] = useState<File | null>(null)
  const [formularioPreenchido, setFormularioPreenchido] = useState<File | null>(null)
  const [comprovanteIndicacao, setComprovanteIndicacao] = useState<File | null>(null)
  
  const { data: veiculos } = useVeiculos()
  const { data: condutores } = useCondutores()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      veiculo_id: "",
      condutor_infrator_id: "",
      numeroAutoInfracao: "",
      horario: "",
      ocorrencia: "",
      pontos: 0,
      placa: "",
      responsavel: "",
      numeroFatura: "",
      tituloSienge: "",
      valor: undefined,
      gravidade: undefined,
      indicadoOrgao: "Pendente" as const,
      observacoesGerais: "",
      indicar_outro_condutor: false,
      outro_condutor_id: "",
      condutor_infrator_nome: "",
      veiculo_modelo: "",
      locadora_nome: "",
    },
  })
  
  const veiculoSelecionado = form.watch("veiculo_id")
  const indicarOutroCondutor = form.watch("indicar_outro_condutor")
  const outroCondutorId = form.watch("outro_condutor_id")
  
  // Auto-preencher placa, locadora e condutor ao selecionar veículo
  useEffect(() => {
    if (veiculoSelecionado && veiculos) {
      const veiculo = veiculos.find(v => v.id === veiculoSelecionado)
      if (veiculo) {
        form.setValue("placa", veiculo.placa || "")
        form.setValue("veiculo_modelo", veiculo.modelo || "")
        form.setValue("locadora_nome", veiculo.locadora?.nome || "")
        
        // Se há condutor principal, preencher automaticamente
        if (veiculo.condutor_principal_id && !indicarOutroCondutor) {
          form.setValue("condutor_infrator_id", veiculo.condutor_principal_id)
          form.setValue("condutor_infrator_nome", veiculo.condutor_principal_nome || "")
        }
      }
    }
  }, [veiculoSelecionado, veiculos, indicarOutroCondutor])
  
  // Preencher nome do condutor ao selecionar
  useEffect(() => {
    const condutorId = indicarOutroCondutor ? outroCondutorId : form.watch("condutor_infrator_id")
    if (condutorId && condutores) {
      const condutor = condutores.find(c => c.id === condutorId)
      if (condutor) {
        form.setValue("condutor_infrator_nome", condutor.nome_condutor || "")
      }
    }
  }, [form.watch("condutor_infrator_id"), outroCondutorId, condutores, indicarOutroCondutor])

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      // Se indicar outro condutor, usar o outro_condutor_id
      const condutorFinalId = values.indicar_outro_condutor ? values.outro_condutor_id : values.condutor_infrator_id
      const condutor = condutores?.find(c => c.id === condutorFinalId)
      
      const novaMulta: MultaCompleta = {
        id: crypto.randomUUID(),
        numeroAutoInfracao: values.numeroAutoInfracao,
        dataMulta: values.dataMulta,
        horario: values.horario,
        ocorrencia: values.ocorrencia,
        pontos: values.pontos,
        condutorInfrator: condutor?.nome_condutor || values.condutor_infrator_nome || "",
        placa: values.placa,
        veiculo: values.veiculo_modelo,
        locadora: values.locadora_nome,
        valor: values.valor,
        dataNotificacao: values.dataNotificacao,
        responsavel: values.responsavel,
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
  
  const outroCondutor = condutores?.find(c => c.id === outroCondutorId)

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
                {/* Linha 1: Veículo, Condutor Infrator, Placa */}
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
                  name="condutor_infrator_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Condutor Infrator *
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={indicarOutroCondutor}
                      >
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione o condutor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {condutores?.map((condutor) => (
                            <SelectItem key={condutor.id} value={condutor.id}>
                              {condutor.nome_condutor}
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

                {/* Linha 2: Nº Auto Infração, Data da Multa, Horário */}
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
                    <FormItem className="flex flex-col justify-end">
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Data da Multa *
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
              </div>

              {/* Linha 3: Ocorrência (largura completa) */}
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="ocorrencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Ocorrência *
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrição da ocorrência" 
                          className={cn(!field.value && "border-destructive")}
                          rows={1}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Linha 4: Pontos, Valor, Gravidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="R$ 0,00"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gravidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gravidade</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Leve">Leve</SelectItem>
                          <SelectItem value="Média">Média</SelectItem>
                          <SelectItem value="Grave">Grave</SelectItem>
                          <SelectItem value="Gravíssima">Gravíssima</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Linha 5: Indicado ao Órgão */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
              {/* Toggle para indicar outro condutor */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="indicar_outro_condutor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Indicar outro condutor infrator
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Diferente do condutor principal vinculado ao veículo
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Campos condicionais quando toggle está ativo */}
                {indicarOutroCondutor && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="outro_condutor_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={cn(!field.value && "text-destructive")}>
                            Outro Condutor Infrator *
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn(!field.value && "border-destructive")}>
                                <SelectValue placeholder="Selecione o outro condutor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {condutores?.map((condutor) => (
                                <SelectItem key={condutor.id} value={condutor.id}>
                                  {condutor.nome_condutor}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Alerta sobre direcionamento de pontos */}
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        ⚠️ Os pontos desta multa serão direcionados para o condutor indicado acima e não para o condutor principal do veículo.
                      </AlertDescription>
                    </Alert>

                    {/* Exibir dados do outro condutor selecionado */}
                    {outroCondutor && (
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-base">Dados do Condutor Indicado</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <Label className="text-muted-foreground">Nome Completo</Label>
                              <p className="font-medium">{outroCondutor.nome_condutor}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">CPF</Label>
                              <p className="font-medium">{outroCondutor.cpf || "-"}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">CNH</Label>
                              <p className="font-medium">{outroCondutor.numero_cnh || "-"}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Categoria CNH</Label>
                              <p className="font-medium">{outroCondutor.categoria_cnh || "-"}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Validade CNH</Label>
                              <p className="font-medium">
                                {outroCondutor.validade_cnh 
                                  ? format(new Date(outroCondutor.validade_cnh), "dd/MM/yyyy")
                                  : "-"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Status CNH</Label>
                              <p className="font-medium">{outroCondutor.status_cnh || "-"}</p>
                            </div>
                            <div>
                              <Label className="text-muted-foreground">Pontuação Atual</Label>
                              <p className="font-medium">{outroCondutor.pontuacao_atual || 0} pontos</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
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
