
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTreinamentoForm, TreinamentoFormValues } from "@/hooks/useTreinamentoForm";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import TreinamentoSelector from "@/components/treinamentos/execucao/TreinamentoSelector";
import CCASelector from "@/components/treinamentos/execucao/CCASelector";
import ProcessoTipoFields from "@/components/treinamentos/execucao/ProcessoTipoFields";
import DateTimeFields from "@/components/treinamentos/execucao/DateTimeFields";
import CargaHorariaEfetivoFields from "@/components/treinamentos/execucao/CargaHorariaEfetivoFields";
import ObservacoesAnexoFields from "@/components/treinamentos/execucao/ObservacoesAnexoFields";
import SuccessCard from "@/components/treinamentos/execucao/SuccessCard";

const TreinamentosExecucao = () => {
  const {
    form,
    treinamentoOptions,
    ccaOptions,
    processoOptions,
    tipoOptions,
    calculateHorasTotais,
    showSuccess,
    setShowSuccess,
    isLoading
  } = useTreinamentoForm();

  const onSubmit = async (data: TreinamentoFormValues) => {
    try {
      console.log("Form data:", data);
      
      // Convert string date to Date object for processing
      const dataDate = new Date(data.data);
      
      // Preparar dados para inserção no banco
      const execucaoData = {
        data: data.data, // Keep as string for database
        mes: dataDate.getMonth() + 1,
        ano: dataDate.getFullYear(),
        cca: ccaOptions.find(c => c.id.toString() === data.cca_id)?.nome || "",
        cca_id: parseInt(data.cca_id),
        processo_treinamento: processoOptions.find(p => p.id === data.processo_treinamento_id)?.nome || "",
        processo_treinamento_id: data.processo_treinamento_id,
        tipo_treinamento: tipoOptions.find(t => t.id === data.tipo_treinamento_id)?.nome || "",
        tipo_treinamento_id: data.tipo_treinamento_id,
        treinamento_nome: data.treinamento_id === "outro" ? data.treinamento_nome : 
          treinamentoOptions.find(t => t.id === data.treinamento_id)?.nome || "",
        carga_horaria: data.carga_horaria,
        efetivo_mod: data.efetivo_mod,
        efetivo_moi: data.efetivo_moi,
        horas_totais: calculateHorasTotais(),
        observacoes: data.observacoes,
        lista_presenca_url: data.lista_presenca_url,
        treinamento_id: data.treinamento_id === "outro" ? null : data.treinamento_id,
      };

      console.log("Execucao data:", execucaoData);
      
      await execucaoTreinamentoService.create(execucaoData);
      
      toast.success("Execução de treinamento cadastrada com sucesso!");
      setShowSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Erro ao cadastrar execução:", error);
      toast.error("Erro ao cadastrar execução de treinamento");
    }
  };

  if (showSuccess) {
    return <SuccessCard onNewTraining={() => setShowSuccess(false)} />;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Execução de Treinamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <TreinamentoSelector
                  form={form}
                  treinamentoOptions={treinamentoOptions}
                />

                <CCASelector form={form} ccaOptions={ccaOptions} />

                <ProcessoTipoFields
                  form={form}
                  processoOptions={processoOptions}
                  tipoOptions={tipoOptions}
                />

                <DateTimeFields form={form} />

                <CargaHorariaEfetivoFields
                  form={form}
                  calculateHorasTotais={calculateHorasTotais}
                />

                <ObservacoesAnexoFields form={form} />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Cadastrando..." : "Cadastrar Execução"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinamentosExecucao;
