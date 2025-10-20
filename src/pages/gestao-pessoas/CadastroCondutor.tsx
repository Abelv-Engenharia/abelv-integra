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
import { DocumentUploadField } from "@/components/veiculos/DocumentUploadField"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  nomeCondutor: z.string().min(1, "Nome do condutor é obrigatório"),
  cpf: z.string()
    .min(1, "CPF é obrigatório")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato 000.000.000-00"),
  categoriaCnh: z.string().min(1, "Categoria da CNH é obrigatória"),
  validadeCnh: z.date({
    required_error: "Validade da CNH é obrigatória",
  }),
  statusCnh: z.string().min(1, "Status da CNH é obrigatório"),
  termoResponsabilidade: z.string().min(1, "Status do termo de responsabilidade é obrigatório"),
  observacao: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CadastroCondutor() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [termoAnexado, setTermoAnexado] = useState<File | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCondutor: "",
      cpf: "",
      categoriaCnh: "",
      statusCnh: "",
      termoResponsabilidade: "",
      observacao: "",
    },
  })

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const existingCondutores = JSON.parse(localStorage.getItem("condutores") || "[]")
      const cpfExiste = existingCondutores.some((condutor: any) => 
        condutor.cpf.replace(/\D/g, "") === values.cpf.replace(/\D/g, "")
      )

      if (cpfExiste) {
        toast({
          title: "Erro",
          description: "Este CPF já está cadastrado.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const novoCondutor = {
        id: crypto.randomUUID(),
        nome: values.nomeCondutor,
        cpf: values.cpf,
        categoriaCnh: values.categoriaCnh,
        validadeCnh: values.validadeCnh,
        statusCnh: values.statusCnh,
        termoResponsabilidade: values.termoResponsabilidade,
        observacao: values.observacao,
        pontuacaoAtual: 0,
        termoAnexado: termoAnexado ? termoAnexado.name : null,
        createdAt: new Date().toISOString(),
      }

      const condutores = [...existingCondutores, novoCondutor]
      localStorage.setItem("condutores", JSON.stringify(condutores))

      toast({
        title: "Sucesso",
        description: "Condutor cadastrado com sucesso!",
      })

      form.reset()
      setTermoAnexado(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar condutor. Tente novamente.",
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
        <span className="text-foreground font-medium"> Cadastro de Condutor</span>
      </nav>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cadastro de Condutor</h1>
        <p className="text-muted-foreground mt-2">
          Cadastre novos condutores autorizados
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados do Condutor</CardTitle>
          <CardDescription>Informações pessoais e CNH</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nomeCondutor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Nome do Condutor *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome completo do condutor" 
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
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Cpf *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000.000.000-00" 
                          className={cn(!field.value && "border-destructive")}
                          {...field}
                          onChange={(e) => field.onChange(formatCPF(e.target.value))}
                          maxLength={14}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoriaCnh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Categoria Cnh *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="E">E</SelectItem>
                          <SelectItem value="AB">AB</SelectItem>
                          <SelectItem value="AC">AC</SelectItem>
                          <SelectItem value="AD">AD</SelectItem>
                          <SelectItem value="AE">AE</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validadeCnh"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Validade Cnh *
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
                  name="statusCnh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Status Cnh *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ativa">Ativa</SelectItem>
                          <SelectItem value="vencida">Vencida</SelectItem>
                          <SelectItem value="suspensa">Suspensa</SelectItem>
                          <SelectItem value="cassada">Cassada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="termoResponsabilidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Termo Responsabilidade *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={cn(!field.value && "border-destructive")}>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sim">Assinado</SelectItem>
                          <SelectItem value="nao">Não Assinado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documentação</h3>
                <DocumentUploadField
                  label="Termo de Responsabilidade"
                  value={termoAnexado?.name || null}
                  onChange={setTermoAnexado}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observação</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações adicionais sobre o condutor"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
