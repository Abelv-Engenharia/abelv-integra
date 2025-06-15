import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle } from "lucide-react";
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

// Busca FUNCIONÁRIOS ATIVOS
const useFuncionarios = () => {
  const [funcionarios, setFuncionarios] = React.useState([]);
  React.useEffect(() => {
    supabase
      .from("funcionarios")
      .select("id, nome, funcao")
      .eq("ativo", true)
      .order("nome")
      .then(({ data }) => setFuncionarios(data || []));
  }, []);
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
  const funcionarios = useFuncionarios();
  const tiposInspecao = useTiposInspecao();
  const { toast } = useToast();

  const [success, setSuccess] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responsavelTipo: "funcionario",
      responsavelFuncionarioId: "",
    },
  });

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

  if (success) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-2xl mx-auto">
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
    <div className="container mx-auto py-6">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 space-y-6">
          <h2 className="text-2xl font-bold text-center">Cadastro de Inspeção Hora da Segurança (HSA)</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Input readOnly value={mes} placeholder="Mês" />
                </FormItem>
                {/* ANO (apenas visual, não FormField) */}
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <Input readOnly value={ano} placeholder="Ano" />
                </FormItem>
              </div>

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

              {/* Seleção do responsável */}
              <FormField
                control={form.control}
                name="responsavelTipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável pela inspeção</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione como informar o responsável" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="funcionario">Escolher funcionário</SelectItem>
                        <SelectItem value="manual">Inserir manualmente</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {watchResponsavelTipo === "funcionario" ? (
                <FormField
                  control={form.control}
                  name="responsavelFuncionarioId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funcionário</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o funcionário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {funcionarios.map((f: any) => (
                            <SelectItem key={f.id} value={f.id}>{f.nome} ({f.funcao})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="responsavelNome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do responsável</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Digite o nome do responsável" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="responsavelFuncao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função do responsável</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Digite a função do responsável" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" size="default" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspecaoCadastroHSA;
