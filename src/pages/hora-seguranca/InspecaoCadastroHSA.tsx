import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";

// Define types for our data
interface Cca {
  id: number;
  codigo: string;
  nome: string;
}

interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
}

interface TipoInspecao {
  id: string;
  nome: string;
}


// Busca CCAs ativos
const useCCAs = () => {
  const [ccas, setCcas] = React.useState<Cca[]>([]);
  React.useEffect(() => {
    supabase
      .from("ccas")
      .select("id, codigo, nome")
      .eq("ativo", true)
      .order("codigo")
      .then(({ data }) => setCcas((data as Cca[]) || []));
  }, []);
  return ccas;
};

// Atualiza o hook para aceitar o código do CCA
const useFuncionarios = (ccaCodigo?: string) => {
  const [funcionarios, setFuncionarios] = React.useState<Funcionario[]>([]);
  React.useEffect(() => {
    const fetchFuncionarios = async () => {
      if (!ccaCodigo) {
        setFuncionarios([]);
        return;
      }

      // 1. Get cca_id from cca_codigo
      const { data: ccaData, error: ccaError } = await supabase
        .from('ccas')
        .select('id')
        .eq('codigo', ccaCodigo)
        .maybeSingle();

      if (ccaError || !ccaData) {
        console.error("Error fetching CCA or CCA not found:", ccaError?.message);
        setFuncionarios([]);
        return;
      }

      // 2. Get employees for that cca_id
      const { data: funcData, error: funcError } = await supabase
        .from('funcionarios')
        .select('id, nome, funcao')
        .eq('ativo', true)
        .eq('cca_id', ccaData.id)
        .order('nome');
      
      if (funcError) {
        console.error("Error fetching funcionarios:", funcError.message);
        setFuncionarios([]);
        return;
      }
      
      setFuncionarios((funcData as Funcionario[]) || []);
    };

    fetchFuncionarios();
  }, [ccaCodigo]);
  return funcionarios;
};


// Tipos de inspeção HSA
const useTiposInspecao = () => {
  const [tipos, setTipos] = React.useState<TipoInspecao[]>([]);
  React.useEffect(() => {
    supabase
      .from("tipo_inspecao_hsa")
      .select("id, nome")
      .eq("ativo", true)
      .order("nome")
      .then(({ data }) => setTipos((data as TipoInspecao[]) || []));
  }, []);
  return tipos;
};

const formSchema = z.object({
  data: z.date({
    required_error: "A data da inspeção é obrigatória.",
  }),
  cca: z.string({
    required_error: "O CCA é obrigatório.",
  }),
  responsavelTipo: z.enum(["funcionario", "manual"]).default("funcionario"),
  responsavelFuncionarioId: z.string().optional(),
  responsavelNome: z.string().optional(),
  responsavelFuncao: z.string().optional(),
  tipoInspecao: z.string({
    required_error: "Inspeção programada é obrigatória.",
  }),
});

type FormType = z.infer<typeof formSchema>;

