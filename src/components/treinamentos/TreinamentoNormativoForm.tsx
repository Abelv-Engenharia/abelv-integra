
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Save, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithManualInput } from "@/components/ui/date-picker-with-manual-input";
import { Link, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Funcionario, Treinamento } from "@/types/treinamentos";
import { calcularDataValidade, calcularStatusTreinamento, fetchFuncionarios, fetchTreinamentos, criarTreinamentoNormativo } from "@/utils/treinamentosUtils";
import { ccaService } from "@/services/treinamentos/ccaService";
import { listaTreinamentosNormativosService } from "@/services/treinamentos/listaTreinamentosNormativosService";
import { uploadCertificadoPersonalizado, buildCertificadoFileName, getTreinamentoNomeById } from "@/utils/treinamentoNormativoCertificado";

const formSchema = z.object({
  ccaId: z.string({ required_error: "O CCA é obrigatório" }),
  funcionarioId: z.string({ required_error: "O funcionário é obrigatório" }),
  treinamentoId: z.string({ required_error: "O treinamento é obrigatório" }),
  tipo: z.enum(["Formação", "Reciclagem"], { required_error: "O tipo de treinamento é obrigatório" }),
  dataRealizacao: z.date({ required_error: "A data de realização é obrigatória" }),
  certificado: z.any().optional()
});
type FormValues = z.infer<typeof formSchema>;

type Props = {
  onSuccess: () => void;
  setFormResetFn: (fn: () => void) => void;
};

