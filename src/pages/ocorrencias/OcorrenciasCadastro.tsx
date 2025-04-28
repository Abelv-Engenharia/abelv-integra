
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save 
} from "lucide-react";
import IdentificacaoForm from "@/components/ocorrencias/forms/IdentificacaoForm";
import InformacoesOcorrenciaForm from "@/components/ocorrencias/forms/InformacoesOcorrenciaForm";
import ClassificacaoRiscoForm from "@/components/ocorrencias/forms/ClassificacaoRiscoForm";
import PlanoAcaoForm from "@/components/ocorrencias/forms/PlanoAcaoForm";
import FechamentoForm from "@/components/ocorrencias/forms/FechamentoForm";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

// Define types for form data
type OcorrenciaFormData = {
  // Identificação
  data: Date | null;
  hora: string;
  mes: string;
  ano: string;
  cca: string;
  empresa: string;
  disciplina: string;
  engenheiroResponsavel: string;
  supervisorResponsavel: string;
  encarregadoResponsavel: string;
  colaboradoresAcidentados: Array<{
    colaborador: string;
    funcao: string;
    matricula: string;
  }>;
  tipoOcorrencia: string;
  tipoEvento: string;
  classificacaoOcorrencia: string;
  
  // Informações
  houveAfastamento: string;
  diasPerdidos: number | null;
  diasDebitados: number | null;
  parteCorpoAtingida: string;
  lateralidade: string;
  agenteCausador: string;
  situacaoGeradora: string;
  naturezaLesao: string;
  descricaoOcorrencia: string;
  numeroCat: string;
  cid: string;
  arquivoCAT: File | null;
  
  // Classificação de Risco
  severidade: string;
  probabilidade: string;
  classificacaoRisco: string;
  
  // Plano de Ação
  tratativaAplicada: string;
  dataAdequacao: Date | null;
  responsavelAcao: string;
  funcaoResponsavel: string;
  situacao: string;
  status: string;
  
  // Fechamento
  investigacaoRealizada: string;
  informePreliminar: string;
  relatorioAnalise: File | null;
  licoesAprendidasEnviada: string;
  arquivoLicoesAprendidas: File | null;
};

const OcorrenciasCadastro = () => {
  const [activeTab, setActiveTab] = useState("identificacao");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const methods = useForm<OcorrenciaFormData>();

  const tabs = [
    { id: "identificacao", label: "Identificação" },
    { id: "informacoes", label: "Informações da Ocorrência" },
    { id: "classificacaoRisco", label: "Classificação de Risco" },
    { id: "planoAcao", label: "Plano de Ação" },
    { id: "fechamento", label: "Fechamento" },
  ];

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const onSubmit = (data: OcorrenciaFormData) => {
    console.log("Form submitted:", data);
    
    // Validate all required fields here
    // This is a simple validation for demonstration
    if (!data.data || !data.cca || !data.empresa) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    // Save data and show success dialog
    setSuccessDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Cadastro de Ocorrências</h1>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full flex overflow-x-auto max-w-full mb-6">
                  {tabs.map(tab => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="flex-1"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="identificacao">
                  <IdentificacaoForm />
                </TabsContent>

                <TabsContent value="informacoes">
                  <InformacoesOcorrenciaForm />
                </TabsContent>

                <TabsContent value="classificacaoRisco">
                  <ClassificacaoRiscoForm />
                </TabsContent>

                <TabsContent value="planoAcao">
                  <PlanoAcaoForm />
                </TabsContent>

                <TabsContent value="fechamento">
                  <FechamentoForm />
                </TabsContent>
                
                <div className="flex justify-between mt-6 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={activeTab === tabs[0].id}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>
                  
                  {activeTab === tabs[tabs.length - 1].id ? (
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Salvar ocorrência
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleNext}>
                      Próximo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Tabs>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ocorrência registrada com sucesso!</DialogTitle>
            <DialogDescription>
              Os dados da ocorrência foram salvos no sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSuccessDialogOpen(false);
                methods.reset();
                setActiveTab("identificacao");
              }}
            >
              Registrar nova ocorrência
            </Button>
            <Button asChild>
              <Link to="/">
                Menu principal
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OcorrenciasCadastro;
