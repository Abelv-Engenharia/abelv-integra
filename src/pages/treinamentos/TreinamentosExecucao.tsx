
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

import { useTreinamentoForm } from "@/hooks/useTreinamentoForm";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { ccaService } from "@/services/treinamentos/ccaService";
import { processoTreinamentoService } from "@/services/treinamentos/processoTreinamentoService";
import { tipoTreinamentoService } from "@/services/treinamentos/tipoTreinamentoService";
import { treinamentosService } from "@/services/treinamentos/treinamentosService";

import SuccessCard from "@/components/treinamentos/execucao/SuccessCard";
import DateTimeFields from "@/components/treinamentos/execucao/DateTimeFields";
import CCASelector from "@/components/treinamentos/execucao/CCASelector";
import ProcessoTipoFields from "@/components/treinamentos/execucao/ProcessoTipoFields";
import TreinamentoSelector from "@/components/treinamentos/execucao/TreinamentoSelector";
import CargaHorariaEfetivoFields from "@/components/treinamentos/execucao/CargaHorariaEfetivoFields";
import ObservacoesAnexoFields from "@/components/treinamentos/execucao/ObservacoesAnexoFields";

const TreinamentosExecucao = () => {
  const { toast } = useToast();
  const { form, submitSuccess, setSubmitSuccess, calculateHorasTotais } = useTreinamentoForm();

  const { data: ccaOptions = [] } = useQuery({
    queryKey: ["ccas"],
    queryFn: ccaService.getAll,
  });

  const { data: processoOptions = [] } = useQuery({
    queryKey: ["processo-treinamento"],
    queryFn: processoTreinamentoService.getAll,
  });

  const { data: tipoOptions = [] } = useQuery({
    queryKey: ["tipo-treinamento"],
    queryFn: tipoTreinamentoService.getAll,
  });

  const { data: treinamentoOptions = [] } = useQuery({
    queryKey: ["treinamentos"],
    queryFn: treinamentosService.getAll,
  });

  const onSubmit = async (values: any) => {
    try {
      console.log("Form values:", values);

      const selectedCCA = ccaOptions.find(cca => cca.id === values.cca_id);
      const selectedProcesso = processoOptions.find(p => p.id === values.processo_treinamento_id);
      const selectedTipo = tipoOptions.find(t => t.id === values.tipo_treinamento_id);
      const selectedTreinamento = treinamentoOptions.find(t => t.id === values.treinamento_id);

      const horasTotais = calculateHorasTotais();

      const execucaoData = {
        data: values.data,
        mes: values.data.getMonth() + 1,
        ano: values.data.getFullYear(),
        cca: selectedCCA?.codigo || "",
        processo_treinamento: selectedProcesso?.nome || "",
        tipo_treinamento: selectedTipo?.nome || "",
        treinamento_nome: selectedTreinamento?.nome || "",
        carga_horaria: Number(values.carga_horaria),
        efetivo_mod: Number(values.efetivo_mod),
        efetivo_moi: Number(values.efetivo_moi),
        horas_totais: horasTotais,
        observacoes: values.observacoes,
        cca_id: values.cca_id,
        processo_treinamento_id: values.processo_treinamento_id,
        tipo_treinamento_id: values.tipo_treinamento_id,
        treinamento_id: values.treinamento_id,
      };

      console.log("Execucao data to save:", execucaoData);

      await execucaoTreinamentoService.create(execucaoData);

      setSubmitSuccess(true);
      toast({
        title: "Sucesso!",
        description: "Execução de treinamento registrada com sucesso.",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a execução do treinamento.",
        variant: "destructive",
      });
    }
  };

  if (submitSuccess) {
    return <SuccessCard onReset={() => {
      setSubmitSuccess(false);
      form.reset();
    }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Execução de Treinamentos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Execução de Treinamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <DateTimeFields form={form} />

              <CCASelector form={form} ccaOptions={ccaOptions} />

              <ProcessoTipoFields 
                form={form} 
                processoOptions={processoOptions}
                tipoOptions={tipoOptions}
              />

              <TreinamentoSelector form={form} treinamentoOptions={treinamentoOptions} />

              <CargaHorariaEfetivoFields form={form} calculateHorasTotais={calculateHorasTotais} />

              <ObservacoesAnexoFields form={form} />

              <Button type="submit" size="lg" className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Registrar Execução
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinamentosExecucao;
