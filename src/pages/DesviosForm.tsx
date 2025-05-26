
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import IdentificacaoForm from "@/components/desvios/forms/IdentificacaoForm";
import AnaliseForm from "@/components/desvios/forms/AnaliseForm";
import PlanoAcaoForm from "@/components/desvios/forms/PlanoAcaoForm";
import ClassificacaoRiscoForm from "@/components/desvios/forms/ClassificacaoRiscoForm";

type DesvioFormData = {
  data: Date | null;
  local: string;
  responsavel: string;
  tipoDesvio: string;
  classificacao: string;
  descricao: string;
  acaoImediata: string;
  anexos: File[];
  
  // Classificação de Risco
  exposicao: string;
  controle: string;
  deteccao: string;
  efeitoFalha: string;
  impacto: string;
  probabilidade: number | null;
  severidade: number | null;
  classificacaoRisco: string;
  
  // Análise
  causaRaiz: string;
  analiseDetalhada: string;
  
  // Plano de Ação
  acoesCorretivasPreventivas: Array<{
    descricao: string;
    responsavel: string;
    prazo: Date | null;
    status: string;
  }>;
};

const DesviosForm = () => {
  const [activeTab, setActiveTab] = useState("identificacao");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  const methods = useForm<DesvioFormData>({
    defaultValues: {
      acoesCorretivasPreventivas: [{
        descricao: '',
        responsavel: '',
        prazo: null,
        status: 'Pendente'
      }]
    }
  });

  const tabs = [
    { id: "identificacao", label: "Identificação" },
    { id: "classificacaoRisco", label: "Classificação de Risco" },
    { id: "analise", label: "Análise" },
    { id: "planoAcao", label: "Plano de Ação" },
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

  const onSubmit = (data: DesvioFormData) => {
    console.log("Form submitted:", data);
    
    if (!data.data || !data.local || !data.tipoDesvio) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    
    setSuccessDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Cadastro de Desvios</h1>
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

                <TabsContent value="classificacaoRisco">
                  <ClassificacaoRiscoForm />
                </TabsContent>

                <TabsContent value="analise">
                  <AnaliseForm />
                </TabsContent>

                <TabsContent value="planoAcao">
                  <PlanoAcaoForm />
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
                      Salvar desvio
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
            <DialogTitle>Desvio registrado com sucesso!</DialogTitle>
            <DialogDescription>
              Os dados do desvio foram salvos no sistema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setSuccessDialogOpen(false);
                methods.reset({
                  acoesCorretivasPreventivas: [{
                    descricao: '',
                    responsavel: '',
                    prazo: null,
                    status: 'Pendente'
                  }]
                });
                setActiveTab("identificacao");
              }}
            >
              Registrar novo desvio
            </Button>
            <Button asChild>
              <Link to="/">Menu principal</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DesviosForm;
