
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createOcorrencia } from "@/services/ocorrencias/ocorrenciasService";
import IdentificacaoForm from "@/components/ocorrencias/forms/IdentificacaoForm";
import InformacoesOcorrenciaForm from "@/components/ocorrencias/forms/InformacoesOcorrenciaForm";
import ClassificacaoRiscoForm from "@/components/ocorrencias/forms/ClassificacaoRiscoForm";
import PlanoAcaoForm from "@/components/ocorrencias/forms/PlanoAcaoForm";
import FechamentoForm from "@/components/ocorrencias/forms/FechamentoForm";
import { OcorrenciaFormNavigation } from "@/components/ocorrencias/forms/OcorrenciaFormNavigation";
import { ValidationDialog } from "@/components/ocorrencias/ValidationDialog";
import { SuccessDialog } from "@/components/ocorrencias/SuccessDialog";
import { useOcorrenciaTabs } from "@/hooks/ocorrencias/useOcorrenciaTabs";
import { ocorrenciaFormSchema, OcorrenciaFormSchema } from "@/schemas/ocorrencias/ocorrenciaFormSchema";

const defaultValues: Partial<OcorrenciaFormSchema> = {
  colaboradores_acidentados: [{ colaborador: "", funcao: "", matricula: "" }],
  acoes: [
    {
      tratativa_aplicada: "",
      data_adequacao: null,
      responsavel_acao: "",
      funcao_responsavel: "",
      situacao: "",
      status: "",
    },
  ],
};

