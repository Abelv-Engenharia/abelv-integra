import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserCCAs } from "@/hooks/useUserCCAs";
import { PdfUpload } from "@/components/ui/pdf-upload";

// Hooks para buscar dados (filtrado pelos CCAs permitidos)
const useCCAs = () => {
  const [ccas, setCcas] = React.useState([]);
  const { data: userCCAs = [] } = useUserCCAs();
  
  React.useEffect(() => {
    if (userCCAs.length === 0) {
      setCcas([]);
      return;
    }
    
    const ccaIds = userCCAs.map(cca => cca.id);
    supabase
      .from("ccas")
      .select("id, codigo, nome, ativo")
      .eq("ativo", true)
      .in("id", ccaIds)
      .order("codigo")
      .then(({ data }) => setCcas(data || []));
  }, [userCCAs]);
  
  return ccas;
};

const useTiposInspecao = () => {
  const [tipos, setTipos] = React.useState([]);
  React.useEffect(() => {
    supabase.from("tipo_inspecao_hsa").select("id, nome").eq("ativo", true).order("nome").then(({
      data
    }) => setTipos(data || []));
  }, []);
  return tipos;
};

const useFuncionarios = (ccaCodigo?: string) => {
  const [funcionarios, setFuncionarios] = React.useState([]);
  
  React.useEffect(() => {
    if (!ccaCodigo) {
      setFuncionarios([]);
      return;
    }
    
    // Query única com JOIN para buscar funcionários do CCA
    supabase
      .from("funcionarios")
      .select(`
        id, 
        nome, 
        funcao, 
        cca_id, 
        ativo, 
        matricula,
        ccas!inner(id, codigo, nome)
      `)
      .eq("ativo", true)
      .eq("ccas.codigo", ccaCodigo)
      .order("nome")
      .then(({ data, error }) => {
        if (error) {
          console.error("Erro ao buscar funcionários:", error);
          setFuncionarios([]);
          return;
        }
        setFuncionarios(data || []);
      });
  }, [ccaCodigo]);
  
  return funcionarios;
};

const formSchema = z.object({
  data: z.date({
    required_error: "A data da inspeção é obrigatória."
  }),
  cca: z.string({
    required_error: "O CCA é obrigatório."
  }),
  tipoInspecao: z.string({
    required_error: "Selecione o tipo de inspeção realizada."
  }),
  responsavelTipo: z.enum(["funcionario", "manual"]).default("funcionario"),
  responsavelFuncionarioId: z.string().optional(),
  responsavelNome: z.string().optional(),
  responsavelFuncao: z.string().optional(),
  desviosIdentificados: z.number().int("Insira um número inteiro.").min(0, "Não pode ser negativo").default(0),
  relatorioUrl: z.string().optional()
});

type FormType = z.infer<typeof formSchema>;

