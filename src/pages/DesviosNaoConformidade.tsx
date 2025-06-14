import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, FileText, Mail, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService, DesvioCompleto } from "@/services/desvios/desviosCompletosService";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// Schema for form validation
const formSchema = z.object({
  desvioId: z.string().min(1, { message: "ID do desvio é obrigatório" }),
  destinatario: z.string().email({ message: "Email inválido" }),
  assunto: z.string().min(1, { message: "Assunto é obrigatório" }),
  mensagem: z.string().optional(),
  templateText: z.string().min(1, { message: "Conteúdo do template é obrigatório" }),
});

type FormValues = z.infer<typeof formSchema>;

// Template codes for field mapping
const templateCodes = [
  { code: "{ID}", description: "ID do desvio" },
  { code: "{DATA}", description: "Data do desvio" },
  { code: "{HORA}", description: "Hora do desvio" },
  { code: "{CCA_ID}", description: "ID da CCA" },
  { code: "{CCA_NOME}", description: "Nome da CCA" },
  { code: "{CCA_CODIGO}", description: "Código da CCA" },
  { code: "{TIPO_REGISTRO}", description: "Tipo de registro" },
  { code: "{PROCESSO}", description: "Processo" },
  { code: "{EVENTO_IDENTIFICADO}", description: "Evento identificado" },
  { code: "{CAUSA_PROVAVEL}", description: "Causa provável" },
  { code: "{DISCIPLINA}", description: "Disciplina" },
  { code: "{ENGENHEIRO_NOME}", description: "Engenheiro responsável" },
  { code: "{SUPERVISOR_NOME}", description: "Supervisor responsável" },
  { code: "{ENCARREGADO_NOME}", description: "Encarregado responsável" },
  { code: "{EMPRESA_ID}", description: "ID da Empresa" },
  { code: "{EMPRESA_NOME}", description: "Nome da Empresa" },
  { code: "{BASE_LEGAL}", description: "Base legal" },
  { code: "{DESCRICAO}", description: "Descrição do desvio" },
  { code: "{ACAO_IMEDIATA}", description: "Ação imediata" },
  { code: "{IMAGEM_URL}", description: "Imagem URL" },
  { code: "{EXPOSICAO}", description: "Exposição" },
  { code: "{CONTROLE}", description: "Controle" },
  { code: "{DETECCAO}", description: "Detecção" },
  { code: "{EFEITO_FALHA}", description: "Efeito da falha" },
  { code: "{IMPACTO}", description: "Impacto" },
  { code: "{PROBABILIDADE}", description: "Probabilidade" },
  { code: "{SEVERIDADE}", description: "Severidade" },
  { code: "{CLASSIFICACAO_RISCO}", description: "Classificação de risco" },
  { code: "{STATUS}", description: "Status do desvio" },
  { code: "{RESPONSAVEL_ID}", description: "ID do responsável" },
  { code: "{PRAZO}", description: "Prazo de conclusão" },
  // Campos para funcionários envolvidos
  { code: "{FUNCIONARIOS_ENVOLVIDOS}", description: "Funcionários envolvidos (JSON)" },
];

// Default template text
const defaultTemplate = `
NÃO CONFORMIDADE - RELATÓRIO

ID do Desvio: {ID}
Data de Registro: {DATA}
Local: {LOCAL}
CCA: {CCA}

DESCRIÇÃO DA NÃO CONFORMIDADE:
{DESCRICAO}

Empresa: {EMPRESA}
Nível de Risco: {RISCO}
Status Atual: {STATUS}
Prazo para Resolução: {PRAZO}

AÇÃO IMEDIATA TOMADA:
{ACAO_IMEDIATA}

Este documento representa uma notificação formal de não conformidade 
identificada em nossas instalações. Solicitamos atenção imediata para 
resolução dentro do prazo estabelecido.

Atenciosamente,
Departamento de Segurança do Trabalho
`;

