import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useDesviosForm } from "@/hooks/useDesviosForm";
import { useFormData } from "@/hooks/useFormData";
import NovaIdentificacaoForm from "@/components/desvios/forms/NovaIdentificacaoForm";
import NovasInformacoesForm from "@/components/desvios/forms/NovasInformacoesForm";
import AcaoCorretivaForm from "@/components/desvios/forms/AcaoCorretivaForm";
import ClassificacaoRiscoForm from "@/components/desvios/forms/ClassificacaoRiscoForm";
import FormSuccessDialog from "@/components/desvios/forms/FormSuccessDialog";
import FormNavigation from "@/components/desvios/forms/FormNavigation";
import { Button, Save } from "@/components/ui/button";

const DesviosForm = () => {
  const {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    showSuccessDialog,
    setShowSuccessDialog,
    handleSave,
    handleCancel,
    handleNewRecord,
  } = useDesviosForm();

  const contextValue = useFormData();

  const tabs = [
    { id: "identificacao", label: "Identificação", component: NovaIdentificacaoForm },
    { id: "informacoes", label: "Informações", component: NovasInformacoesForm },
    { id: "acao-corretiva", label: "Ação Corretiva", component: AcaoCorretivaForm },
    { id: "classificacao", label: "Classificação de Risco", component: ClassificacaoRiscoForm },
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

  // Auto-popular ano e mês quando a data for selecionada
  const watchData = form.watch("data");
  React.useEffect(() => {
    if (watchData) {
      const date = new Date(watchData);
      form.setValue("ano", date.getFullYear().toString());
      form.setValue("mes", (date.getMonth() + 1).toString().padStart(2, '0'));
    }
  }, [watchData, form]);

  // Watch colaboradorInfrator to auto-populate funcao and matricula
  const watchColaborador = form.watch("colaboradorInfrator");
  React.useEffect(() => {
    if (watchColaborador) {
      const funcionario = contextValue.funcionarios.find(f => f.id === watchColaborador);
      if (funcionario) {
        form.setValue("funcao", funcionario.funcao);
        form.setValue("matricula", funcionario.matricula);
      }
    }
  }, [watchColaborador, contextValue.funcionarios, form]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit interceptado');
  };

  const renderTabContent = (tab: typeof tabs[0]) => {
    if (tab.id === "classificacao") {
      return (
        <div className="space-y-6">
          <ClassificacaoRiscoForm />
          <div className="flex justify-end pt-6 border-t">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Salvando..." : "Salvar Desvio"}
            </Button>
          </div>
        </div>
      );
    } else {
      const Component = tab.component;
      return <Component context={contextValue} />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cadastro de Desvio</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-6">
                    {renderTabContent(tab)}
                  </TabsContent>
                ))}
              </Tabs>

              {activeTab !== "classificacao" && (
                <FormNavigation
                  currentTabIndex={currentTabIndex}
                  totalTabs={tabs.length}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onCancel={handleCancel}
                />
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <FormSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onNewRecord={handleNewRecord}
      />
    </div>
  );
};

export default DesviosForm;
