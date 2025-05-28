
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService } from "@/services/desvios/desviosCompletosService";
import IdentificacaoForm from "@/components/desvios/forms/IdentificacaoForm";
import InformacoesDesvioForm from "@/components/desvios/forms/InformacoesDesvioForm";
import ClassificacaoRiscoForm from "@/components/desvios/forms/ClassificacaoRiscoForm";
import PlanoAcaoForm from "@/components/desvios/forms/PlanoAcaoForm";
import FechamentoForm from "@/components/desvios/forms/FechamentoForm";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";

interface DesvioFormData {
  // Identificação
  dataDesvio: string;
  horaDesvio: string;
  local: string;
  ccaId: string;
  empresaId: string;
  baseLegalOpcaoId: string;
  engenheiroResponsavelId: string;
  supervisorResponsavelId: string;
  encarregadoResponsavelId: string;
  funcionariosEnvolvidos: any[];
  
  // Informações do Desvio
  tipoRegistroId: string;
  processoId: string;
  eventoIdentificadoId: string;
  causaProvavelId: string;
  disciplinaId: string;
  descricaoDesvio: string;
  acaoImediata: string;
  imagemUrl: string;
  
  // Classificação de Risco
  exposicao: string;
  controle: string;
  deteccao: string;
  efeitoFalha: string;
  impacto: string;
  probabilidade: number;
  severidade: number;
  classificacaoRisco: string;
  
  // Plano de Ação
  acoes: any[];
  
  // Fechamento
  status: string;
  responsavelId: string;
  prazoConclusao: string;
}

const DesviosForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DesvioFormData>({
    defaultValues: {
      dataDesvio: "",
      horaDesvio: "",
      local: "",
      ccaId: "",
      empresaId: "",
      baseLegalOpcaoId: "",
      engenheiroResponsavelId: "",
      supervisorResponsavelId: "",
      encarregadoResponsavelId: "",
      funcionariosEnvolvidos: [],
      tipoRegistroId: "",
      processoId: "",
      eventoIdentificadoId: "",
      causaProvavelId: "",
      disciplinaId: "",
      descricaoDesvio: "",
      acaoImediata: "",
      imagemUrl: "",
      exposicao: "",
      controle: "",
      deteccao: "",
      efeitoFalha: "",
      impacto: "",
      probabilidade: 0,
      severidade: 0,
      classificacaoRisco: "",
      acoes: [],
      status: "Aberto",
      responsavelId: "",
      prazoConclusao: "",
    },
  });

  const tabs = [
    { id: "identificacao", label: "Identificação", component: IdentificacaoForm },
    { id: "informacoes", label: "Informações do Desvio", component: InformacoesDesvioForm },
    { id: "classificacao", label: "Classificação de Risco", component: ClassificacaoRiscoForm },
    { id: "plano", label: "Plano de Ação", component: PlanoAcaoForm },
    { id: "fechamento", label: "Fechamento", component: FechamentoForm },
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
      
      const desvioData = {
        data_desvio: formData.dataDesvio,
        hora_desvio: formData.horaDesvio,
        local: formData.local,
        cca_id: formData.ccaId ? parseInt(formData.ccaId) : undefined,
        empresa_id: formData.empresaId ? parseInt(formData.empresaId) : undefined,
        base_legal_opcao_id: formData.baseLegalOpcaoId ? parseInt(formData.baseLegalOpcaoId) : undefined,
        engenheiro_responsavel_id: formData.engenheiroResponsavelId || undefined,
        supervisor_responsavel_id: formData.supervisorResponsavelId || undefined,
        encarregado_responsavel_id: formData.encarregadoResponsavelId || undefined,
        funcionarios_envolvidos: formData.funcionariosEnvolvidos,
        tipo_registro_id: formData.tipoRegistroId ? parseInt(formData.tipoRegistroId) : undefined,
        processo_id: formData.processoId ? parseInt(formData.processoId) : undefined,
        evento_identificado_id: formData.eventoIdentificadoId ? parseInt(formData.eventoIdentificadoId) : undefined,
        causa_provavel_id: formData.causaProvavelId ? parseInt(formData.causaProvavelId) : undefined,
        disciplina_id: formData.disciplinaId ? parseInt(formData.disciplinaId) : undefined,
        descricao_desvio: formData.descricaoDesvio,
        acao_imediata: formData.acaoImediata,
        imagem_url: formData.imagemUrl,
        exposicao: formData.exposicao ? parseInt(formData.exposicao) : undefined,
        controle: formData.controle ? parseInt(formData.controle) : undefined,
        deteccao: formData.deteccao ? parseInt(formData.deteccao) : undefined,
        efeito_falha: formData.efeitoFalha ? parseInt(formData.efeitoFalha) : undefined,
        impacto: formData.impacto ? parseInt(formData.impacto) : undefined,
        probabilidade: formData.probabilidade,
        severidade: formData.severidade,
        classificacao_risco: formData.classificacaoRisco,
        acoes: formData.acoes,
        status: formData.status,
        responsavel_id: formData.responsavelId || undefined,
        prazo_conclusao: formData.prazoConclusao || undefined,
      };

      const result = await desviosCompletosService.create(desvioData);
      
      if (result) {
        toast({
          title: "Desvio cadastrado com sucesso!",
          description: `Desvio ${result.id} foi criado com sucesso.`,
        });
        
        // Limpar o formulário
        form.reset();
        setActiveTab("identificacao");
      } else {
        throw new Error("Falha ao criar o desvio");
      }
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
                <TabsList className="grid w-full grid-cols-5">
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
