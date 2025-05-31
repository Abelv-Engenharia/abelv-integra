
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import DateTimeFields from "@/components/treinamentos/execucao/DateTimeFields";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";

interface TreinamentoFormValues {
  data: string;
  carga_horaria: number;
  cca_id: number;
  efetivo_mod: number;
  efetivo_moi: number;
  horas_totais: number;
  cca: string;
  processo_treinamento: string;
  tipo_treinamento: string;
  treinamento_nome: string;
  observacoes: string;
  lista_presenca_url: string;
}

const TreinamentosExecucao = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("data-horario");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TreinamentoFormValues>({
    defaultValues: {
      data: "",
      carga_horaria: 0,
      cca_id: 0,
      efetivo_mod: 0,
      efetivo_moi: 0,
      horas_totais: 0,
      cca: "",
      processo_treinamento: "",
      tipo_treinamento: "",
      treinamento_nome: "",
      observacoes: "",
      lista_presenca_url: "",
    },
  });

  const tabs = [
    { id: "data-horario", label: "Data e Horário", component: DateTimeFields },
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
      console.log("Dados do formulário:", formData);
      
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

  const CurrentTabComponent = tabs.find(tab => tab.id === activeTab)?.component;

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
                <TabsList className="grid w-full grid-cols-1">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-6">
                    {CurrentTabComponent && <CurrentTabComponent form={form} />}
                  </TabsContent>
                ))}
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