const InspecaoNaoProgramadaHSA = () => {
  const ccas = useCCAs(); // [{ id, codigo, nome }]
  const tiposInspecao = useTiposInspecao();
  const { data: userCCAs = [] } = useUserCCAs();
  
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsavelTipo: "funcionario",
      desviosIdentificados: 0,
      responsavelFuncionarioId: "",
      relatorioUrl: ""
    }
  });
  const watchCCA = form.watch("cca");
  const funcionarios = useFuncionarios(watchCCA);
  const watchData = form.watch("data");
  const ano = watchData ? format(watchData, "yyyy") : "";
  const mes = watchData ? format(watchData, "MM") : "";
  const watchResponsavelTipo = form.watch("responsavelTipo");
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [relatorioUrl, setRelatorioUrl] = useState<string>("");
  const {
    toast
  } = useToast();

  // Verificar se o usuário tem permissão para acessar
  if (userCCAs.length === 0) {
    return (
      <div className="w-full px-2 sm:px-4 md:px-8 py-6 flex justify-center">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="pt-6 flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold text-center">Acesso Negado</h2>
            <p className="text-center text-yellow-600">
              Você não possui permissão para cadastrar inspeções em nenhum CCA.
            </p>
            <Button variant="outline" asChild>
              <Link to="/hora-seguranca/dashboard">Voltar ao Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (values: FormType) => {
    setIsSaving(true);

    // Encontre o objeto CCA para obter o id (integer)
    const ccaObj = ccas.find((c: any) => c.codigo === values.cca);
    const cca_id = ccaObj ? ccaObj.id : undefined;

    // Nome da inspeção programada
    const tipoInspecaoLabel = tiposInspecao.find((t: any) => t.id === values.tipoInspecao)?.nome || "";
    let responsavel_nome = "";
    let funcao = "";
    if (values.responsavelTipo === "funcionario") {
      const funcionario = funcionarios.find((f: any) => f.id === values.responsavelFuncionarioId);
      responsavel_nome = funcionario?.nome || "";
      funcao = funcionario?.funcao || "";
    } else {
      responsavel_nome = values.responsavelNome || "";
      funcao = values.responsavelFuncao || "";
    }

    // Campos obrigatórios validados antes do envio
    if (!cca_id) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: "Selecione um CCA válido.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }
    if (!values.data) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: "Informe a data da inspeção.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }
    if (!responsavel_nome) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: "Selecione ou informe o responsável.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }
    if (!funcao) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: "Informe a função do responsável.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }
    if (!values.tipoInspecao) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: "Selecione o tipo de inspeção realizada.",
        variant: "destructive"
      });
      setIsSaving(false);
      return;
    }

    // Formatar data usando toISOString e pegando apenas a parte da data
    const dataFormatada = values.data.toISOString().split('T')[0];

    // Debug: conferir o que vai para o Supabase
    console.log("[SUBMIT NÃO PROGRAMADA] Dados enviados:", {
      cca_id,
      data: dataFormatada,
      ano: parseInt(ano),
      mes: parseInt(mes),
      inspecao_programada: tipoInspecaoLabel,
      responsavel_inspecao: responsavel_nome,
      funcao,
      desvios_identificados: values.desviosIdentificados,
      relatorio_url: relatorioUrl || null,
      status: "REALIZADA (NÃO PROGRAMADA)"
    });
    const { error } = await supabase.from("execucao_hsa").insert({
      cca_id,
      data: dataFormatada,
      ano: parseInt(ano),
      mes: parseInt(mes),
      inspecao_programada: tipoInspecaoLabel,
      responsavel_inspecao: responsavel_nome,
      funcao,
      desvios_identificados: values.desviosIdentificados,
      relatorio_url: relatorioUrl || null,
      status: "REALIZADA (NÃO PROGRAMADA)"
    });
    setIsSaving(false);
    if (error) {
      console.error("Erro supabase:", error);
      toast({
        title: "Erro ao cadastrar inspeção",
        description: error.message || "Erro inesperado",
        variant: "destructive"
      });
      return;
    }
    setSuccess(true);
    toast({
      title: "Inspeção cadastrada",
      description: "Inspeção não programada cadastrada com sucesso!"
    });
  };
  
  if (success) {
    return <div className="w-full px-2 sm:px-4 md:px-8 py-6 flex justify-center">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="pt-6 flex flex-col items-center gap-6">
            <CheckCircle className="h-16 w-16 text-orange-400" />
            <h2 className="text-2xl font-bold text-center text-orange-500">
              Inspeção não programada cadastrada!
            </h2>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Button className="flex-1" onClick={() => {
              form.reset();
              setRelatorioUrl("");
              setSuccess(false);
            }}>
                Cadastrar nova inspeção não programada
              </Button>
              <Button className="flex-1" variant="outline" asChild>
                <Link to="/hora-seguranca/dashboard">Dashboard HSA</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>;
  }

  return <div className="w-full px-2 sm:px-4 md:px-8 py-6 flex justify-center text-black text-left">
      <Card className="w-full max-w-4xl border bg-card shadow-md">
        <CardContent className="pt-6 pb-8 space-y-6">
          <h2 className="text-2xl font-bold text-left w-full">
            Cadastrar Inspeção Não Programada - HSA
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Data */}
                <FormField control={form.control} name="data" render={({
                field
              }) => <FormItem>
                      <FormLabel>Data da inspeção</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className="w-full pl-3 text-left font-normal">
                              {field.value ? format(field.value, "dd/MM/yyyy") : <span>Selecione a data</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date < new Date("1900-01-01")} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>} />
                <FormItem>
                  <FormLabel>Mês</FormLabel>
                  <Input readOnly value={mes} placeholder="Mês" className="w-full" />
                </FormItem>
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <Input readOnly value={ano} placeholder="Ano" className="w-full" />
                </FormItem>
              </div>

              {/* CCA */}
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <FormField control={form.control} name="cca" render={({
                field
              }) => <FormItem>
                      <FormLabel>CCA</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o CCA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-72 overflow-y-auto">
                          {ccas.map((cca: any) => <SelectItem key={cca.codigo} value={cca.codigo}>
                              {cca.codigo} - {cca.nome}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />
              </div>

              {/* Inspeção programada */}
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <FormField control={form.control} name="tipoInspecao" render={({
                field
              }) => <FormItem>
                      <FormLabel>Inspeção programada</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de inspeção realizada" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-72 overflow-y-auto">
                          {tiposInspecao.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>} />
              </div>

              {/* Responsável pela inspeção e função */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block font-medium mb-1">
                      Responsável pela inspeção
                    </label>
                    {watchResponsavelTipo === "funcionario" ? <Select onValueChange={value => form.setValue("responsavelFuncionarioId", value)} value={form.watch("responsavelFuncionarioId")} disabled={!watchCCA}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={watchCCA ? "Selecione o funcionário" : "Selecione um CCA primeiro"} />
                        </SelectTrigger>
                        <SelectContent>
                          {funcionarios.length === 0 && watchCCA && <div className="text-sm text-gray-500 px-2 py-1">Nenhum funcionário para este CCA</div>}
                          {funcionarios.map((f: any) => <SelectItem key={f.id} value={f.id}>
                              {f.nome}
                            </SelectItem>)}
                        </SelectContent>
                      </Select> : <Input value={form.watch("responsavelNome") || ""} onChange={e => form.setValue("responsavelNome", e.target.value)} placeholder="Ou digite um responsável manualmente" disabled={!watchCCA} className="w-full" />}
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Função
                    </label>
                    {watchResponsavelTipo === "funcionario" ? <Input value={(() => {
                    const funcionario = funcionarios.find((f: any) => f.id === form.watch("responsavelFuncionarioId"));
                    return funcionario?.funcao || "";
                  })()} placeholder={watchCCA ? "Função do funcionário" : ""} disabled className="w-full" /> : <Input value={form.watch("responsavelFuncao") || ""} onChange={e => form.setValue("responsavelFuncao", e.target.value)} placeholder="Digite a função do responsável" disabled={!watchCCA} className="w-full" />}
                  </div>
                </div>
                {/* Seleção entre funcionário e manual */}
                <div className="mt-2">
                  <FormField control={form.control} name="responsavelTipo" render={({
                  field
                }) => <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full max-w-xs">
                            <SelectValue placeholder="Selecione como informar o responsável" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="funcionario">Escolher funcionário</SelectItem>
                          <SelectItem value="manual">Inserir manualmente</SelectItem>
                        </SelectContent>
                      </Select>} />
                </div>
              </div>

              {/* Campo quantidade de desvios identificados */}
              <FormField control={form.control} name="desviosIdentificados" render={({
              field
            }) => <FormItem>
                    <FormLabel>Quantidade de desvios identificados</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} onChange={e => {
                  const val = parseInt(e.target.value) || 0;
                  field.onChange(val);
                }} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              {/* Upload de relatório */}
              <div className="space-y-2">
                <label className="block font-medium">
                  Anexar Relatório da Inspeção (Opcional)
                </label>
                <PdfUpload
                  onFileUploaded={(url) => {
                    setRelatorioUrl(url);
                    form.setValue("relatorioUrl", url);
                  }}
                  currentFile={relatorioUrl}
                  onFileRemoved={() => {
                    setRelatorioUrl("");
                    form.setValue("relatorioUrl", "");
                  }}
                />
              </div>

              <div className="flex flex-col md:flex-row w-full pt-4 gap-3 md:gap-0">
                <div className="flex md:flex-1 md:justify-start">
                  <Button type="button" variant="outline" className="w-full md:w-auto" asChild>
                    <Link to="/hora-seguranca/dashboard">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Link>
                  </Button>
                </div>
                <div className="flex md:flex-1 md:justify-end">
                  <Button type="submit" size="default" disabled={isSaving} className="w-full md:w-auto">
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>;
};

export default InspecaoNaoProgramadaHSA;
