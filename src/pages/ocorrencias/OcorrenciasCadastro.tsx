import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  Save,
  X
} from "lucide-react";
import IdentificacaoForm from "@/components/ocorrencias/forms/IdentificacaoForm";
import InformacoesOcorrenciaForm from "@/components/ocorrencias/forms/InformacoesOcorrenciaForm";
import ClassificacaoRiscoForm from "@/components/ocorrencias/forms/ClassificacaoRiscoForm";
import PlanoAcaoForm from "@/components/ocorrencias/forms/PlanoAcaoForm";
import FechamentoForm from "@/components/ocorrencias/forms/FechamentoForm";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { createOcorrencia, updateOcorrencia, getOcorrenciaById, OcorrenciaFormData } from "@/services/ocorrencias/ocorrenciasService";

const OcorrenciasCadastro = () => {
  const [activeTab, setActiveTab] = useState("identificacao");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ocorrenciaId = searchParams.get("id");

  const getDefaultValues = () => ({
    data: null,
    hora: '',
    mes: '',
    ano: '',
    cca: '',
    empresa: '',
    disciplina: '',
    engenheiro_responsavel: '',
    supervisor_responsavel: '',
    encarregado_responsavel: '',
    colaboradores_acidentados: [{
      colaborador: '',
      funcao: '',
      matricula: ''
    }],
    tipo_ocorrencia: '',
    tipo_evento: '',
    classificacao_ocorrencia: '',
    houve_afastamento: '',
    dias_perdidos: null,
    dias_debitados: null,
    parte_corpo_atingida: '',
    lateralidade: '',
    agente_causador: '',
    situacao_geradora: '',
    natureza_lesao: '',
    descricao_ocorrencia: '',
    numero_cat: '',
    cid: '',
    arquivo_cat: null,
    exposicao: '',
    controle: '',
    deteccao: '',
    efeito_falha: '',
    impacto: '',
    probabilidade: null,
    severidade: null,
    classificacao_risco: '',
    acoes: [{
      tratativa_aplicada: '',
      data_adequacao: null,
      responsavel_acao: '',
      funcao_responsavel: '',
      situacao: '',
      status: ''
    }],
    investigacao_realizada: '',
    informe_preliminar: null,
    relatorio_analise: null,
    licoes_aprendidas_enviada: '',
    arquivo_licoes_aprendidas: null
  });
  
  const methods = useForm<OcorrenciaFormData>({
    defaultValues: getDefaultValues()
  });

  useEffect(() => {
    if (ocorrenciaId) {
      setIsEditMode(true);
      setLoadingData(true);
      
      getOcorrenciaById(ocorrenciaId).then((ocorrencia) => {
        if (ocorrencia) {
          const formData: Partial<OcorrenciaFormData> = {
            data: ocorrencia.data ? new Date(ocorrencia.data) : null,
            hora: ocorrencia.hora || '',
            mes: ocorrencia.mes?.toString() || '',
            ano: ocorrencia.ano?.toString() || '',
            cca: ocorrencia.cca || '',
            empresa: ocorrencia.empresa || '',
            disciplina: ocorrencia.disciplina || '',
            tipo_ocorrencia: ocorrencia.tipo_ocorrencia || '',
            tipo_evento: ocorrencia.tipo_evento || '',
            classificacao_ocorrencia: ocorrencia.classificacao_ocorrencia || '',
            engenheiro_responsavel: ocorrencia.engenheiro_responsavel || '',
            supervisor_responsavel: ocorrencia.supervisor_responsavel || '',
            encarregado_responsavel: ocorrencia.encarregado_responsavel || '',
            colaboradores_acidentados: Array.isArray(ocorrencia.colaboradores_acidentados) 
              ? ocorrencia.colaboradores_acidentados.map((col: any) => ({
                  colaborador: col.colaborador || '',
                  funcao: col.funcao || '',
                  matricula: col.matricula || ''
                }))
              : [{
                  colaborador: '',
                  funcao: '',
                  matricula: ''
                }],
            houve_afastamento: ocorrencia.houve_afastamento || '',
            dias_perdidos: ocorrencia.dias_perdidos,
            dias_debitados: ocorrencia.dias_debitados,
            parte_corpo_atingida: ocorrencia.parte_corpo_atingida || '',
            lateralidade: ocorrencia.lateralidade || '',
            agente_causador: ocorrencia.agente_causador || '',
            situacao_geradora: ocorrencia.situacao_geradora || '',
            natureza_lesao: ocorrencia.natureza_lesao || '',
            descricao_ocorrencia: ocorrencia.descricao_ocorrencia || '',
            numero_cat: ocorrencia.numero_cat || '',
            cid: ocorrencia.cid || '',
            exposicao: ocorrencia.exposicao || '',
            controle: ocorrencia.controle || '',
            deteccao: ocorrencia.deteccao || '',
            efeito_falha: ocorrencia.efeito_falha || '',
            impacto: ocorrencia.impacto || '',
            probabilidade: ocorrencia.probabilidade,
            severidade: ocorrencia.severidade,
            classificacao_risco: ocorrencia.classificacao_risco || '',
            acoes: Array.isArray(ocorrencia.acoes) 
              ? ocorrencia.acoes.map((acao: any) => ({
                  tratativa_aplicada: acao.tratativa_aplicada || '',
                  data_adequacao: acao.data_adequacao ? new Date(acao.data_adequacao) : null,
                  responsavel_acao: acao.responsavel_acao || '',
                  funcao_responsavel: acao.funcao_responsavel || '',
                  situacao: acao.situacao || '',
                  status: acao.status || ''
                }))
              : [{
                  tratativa_aplicada: '',
                  data_adequacao: null,
                  responsavel_acao: '',
                  funcao_responsavel: '',
                  situacao: '',
                  status: ''
                }],
            investigacao_realizada: ocorrencia.investigacao_realizada || '',
            licoes_aprendidas_enviada: ocorrencia.licoes_aprendidas_enviada || '',
            arquivo_cat: null,
            informe_preliminar: null,
            relatorio_analise: null,
            arquivo_licoes_aprendidas: null
          };
          
          methods.reset(formData);
          
          toast({
            title: "Edição de Ocorrência",
            description: `Dados da ocorrência carregados para edição.`
          });
        } else {
          toast({
            title: "Erro",
            description: "Ocorrência não encontrada.",
            variant: "destructive"
          });
          navigate("/ocorrencias/consulta");
        }
        
        setLoadingData(false);
      }).catch((error) => {
        console.error('Erro ao carregar ocorrência:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados da ocorrência.",
          variant: "destructive"
        });
        setLoadingData(false);
      });
    }
  }, [ocorrenciaId, methods, toast, navigate]);

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

  const handleCancel = () => {
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    methods.reset(getDefaultValues());
    setActiveTab("identificacao");
    setCancelDialogOpen(false);
    
    toast({
      title: "Formulário cancelado",
      description: "O preenchimento foi cancelado e os dados foram limpos."
    });
  };

  const clearForm = () => {
    console.log('Limpando formulário...');
    methods.reset(getDefaultValues());
    setActiveTab("identificacao");
  };

  const onSubmit = async (data: OcorrenciaFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Is edit mode:", isEditMode);

    // Logging the empresa field before validation
    console.log("Valor capturado de empresa (pré-validação):", data.empresa);

    // Validação detalhada
    if (!data.data) {
      console.log("Validation error: data is missing");
      toast({
        title: "Erro de validação",
        description: "O campo 'Data' é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!data.cca) {
      console.log("Validation error: cca is missing");
      toast({
        title: "Erro de validação",
        description: "O campo 'CCA' é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!data.empresa) {
      console.log("Validation error: empresa is missing");
      toast({
        title: "Erro de validação",
        description: "O campo 'Empresa' é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    // --- FIX BELOW: context of 'empresa' type (force as string | number | undefined) ---
    const empresaValue = data.empresa as string | number | undefined;
    const fixedEmpresa =
      typeof empresaValue === "number"
        ? empresaValue.toString()
        : empresaValue || "";
    if (data.empresa !== fixedEmpresa) {
      console.log(
        "Corrigindo valor de empresa para string. Antes:",
        data.empresa,
        "Depois:",
        fixedEmpresa
      );
      data.empresa = fixedEmpresa;
    }
    // --- END FIX ---

    setIsSubmitting(true);

    try {
      console.log("Starting save process...");
      console.log("Valor FINAL de empresa antes de criar/atualizar:", data.empresa, "Tipo:", typeof data.empresa);
      if (isEditMode && ocorrenciaId) {
        console.log("Updating existing ocorrencia with ID:", ocorrenciaId);
        await updateOcorrencia(ocorrenciaId, data);
        toast({
          title: "Sucesso",
          description: "Ocorrência atualizada com sucesso!"
        });
      } else {
        console.log("Creating new ocorrencia...");
        const result = await createOcorrencia(data);
        console.log("Create result:", result);
        toast({
          title: "Sucesso",
          description: "Ocorrência cadastrada com sucesso!"
        });

        // Limpar formulário após criar nova ocorrência
        if (!isEditMode) {
          clearForm();
        }
      }

      setSuccessDialogOpen(true);
    } catch (error) {
      console.error('Detailed error:', error);
      toast({
        title: "Erro",
        description: `Erro ao salvar a ocorrência: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditMode ? "Edição de Ocorrência" : "Cadastro de Ocorrências"}
        </h1>
        {isEditMode && (
          <Button 
            variant="outline" 
            onClick={() => navigate(`/ocorrencias/detalhes/${ocorrenciaId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Detalhes
          </Button>
        )}
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
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={activeTab === tabs[0].id}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Anterior
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                  
                  {/* Só mostrar botão de salvar na aba "Fechamento" */}
                  {activeTab === "fechamento" ? (
                    <Button type="submit" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Salvando..." : (isEditMode ? "Salvar alterações" : "Salvar ocorrência")}
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
      
      {/* Dialog de cancelamento */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar preenchimento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar o preenchimento? Todos os dados inseridos serão perdidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCancelDialogOpen(false)}
            >
              Continuar preenchendo
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmCancel}
            >
              Sim, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditMode 
                ? "Ocorrência atualizada com sucesso!" 
                : "Ocorrência registrada com sucesso!"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "As alterações foram salvas no sistema." 
                : "Os dados da ocorrência foram salvos no sistema."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {!isEditMode && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSuccessDialogOpen(false);
                  clearForm();
                }}
              >
                Registrar nova ocorrência
              </Button>
            )}
            <Button 
              asChild
              onClick={() => {
                if (isEditMode) {
                  navigate(`/ocorrencias/detalhes/${ocorrenciaId}`);
                }
              }}
            >
              <Link to={isEditMode ? `/ocorrencias/detalhes/${ocorrenciaId}` : "/"}>
                {isEditMode ? "Ver detalhes" : "Menu principal"}
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OcorrenciasCadastro;
