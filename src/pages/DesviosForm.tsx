import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService } from "@/services/desvios/desviosCompletosService";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCCAs,
  fetchTiposRegistro,
  fetchProcessos,
  fetchEventosIdentificados,
  fetchCausasProvaveis,
  fetchEmpresas,
  fetchDisciplinas,
  fetchEngenheiros,
  fetchBaseLegalOpcoes,
  fetchSupervisores,
  fetchEncarregados,
  fetchFuncionarios,
} from "@/services/desviosService";
import NovaIdentificacaoForm from "@/components/desvios/forms/NovaIdentificacaoForm";
import NovasInformacoesForm from "@/components/desvios/forms/NovasInformacoesForm";
import AcaoCorretivaForm from "@/components/desvios/forms/AcaoCorretivaForm";
import ClassificacaoRiscoForm from "@/components/desvios/forms/ClassificacaoRiscoForm";
import FormSuccessDialog from "@/components/desvios/forms/FormSuccessDialog";
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Fetch data for all select options
  const { data: ccas = [] } = useQuery({
    queryKey: ['ccas'],
    queryFn: fetchCCAs,
  });

  const { data: tiposRegistro = [] } = useQuery({
    queryKey: ['tipos-registro'],
    queryFn: fetchTiposRegistro,
  });

  const { data: processos = [] } = useQuery({
    queryKey: ['processos'],
    queryFn: fetchProcessos,
  });

  const { data: eventosIdentificados = [] } = useQuery({
    queryKey: ['eventos-identificados'],
    queryFn: fetchEventosIdentificados,
  });

  const { data: causasProvaveis = [] } = useQuery({
    queryKey: ['causas-provaveis'],
    queryFn: fetchCausasProvaveis,
  });

  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn: fetchEmpresas,
  });

  const { data: disciplinas = [] } = useQuery({
    queryKey: ['disciplinas'],
    queryFn: fetchDisciplinas,
  });

  const { data: engenheiros = [] } = useQuery({
    queryKey: ['engenheiros'],
    queryFn: fetchEngenheiros,
  });

  const { data: baseLegalOpcoes = [] } = useQuery({
    queryKey: ['base-legal-opcoes'],
    queryFn: fetchBaseLegalOpcoes,
  });

  const { data: supervisores = [] } = useQuery({
    queryKey: ['supervisores'],
    queryFn: fetchSupervisores,
  });

  const { data: encarregados = [] } = useQuery({
    queryKey: ['encarregados'],
    queryFn: fetchEncarregados,
  });

  const { data: funcionarios = [] } = useQuery({
    queryKey: ['funcionarios'],
    queryFn: fetchFuncionarios,
  });

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

  const validateRequiredFields = (): boolean => {
    const formData = form.getValues();
    const requiredFields = [
      'data',
      'hora',
      'ccaId',
      'tipoRegistro',
      'processo',
      'eventoIdentificado',
      'causaProvavel',
      'responsavelInspecao',
      'empresa',
      'disciplina',
      'engenheiroResponsavel',
      'descricao',
      'baseLegal',
      'supervisorResponsavel',
      'encarregadoResponsavel',
      'tratativaAplicada',
      'responsavelAcao',
      'prazoCorrecao',
      'situacaoAcao'
    ];

    const missingFields: string[] = [];
    
    requiredFields.forEach(field => {
      const value = formData[field as keyof DesvioFormData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      const fieldNames: Record<string, string> = {
        data: 'Data',
        hora: 'Hora',
        ccaId: 'CCA',
        tipoRegistro: 'Tipo de Registro',
        processo: 'Processo',
        eventoIdentificado: 'Evento Identificado',
        causaProvavel: 'Causa Provável',
        responsavelInspecao: 'Responsável pela Inspeção',
        empresa: 'Empresa',
        disciplina: 'Disciplina',
        engenheiroResponsavel: 'Engenheiro Responsável',
        descricao: 'Descrição',
        baseLegal: 'Base Legal',
        supervisorResponsavel: 'Supervisor Responsável',
        encarregadoResponsavel: 'Encarregado Responsável',
        tratativaAplicada: 'Tratativa Aplicada',
        responsavelAcao: 'Responsável pela Ação',
        prazoCorrecao: 'Prazo para Correção',
        situacaoAcao: 'Situação da Ação'
      };

      const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
      
      toast({
        title: "Campos obrigatórios não preenchidos",
        description: `Por favor, preencha os seguintes campos: ${missingFieldNames.join(', ')}`,
        variant: "destructive",
      });
      
      return false;
    }

    return true;
  };

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
    
    if (!validateRequiredFields()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = form.getValues();
      console.log("Dados do formulário:", formData);
      
      // Prepare data for desvios_completos table
      const desvioData = {
        data_desvio: formData.data,
        hora_desvio: formData.hora,
        local: formData.responsavelInspecao || "Local não especificado",
        cca_id: formData.ccaId ? parseInt(formData.ccaId) : null,
        empresa_id: formData.empresa ? parseInt(formData.empresa) : null,
        base_legal_opcao_id: formData.baseLegal ? parseInt(formData.baseLegal) : null,
        engenheiro_responsavel_id: formData.engenheiroResponsavel || null,
        supervisor_responsavel_id: formData.supervisorResponsavel || null,
        encarregado_responsavel_id: formData.encarregadoResponsavel || null,
        funcionarios_envolvidos: formData.colaboradorInfrator ? [{ 
          id: formData.colaboradorInfrator, 
          funcao: formData.funcao, 
          matricula: formData.matricula 
        }] : [],
        tipo_registro_id: formData.tipoRegistro ? parseInt(formData.tipoRegistro) : null,
        processo_id: formData.processo ? parseInt(formData.processo) : null,
        evento_identificado_id: formData.eventoIdentificado ? parseInt(formData.eventoIdentificado) : null,
        causa_provavel_id: formData.causaProvavel ? parseInt(formData.causaProvavel) : null,
        disciplina_id: formData.disciplina ? parseInt(formData.disciplina) : null,
        descricao_desvio: formData.descricao.toUpperCase(),
        acao_imediata: formData.tratativaAplicada.toUpperCase(),
        exposicao: formData.exposicao ? parseInt(formData.exposicao) : null,
        controle: formData.controle ? parseInt(formData.controle) : null,
        deteccao: formData.deteccao ? parseInt(formData.deteccao) : null,
        efeito_falha: formData.efeitoFalha ? parseInt(formData.efeitoFalha) : null,
        impacto: formData.impacto ? parseInt(formData.impacto) : null,
        probabilidade: formData.probabilidade || null,
        severidade: formData.severidade || null,
        classificacao_risco: formData.classificacaoRisco || null,
        acoes: formData.aplicacaoMedidaDisciplinar ? [{
          responsavel: formData.responsavelAcao.toUpperCase(),
          prazo: formData.prazoCorrecao,
          situacao: formData.situacaoAcao,
          medida_disciplinar: formData.aplicacaoMedidaDisciplinar
        }] : [],
        status: 'Aberto',
        prazo_conclusao: formData.prazoCorrecao || null,
      };
      
      const result = await desviosCompletosService.create(desvioData);
      
      if (result) {
        setShowSuccessDialog(true);
      } else {
        throw new Error("Falha ao criar desvio");
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

  const handleNewRecord = () => {
    form.reset();
    setActiveTab("identificacao");
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

  // Watch colaboradorInfrator to auto-populate funcao and matricula
  const watchColaborador = form.watch("colaboradorInfrator");
  React.useEffect(() => {
    if (watchColaborador) {
      const funcionario = funcionarios.find(f => f.id === watchColaborador);
      if (funcionario) {
        form.setValue("funcao", funcionario.funcao);
        form.setValue("matricula", funcionario.matricula);
      }
    }
  }, [watchColaborador, funcionarios, form]);

  const contextValue = {
    ccas,
    tiposRegistro,
    processos,
    eventosIdentificados,
    causasProvaveis,
    empresas,
    disciplinas,
    engenheiros,
    baseLegalOpcoes,
    supervisores,
    encarregados,
    funcionarios,
  };

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
                    {CurrentTabComponent && <CurrentTabComponent context={contextValue} />}
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

      <FormSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        onNewRecord={handleNewRecord}
      />
    </div>
  );
};

export default DesviosForm;
