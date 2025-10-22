import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Download, FileText, X, FilePlus2, FileX2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  Breadcrumb,
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { usePrestadoresPJ, PrestadorPJ } from "@/hooks/gestao-pessoas/usePrestadoresPJ";

// Enum para tipos de contrato
enum TipoContrato {
  PRESTACAO_SERVICO = 'prestacao_servico',
  DISTRATO = 'distrato',
  ADITIVO = 'aditivo'
}


// Schemas de validação
const contratoSchema = z.object({
  numerocontrato: z.string().min(1, "Número do contrato é obrigatório"),
  datainicio: z.date({ required_error: "Data de início é obrigatória" }),
  datafim: z.date({ required_error: "Data de término é obrigatória" }),
  formapagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
  prazocontrato: z.string().min(1, "Prazo de contrato é obrigatório"),
  clausulas: z.string().min(20, "Cláusulas do contrato são obrigatórias")
});

const distratoSchema = z.object({
  numerocontratooriginal: z.string().min(1, "Número do contrato original é obrigatório"),
  numerodistrato: z.string().min(1, "Número do distrato é obrigatório"),
  datadistrato: z.date({ required_error: "Data do distrato é obrigatória" }),
  motivodistrato: z.string().min(10, "Motivo do distrato é obrigatório"),
  dataencerramentoservicos: z.date({ required_error: "Data de encerramento é obrigatória" }),
  observacoes: z.string().optional(),
  valortotaldistrato: z.string().optional(),
  datapagamento: z.date().optional()
});

const aditivoSchema = z.object({
  numerocontratooriginal: z.string().min(1, "Número do contrato original é obrigatório"),
  numeroaditivo: z.string().min(1, "Número do aditivo é obrigatório"),
  datavigencia: z.date({ required_error: "Data de vigência é obrigatória" }),
  motivoaditivo: z.string().min(10, "Motivo do aditivo é obrigatório"),
  alteracoes: z.string().min(10, "Descrição das alterações é obrigatória"),
  valoranterior: z.string().optional(),
  valornovo: z.string().optional(),
  cargoanterior: z.string().optional(),
  cargonovo: z.string().optional()
});

type ContratoFormData = z.infer<typeof contratoSchema>;
type DistratoFormData = z.infer<typeof distratoSchema>;
type AditivoFormData = z.infer<typeof aditivoSchema>;


