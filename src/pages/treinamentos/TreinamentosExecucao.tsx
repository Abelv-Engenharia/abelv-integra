
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";

const TreinamentosExecucao = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("data-horario");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    form,
    ccaOptions,
    processoOptions,
    tipoOptions,
    treinamentoOptions,
    calculateHorasTotais
  } = useTreinamentoForm();

  const tabs = [
    { id: "data-horario", label: "Data e CCA" },
    { id: "processo-tipo", label: "Processo e Tipo" },
    { id: "treinamento", label: "Treinamento" },
    { id: "carga-efetivo", label: "Carga Horária e Efetivo" },
    { id: "observacoes", label: "Observações e Anexos" },
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

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
      setActiveTab("data-horario");
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
    setActiveTab("data-horario");
    toast({
      title: "Formulário cancelado",
      description: "O formulário foi resetado.",
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "data-horario":
        return (
          <div className="space-y-6">
            <DateTimeFields form={form} />
            <CCASelector form={form} ccaOptions={ccaOptions} />
          </div>
        );
      case "processo-tipo":
        return <ProcessoTipoFields form={form} processoOptions={processoOptions} tipoOptions={tipoOptions} />;
      case "treinamento":
        return <TreinamentoSelector form={form} treinamentoOptions={treinamentoOptions} />;
      case "carga-efetivo":
        return <CargaHorariaEfetivoFields form={form} calculateHorasTotais={calculateHorasTotais} />;
      case "observacoes":
        return <ObservacoesAnexoFields form={form} />;
      default:
        return null;
    }
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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {renderTabContent()}
                </TabsContent>
              </Tabs>

              <div className="flex justify-between items-center pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentTabIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex gap-2">
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

                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={currentTabIndex === tabs.length - 1}
                  className="flex items-center gap-2"
                >
                  Próximo
                  <ArrowRight className="h-4 w-4" />
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
