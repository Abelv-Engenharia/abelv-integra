
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import IdentificacaoForm from "@/components/ocorrencias/forms/IdentificacaoForm";
import InformacoesOcorrenciaForm from "@/components/ocorrencias/forms/InformacoesOcorrenciaForm";
import { OcorrenciaFormNavigation } from "@/components/ocorrencias/forms/OcorrenciaFormNavigation";
import ClassificacaoRiscoForm from "@/components/ocorrencias/forms/ClassificacaoRiscoForm";
import PlanoAcaoForm from "@/components/ocorrencias/forms/PlanoAcaoForm";
import FechamentoForm from "@/components/ocorrencias/forms/FechamentoForm"; // NOVO IMPORT

const schema = z.object({
  // Aba 1: Identificação
  data: z.coerce.date({ required_error: "Campo obrigatório" }),
  hora: z.string().min(1, "Campo obrigatório"),
  mes: z.string().min(1, "Campo obrigatório"),
  ano: z.string().min(1, "Campo obrigatório"),
  cca: z.string().min(1, "Campo obrigatório"),
  empresa: z.string().optional(),
  disciplina: z.string().min(1, "Campo obrigatório"),
  engenheiro_responsavel: z.string().optional(),
  supervisor_responsavel: z.string().optional(),
  encarregado_responsavel: z.string().optional(),
  colaboradores_acidentados: z
    .array(
      z.object({
        colaborador: z.string().optional(),
        funcao: z.string().optional(),
        matricula: z.string().optional(),
      })
    )
    .optional(),
  tipo_ocorrencia: z.string().min(1, "Campo obrigatório"),
  tipo_evento: z.string().min(1, "Campo obrigatório"),
  classificacao_ocorrencia: z.string().min(1, "Campo obrigatório"),

  // Informações Ocorrência
  houve_afastamento: z.string().optional(),
  dias_perdidos: z.union([z.number(), z.null()]).optional(),
  dias_debitados: z.union([z.number(), z.null()]).optional(),
  parte_corpo_atingida: z.string().optional(),
  lateralidade: z.string().optional(),
  agente_causador: z.string().optional(),
  situacao_geradora: z.string().optional(),
  natureza_lesao: z.string().optional(),
  descricaoOcorrencia: z.string().optional(),
  numeroCat: z.string().optional(),
  cid: z.string().optional(),
  arquivo_cat: z.any().optional(),

  // Classificação de Risco
  exposicao: z.string().optional(),
  controle: z.string().optional(),
  deteccao: z.string().optional(),
  efeitoFalha: z.string().optional(),
  impacto: z.string().optional(),
  probabilidade: z.number().optional(),
  severidade: z.number().optional(),
  classificacaoRisco: z.string().optional(),

  // Plano de Ação
  acoes: z
    .array(
      z.object({
        tratativa_aplicada: z.string().optional(),
        data_adequacao: z.date().nullable().optional(),
        responsavel_acao: z.string().optional(),
        funcao_responsavel: z.string().optional(),
        situacao: z.string().optional(),
        status: z.string().optional(),
      })
    )
    .optional(),

  // Fechamento
  investigacao_realizada: z.string().optional(),
  informe_preliminar: z.any().optional(),
  relatorio_analise: z.any().optional(),
  licoes_aprendidas_enviada: z.string().optional(),
  arquivo_licoes_aprendidas: z.any().optional(),

  // outros campos podem ser adicionados aqui...
});

type OcorrenciaFormSchema = z.infer<typeof schema>;

// Atualização de abas para incluir Fechamento
const tabs = [
  { id: "identificacao", label: "Identificação" },
  { id: "informacoes", label: "Informações da Ocorrência" },
  { id: "classificacaoRisco", label: "Classificação de Risco" },
  { id: "planoAcao", label: "Plano de Ação" },
  { id: "fechamento", label: "Fechamento" },
];

const OcorrenciasCadastro: React.FC = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<OcorrenciaFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
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
    }
  });

  const onNext = () => {
    const idx = tabs.findIndex(tab => tab.id === activeTab);
    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
  };

  const onPrevious = () => {
    const idx = tabs.findIndex(tab => tab.id === activeTab);
    if (idx > 0) setActiveTab(tabs[idx - 1].id);
  };

  const onCancel = () => {
    navigate("/ocorrencias/consulta");
  };

  const onSubmit = async (values: OcorrenciaFormSchema) => {
    try {
      setIsSubmitting(true);
      // Montar payload para tabela ocorrencias
      const payload: any = {
        ...values,
        descricao_ocorrencia: values.descricaoOcorrencia,
        created_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("ocorrencias").insert(payload);
      if (error) throw error;
      toast.success("Ocorrência cadastrada com sucesso!");
      navigate("/ocorrencias/consulta");
    } catch (e: any) {
      toast.error("Erro ao cadastrar ocorrência: " + (e.message || e));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6">
      <h2 className="text-2xl font-bold mb-6">Cadastro de Ocorrências</h2>
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
    </div>
  );
};

export default OcorrenciasCadastro;