export default function EmissaoContratoPrestacaoServico() {
  const { toast } = useToast();
  const { data: prestadores, isLoading: loadingPrestadores } = usePrestadoresPJ();
  
  // Estados para controle de fluxo
  const [tipoContratoSelecionado, setTipoContratoSelecionado] = useState<TipoContrato | null>(null);
  const [prestadorSelecionado, setPrestadorSelecionado] = useState<PrestadorPJ | null>(null);
  const [etapaAtual, setEtapaAtual] = useState<1 | 2 | 3>(1);

  // Forms para cada tipo de contrato
  const formContrato = useForm<ContratoFormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      numerocontrato: "",
      formapagamento: "",
      prazocontrato: "",
      clausulas: ""
    },
  });

  const formDistrato = useForm<DistratoFormData>({
    resolver: zodResolver(distratoSchema),
    defaultValues: {
      numerocontratooriginal: "",
      numerodistrato: "",
      motivodistrato: "",
      observacoes: "",
      valortotaldistrato: "",
      datapagamento: undefined
    },
  });

  const formAditivo = useForm<AditivoFormData>({
    resolver: zodResolver(aditivoSchema),
    defaultValues: {
      numerocontratooriginal: "",
      numeroaditivo: "",
      motivoaditivo: "",
      alteracoes: "",
      valoranterior: "",
      valornovo: "",
      cargoanterior: "",
      cargonovo: ""
    },
  });

  // Handlers para submissão de cada tipo
  const onSubmitContrato = (data: ContratoFormData) => {
    console.log("Contrato de Prestação de Serviço:", { prestador: prestadorSelecionado, ...data });
    toast({
      title: "Contrato emitido com sucesso!",
      description: `Contrato de ${prestadorSelecionado?.razaoSocial} criado.`,
    });
    resetarFluxo();
  };

  const onSubmitDistrato = (data: DistratoFormData) => {
    console.log("Distrato:", { prestador: prestadorSelecionado, ...data });
    toast({
      title: "Distrato emitido com sucesso!",
      description: `Distrato de ${prestadorSelecionado?.razaoSocial} criado.`,
    });
    resetarFluxo();
  };

  const onSubmitAditivo = (data: AditivoFormData) => {
    console.log("Aditivo:", { prestador: prestadorSelecionado, ...data });
    toast({
      title: "Aditivo emitido com sucesso!",
      description: `Aditivo de ${prestadorSelecionado?.razaoSocial} criado.`,
    });
    resetarFluxo();
  };

  const resetarFluxo = () => {
    setEtapaAtual(1);
    setTipoContratoSelecionado(null);
    setPrestadorSelecionado(null);
    formContrato.reset();
    formDistrato.reset();
    formAditivo.reset();
  };

  const handleGerarPDF = () => {
    if (!prestadorSelecionado) return;

    const doc = new jsPDF();
    
    // Cabeçalho comum
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    
    if (tipoContratoSelecionado === TipoContrato.PRESTACAO_SERVICO) {
      doc.text("CONTRATO DE PRESTAÇÃO DE SERVIÇOS", 105, 20, { align: "center" });
    } else if (tipoContratoSelecionado === TipoContrato.DISTRATO) {
      doc.text("DISTRATO DE PRESTAÇÃO DE SERVIÇOS", 105, 20, { align: "center" });
    } else {
      doc.text("TERMO ADITIVO AO CONTRATO", 105, 20, { align: "center" });
    }

    // Dados do prestador
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DADOS DO PRESTADOR:", 20, 35);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Razão Social: ${prestadorSelecionado.razaoSocial}`, 20, 42);
    doc.text(`CNPJ: ${prestadorSelecionado.cnpj}`, 20, 48);
    doc.text(`Representante Legal: ${prestadorSelecionado.nomeCompleto}`, 20, 54);
    doc.text(`Endereço: ${prestadorSelecionado.endereco}`, 20, 60);
    doc.text(`Atividade: ${prestadorSelecionado.descricaoAtividade || 'N/A'}`, 20, 66);
    doc.text(`Valor: R$ ${prestadorSelecionado.valorPrestacaoServico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 72);
    doc.text(`Ajuda de Custo: R$ ${prestadorSelecionado.ajudaCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 78);

    doc.save(`${tipoContratoSelecionado}_${prestadorSelecionado.razaoSocial}.pdf`);
    
    toast({
      title: "PDF gerado com sucesso!",
      description: "O documento foi baixado.",
    });
  };

  // Card de seleção de tipo de contrato
  const CardTipoContrato = ({ 
    tipo, 
    titulo, 
    descricao, 
    icone,
    cor
  }: { 
    tipo: TipoContrato; 
    titulo: string; 
    descricao: string; 
    icone: React.ReactNode;
    cor: string;
  }) => (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:border-primary",
        tipoContratoSelecionado === tipo && "border-primary border-2 bg-primary/5"
      )}
      onClick={() => {
        setTipoContratoSelecionado(tipo);
        setEtapaAtual(2);
      }}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-lg", cor)}>
            {icone}
          </div>
          <div>
            <CardTitle className="text-lg">{titulo}</CardTitle>
            <CardDescription className="text-sm mt-1">{descricao}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Gestão de Pessoas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Recursos & Benefícios</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Emissão de Contratos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Emissão de Contratos</h1>
            <p className="text-muted-foreground">Selecione o tipo de documento e o prestador de serviço</p>
          </div>
        </div>

        {/* ETAPA 1: Seleção do Tipo de Contrato */}
        {etapaAtual === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Selecione o tipo de documento a ser emitido</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <CardTipoContrato
                tipo={TipoContrato.PRESTACAO_SERVICO}
                titulo="Contrato de Prestação de Serviço"
                descricao="Criar novo contrato de prestação de serviços com fornecedor"
                icone={<FileText className="h-6 w-6 text-white" />}
                cor="bg-primary"
              />
              <CardTipoContrato
                tipo={TipoContrato.DISTRATO}
                titulo="Distrato de Prestação de Serviço"
                descricao="Encerrar contrato existente de forma amigável"
                icone={<FileX2 className="h-6 w-6 text-white" />}
                cor="bg-destructive"
              />
              <CardTipoContrato
                tipo={TipoContrato.ADITIVO}
                titulo="Aditivo de Prestação de Serviço"
                descricao="Adicionar alterações a um contrato vigente"
                icone={<FilePlus2 className="h-6 w-6 text-white" />}
                cor="bg-orange-500"
              />
            </div>
          </div>
        )}

        {/* ETAPA 2: Seleção de Prestador */}
        {etapaAtual === 2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Selecione o Prestador de Serviço</CardTitle>
                  <CardDescription>
                    Escolha o prestador cadastrado para {
                      tipoContratoSelecionado === TipoContrato.PRESTACAO_SERVICO ? 'o novo contrato' :
                      tipoContratoSelecionado === TipoContrato.DISTRATO ? 'o distrato' :
                      'o aditivo contratual'
                    }
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEtapaAtual(1);
                    setTipoContratoSelecionado(null);
                  }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prestador">Prestador *</Label>
                <Select
                  onValueChange={(value) => {
                    const prestador = prestadores?.find(p => p.id === value);
                    if (prestador) {
                      setPrestadorSelecionado(prestador);
                      setEtapaAtual(3);
                    }
                  }}
                  disabled={loadingPrestadores}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingPrestadores ? "Carregando prestadores..." : "Selecione um prestador cadastrado"} />
                  </SelectTrigger>
                  <SelectContent>
                    {prestadores?.map(prestador => (
                      <SelectItem key={prestador.id} value={prestador.id}>
                        {prestador.razaoSocial} - {prestador.cnpj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ETAPA 3: Formulário com Dados do Prestador */}
        {etapaAtual === 3 && prestadorSelecionado && (
          <div className="space-y-6">
            {/* Botão Voltar */}
            <Button 
              variant="outline" 
              onClick={() => {
                setEtapaAtual(2);
                setPrestadorSelecionado(null);
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {/* Card de Dados do Prestador (somente leitura) */}
            <Card>
              <CardHeader>
                <CardTitle>Dados do Prestador Selecionado</CardTitle>
                <CardDescription>
                  Informações carregadas do cadastro de pessoa jurídica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Razão Social</Label>
                    <Input value={prestadorSelecionado.razaoSocial} disabled className="bg-muted" />
                  </div>
                  <div>
                    <Label>Cnpj</Label>
                    <Input value={prestadorSelecionado.cnpj} disabled className="bg-muted" />
                  </div>
                  <div>
                    <Label>Representante Legal</Label>
                    <Input value={prestadorSelecionado.nomeCompleto} disabled className="bg-muted" />
                  </div>
                  <div>
                    <Label>Endereço</Label>
                    <Input value={prestadorSelecionado.endereco} disabled className="bg-muted" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Descrição de Atividade</Label>
                    <Textarea value={prestadorSelecionado.descricaoAtividade || 'N/A'} disabled className="bg-muted" />
                  </div>
                  <div>
                    <Label>Valor de Prestação de Serviço</Label>
                    <Input 
                      value={`R$ ${prestadorSelecionado.valorPrestacaoServico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                      disabled 
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label>Ajuda de Custo</Label>
                    <Input 
                      value={`R$ ${prestadorSelecionado.ajudaCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
                      disabled 
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label>Data de Início do Contrato</Label>
                    <Input 
                      value={new Date(prestadorSelecionado.dataInicioContrato).toLocaleDateString('pt-BR')} 
                      disabled 
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formulário específico baseado no tipo */}
            {tipoContratoSelecionado === TipoContrato.PRESTACAO_SERVICO && (
              <Form {...formContrato}>
                <form onSubmit={formContrato.handleSubmit(onSubmitContrato)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dados do Contrato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={formContrato.control}
                          name="numerocontrato"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={cn(formContrato.formState.errors.numerocontrato && "text-destructive")}>
                                Número do Contrato *
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="CT-2024-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formContrato.control}
                          name="formapagamento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={cn(formContrato.formState.errors.formapagamento && "text-destructive")}>
                                Forma de Pagamento *
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="transferencia">Transferência</SelectItem>
                                  <SelectItem value="pix">Pix</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={formContrato.control}
                          name="datainicio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={cn(formContrato.formState.errors.datainicio && "text-destructive")}>
                                Data de Início *
                              </FormLabel>
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
                                      {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
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
                          control={formContrato.control}
                          name="datafim"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={cn(formContrato.formState.errors.datafim && "text-destructive")}>
                                Data de Término *
                              </FormLabel>
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
                                      {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
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
                      </div>

                      <FormField
                        control={formContrato.control}
                        name="prazocontrato"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(formContrato.formState.errors.prazocontrato && "text-destructive")}>
                              Prazo de Contrato *
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="padrao">Padrão</SelectItem>
                                <SelectItem value="determinado">Determinado</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formContrato.control}
                        name="clausulas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(formContrato.formState.errors.clausulas && "text-destructive")}>
                              Cláusulas do Contrato *
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descreva as cláusulas do contrato" 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={handleGerarPDF}>
                      <Download className="mr-2 h-4 w-4" />
                      Gerar Pdf
                    </Button>
                    <Button type="submit">
                      <FileText className="mr-2 h-4 w-4" />
                      Emitir Contrato
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {tipoContratoSelecionado === TipoContrato.DISTRATO && (
              <Form {...formDistrato}>
                <form onSubmit={formDistrato.handleSubmit(onSubmitDistrato)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dados do Distrato</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={formDistrato.control}
                          name="numerocontratooriginal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={cn(formDistrato.formState.errors.numerocontratooriginal && "text-destructive")}>
                                Número do Contrato Original *
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="CT-2024-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formDistrato.control}
                          name="numerodistrato"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={cn(formDistrato.formState.errors.numerodistrato && "text-destructive")}>
                                Número do Distrato *
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="DT-2024-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={formDistrato.control}
                          name="datadistrato"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={cn(formDistrato.formState.errors.datadistrato && "text-destructive")}>
                                Data do Distrato *
                              </FormLabel>
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
                                      {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
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
                          control={formDistrato.control}
                          name="dataencerramentoservicos"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={cn(formDistrato.formState.errors.dataencerramentoservicos && "text-destructive")}>
                                Data de Encerramento *
                              </FormLabel>
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
                                      {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
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
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={formDistrato.control}
                          name="valortotaldistrato"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Total do Distrato</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="R$ 0,00" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formDistrato.control}
                          name="datapagamento"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Pagamento</FormLabel>
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
                                      {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
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
                      </div>

                      <FormField
                        control={formDistrato.control}
                        name="motivodistrato"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(formDistrato.formState.errors.motivodistrato && "text-destructive")}>
                              Motivo do Distrato *
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descreva o motivo do distrato" 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formDistrato.control}
                        name="observacoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Observações adicionais (opcional)" 
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={handleGerarPDF}>
                      <Download className="mr-2 h-4 w-4" />
                      Gerar Pdf
                    </Button>
                    <Button type="submit" variant="destructive">
                      <FileX2 className="mr-2 h-4 w-4" />
                      Emitir Distrato
                    </Button>
                  </div>
                </form>
              </Form>
            )}

            {tipoContratoSelecionado === TipoContrato.ADITIVO && (
              <Form {...formAditivo}>
                <form onSubmit={formAditivo.handleSubmit(onSubmitAditivo)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dados do Aditivo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={formAditivo.control}
                          name="numerocontratooriginal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={cn(formAditivo.formState.errors.numerocontratooriginal && "text-destructive")}>
                                Número do Contrato Original *
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="CT-2024-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formAditivo.control}
                          name="numeroaditivo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={cn(formAditivo.formState.errors.numeroaditivo && "text-destructive")}>
                                Número do Aditivo *
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="AD-2024-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={formAditivo.control}
                        name="datavigencia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(formAditivo.formState.errors.datavigencia && "text-destructive")}>
                              Data de Vigência *
                            </FormLabel>
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
                                    {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
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
                        control={formAditivo.control}
                        name="motivoaditivo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(formAditivo.formState.errors.motivoaditivo && "text-destructive")}>
                              Motivo do Aditivo *
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descreva o motivo do aditivo" 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formAditivo.control}
                        name="alteracoes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(formAditivo.formState.errors.alteracoes && "text-destructive")}>
                              Descrição das Alterações *
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descreva as alterações contratuais" 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={formAditivo.control}
                          name="valoranterior"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Anterior</FormLabel>
                              <FormControl>
                                <Input placeholder="R$ 0,00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formAditivo.control}
                          name="valornovo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Novo</FormLabel>
                              <FormControl>
                                <Input placeholder="R$ 0,00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={formAditivo.control}
                          name="cargoanterior"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cargo Anterior</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Analista" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formAditivo.control}
                          name="cargonovo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cargo Novo</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Coordenador" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={handleGerarPDF}>
                      <Download className="mr-2 h-4 w-4" />
                      Gerar Pdf
                    </Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      Emitir Aditivo
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        )}
    </div>
  );
}