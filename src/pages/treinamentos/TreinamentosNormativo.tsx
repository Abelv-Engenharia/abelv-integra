import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, Save, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  Funcionario,
  Treinamento
} from "@/types/treinamentos";
import { calcularDataValidade, calcularStatusTreinamento, fetchFuncionarios, fetchTreinamentos, criarTreinamentoNormativo } from "@/utils/treinamentosUtils";
import { cn } from "@/lib/utils";
import { ccaService } from "@/services/treinamentos/ccaService";
import { listaTreinamentosNormativosService } from "@/services/treinamentos/listaTreinamentosNormativosService";
import { supabase } from "@/integrations/supabase/client";

const BUCKET_CERTIFICADOS = "certificados-treinamentos-normativos";

const formSchema = z.object({
  ccaId: z.string({
    required_error: "O CCA é obrigatório",
  }),
  funcionarioId: z.string({
    required_error: "O funcionário é obrigatório",
  }),
  treinamentoId: z.string({
    required_error: "O treinamento é obrigatório",
  }),
  tipo: z.enum(["Formação", "Reciclagem"], {
    required_error: "O tipo de treinamento é obrigatório",
  }),
  dataRealizacao: z.date({
    required_error: "A data de realização é obrigatória",
  }),
  certificado: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TreinamentosNormativo = () => {
  // ----------- HOOKS E DEFINIÇÕES DEVEM FICAR ANTES DE QUALQUER RETURN -----------
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [dataValidade, setDataValidade] = useState<Date | null>(null);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ccas, setCcas] = useState<{ id: number; codigo: string; nome: string }[]>([]);
  const [selectedCcaId, setSelectedCcaId] = useState<string | null>(null);
  const [treinamentosNormativos, setTreinamentosNormativos] = useState<{id: string, nome: string, validade_dias?: number}[]>([]);
  const [certificadoFile, setCertificadoFile] = useState<File | null>(null);
  const [manualDate, setManualDate] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ccaId: "",
      tipo: "Formação",
    },
  });

  // --- UseEffects e watchers devem ficar aqui ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const funcionariosData = await fetchFuncionarios();
        const treinamentosData = await fetchTreinamentos();
        
        setFuncionarios(funcionariosData);
        setTreinamentos(treinamentosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const watchFuncionarioId = form.watch("funcionarioId");
  const watchTreinamentoId = form.watch("treinamentoId");
  const watchDataRealizacao = form.watch("dataRealizacao");
  
  useEffect(() => {
    if (watchFuncionarioId) {
      const funcionario = funcionarios.find(f => f.id === watchFuncionarioId);
      setSelectedFuncionario(funcionario || null);
    } else {
      setSelectedFuncionario(null);
    }
  }, [watchFuncionarioId, funcionarios]);
  
  useEffect(() => {
    const updateDataValidade = async () => {
      if (watchTreinamentoId && watchDataRealizacao) {
        try {
          const validade = await calcularDataValidade(watchTreinamentoId, watchDataRealizacao);
          setDataValidade(validade);
        } catch (error) {
          console.error("Erro ao calcular data de validade:", error);
        }
      } else {
        setDataValidade(null);
      }
    };
    updateDataValidade();
  }, [watchTreinamentoId, watchDataRealizacao]);

  const watchCcaId = form.watch("ccaId");
  useEffect(() => {
    setSelectedCcaId(watchCcaId || null);
    form.setValue("funcionarioId", "");
  }, [watchCcaId]);
  
  useEffect(() => {
    const fetchCcas = async () => {
      const ccasData = await ccaService.getAll();
      setCcas(ccasData);
    };
    fetchCcas();
  }, []);

  // Carregar treinamentos normativos da tabela correta no useEffect
  useEffect(() => {
    const loadTreinamentosNormativos = async () => {
      try {
        const data = await listaTreinamentosNormativosService.getAll();
        setTreinamentosNormativos(data);
      } catch (error) {
        console.error("Erro ao carregar treinamentos normativos:", error);
      }
    };
    loadTreinamentosNormativos();
  }, []);

  const filteredFuncionarios = selectedCcaId
    ? funcionarios.filter(f => String(f.cca_id) === selectedCcaId)
    : [];

  // Função para buscar nome do treinamento pelo id selecionado
  function getTreinamentoNomeById(id: string): string | null {
    const trein = treinamentosNormativos.find((t) => t.id === id);
    return trein ? trein.nome : null;
  }

  // Função para construir o nome customizado do arquivo
  function buildCertificadoFileName(
    nomeTreinamento: string,
    matriculaFuncionario: string,
    nomeFuncionario: string,
    ext: string
  ): string {
    let baseTreinamento = nomeTreinamento.split("-")[0].trim();
    // Remove espaços extras e mantém apenas a parte antes de "-"
    baseTreinamento = baseTreinamento.replace(/\s+$/, "");

    // Remove acentos e caracteres especiais por segurança no nome do arquivo
    function removeSpecialChars(str: string) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-zA-Z0-9_\-\s]/g, "") // Remove caracteres não permitidos
        .replace(/\s{2,}/g, " ") // Remove múltiplos espaços
        .trim();
    }

    const baseNomeArquivo =
      `${removeSpecialChars(baseTreinamento)}_${matriculaFuncionario}_${removeSpecialChars(nomeFuncionario).toUpperCase()}`.replace(/ /g, " ");

    // Garante extensão
    const arquivoFinal = `${baseNomeArquivo}.${ext.toLowerCase()}`;
    return arquivoFinal;
  }

  // Função para upload de certificado e retornar a URL segura
  async function uploadCertificadoPersonalizado(file: File): Promise<string | null> {
    // Precisa dos campos para construir o nome customizado
    const treinamentoId = form.getValues("treinamentoId");
    const funcionarioId = form.getValues("funcionarioId");

    const treinamentoNome = getTreinamentoNomeById(treinamentoId || "");
    const funcionario = funcionarios.find(f => f.id === funcionarioId);

    if (!treinamentoNome || !funcionario) {
      toast({
        title: "Dados insuficientes",
        description: "Selecione o treinamento e o funcionário antes de anexar o certificado.",
        variant: "destructive"
      });
      return null;
    }

    const ext = file.name.split(".").pop() || "pdf";
    const matricula = funcionario.matricula || "XXXX";
    const nomeFuncionario = funcionario.nome || "FUNCIONARIO_DESCONHECIDO";

    const fileName = buildCertificadoFileName(treinamentoNome, matricula, nomeFuncionario, ext);

    // Upload usando o bucket privado
    const { data, error } = await supabase
      .storage
      .from(BUCKET_CERTIFICADOS)
      .upload(fileName, file, { upsert: true, contentType: "application/pdf" });

    if (error) {
      toast({
        title: "Erro ao anexar certificado",
        description: "Falha ao enviar arquivo para o storage.",
        variant: "destructive"
      });
      return null;
    }

    // Gera URL assinada (válida por 7d) — bucket privado!
    const { data: signedUrlData, error: signedUrlError } = await supabase
      .storage
      .from(BUCKET_CERTIFICADOS)
      .createSignedUrl(fileName, 60 * 60 * 24 * 7); // 7 dias

    if (signedUrlError || !signedUrlData?.signedUrl) {
      toast({
        title: "Erro ao gerar URL do certificado",
        description: "Não foi possível gerar a URL segura.",
        variant: "destructive"
      });
      return null;
    }

    return signedUrlData.signedUrl;
  }

  // Para garantir que a data seja sempre salva corretamente (sem perder 1 dia), convertendo sempre para "YYYY-MM-DD" (local).
  function dateValueToISODateString(value: any): string | null {
    // Aceita tanto Date quanto string no formato yyyy-mm-dd
    if (!value) return null;
    if (value instanceof Date) {
      // Retorna data local no formato yyyy-mm-dd
      const y = value.getFullYear();
      const m = String(value.getMonth() + 1).padStart(2, "0");
      const d = String(value.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    // Se vier string ISO (formato yyyy-mm-dd), usa direto, só se for válido
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    // Outras strings: tenta converter
    const tryDate = new Date(value);
    if (!isNaN(tryDate.getTime())) {
      const y = tryDate.getFullYear();
      const m = String(tryDate.getMonth() + 1).padStart(2, "0");
      const d = String(tryDate.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    return null;
  }

  const onSubmit = async (data: FormValues) => {
    // Corrigir: pegar a data da última seleção válida (manual ou calendário)
    const dataRealizacaoISO =
      manualDate && /^\d{4}-\d{2}-\d{2}$/.test(manualDate)
        ? manualDate
        : dateValueToISODateString(data.dataRealizacao);

    if (!dataRealizacaoISO) {
      toast({
        title: "Erro",
        description: "A data de realização é obrigatória e deve ser válida.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Form data:", data);
    
    let certificadoUrl: string | undefined = undefined;

    // Faz upload do certificado, se houver
    if (certificadoFile) {
      // Validação extra de tamanho e formato
      if (certificadoFile.size > 2 * 1024 * 1024) {
        toast({
          title: "Erro ao salvar",
          description: "O arquivo deve ter no máximo 2MB",
          variant: "destructive",
        });
        return;
      }
      if (!certificadoFile.name.toLowerCase().endsWith(".pdf")) {
        toast({
          title: "Erro ao salvar",
          description: "Apenas arquivos PDF são permitidos.",
          variant: "destructive",
        });
        return;
      }

      // NOVO: upload usando nome customizado
      const url = await uploadCertificadoPersonalizado(certificadoFile);
      if (!url) return;
      certificadoUrl = url;
    }
    
    try {
      setIsLoading(true);
      
      // Implementar upload do certificado aqui
      // FIX: Remover ccaId do objeto passado para criarTreinamentoNormativo
      const result = await criarTreinamentoNormativo({
        funcionarioId: data.funcionarioId,
        treinamentoId: data.treinamentoId,
        tipo: data.tipo,
        dataRealizacao: dataRealizacaoISO, // <-- sempre string yyyy-mm-dd
        dataValidade: dataValidade,
        certificadoUrl
      });
      
      if (result.success) {
        toast({
          title: "Sucesso!",
          description: "Registro realizado com sucesso!",
          variant: "default",
        });
        setIsSubmitSuccess(true);
      } else {
        toast({
          title: "Erro ao salvar",
          description: result.error || "Erro ao salvar o registro",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao criar treinamento:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a solicitação",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------- SOMENTE AQUI FAREMOS RETURNS CONDICIONAIS -----------------
  if (isSubmitSuccess) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="w-[500px]">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Registro Concluído!</CardTitle>
            <CardDescription className="text-center">
              O registro de treinamento normativo foi salvo com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => {
                form.reset();
                setIsSubmitSuccess(false);
                setSelectedFuncionario(null);
                setDataValidade(null);
              }}
            >
              Registrar novo treinamento
            </Button>
            <Button asChild>
              <Link to="/treinamentos/dashboard">
                Menu principal
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link to="/treinamentos/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Registro de Treinamentos Normativos</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informações do Treinamento Normativo</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para registrar um treinamento normativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <p>Carregando dados...</p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* CCA em linha inteira */}
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="ccaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CCA</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o CCA" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[...ccas]
                              .sort((a, b) => {
                                return String(a.codigo).localeCompare(String(b.codigo), "pt-BR", { numeric: true });
                              })
                              .map((cca) => (
                                <SelectItem key={cca.id} value={String(cca.id)}>
                                  {cca.codigo} - {cca.nome}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="funcionarioId"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Funcionário</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedCcaId ? "Selecione o funcionário" : "Selecione o CCA primeiro"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredFuncionarios.length === 0 && (
                              <div className="p-2 text-muted-foreground text-sm">Nenhum funcionário cadastrado para este CCA</div>
                            )}
                            {filteredFuncionarios.map((funcionario) => (
                              <SelectItem key={funcionario.id} value={funcionario.id}>
                                {funcionario.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem className="flex-1">
                    <FormLabel>Função</FormLabel>
                    <Input 
                      value={selectedFuncionario?.funcao || ""} 
                      disabled 
                    />
                  </FormItem>
                  
                  <FormItem className="flex-1">
                    <FormLabel>Matrícula</FormLabel>
                    <Input 
                      value={selectedFuncionario?.matricula || ""} 
                      disabled 
                    />
                  </FormItem>
                </div>

                <FormField
                  control={form.control}
                  name="treinamentoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treinamento realizado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o treinamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {treinamentosNormativos.map((treinamento) => (
                            <SelectItem key={treinamento.id} value={treinamento.id}>
                              {treinamento.nome}
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
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de treinamento</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Formação">Formação</SelectItem>
                          <SelectItem value="Reciclagem">Reciclagem</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataRealizacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da realização</FormLabel>
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        {/* Input manual */}
                        <Input
                          type="date"
                          value={
                            manualDate
                              ? manualDate
                              : field.value
                              ? dateValueToISODateString(field.value)
                              : ""
                          }
                          onChange={e => {
                            setManualDate(e.target.value);
                            // CORREÇÃO: sempre enviar um Date para onChange
                            if (e.target.value) {
                              // Only call onChange if date string is valid
                              const [yyyy, mm, dd] = e.target.value.split("-");
                              const _date = new Date(
                                Number(yyyy),
                                Number(mm) - 1,
                                Number(dd)
                              );
                              field.onChange(_date);
                            } else {
                              field.onChange(undefined);
                            }
                          }}
                          className="max-w-[180px]"
                          min="1900-01-01"
                          max={dateValueToISODateString(new Date()) || ""}
                        />
                        <span className="text-xs text-muted-foreground">ou</span>
                        {/* Popover do Calendário */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal max-w-[180px]",
                                  !(manualDate || field.value) &&
                                    "text-muted-foreground"
                                )}
                              >
                                {manualDate || field.value ? (
                                  dateValueToISODateString(
                                    manualDate
                                      ? manualDate
                                      : field.value
                                  ) &&
                                  (() => {
                                    const v =
                                      manualDate ??
                                      dateValueToISODateString(field.value);
                                    if (v) {
                                      const [y, m, d] = v.split("-");
                                      return `${d}/${m}/${y}`;
                                    }
                                    return null;
                                  })()
                                ) : (
                                  <span>Calendário</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                manualDate
                                  ? new Date(manualDate)
                                  : field.value instanceof Date
                                  ? field.value
                                  : field.value
                                  ? new Date(field.value)
                                  : undefined
                              }
                              onSelect={date => {
                                if (date) {
                                  // Quando seleciona no calendário, limpa manualDate e atualiza o campo para Date
                                  setManualDate(null);
                                  field.onChange(date);
                                }
                              }}
                              disabled={date => date > new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Data de validade</FormLabel>
                  <Input
                    value={dataValidade ? format(dataValidade, "dd/MM/yyyy") : ""}
                    disabled
                  />
                  {dataValidade && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {calcularStatusTreinamento(dataValidade) === "Válido" ? (
                        <span className="text-green-600">Válido até esta data</span>
                      ) : calcularStatusTreinamento(dataValidade) === "Próximo ao vencimento" ? (
                        <span className="text-amber-600">Próximo ao vencimento</span>
                      ) : (
                        <span className="text-red-600">Vencido</span>
                      )}
                    </div>
                  )}
                </FormItem>

                <div>
                  <label htmlFor="certificado" className="block font-medium mb-1">Anexar certificado (PDF, máx. 2MB)</label>
                  <Input
                    id="certificado"
                    type="file"
                    accept=".pdf"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setCertificadoFile(e.target.files[0]);
                      } else {
                        setCertificadoFile(null);
                      }
                    }}
                  />
                  <div className="text-xs text-muted-foreground mt-1">Apenas arquivos PDF, máximo 2MB.</div>
                  {/* Exibe o nome do arquivo customizado que será usado no bucket, se tudo já tiver sido selecionado */}
                  {certificadoFile && form.getValues("treinamentoId") && selectedFuncionario && (
                    <div className="text-xs text-blue-600 mt-1 font-mono">
                      Nome no bucket:{" "}
                      {buildCertificadoFileName(
                        getTreinamentoNomeById(form.getValues("treinamentoId")) || "",
                        selectedFuncionario.matricula,
                        selectedFuncionario.nome,
                        "pdf"
                      )}
                    </div>
                  )}
                  {certificadoFile && (
                    <div className="text-xs text-green-600 mt-1">
                      Arquivo selecionado: {certificadoFile.name}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="gap-1" disabled={isLoading}>
                    <Save className="h-4 w-4" />
                    {isLoading ? "Salvando..." : "Salvar registro"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinamentosNormativo;
