
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
  { code: "{LOCAL}", description: "Local do desvio" },
  { code: "{DESCRICAO}", description: "Descrição do desvio" },
  { code: "{CCA}", description: "CCA" },
  { code: "{EMPRESA}", description: "Empresa" },
  { code: "{RISCO}", description: "Nível de risco" },
  { code: "{STATUS}", description: "Status do desvio" },
  { code: "{ACAO_IMEDIATA}", description: "Ação imediata tomada" },
  { code: "{PRAZO}", description: "Prazo para resolução" },
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
    
    let processed = template;
    processed = processed.replace(/{ID}/g, data.id?.slice(0, 8) + '...' || "");
    processed = processed.replace(/{DATA}/g, new Date(data.data_desvio).toLocaleDateString("pt-BR") || "");
    processed = processed.replace(/{LOCAL}/g, data.local || "");
    processed = processed.replace(/{DESCRICAO}/g, data.descricao_desvio || "");
    processed = processed.replace(/{CCA}/g, (data as any).ccas?.nome || "");
    processed = processed.replace(/{EMPRESA}/g, (data as any).empresas?.nome || "");
    processed = processed.replace(/{RISCO}/g, data.classificacao_risco || "");
    processed = processed.replace(/{STATUS}/g, data.status || "");
    processed = processed.replace(/{ACAO_IMEDIATA}/g, data.acao_imediata || "");
    processed = processed.replace(/{PRAZO}/g, data.prazo_conclusao ? new Date(data.prazo_conclusao).toLocaleDateString("pt-BR") : "");
    
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
                <FormField
                  control={form.control}
                  name="desvioId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID do Desvio</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Cole o ID completo do desvio" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={generatePreview}
                        >
                          Carregar
                        </Button>
                      </div>
                      <FormDescription>
                        Digite o ID completo do desvio para carregar os dados.
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
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Códigos de Template</h4>
                            <p className="text-sm text-muted-foreground">
                              Clique em um código para inseri-lo no template.
                            </p>
                          </div>
                          <div className="grid gap-2">
                            {templateCodes.map((item) => (
                              <div 
                                key={item.code} 
                                className="flex justify-between items-center hover:bg-accent p-2 rounded-md cursor-pointer"
                                onClick={() => insertCodeAtCursor(item.code)}
                              >
                                <code className="bg-muted px-1 py-0.5 rounded">{item.code}</code>
                                <span className="text-sm text-muted-foreground">{item.description}</span>
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
