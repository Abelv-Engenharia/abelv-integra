
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
import { useOcorrenciaTabs } from "@/hooks/ocorrencias/useOcorrenciaTabs";
import { ocorrenciaFormSchema, OcorrenciaFormSchema } from "@/schemas/ocorrencias/ocorrenciaFormSchema";
import { transformFormDataToOcorrencia } from "@/utils/ocorrenciasDataTransform";

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

  const onSubmit = async (values: OcorrenciaFormSchema) => {
    console.log("onSubmit chamado com valores:", values);
    setIsSubmitting(true);

    const ocorrenciaData = transformFormDataToOcorrencia(values);

    // Validação mínima
    if (!ocorrenciaData.data || !ocorrenciaData.classificacao_risco || !ocorrenciaData.cca || !ocorrenciaData.empresa) {
      toast.error(
        `Preencha os campos obrigatórios: data, classificação de risco, CCA e empresa!
        (data: ${!!ocorrenciaData.data ? "Ok" : "Vazio"},
        classificação: ${!!ocorrenciaData.classificacao_risco ? "Ok" : "Vazio"},
        CCA: ${!!ocorrenciaData.cca ? "Ok" : "Vazio"},
        empresa: ${!!ocorrenciaData.empresa ? "Ok" : "Vazio"}
        )`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Enviando dados para createOcorrencia:", ocorrenciaData);
      const result = await createOcorrencia(ocorrenciaData);

      if (!result) {
        toast.error("Erro ao cadastrar ocorrência: Registro não foi salvo no banco.");
        setIsSubmitting(false);
        return;
      }

      console.log("Ocorrência salva com sucesso:", result);
      toast.success("Ocorrência cadastrada com sucesso!");
      navigate("/ocorrencias/consulta");
    } catch (e: any) {
      const erroMsg =
        e?.message ||
        (e && typeof e === "object" ? JSON.stringify(e) : String(e));
      toast.error("Erro crítico ao cadastrar ocorrência: " + erroMsg);
      console.error("[OCORRENCIA] Erro ao cadastrar:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async () => {
    console.log("handleFormSubmit executado");
    const values = form.getValues();
    console.log("Valores atuais do formulário:", values);
    
    // Validar o formulário antes de submeter
    const isValid = await form.trigger();
    console.log("Formulário válido:", isValid);
    
    if (!isValid) {
      const errors = form.formState.errors;
      console.log("Erros de validação:", errors);
      toast.error("Por favor, corrija os erros no formulário antes de salvar.");
      return;
    }
    
    await onSubmit(values);
  };

  return (
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
  );
};