const DesviosNaoConformidade = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [previewText, setPreviewText] = useState("");
  const [loadedDesvio, setLoadedDesvio] = useState<DesvioCompleto | null>(null);
  const [desvios, setDesvios] = useState<DesvioCompleto[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      desvioId: "",
      destinatario: "",
      assunto: "Notificação de Não Conformidade",
      mensagem: "Segue anexo o relatório de não conformidade para seu conhecimento e providências.",
      templateText: defaultTemplate,
    },
  });

  useEffect(() => {
    const fetchDesvios = async () => {
      try {
        const data = await desviosCompletosService.getAll();
        setDesvios(data);
      } catch (error) {
        console.error('Erro ao carregar desvios:', error);
      }
    };
    
    fetchDesvios();
  }, []);

  // Function to fetch deviation data by ID
  const fetchDesvioData = async (id: string) => {
    try {
      const desvio = await desviosCompletosService.getById(id);
      if (desvio) {
        setLoadedDesvio(desvio);
        toast({
          title: "Desvio encontrado",
          description: `Dados do desvio ${id.slice(0, 8)}... carregados com sucesso.`,
        });
        return desvio;
      } else {
        toast({
          title: "Erro",
          description: `Desvio com ID ${id} não encontrado.`,
          variant: "destructive",
        });
        setLoadedDesvio(null);
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar desvio:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar dados do desvio.",
        variant: "destructive",
      });
      setLoadedDesvio(null);
      return null;
    }
  };

  // Function to process template and replace codes with actual data
  const processTemplate = (template: string, data: DesvioCompleto) => {
    if (!data) return template;
    // Códigos antigos (legado)
    let processed = template;
    processed = processed.replace(/{ID}/g, data.id?.slice(0, 8) + "..." || "");
    processed = processed.replace(/{DATA}/g, data.data_desvio ? new Date(data.data_desvio).toLocaleDateString("pt-BR") : "");
    processed = processed.replace(/{LOCAL}/g, data.local || "");
    processed = processed.replace(/{DESCRICAO}/g, data.descricao_desvio || "");
    processed = processed.replace(/{CCA}/g, (data as any).ccas?.nome || "");
    processed = processed.replace(/{EMPRESA}/g, (data as any).empresas?.nome || "");
    processed = processed.replace(/{RISCO}/g, data.classificacao_risco || "");
    processed = processed.replace(/{STATUS}/g, data.status || "");
    processed = processed.replace(/{ACAO_IMEDIATA}/g, data.acao_imediata || "");
    processed = processed.replace(/{PRAZO}/g, data.prazo_conclusao ? new Date(data.prazo_conclusao).toLocaleDateString("pt-BR") : "");
    // Novos campos abrangentes
    processed = processed.replace(/{HORA}/g, data.hora_desvio || "");
    processed = processed.replace(/{CCA_ID}/g, data.cca_id ? String(data.cca_id) : "");
    processed = processed.replace(/{CCA_NOME}/g, (data as any).ccas?.nome || "");
    processed = processed.replace(/{CCA_CODIGO}/g, (data as any).ccas?.codigo || "");
    processed = processed.replace(/{TIPO_REGISTRO}/g, (data as any).tipos_registro?.nome || "");
    processed = processed.replace(/{PROCESSO}/g, (data as any).processos?.nome || "");
    processed = processed.replace(/{EVENTO_IDENTIFICADO}/g, (data as any).eventos_identificados?.nome || "");
    processed = processed.replace(/{CAUSA_PROVAVEL}/g, (data as any).causas_provaveis?.nome || "");
    processed = processed.replace(/{DISCIPLINA}/g, (data as any).disciplinas?.nome || "");
    processed = processed.replace(/{ENGENHEIRO_NOME}/g, (data as any).engenheiros?.nome || "");
    processed = processed.replace(/{SUPERVISOR_NOME}/g, (data as any).supervisores?.nome || "");
    processed = processed.replace(/{ENCARREGADO_NOME}/g, (data as any).encarregados?.nome || "");
    processed = processed.replace(/{EMPRESA_ID}/g, data.empresa_id ? String(data.empresa_id) : "");
    processed = processed.replace(/{EMPRESA_NOME}/g, (data as any).empresas?.nome || "");
    processed = processed.replace(/{BASE_LEGAL}/g, (data as any).base_legal_opcoes?.nome || "");
    processed = processed.replace(/{IMAGEM_URL}/g, data.imagem_url || "");
    processed = processed.replace(/{EXPOSICAO}/g, data.exposicao !== undefined ? String(data.exposicao ?? "") : "");
    processed = processed.replace(/{CONTROLE}/g, data.controle !== undefined ? String(data.controle ?? "") : "");
    processed = processed.replace(/{DETECCAO}/g, data.deteccao !== undefined ? String(data.deteccao ?? "") : "");
    processed = processed.replace(/{EFEITO_FALHA}/g, data.efeito_falha !== undefined ? String(data.efeito_falha ?? "") : "");
    processed = processed.replace(/{IMPACTO}/g, data.impacto !== undefined ? String(data.impacto ?? "") : "");
    processed = processed.replace(/{PROBABILIDADE}/g, data.probabilidade !== undefined ? String(data.probabilidade ?? "") : "");
    processed = processed.replace(/{SEVERIDADE}/g, data.severidade !== undefined ? String(data.severidade ?? "") : "");
    processed = processed.replace(/{CLASSIFICACAO_RISCO}/g, data.classificacao_risco || "");
    processed = processed.replace(/{RESPONSAVEL_ID}/g, data.responsavel_id || "");
    processed = processed.replace(/{FUNCIONARIOS_ENVOLVIDOS}/g, data.funcionarios_envolvidos ? JSON.stringify(data.funcionarios_envolvidos) : "");

    return processed;
  };

  // Function to generate preview
  const generatePreview = async () => {
    const desvioId = form.getValues("desvioId");
    const desvioData = await fetchDesvioData(desvioId);
    
    if (desvioData) {
      const templateText = form.getValues("templateText");
      const processed = processTemplate(templateText, desvioData);
      setPreviewText(processed);
    }
  };

  // Function to send PDF via email (mocked)
  const sendPdfEmail = (data: FormValues) => {
    toast({
      title: "Enviando e-mail",
      description: "Processando o envio do PDF por e-mail...",
    });
    
    // This would be an actual API call in a real application
    setTimeout(() => {
      toast({
        title: "E-mail enviado",
        description: `Não conformidade enviada com sucesso para ${data.destinatario}`,
      });
    }, 2000);
  };

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    const desvioData = loadedDesvio || fetchDesvioData(data.desvioId);
    
    if (desvioData) {
      sendPdfEmail(data);
    }
  };

  // Function to insert a code at cursor position
  const insertCodeAtCursor = (code: string) => {
    const textarea = document.getElementById("templateText") as HTMLTextAreaElement;
    if (!textarea) return;
    
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const before = form.getValues("templateText").substring(0, startPos);
    const after = form.getValues("templateText").substring(endPos);
    
    const newValue = before + code + after;
    form.setValue("templateText", newValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate("/desvios/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Dashboard
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Emissão de Não Conformidade</h1>
        <p className="text-muted-foreground">
          Gere relatórios de não conformidade baseados em desvios registrados e envie-os via e-mail.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Formulário de Emissão</CardTitle>
            <CardDescription>
              Preencha os dados necessários para emissão da não conformidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* SELETOR DE DESVIO */}
                <FormField
                  control={form.control}
                  name="desvioId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selecione o Desvio</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={async (value) => {
                          field.onChange(value);
                          await generatePreview();
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um desvio" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white">
                          {desvios.map((d) => (
                            <SelectItem key={d.id} value={d.id!}>
                              <div>
                                <span className="font-semibold">{d.id?.slice(0, 8)}... </span>
                                <span>{new Date(d.data_desvio).toLocaleDateString("pt-BR")} </span>
                                <span className="italic truncate">{d.local}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">{(d.descricao_desvio || "").slice(0, 40)}...</div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Escolha o desvio desejado para gerar a não conformidade.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinatario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email do Destinatário</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assunto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assunto</FormLabel>
                      <FormControl>
                        <Input placeholder="Assunto do email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mensagem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem do Email</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Texto que será incluído no corpo do email" 
                          className="h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Mensagem que será incluída no corpo do email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel>Template da Não Conformidade</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          Códigos Disponíveis
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96 z-50 bg-white">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Códigos de Template</h4>
                            <p className="text-sm text-muted-foreground">
                              Clique em um código para inseri-lo no template.
                            </p>
                          </div>
                          <div className="grid gap-2 max-h-60 overflow-y-auto">
                            {templateCodes.map((item) => (
                              <div 
                                key={item.code} 
                                className="flex justify-between items-center hover:bg-accent p-2 rounded-md cursor-pointer"
                                onClick={() => insertCodeAtCursor(item.code)}
                              >
                                <code className="bg-muted px-1 py-0.5 rounded">{item.code}</code>
                                <span className="text-xs text-muted-foreground">{item.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="templateText"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            id="templateText"
                            placeholder="Template da não conformidade" 
                            className="font-mono h-64"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Use os códigos para inserir informações do desvio automaticamente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePreview}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar por Email
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
            <CardDescription>
              Visualize como ficará o documento de não conformidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 min-h-[600px] bg-white text-black whitespace-pre-wrap font-mono text-sm">
              {previewText || "Carregue um desvio para visualizar o documento preenchido."}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <div className="text-sm text-muted-foreground">
              Este é apenas um preview. O documento final será enviado em formato PDF.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DesviosNaoConformidade;
