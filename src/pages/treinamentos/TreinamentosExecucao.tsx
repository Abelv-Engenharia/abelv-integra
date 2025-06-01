
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useTreinamentoForm } from "@/hooks/useTreinamentoForm";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import DateTimeFields from "@/components/treinamentos/execucao/DateTimeFields";
import CCASelector from "@/components/treinamentos/execucao/CCASelector";
import ProcessoTipoFields from "@/components/treinamentos/execucao/ProcessoTipoFields";
import TreinamentoSelector from "@/components/treinamentos/execucao/TreinamentoSelector";
import CargaHorariaEfetivoFields from "@/components/treinamentos/execucao/CargaHorariaEfetivoFields";
import ObservacoesAnexoFields from "@/components/treinamentos/execucao/ObservacoesAnexoFields";
import { Save, X } from "lucide-react";

const TreinamentosExecucao = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    form,
    ccaOptions,
    processoOptions,
    tipoOptions,
    treinamentoOptions,
    calculateHorasTotais
  } = useTreinamentoForm();

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const formData = form.getValues();
      const dataExecucao = new Date(formData.data);
      
      // Get selected CCA name
      const selectedCCA = ccaOptions.find(cca => cca.id === Number(formData.cca_id));
      const selectedProcesso = processoOptions.find(p => p.id === formData.processo_treinamento_id);
      const selectedTipo = tipoOptions.find(t => t.id === formData.tipo_treinamento_id);
      const selectedTreinamento = treinamentoOptions.find(t => t.id === formData.treinamento_id);

      const execucaoData = {
        data: formData.data,
        mes: dataExecucao.getMonth() + 1,
        ano: dataExecucao.getFullYear(),
        cca: selectedCCA ? `${selectedCCA.codigo} - ${selectedCCA.nome}` : '',
        cca_id: Number(formData.cca_id),
        processo_treinamento: selectedProcesso?.nome || '',
        processo_treinamento_id: formData.processo_treinamento_id,
        tipo_treinamento: selectedTipo?.nome || '',
        tipo_treinamento_id: formData.tipo_treinamento_id,
        treinamento_id: formData.treinamento_id === 'outro' ? null : formData.treinamento_id,
        treinamento_nome: formData.treinamento_id === 'outro' ? formData.treinamento_nome : selectedTreinamento?.nome,
        carga_horaria: formData.carga_horaria,
        efetivo_mod: formData.efetivo_mod,
        efetivo_moi: formData.efetivo_moi,
        horas_totais: calculateHorasTotais(),
        observacoes: formData.observacoes,
        lista_presenca_url: formData.lista_presenca_url
      };

      console.log("Salvando dados de execução:", execucaoData);
      
      await execucaoTreinamentoService.create(execucaoData);
      
      toast({
        title: "Treinamento salvo com sucesso!",
        description: "Os dados foram registrados no sistema.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar treinamento:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o treinamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    toast({
      title: "Formulário cancelado",
      description: "O formulário foi resetado.",
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Execução de Treinamentos</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form className="space-y-6">
              {/* Data e CCA */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b pb-2">Data e CCA</h2>
                <DateTimeFields form={form} />
                <CCASelector form={form} ccaOptions={ccaOptions} />
              </div>

              {/* Processo e Tipo */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b pb-2">Processo e Tipo de Treinamento</h2>
                <ProcessoTipoFields form={form} processoOptions={processoOptions} tipoOptions={tipoOptions} />
              </div>

              {/* Treinamento */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b pb-2">Treinamento</h2>
                <TreinamentoSelector form={form} treinamentoOptions={treinamentoOptions} />
              </div>

              {/* Carga Horária e Efetivo */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b pb-2">Carga Horária e Efetivo</h2>
                <CargaHorariaEfetivoFields form={form} calculateHorasTotais={calculateHorasTotais} />
              </div>

              {/* Observações e Anexos */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold border-b pb-2">Observações e Anexos</h2>
                <ObservacoesAnexoFields form={form} />
              </div>

              {/* Botões de ação */}
              <div className="flex justify-end gap-2 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
                
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Salvando..." : "Salvar"}
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
