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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DocumentUploadField } from "@/components/gestao-pessoas/veiculos/DocumentUploadField"
import { cn } from "@/lib/utils"
import { supabase } from "@/integrations/supabase/client"

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
  numeroCnh: z.string()
    .min(1, "Número da CNH é obrigatório")
    .regex(/^\d{11}$/, "CNH deve conter 11 dígitos"),
  observacao: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function CadastroCondutor() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [cnhAnexada, setCnhAnexada] = useState<File | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCondutor: "",
      cpf: "",
      categoriaCnh: "",
      statusCnh: "",
      numeroCnh: "",
      observacao: "",
    },
  })

  // Migrar dados do localStorage para Supabase (uma única vez)
  useEffect(() => {
    const migrateFromLocalStorage = async () => {
      try {
        const localCondutores = localStorage.getItem("condutores")
        if (!localCondutores) return

        const condutores = JSON.parse(localCondutores)
        if (!Array.isArray(condutores) || condutores.length === 0) return

        for (const condutor of condutores) {
          // Verificar se já existe no Supabase
          const { data: existing } = await supabase
            .from('veiculos_condutores')
            .select('cpf')
            .eq('cpf', condutor.cpf.replace(/\D/g, ""))
            .single()

          if (!existing) {
            // Inserir no Supabase
            await supabase.from('veiculos_condutores').insert({
              nome_condutor: condutor.nome || condutor.nomeCondutor,
              cpf: condutor.cpf.replace(/\D/g, ""),
              categoria_cnh: condutor.categoriaCnh,
              validade_cnh: typeof condutor.validadeCnh === 'string' 
                ? condutor.validadeCnh 
                : new Date(condutor.validadeCnh).toISOString().split('T')[0],
              status_cnh: condutor.statusCnh,
              numero_cnh: condutor.numeroCnh,
              observacao: condutor.observacao || null,
              pontuacao_atual: condutor.pontuacaoAtual || 0,
              termo_responsabilidade_assinado: false,
              termo_anexado_nome: condutor.cnhAnexada || null,
              ativo: true,
            })
          }
        }

        // Remover do localStorage após migração
        localStorage.removeItem("condutores")
        console.log("Migração de condutores concluída")
      } catch (error) {
        console.error("Erro ao migrar condutores:", error)
      }
    }

    migrateFromLocalStorage()
  }, [])

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1")
  }

  const formatCNH = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
  }

  const uploadCNH = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `cnhs/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('veiculos-documentos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('veiculos-documentos')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Erro ao fazer upload da CNH:', error)
      return null
    }
  }

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      // Verificar se CPF já existe no Supabase
      const { data: existingCondutor, error: checkError } = await supabase
        .from('veiculos_condutores')
        .select('cpf')
        .eq('cpf', values.cpf.replace(/\D/g, ""))
        .single()

      if (existingCondutor) {
        toast({
          title: "Erro",
          description: "Este CPF já está cadastrado.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Fazer upload da CNH se anexada
      let cnhUrl: string | null = null
      if (cnhAnexada) {
        cnhUrl = await uploadCNH(cnhAnexada)
        if (!cnhUrl) {
          toast({
            title: "Aviso",
            description: "Erro ao fazer upload da CNH. O condutor será cadastrado sem o documento anexado.",
            variant: "destructive",
          })
        }
      }

      // Inserir novo condutor no Supabase
      const { error: insertError } = await supabase
        .from('veiculos_condutores')
        .insert({
          nome_condutor: values.nomeCondutor,
          cpf: values.cpf.replace(/\D/g, ""),
          categoria_cnh: values.categoriaCnh,
          validade_cnh: values.validadeCnh.toISOString().split('T')[0],
          status_cnh: values.statusCnh,
          numero_cnh: values.numeroCnh,
          observacao: values.observacao || null,
          pontuacao_atual: 0,
          termo_responsabilidade_assinado: false,
          termo_anexado_url: cnhUrl,
          termo_anexado_nome: cnhAnexada ? cnhAnexada.name : null,
          ativo: true,
        })

      if (insertError) throw insertError

      toast({
        title: "Sucesso",
        description: "Condutor cadastrado com sucesso!",
      })

      form.reset()
      setCnhAnexada(null)
      
      // Limpar localStorage antigo (migração)
      localStorage.removeItem("condutores")
      
    } catch (error) {
      console.error("Erro ao cadastrar condutor:", error)
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
                        CPF *
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
                        Categoria CNH *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                        Validade CNH *
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
                        Status CNH *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  name="numeroCnh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(!field.value && "text-destructive")}>
                        Número da CNH *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="00000000000" 
                          className={cn(!field.value && "border-destructive")}
                          {...field}
                          onChange={(e) => field.onChange(formatCNH(e.target.value))}
                          maxLength={11}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">CNH do Condutor</h3>
                <DocumentUploadField
                  label="CNH do Condutor"
                  value={cnhAnexada?.name || null}
                  onChange={setCnhAnexada}
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
                  onClick={() => navigate("/gestao-pessoas/dashboard-veiculos")}
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