const InspecaoCadastroHSA = () => {
  const ccas = useCCAs();

  // Pega o valor de CCA selecionado e atualiza o hook de funcionários para filtrar corretamente
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsavelTipo: "funcionario",
      responsavelFuncionarioId: "",
    },
  });
  const watchCCA = form.watch("cca");
  const funcionarios = useFuncionarios(watchCCA);
  const tiposInspecao = useTiposInspecao();
  const { toast } = useToast();

  const [success, setSuccess] = useState(false);

  const watchData = form.watch("data");
  const ano = watchData ? format(watchData, "yyyy") : "";
  const mes = watchData ? format(watchData, "MM") : "";

  const watchResponsavelTipo = form.watch("responsavelTipo");

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (values: FormType) => {
    setIsSaving(true);
    let responsavel_nome: string | undefined = "";
    let funcao: string | undefined = "";

    if (values.responsavelTipo === "funcionario") {
      const funcionario = funcionarios.find((f) => f.id === values.responsavelFuncionarioId);
      responsavel_nome = funcionario?.nome;
      funcao = funcionario?.funcao;
    } else {
      responsavel_nome = values.responsavelNome || "";
      funcao = values.responsavelFuncao || "";
    }

    // Corrigir busca do ID do CCA pelo código
    const ccaObj = ccas.find((c) => c.codigo === values.cca);
    const cca_id = ccaObj?.id;

    // Checar campos obrigatórios antes de salvar
    if (!cca_id) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: "Selecione um CCA válido.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }
    if (!values.data) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: "Informe a data da inspeção.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }
    if (!responsavel_nome) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: "Selecione ou informe o responsável pela inspeção.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }
    if (!funcao) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: "Informe a função do responsável.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }
    if (!values.tipoInspecao) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: "Selecione o tipo de inspeção.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    // Nome do tipo de inspeção
    const tipoInspecaoLabel = tiposInspecao.find((t) => t.id === values.tipoInspecao)?.nome || "";

    // Insert só com cca_id e campos obrigatórios
    const { error } = await supabase
      .from("execucao_hsa")
      .insert({
        cca_id,
        data: format(values.data, "yyyy-MM-dd"),
        ano: parseInt(ano),
        mes: parseInt(mes),
        inspecao_programada: tipoInspecaoLabel,
        responsavel_inspecao: responsavel_nome,
        funcao,
        status: "A REALIZAR",
      });

    setIsSaving(false);

    if (error) {
      toast({
        title: "Erro ao cadastrar inspeção",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setSuccess(true);
    toast({
      title: "Inspeção cadastrada",
      description: "Inspeção cadastrada com sucesso!",
    });
  };

  // Remove a segunda declaração duplicada de watchCCA e usa apenas a original declarada acima.
  const ccaSelecionado = !!watchCCA;

  if (success) {
    return (
      <div className="w-full px-2 sm:px-4 md:px-8 py-6 flex justify-center">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="pt-6 flex flex-col items-center gap-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-center">Inspeção cadastrada com sucesso!</h2>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Button className="flex-1" onClick={() => {
                form.reset();
                setSuccess(false);
              }}>
                Cadastrar nova inspeção
              </Button>
              <Button className="flex-1" variant="outline" asChild>
                <Link to="/hora-seguranca/dashboard">Dashboard HSA</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 md:px-8 py-6 flex justify-center">
      <Card className="w-full max-w-4xl border bg-card shadow-md">
        <CardContent className="pt-6 pb-8 space-y-6">
          <h2 className="text-2xl font-bold text-center w-full">Cadastro de Inspeção Hora da Segurança (HSA)</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Data */}
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da inspeção</FormLabel>
                      <FormControl>
                        <DatePickerWithManualInput
                          value={field.value}
                          onChange={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* MÊS (apenas visual, não FormField) */}
                <FormItem>
                  <FormLabel htmlFor="mes-input">Mês</FormLabel>
                  <Input id="mes-input" readOnly value={mes} placeholder="Mês" className="w-full" />
                </FormItem>
                {/* ANO (apenas visual, não FormField) */}
                <FormItem>
                  <FormLabel htmlFor="ano-input">Ano</FormLabel>
                  <Input id="ano-input" readOnly value={ano} placeholder="Ano" className="w-full" />
                </FormItem>
              </div>

              {/* Os campos CCA e Inspeção programada agora estão um abaixo do outro */}
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <FormField
                  control={form.control}
                  name="cca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CCA</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o CCA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-72 overflow-y-auto">
                          {ccas.map((cca) => (
                            <SelectItem key={cca.codigo} value={cca.codigo}>
                              {cca.codigo} - {cca.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <FormField
                  control={form.control}
                  name="tipoInspecao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inspeção programada</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de inspeção" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-72 overflow-y-auto">
                          {tiposInspecao.map((t: any) => (
                            <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Responsável pela inspeção e Função - conforme imagem */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="block font-medium" htmlFor={
                      form.watch("responsavelTipo") === "funcionario"
                        ? "responsavelFuncionarioId"
                        : "responsavelNome"
                    }>
                    Responsável pela inspeção
                  </label>
                  {form.watch("responsavelTipo") === "funcionario" ? (
                    <Select
                      onValueChange={(value) => form.setValue("responsavelFuncionarioId", value)}
                      value={form.watch("responsavelFuncionarioId")}
                      disabled={!watchCCA}
                    >
                      <SelectTrigger id="responsavelFuncionarioId" className="w-full">
                        <SelectValue
                          placeholder={
                            watchCCA
                              ? "Selecione o funcionário"
                              : "Selecione um CCA primeiro"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {funcionarios.length === 0 && watchCCA && (
                          <div className="text-sm text-gray-500 px-2 py-1">Nenhum funcionário para este CCA</div>
                        )}
                        {funcionarios.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="responsavelNome"
                      value={form.watch("responsavelNome") || ""}
                      onChange={e => form.setValue("responsavelNome", e.target.value)}
                      placeholder="Ou digite um responsável manualmente"
                      disabled={!watchCCA}
                      className="w-full"
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="responsavelTipo"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione como informar o responsável" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="funcionario">Escolher funcionário</SelectItem>
                          <SelectItem value="manual">Inserir manualmente</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-medium" htmlFor={
                      form.watch("responsavelTipo") === "funcionario"
                        ? "funcaoFuncionario"
                        : "responsavelFuncao"
                    }>
                    Função
                  </label>
                  {form.watch("responsavelTipo") === "funcionario" ? (
                    <Input
                      id="funcaoFuncionario"
                      value={
                        (() => {
                          const funcionario = funcionarios.find(
                            (f) => f.id === form.watch("responsavelFuncionarioId")
                          );
                          return funcionario?.funcao || "";
                        })()
                      }
                      placeholder={
                        watchCCA
                          ? "Função do funcionário"
                          : ""
                      }
                      disabled
                      className="w-full"
                    />
                  ) : (
                    <Input
                      id="responsavelFuncao"
                      value={form.watch("responsavelFuncao") || ""}
                      onChange={e => form.setValue("responsavelFuncao", e.target.value)}
                      placeholder="Digite a função do responsável"
                      disabled={!watchCCA}
                      className="w-full"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row w-full pt-4 gap-3 md:gap-0">
                <div className="flex md:flex-1 md:justify-start">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full md:w-auto"
                    asChild
                  >
                    <Link to="/hora-seguranca/dashboard">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Link>
                  </Button>
                </div>
                <div className="flex md:flex-1 md:justify-end">
                  <Button
                    type="submit"
                    size="default"
                    disabled={isSaving}
                    className="w-full md:w-auto"
                  >
                    {isSaving ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspecaoCadastroHSA;
