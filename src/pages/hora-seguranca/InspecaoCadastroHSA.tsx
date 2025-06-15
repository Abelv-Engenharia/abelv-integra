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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

// Busca CCAs ativos
const useCCAs = () => {
  const [ccas, setCcas] = React.useState([]);
  React.useEffect(() => {
    supabase
      .from("ccas")
      .select("codigo, nome")
      .eq("ativo", true)
      .order("codigo")
      .then(({ data }) => setCcas(data || []));
  }, []);
  return ccas;
};

// Atualiza o hook para aceitar o código do CCA
const useFuncionarios = (ccaCodigo?: string) => {
  const [funcionarios, setFuncionarios] = React.useState([]);
  React.useEffect(() => {
    if (!ccaCodigo) {
      setFuncionarios([]);
      return;
    }
    supabase
      .from("funcionarios")
      .select("id, nome, funcao, cca_id, ativo, matricula")
      .eq("ativo", true)
      .order("nome")
      .then(({ data }) => {
        // Filtra funcionários pelo cca_id relacionado ao código selecionado
        if (!data) {
          setFuncionarios([]);
          return;
        }
        // Buscar o ID do CCA a partir do código
        supabase
          .from("ccas")
          .select("id")
          .eq("codigo", ccaCodigo)
          .maybeSingle()
          .then(({ data: ccaData }) => {
            if (!ccaData) {
              setFuncionarios([]);
              return;
            }
            const filtered = data.filter((f: any) => f.cca_id === ccaData.id);
            setFuncionarios(filtered);
          });
      });
  }, [ccaCodigo]);
  return funcionarios;
};

// Tipos de inspeção HSA
const useTiposInspecao = () => {
  const [tipos, setTipos] = React.useState([]);
  React.useEffect(() => {
    supabase
      .from("tipo_inspecao_hsa")
      .select("id, nome")
      .eq("ativo", true)
      .order("nome")
      .then(({ data }) => setTipos(data || []));
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
    let responsavel_nome = "";
    let funcao = "";
    // Nome e função do responsável
    if (values.responsavelTipo === "funcionario") {
      const funcionario = funcionarios.find((f: any) => f.id === values.responsavelFuncionarioId);
      responsavel_nome = funcionario?.nome;
      funcao = funcionario?.funcao;
    } else {
      responsavel_nome = values.responsavelNome || "";
      funcao = values.responsavelFuncao || "";
    }
    // Nome do tipo de inspeção
    const tipoInspecaoLabel = tiposInspecao.find((t: any) => t.id === values.tipoInspecao)?.nome || "";

    const { error } = await supabase
      .from("execucao_hsa")
      .insert({
        cca: values.cca,
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full pl-3 text-left font-normal"
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
                            disabled={date => date < new Date("1900-01-01")}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* MÊS (apenas visual, não FormField) */}
                <FormItem>
                  <FormLabel>Mês</FormLabel>
                  <Input readOnly value={mes} placeholder="Mês" className="w-full" />
                </FormItem>
                {/* ANO (apenas visual, não FormField) */}
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <Input readOnly value={ano} placeholder="Ano" className="w-full" />
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
                        <SelectContent>
                          {ccas.map((cca: any) => (
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
                        <SelectContent>
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
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block font-medium mb-1">
                      Responsável pela inspeção
                    </label>
                    {form.watch("responsavelTipo") === "funcionario" ? (
                      <Select
                        onValueChange={(value) => form.setValue("responsavelFuncionarioId", value)}
                        value={form.watch("responsavelFuncionarioId")}
                        disabled={!watchCCA}
                      >
                        <SelectTrigger className="w-full">
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
                          {funcionarios.map((f: any) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.nome} ({f.funcao})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={form.watch("responsavelNome") || ""}
                        onChange={e => form.setValue("responsavelNome", e.target.value)}
                        placeholder="Ou digite um responsável manualmente"
                        disabled={!watchCCA}
                        className="w-full"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Função
                    </label>
                    {form.watch("responsavelTipo") === "funcionario" ? (
                      <Input
                        value={
                          (() => {
                            const funcionario = funcionarios.find(
                              (f: any) => f.id === form.watch("responsavelFuncionarioId")
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
                        value={form.watch("responsavelFuncao") || ""}
                        onChange={e => form.setValue("responsavelFuncao", e.target.value)}
                        placeholder="Digite a função do responsável"
                        disabled={!watchCCA}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
                {/* Seleção entre funcionário e manual */}
                <div className="mt-2">
                  <FormField
                    control={form.control}
                    name="responsavelTipo"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full max-w-xs">
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
