
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
  // outros valores padrão...
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
    try {
      setIsSubmitting(true);

      const payload = {
        ...values,
        descricao_ocorrencia: values.descricaoOcorrencia,
        numero_cat: values.numeroCat,
        efeito_falha: values.efeitoFalha,
        classificacao_risco: values.classificacaoRisco,
      };

      await createOcorrencia(payload);
      
      toast.success("Ocorrência cadastrada com sucesso!");
      navigate("/ocorrencias/consulta");
    } catch (e: any) {
      toast.error("Erro ao cadastrar ocorrência: " + (e.message || e));
    } finally {
      setIsSubmitting(false);
    }
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
            onSubmit={(e) => form.handleSubmit(onSubmit)(e as any)}
            isSubmitting={isSubmitting}
            isEditMode={false}
          />
        </form>
      </FormProvider>
    </div>
  );
};