export const OcorrenciaFormProvider: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const navigate = useNavigate();
  const {
    tabs,
    activeTab,
    setActiveTab,
    onNext,
    onPrevious
  } = useOcorrenciaTabs();

  const form = useForm<OcorrenciaFormSchema>({
    resolver: zodResolver(ocorrenciaFormSchema),
    defaultValues,
  });

  const onCancel = () => {
    navigate("/ocorrencias/consulta");
  };

  const validateRequiredFields = (formData: OcorrenciaFormSchema): string[] => {
    const missing: string[] = [];
    
    if (!formData.data) missing.push("Data");
    if (!formData.cca) missing.push("CCA");
    if (!formData.empresa) missing.push("Empresa");
    if (!formData.disciplina) missing.push("Disciplina");
    if (!formData.tipoOcorrencia) missing.push("Tipo de Ocorrência");
    if (!formData.tipoEvento) missing.push("Tipo de Evento");
    if (!formData.classificacaoOcorrencia) missing.push("Classificação da Ocorrência");
    
    return missing;
  };

  const handleFormSubmit = async () => {
    console.log("Iniciando salvamento da ocorrência...");
    setIsSubmitting(true);

    try {
      const formData = form.getValues();
      console.log("Dados do formulário:", formData);

      // Verificar campos obrigatórios
      const missingRequiredFields = validateRequiredFields(formData);
      if (missingRequiredFields.length > 0) {
        setMissingFields(missingRequiredFields);
        setValidationDialogOpen(true);
        setIsSubmitting(false);
        return;
      }

      // Validar formulário com Zod
      const isValid = await form.trigger();
      if (!isValid) {
        console.log("Formulário inválido:", form.formState.errors);
        toast.error("Por favor, corrija os erros no formulário antes de salvar.");
        setIsSubmitting(false);
        return;
      }

      // Preparar dados para envio ao banco (convertendo camelCase para snake_case)
      const ocorrenciaData = {
        // Campos básicos - conversão manual
        data: formData.data instanceof Date ? formData.data.toISOString() : new Date(formData.data).toISOString(),
        hora: formData.hora || null,
        mes: formData.mes ? parseInt(formData.mes) : null,
        ano: formData.ano ? parseInt(formData.ano) : null,
        cca: formData.cca,
        empresa: formData.empresa,
        disciplina: formData.disciplina,
        
        // Responsáveis
        engenheiro_responsavel: formData.engenheiro_responsavel || null,
        supervisor_responsavel: formData.supervisor_responsavel || null,
        encarregado_responsavel: formData.encarregado_responsavel || null,
        
        // Colaboradores
        colaboradores_acidentados: formData.colaboradores_acidentados || [],
        
        // Tipos e classificações (camelCase para snake_case)
        tipo_ocorrencia: formData.tipoOcorrencia,
        tipo_evento: formData.tipoEvento,
        classificacao_ocorrencia: formData.classificacaoOcorrencia,
        
        // Informações da ocorrência (camelCase para snake_case)
        houve_afastamento: formData.houve_afastamento || null,
        dias_perdidos: formData.dias_perdidos || null,
        dias_debitados: formData.dias_debitados || null,
        parte_corpo_atingida: formData.parte_corpo_atingida || null,
        lateralidade: formData.lateralidade || null,
        agente_causador: formData.agente_causador || null,
        situacao_geradora: formData.situacao_geradora || null,
        natureza_lesao: formData.natureza_lesao || null,
        descricao_ocorrencia: formData.descricaoOcorrencia || null,
        numero_cat: formData.numeroCat || null,
        cid: formData.cid || null,
        arquivo_cat: formData.arquivo_cat || null,
        
        // Classificação de risco (camelCase para snake_case)
        exposicao: formData.exposicao || null,
        controle: formData.controle || null,
        deteccao: formData.deteccao || null,
        efeito_falha: formData.efeitoFalha || null,
        impacto: formData.impacto || null,
        probabilidade: formData.probabilidade || null,
        severidade: formData.severidade || null,
        classificacao_risco: formData.classificacaoRisco || null,
        
        // Plano de ação
        acoes: formData.acoes || [],
        
        // Fechamento (camelCase para snake_case)
        investigacao_realizada: formData.investigacao_realizada || null,
        informe_preliminar: formData.informe_preliminar || null,
        relatorio_analise: formData.relatorio_analise || null,
        licoes_aprendidas_enviada: formData.licoes_aprendidas_enviada || null,
        arquivo_licoes_aprendidas: formData.arquivo_licoes_aprendidas || null,
        
        // Status padrão
        status: "Em tratativa"
      };

      console.log("Dados preparados para envio:", ocorrenciaData);

      // Enviar para o banco
      const result = await createOcorrencia(ocorrenciaData);
      
      if (result) {
        console.log("Ocorrência salva com sucesso:", result);
        setSuccessDialogOpen(true);
      } else {
        throw new Error("Falha ao salvar no banco de dados");
      }

    } catch (error) {
      console.error("Erro ao salvar ocorrência:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Erro ao cadastrar ocorrência: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewOccurrence = () => {
    // Reset do formulário
    form.reset(defaultValues);
    setActiveTab("identificacao");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex border-b mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={
                "flex-1 py-2 px-2 text-sm font-medium border-0 rounded-t transition-colors" +
                (activeTab === tab.id ? " bg-background" : " bg-muted hover:bg-muted/60")
              }
              style={{ borderBottom: activeTab === tab.id ? "2px solid #7c3aed" : undefined }}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <FormProvider {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            {activeTab === "identificacao" && <IdentificacaoForm />}
            {activeTab === "informacoes" && <InformacoesOcorrenciaForm />}
            {activeTab === "classificacaoRisco" && <ClassificacaoRiscoForm />}
            {activeTab === "planoAcao" && <PlanoAcaoForm />}
            {activeTab === "fechamento" && <FechamentoForm />}
            
            <OcorrenciaFormNavigation
              activeTab={activeTab}
              tabs={tabs}
              onPrevious={onPrevious}
              onNext={onNext}
              onCancel={onCancel}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              isEditMode={false}
            />
          </form>
        </FormProvider>
      </div>

      <ValidationDialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
        missingFields={missingFields}
      />

      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        onNewOccurrence={handleNewOccurrence}
      />
    </>
  );
};
