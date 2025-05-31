
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService } from "@/services/desvios/desviosCompletosService";
import NovaIdentificacaoForm from "@/components/desvios/forms/NovaIdentificacaoForm";
import NovasInformacoesForm from "@/components/desvios/forms/NovasInformacoesForm";
import AcaoCorretivaForm from "@/components/desvios/forms/AcaoCorretivaForm";
import ClassificacaoRiscoForm from "@/components/desvios/forms/ClassificacaoRiscoForm";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";

interface DesvioFormData {
  // Nova Identificação
  data: string;
  hora: string;
  ano: string;
  mes: string;
  ccaId: string;
  tipoRegistro: string;
  processo: string;
  eventoIdentificado: string;
  causaProvavel: string;
  responsavelInspecao: string;
  empresa: string;
  disciplina: string;
  engenheiroResponsavel: string;
  
  // Novas Informações
  descricao: string;
  baseLegal: string;
  supervisorResponsavel: string;
  encarregadoResponsavel: string;
  colaboradorInfrator: string;
  funcao: string;
  matricula: string;
  
  // Ação Corretiva
  tratativaAplicada: string;
  responsavelAcao: string;
  prazoCorrecao: string;
  situacaoAcao: string;
  aplicacaoMedidaDisciplinar: boolean;
  
  // Classificação de Risco (mantida)
  exposicao: string;
  controle: string;
  deteccao: string;
  efeitoFalha: string;
  impacto: string;
  probabilidade: number;
  severidade: number;
  classificacaoRisco: string;
}

const DesviosForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DesvioFormData>({
    defaultValues: {
      data: "",
      hora: "",
      ano: "",
      mes: "",
      ccaId: "",
      tipoRegistro: "",
      processo: "",
      eventoIdentificado: "",
      causaProvavel: "",
      responsavelInspecao: "",
      empresa: "",
      disciplina: "",
      engenheiroResponsavel: "",
      descricao: "",
      baseLegal: "",
      supervisorResponsavel: "",
      encarregadoResponsavel: "",
      colaboradorInfrator: "",
      funcao: "",
      matricula: "",
      tratativaAplicada: "",
      responsavelAcao: "",
      prazoCorrecao: "",
      situacaoAcao: "pendente",
      aplicacaoMedidaDisciplinar: false,
      exposicao: "",
      controle: "",
      deteccao: "",
      efeitoFalha: "",
      impacto: "",
      probabilidade: 0,
      severidade: 0,
      classificacaoRisco: "",
    },
  });

  const tabs = [
    { id: "identificacao", label: "Identificação", component: NovaIdentificacaoForm },
    { id: "informacoes", label: "Informações", component: NovasInformacoesForm },
    { id: "acao-corretiva", label: "Ação Corretiva", component: AcaoCorretivaForm },
    { id: "classificacao", label: "Classificação de Risco", component: ClassificacaoRiscoForm },
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  const handleNext = () => {
    console.log("Botão Próximo clicado");
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    console.log("Botão Anterior clicado");
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleSave = async () => {
    console.log("Botão Salvar clicado");
    setIsSubmitting(true);
    
    try {
      const formData = form.getValues();
      console.log("Dados do formulário:", formData);
      
      // Simulação de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Desvio cadastrado com sucesso!",
        description: "O desvio foi registrado no sistema.",
      });
      
      // Limpar o formulário
      form.reset();
      setActiveTab("identificacao");
    } catch (error) {
      console.error("Erro ao salvar desvio:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar o desvio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log("Botão Cancelar clicado");
    form.reset();
    setActiveTab("identificacao");
    toast({
      title: "Formulário cancelado",
      description: "O formulário foi resetado.",
    });
  };

  const CurrentTabComponent = tabs.find(tab => tab.id === activeTab)?.component;

  // Auto-popular ano e mês quando a data for selecionada
  const watchData = form.watch("data");
  React.useEffect(() => {
    if (watchData) {
      const date = new Date(watchData);
      form.setValue("ano", date.getFullYear().toString());
      form.setValue("mes", (date.getMonth() + 1).toString().padStart(2, '0'));
    }
  }, [watchData, form]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cadastro de Desvio</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form className="space-y-6">
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
                    {CurrentTabComponent && <CurrentTabComponent />}
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

export default DesviosForm;
