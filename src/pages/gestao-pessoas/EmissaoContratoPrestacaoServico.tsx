import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Download, FileText, X, FilePlus2, FileX2, ArrowLeft, FileCheck } from "lucide-react";
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
import { 
  Breadcrumb,
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { usePrestadoresPJ, PrestadorPJ } from "@/hooks/gestao-pessoas/usePrestadoresPJ";
import { useModelosPorTipo } from "@/hooks/gestao-pessoas/useModelosContratos";
import { useCreateContratoEmitido, useUploadContratoPDF } from "@/hooks/gestao-pessoas/useContratosEmitidos";
import { ContratoModelo, TipoContratoModelo } from "@/types/gestao-pessoas/contratoModelo";
import { gerarContratoPreenchido, blobParaFile } from "@/services/contratos/processarModeloContratoService";

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
  const [tipoContratoSelecionado, setTipoContratoSelecionado] = useState<TipoContratoModelo | null>(null);
  const [modeloSelecionado, setModeloSelecionado] = useState<ContratoModelo | null>(null);
  const [prestadorSelecionado, setPrestadorSelecionado] = useState<PrestadorPJ | null>(null);
  const [etapaAtual, setEtapaAtual] = useState<1 | 2 | 3 | 4>(1);
  
  // Hooks para buscar modelos e salvar contrato
  const { data: modelosDisponiveis, isLoading: loadingModelos } = useModelosPorTipo(tipoContratoSelecionado || undefined);
  const createContrato = useCreateContratoEmitido();
  const uploadPDF = useUploadContratoPDF();

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
  const onSubmitContrato = async (data: ContratoFormData) => {
    if (!prestadorSelecionado || !modeloSelecionado) return;

    try {
      // Preparar dados para substituição
      const dadosContrato = {
        PRESTADOR_RAZAO_SOCIAL: prestadorSelecionado.razaoSocial,
        PRESTADOR_CNPJ: prestadorSelecionado.cnpj,
        PRESTADOR_NOME_COMPLETO: prestadorSelecionado.nomeCompleto,
        PRESTADOR_ENDERECO: prestadorSelecionado.endereco,
        PRESTADOR_ATIVIDADE: prestadorSelecionado.descricaoAtividade || '',
        PRESTADOR_VALOR: prestadorSelecionado.valorPrestacaoServico,
        PRESTADOR_AJUDA_CUSTO: prestadorSelecionado.ajudaCusto,
        CONTRATO_NUMERO: data.numerocontrato,
        CONTRATO_DATA_INICIO: data.datainicio,
        CONTRATO_DATA_FIM: data.datafim,
        CONTRATO_FORMA_PAGAMENTO: data.formapagamento,
        CONTRATO_PRAZO: data.prazocontrato,
        CONTRATO_CLAUSULAS: data.clausulas,
      };

      // Gerar arquivo preenchido
      const nomeArquivo = `Contrato_${prestadorSelecionado.razaoSocial.replace(/\s+/g, '_')}_${data.numerocontrato}.docx`;
      // Extrair o path do arquivo da URL (última parte após a última barra)
      const filePath = modeloSelecionado.arquivo_url.split('/').pop() || '';
      
      const blob = await gerarContratoPreenchido(
        filePath,
        dadosContrato,
        nomeArquivo
      );

      // Converter blob para file e fazer upload
      const file = blobParaFile(blob, nomeArquivo);
      const uploadResult = await uploadPDF.mutateAsync({
        file,
        filename: nomeArquivo,
      });

      // Salvar registro no banco
      await createContrato.mutateAsync({
        prestador_id: prestadorSelecionado.id,
        tipo_contrato: 'prestacao_servico',
        modelo_id: modeloSelecionado.id,
        numero_contrato: data.numerocontrato,
        dados_preenchidos: dadosContrato,
        pdf_url: uploadResult.pdf_url,
        pdf_nome: nomeArquivo,
        data_inicio: data.datainicio.toISOString(),
        data_fim: data.datafim.toISOString(),
        status: 'confirmado',
      });

      toast({
        title: "Contrato emitido com sucesso!",
        description: `Contrato de ${prestadorSelecionado.razaoSocial} criado e salvo.`,
      });
      
      resetarFluxo();
    } catch (error) {
      console.error('Erro ao emitir contrato:', error);
      toast({
        title: "Erro ao emitir contrato",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const onSubmitDistrato = async (data: DistratoFormData) => {
    if (!prestadorSelecionado || !modeloSelecionado) return;

    try {
      const dadosDistrato = {
        PRESTADOR_RAZAO_SOCIAL: prestadorSelecionado.razaoSocial,
        PRESTADOR_CNPJ: prestadorSelecionado.cnpj,
        PRESTADOR_NOME_COMPLETO: prestadorSelecionado.nomeCompleto,
        PRESTADOR_ENDERECO: prestadorSelecionado.endereco,
        DISTRATO_NUMERO: data.numerodistrato,
        DISTRATO_CONTRATO_ORIGINAL: data.numerocontratooriginal,
        DISTRATO_DATA: data.datadistrato,
        DISTRATO_MOTIVO: data.motivodistrato,
        DISTRATO_DATA_ENCERRAMENTO: data.dataencerramentoservicos,
        DISTRATO_OBSERVACOES: data.observacoes || '',
        DISTRATO_VALOR: data.valortotaldistrato || '',
        DISTRATO_DATA_PAGAMENTO: data.datapagamento || null,
      };

      const nomeArquivo = `Distrato_${prestadorSelecionado.razaoSocial.replace(/\s+/g, '_')}_${data.numerodistrato}.docx`;
      // Extrair o path do arquivo da URL
      const filePath = modeloSelecionado.arquivo_url.split('/').pop() || '';
      
      const blob = await gerarContratoPreenchido(
        filePath,
        dadosDistrato,
        nomeArquivo
      );

      const file = blobParaFile(blob, nomeArquivo);
      const uploadResult = await uploadPDF.mutateAsync({
        file,
        filename: nomeArquivo,
      });

      await createContrato.mutateAsync({
        prestador_id: prestadorSelecionado.id,
        tipo_contrato: 'distrato',
        modelo_id: modeloSelecionado.id,
        numero_contrato: data.numerodistrato,
        dados_preenchidos: dadosDistrato,
        pdf_url: uploadResult.pdf_url,
        pdf_nome: nomeArquivo,
        status: 'confirmado',
        observacoes: data.observacoes,
      });

      toast({
        title: "Distrato emitido com sucesso!",
        description: `Distrato de ${prestadorSelecionado.razaoSocial} criado e salvo.`,
      });
      
      resetarFluxo();
    } catch (error) {
      console.error('Erro ao emitir distrato:', error);
      toast({
        title: "Erro ao emitir distrato",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const onSubmitAditivo = async (data: AditivoFormData) => {
    if (!prestadorSelecionado || !modeloSelecionado) return;

    try {
      const dadosAditivo = {
        PRESTADOR_RAZAO_SOCIAL: prestadorSelecionado.razaoSocial,
        PRESTADOR_CNPJ: prestadorSelecionado.cnpj,
        PRESTADOR_NOME_COMPLETO: prestadorSelecionado.nomeCompleto,
        PRESTADOR_ENDERECO: prestadorSelecionado.endereco,
        ADITIVO_NUMERO: data.numeroaditivo,
        ADITIVO_CONTRATO_ORIGINAL: data.numerocontratooriginal,
        ADITIVO_DATA_VIGENCIA: data.datavigencia,
        ADITIVO_MOTIVO: data.motivoaditivo,
        ADITIVO_ALTERACOES: data.alteracoes,
        ADITIVO_VALOR_ANTERIOR: data.valoranterior || '',
        ADITIVO_VALOR_NOVO: data.valornovo || '',
        ADITIVO_CARGO_ANTERIOR: data.cargoanterior || '',
        ADITIVO_CARGO_NOVO: data.cargonovo || '',
      };

      const nomeArquivo = `Aditivo_${prestadorSelecionado.razaoSocial.replace(/\s+/g, '_')}_${data.numeroaditivo}.docx`;
      // Extrair o path do arquivo da URL
      const filePath = modeloSelecionado.arquivo_url.split('/').pop() || '';
      
      const blob = await gerarContratoPreenchido(
        filePath,
        dadosAditivo,
        nomeArquivo
      );

      const file = blobParaFile(blob, nomeArquivo);
      const uploadResult = await uploadPDF.mutateAsync({
        file,
        filename: nomeArquivo,
      });

      await createContrato.mutateAsync({
        prestador_id: prestadorSelecionado.id,
        tipo_contrato: 'aditivo',
        modelo_id: modeloSelecionado.id,
        numero_contrato: data.numeroaditivo,
        dados_preenchidos: dadosAditivo,
        pdf_url: uploadResult.pdf_url,
        pdf_nome: nomeArquivo,
        data_inicio: data.datavigencia.toISOString(),
        status: 'confirmado',
      });

      toast({
        title: "Aditivo emitido com sucesso!",
        description: `Aditivo de ${prestadorSelecionado.razaoSocial} criado e salvo.`,
      });
      
      resetarFluxo();
    } catch (error) {
      console.error('Erro ao emitir aditivo:', error);
      toast({
        title: "Erro ao emitir aditivo",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const resetarFluxo = () => {
    setEtapaAtual(1);
    setTipoContratoSelecionado(null);
    setModeloSelecionado(null);
    setPrestadorSelecionado(null);
    formContrato.reset();
    formDistrato.reset();
    formAditivo.reset();
  };

  const handleGerarPDF = async () => {
    if (!prestadorSelecionado || !modeloSelecionado) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Selecione um prestador e um modelo de contrato",
        variant: "destructive",
      });
      return;
    }

    try {
      // Preparar dados básicos do prestador
      const dadosBasicos = {
        PRESTADOR_RAZAO_SOCIAL: prestadorSelecionado.razaoSocial,
        PRESTADOR_CNPJ: prestadorSelecionado.cnpj,
        PRESTADOR_NOME_COMPLETO: prestadorSelecionado.nomeCompleto,
        PRESTADOR_ENDERECO: prestadorSelecionado.endereco,
        PRESTADOR_ATIVIDADE: prestadorSelecionado.descricaoAtividade || '',
        PRESTADOR_VALOR: prestadorSelecionado.valorPrestacaoServico,
        PRESTADOR_AJUDA_CUSTO: prestadorSelecionado.ajudaCusto,
      };

      // Adicionar dados do formulário se disponíveis
      if (tipoContratoSelecionado === 'prestacao_servico') {
        const formData = formContrato.getValues();
        Object.assign(dadosBasicos, {
          CONTRATO_NUMERO: formData.numerocontrato || '',
          CONTRATO_DATA_INICIO: formData.datainicio || null,
          CONTRATO_DATA_FIM: formData.datafim || null,
          CONTRATO_FORMA_PAGAMENTO: formData.formapagamento || '',
          CONTRATO_PRAZO: formData.prazocontrato || '',
          CONTRATO_CLAUSULAS: formData.clausulas || '',
        });
      } else if (tipoContratoSelecionado === 'distrato') {
        const formData = formDistrato.getValues();
        Object.assign(dadosBasicos, {
          DISTRATO_NUMERO: formData.numerodistrato || '',
          DISTRATO_CONTRATO_ORIGINAL: formData.numerocontratooriginal || '',
          DISTRATO_DATA: formData.datadistrato || null,
          DISTRATO_MOTIVO: formData.motivodistrato || '',
          DISTRATO_DATA_ENCERRAMENTO: formData.dataencerramentoservicos || null,
          DISTRATO_OBSERVACOES: formData.observacoes || '',
          DISTRATO_VALOR: formData.valortotaldistrato || '',
          DISTRATO_DATA_PAGAMENTO: formData.datapagamento || null,
        });
      } else if (tipoContratoSelecionado === 'aditivo') {
        const formData = formAditivo.getValues();
        Object.assign(dadosBasicos, {
          ADITIVO_NUMERO: formData.numeroaditivo || '',
          ADITIVO_CONTRATO_ORIGINAL: formData.numerocontratooriginal || '',
          ADITIVO_DATA_VIGENCIA: formData.datavigencia || null,
          ADITIVO_MOTIVO: formData.motivoaditivo || '',
          ADITIVO_ALTERACOES: formData.alteracoes || '',
          ADITIVO_VALOR_ANTERIOR: formData.valoranterior || '',
          ADITIVO_VALOR_NOVO: formData.valornovo || '',
          ADITIVO_CARGO_ANTERIOR: formData.cargoanterior || '',
          ADITIVO_CARGO_NOVO: formData.cargonovo || '',
        });
      }

      const nomeArquivo = `${tipoContratoSelecionado}_${prestadorSelecionado.razaoSocial.replace(/\s+/g, '_')}_preview.docx`;
      
      // Extrair o path do arquivo da URL
      const filePath = modeloSelecionado.arquivo_url.split('/').pop() || '';
      
      await gerarContratoPreenchido(
        filePath,
        dadosBasicos,
        nomeArquivo
      );

      toast({
        title: "Documento gerado com sucesso!",
        description: "O arquivo foi baixado. Revise antes de emitir o contrato.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar documento",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  // Card de seleção de tipo de contrato
  const CardTipoContrato = ({ 
    tipo, 
    titulo, 
    descricao, 
    icone,
    cor
  }: { 
    tipo: TipoContratoModelo; 
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
                tipo="prestacao_servico"
                titulo="Contrato de Prestação de Serviço"
                descricao="Criar novo contrato de prestação de serviços com fornecedor"
                icone={<FileText className="h-6 w-6 text-white" />}
                cor="bg-primary"
              />
              <CardTipoContrato
                tipo="distrato"
                titulo="Distrato de Prestação de Serviço"
                descricao="Encerrar contrato existente de forma amigável"
                icone={<FileX2 className="h-6 w-6 text-white" />}
                cor="bg-destructive"
              />
              <CardTipoContrato
                tipo="aditivo"
                titulo="Aditivo de Prestação de Serviço"
                descricao="Adicionar alterações a um contrato vigente"
                icone={<FilePlus2 className="h-6 w-6 text-white" />}
                cor="bg-orange-500"
              />
            </div>
          </div>
        )}

        {/* ETAPA 2: Seleção de Modelo */}
        {etapaAtual === 2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Selecione o Modelo de Contrato</CardTitle>
                  <CardDescription>
                    Escolha um modelo cadastrado para {
                      tipoContratoSelecionado === 'prestacao_servico' ? 'prestação de serviço' :
                      tipoContratoSelecionado === 'distrato' ? 'distrato' :
                      'aditivo contratual'
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
              {loadingModelos ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando modelos disponíveis...
                </div>
              ) : modelosDisponiveis && modelosDisponiveis.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {modelosDisponiveis.map((modelo) => (
                    <Card 
                      key={modelo.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-lg hover:border-primary",
                        modeloSelecionado?.id === modelo.id && "border-primary border-2 bg-primary/5"
                      )}
                      onClick={() => {
                        setModeloSelecionado(modelo);
                        setEtapaAtual(3);
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <FileCheck className="h-5 w-5 text-primary mt-1" />
                          <div className="flex-1">
                            <CardTitle className="text-base">{modelo.nome}</CardTitle>
                            {modelo.descricao && (
                              <CardDescription className="text-sm mt-1">
                                {modelo.descricao}
                              </CardDescription>
                            )}
                            <div className="mt-2 text-xs text-muted-foreground">
                              {modelo.codigos_disponiveis.length} códigos disponíveis
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum modelo cadastrado para este tipo de contrato.
                  </p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => window.location.href = '/gestao-pessoas/modelos-contratos'}
                  >
                    Cadastrar modelo agora
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ETAPA 3: Seleção de Prestador */}
        {etapaAtual === 3 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Selecione o Prestador de Serviço</CardTitle>
                  <CardDescription>
                    Escolha o prestador cadastrado para {
                      tipoContratoSelecionado === 'prestacao_servico' ? 'o novo contrato' :
                      tipoContratoSelecionado === 'distrato' ? 'o distrato' :
                      'o aditivo contratual'
                    }
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEtapaAtual(2);
                    setModeloSelecionado(null);
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
                      setEtapaAtual(4);
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

        {/* ETAPA 4: Formulário com Dados do Prestador */}
        {etapaAtual === 4 && prestadorSelecionado && modeloSelecionado && (
          <div className="space-y-6">
            {/* Botão Voltar */}
            <Button 
              variant="outline" 
              onClick={() => {
                setEtapaAtual(3);
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
            {tipoContratoSelecionado === 'prestacao_servico' && (
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

            {tipoContratoSelecionado === 'distrato' && (
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

            {tipoContratoSelecionado === 'aditivo' && (
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