export const TreinamentoNormativoForm: React.FC<Props> = ({ onSuccess, setFormResetFn }) => {
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [dataValidade, setDataValidade] = useState<Date | null>(null);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ccas, setCcas] = useState<{ id: number; codigo: string; nome: string }[]>([]);
  const [selectedCcaId, setSelectedCcaId] = useState<string | null>(null);
  const [treinamentosNormativos, setTreinamentosNormativos] = useState<{ id: string; nome: string; validade_dias?: number }[]>([]);
  const [certificadoFile, setCertificadoFile] = useState<File | null>(null);

  const location = useLocation();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ccaId: "",
      tipo: "Formação",
      dataRealizacao: undefined
    }
  });

  // Para reset externo
  useEffect(() => {
    setFormResetFn(() => form.reset);
  }, [form, setFormResetFn]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const funcionariosData = await fetchFuncionarios();
        const treinamentosData = await fetchTreinamentos();
        setFuncionarios(funcionariosData);
        setTreinamentos(treinamentosData);
      } catch {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados necessários",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle seleção do funcionário
  const watchFuncionarioId = form.watch("funcionarioId");
  const watchTreinamentoId = form.watch("treinamentoId");
  const watchDataRealizacao = form.watch("dataRealizacao");
  const watchCcaId = form.watch("ccaId");

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
        } catch {}
      } else {
        setDataValidade(null);
      }
    };
    updateDataValidade();
  }, [watchTreinamentoId, watchDataRealizacao]);

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

  useEffect(() => {
    const loadTreinamentosNormativos = async () => {
      try {
        const data = await listaTreinamentosNormativosService.getAll();
        setTreinamentosNormativos(data);
      } catch {}
    };
    loadTreinamentosNormativos();
  }, []);

  // Detecta dados vindos via state da tabela para renovação
  useEffect(() => {
    if (location?.state) {
      const { ccaId, funcionarioId, funcao, matricula, treinamentoId, tipo } = location.state as {
        ccaId?: string;
        funcionarioId?: string;
        funcao?: string;
        matricula?: string;
        treinamentoId?: string;
        tipo?: string;
      };
      if (ccaId) form.setValue("ccaId", ccaId);
      if (funcionarioId) form.setValue("funcionarioId", funcionarioId);
      if (treinamentoId) form.setValue("treinamentoId", treinamentoId);
      if (tipo === "Formação" || tipo === "Reciclagem") form.setValue("tipo", tipo);
      if (funcionarioId && funcionarios.length > 0) {
        const funcionario = funcionarios.find(f => f.id === funcionarioId);
        setSelectedFuncionario(funcionario || null);
      }
    }
    // eslint-disable-next-line
  }, [location.state, funcionarios]);

  const filteredFuncionarios = selectedCcaId ? funcionarios.filter(f => String(f.cca_id) === selectedCcaId) : [];

  // Form submit
  const onSubmit = async (data: FormValues) => {
    if (!data.dataRealizacao || !(data.dataRealizacao instanceof Date)) {
      toast({
        title: "Erro",
        description: "A data de realização é obrigatória e deve ser válida.",
        variant: "destructive"
      });
      return;
    }
    if (!dataValidade) {
      toast({
        title: "Erro",
        description: "A data de validade não pode ser calculada. Verifique se o treinamento e a data de realização estão corretos.",
        variant: "destructive"
      });
      return;
    }
    let certificadoUrl: string | undefined = undefined;
    // Faz upload do certificado, se houver
    if (certificadoFile) {
      // Validação extra de tamanho e formato
      if (certificadoFile.size > 2 * 1024 * 1024) {
        toast({
          title: "Erro ao salvar",
          description: "O arquivo deve ter no máximo 2MB",
          variant: "destructive"
        });
        return;
      }
      if (!certificadoFile.name.toLowerCase().endsWith(".pdf")) {
        toast({
          title: "Erro ao salvar",
          description: "Apenas arquivos PDF são permitidos.",
          variant: "destructive"
        });
        return;
      }
      const url = await uploadCertificadoPersonalizado({
        file: certificadoFile,
        treinamentoId: data.treinamentoId,
        funcionarioId: data.funcionarioId,
        treinamentosNormativos,
        funcionarios
      });
      if (!url) return;
      certificadoUrl = url;
    }

    try {
      setIsLoading(true);
      const result = await criarTreinamentoNormativo({
        funcionarioId: data.funcionarioId,
        treinamentoId: data.treinamentoId,
        tipo: data.tipo,
        dataRealizacao: data.dataRealizacao,
        dataValidade: dataValidade,
        certificadoUrl
      });
      if (result.success) {
        toast({ title: "Sucesso!", description: "Registro realizado com sucesso!", variant: "default" });
        onSuccess();
      } else {
        toast({
          title: "Erro ao salvar",
          description: result.error || "Erro ao salvar o registro",
          variant: "destructive"
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar a solicitação",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              <div className="mb-4">
                <FormField control={form.control} name="ccaId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CCA</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o CCA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...ccas].sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), "pt-BR", { numeric: true }))
                          .map(cca => (
                            <SelectItem key={cca.id} value={String(cca.id)}>{cca.codigo} - {cca.nome}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex flex-col md:flex-row gap-4 md:items-end">
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
                          {filteredFuncionarios.length === 0 && <div className="p-2 text-muted-foreground text-sm">Nenhum funcionário cadastrado para este CCA</div>}
                          {filteredFuncionarios.map(funcionario => <SelectItem key={funcionario.id} value={funcionario.id}>{funcionario.nome}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem className="flex-1">
                  <FormLabel>Função</FormLabel>
                  <Input value={selectedFuncionario?.funcao || ""} disabled />
                </FormItem>
                <FormItem className="flex-1">
                  <FormLabel>Matrícula</FormLabel>
                  <Input value={selectedFuncionario?.matricula || ""} disabled />
                </FormItem>
              </div>

              <FormField control={form.control} name="treinamentoId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Treinamento realizado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o treinamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {treinamentosNormativos.map(treinamento => (
                        <SelectItem key={treinamento.id} value={treinamento.id}>{treinamento.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="tipo" render={({ field }) => (
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
              )} />

              <div className="flex flex-col md:flex-row gap-4">
                <FormField control={form.control} name="dataRealizacao" render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Data da realização</FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <DatePickerWithManualInput
                          value={field.value}
                          onChange={field.onChange}
                          disabled={date => date > new Date()}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormItem className="flex-1">
                  <FormLabel>Data de validade</FormLabel>
                  <Input
                    value={dataValidade ? format(dataValidade, "dd/MM/yyyy") : ""}
                    disabled
                    className="h-10"
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
              </div>
              <div>
                <label htmlFor="certificado" className="block font-medium mb-1">Anexar certificado (PDF, máx. 2MB)</label>
                <Input id="certificado" type="file" accept=".pdf" onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setCertificadoFile(e.target.files[0]);
                  } else {
                    setCertificadoFile(null);
                  }
                }} />
                <div className="text-xs text-muted-foreground mt-1">Apenas arquivos PDF, máximo 2MB.</div>
                {certificadoFile && form.getValues("treinamentoId") && selectedFuncionario && (
                  <div className="text-xs text-blue-600 mt-1 font-mono">
                    Nome no bucket:{" "}
                    {buildCertificadoFileName(
                      getTreinamentoNomeById(form.getValues("treinamentoId"), treinamentosNormativos) || "",
                      selectedFuncionario.matricula, selectedFuncionario.nome, "pdf"
                    )}
                  </div>
                )}
                {certificadoFile && (
                  <div className="text-xs text-green-600 mt-1">Arquivo selecionado: {certificadoFile.name}</div>
                )}
              </div>
              <div className="flex justify-between gap-2 pt-6 border-t">
                <Button type="button" variant="outline" asChild>
                  <Link to="/treinamentos/dashboard">
                    <ArrowLeft />
                    Voltar
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    <Save />
                    {isLoading ? "Salvando..." : "Salvar registro"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

