
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { getOcorrenciaById, updateOcorrencia } from "@/services/ocorrencias/ocorrenciasService";
import { ocorrenciaFormSchema, OcorrenciaFormSchema } from "@/schemas/ocorrencias/ocorrenciaFormSchema";
import { useOcorrenciaTabs } from "@/hooks/ocorrencias/useOcorrenciaTabs";
import IdentificacaoForm from "@/components/ocorrencias/forms/IdentificacaoForm";
import InformacoesOcorrenciaForm from "@/components/ocorrencias/forms/InformacoesOcorrenciaForm";
import ClassificacaoRiscoForm from "@/components/ocorrencias/forms/ClassificacaoRiscoForm";
import PlanoAcaoForm from "@/components/ocorrencias/forms/PlanoAcaoForm";
import FechamentoForm from "@/components/ocorrencias/forms/FechamentoForm";
import { OcorrenciaFormNavigation } from "@/components/ocorrencias/forms/OcorrenciaFormNavigation";
import { toast } from "sonner";

const OcorrenciasEdicao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    tabs,
    activeTab,
    setActiveTab,
    onNext,
    onPrevious
  } = useOcorrenciaTabs();

  const form = useForm<OcorrenciaFormSchema>({
    resolver: zodResolver(ocorrenciaFormSchema),
  });

  useEffect(() => {
    const loadOcorrencia = async () => {
      if (!id) return;
      
      try {
        console.log('=== CARREGANDO OCORRÊNCIA ===');
        const data = await getOcorrenciaById(id);
        console.log('Dados recebidos do banco:', data);
        console.log('Campos específicos do banco:');
        console.log('- houve_afastamento:', data.houve_afastamento);
        console.log('- dias_perdidos:', data.dias_perdidos);
        console.log('- dias_debitados:', data.dias_debitados);
        console.log('- parte_corpo_atingida:', data.parte_corpo_atingida);
        console.log('- lateralidade:', data.lateralidade);
        console.log('- agente_causador:', data.agente_causador);
        console.log('- situacao_geradora:', data.situacao_geradora);
        console.log('- natureza_lesao:', data.natureza_lesao);
        
        // Safely handle colaboradores_acidentados data
        const colaboradores = Array.isArray(data.colaboradores_acidentados) 
          ? data.colaboradores_acidentados.map((col: any) => ({
              ...col, // Preserva TODOS os campos originais do banco
              colaborador: col.colaborador_id || col.colaborador || "",
              funcao: col.funcao || "",
              matricula: col.matricula || "",
            }))
          : [];

        // Safely handle acoes data
        const acoes = Array.isArray(data.acoes)
          ? data.acoes.map((acao: any) => ({
              tratativa_aplicada: acao.tratativa_aplicada || "",
              data_adequacao: acao.data_adequacao ? new Date(acao.data_adequacao) : null,
              responsavel_acao: acao.responsavel_acao || "",
              funcao_responsavel: acao.funcao_responsavel || "",
              situacao: acao.situacao || "",
              status: acao.status || ""
            }))
          : [];
        
        // Convert database data back to form format
        const formData: Partial<OcorrenciaFormSchema> = {
          data: data.data ? new Date(data.data) : undefined,
          hora: data.hora || "",
          mes: data.mes?.toString() || "",
          ano: data.ano?.toString() || "",
          cca: data.cca || "",
          empresa: data.empresa || "",
          disciplina: data.disciplina || "",
          engenheiro_responsavel: data.engenheiro_responsavel || "",
          supervisor_responsavel: data.supervisor_responsavel || "",
          encarregado_responsavel: data.encarregado_responsavel || "",
          colaboradores_acidentados: colaboradores,
          colaboradoresEnvolvidos: colaboradores.length > 0,
          tipoOcorrencia: data.tipo_ocorrencia || "",
          tipoEvento: data.tipo_evento || "",
          classificacaoOcorrencia: data.classificacao_ocorrencia || "",
          houve_afastamento: data.houve_afastamento || "",
          dias_perdidos: data.dias_perdidos || null,
          dias_debitados: data.dias_debitados || null,
          parte_corpo_atingida: data.parte_corpo_atingida || "",
          lateralidade: data.lateralidade || "",
          agente_causador: data.agente_causador || "",
          situacao_geradora: data.situacao_geradora || "",
          natureza_lesao: data.natureza_lesao || "",
          descricaoOcorrencia: data.descricao_ocorrencia || "",
          numeroCat: data.numero_cat || "",
          cid: data.cid || "",
          exposicao: data.exposicao || "",
          controle: data.controle || "",
          deteccao: data.deteccao || "",
          efeitoFalha: data.efeito_falha || "",
          impacto: data.impacto || "",
          probabilidade: typeof data.probabilidade === 'number' ? data.probabilidade : undefined,
          severidade: typeof data.severidade === 'number' ? data.severidade : undefined,
          classificacaoRisco: data.classificacao_risco || "",
          acoes: acoes,
          investigacao_realizada: data.investigacao_realizada || "",
          informe_preliminar: data.informe_preliminar || "",
          relatorio_analise: data.relatorio_analise || "",
          licoes_aprendidas_enviada: data.licoes_aprendidas_enviada || "",
          arquivo_licoes_aprendidas: data.arquivo_licoes_aprendidas || "",
          arquivo_cat: data.arquivo_cat || "",
        };
        
        console.log('=== DADOS CONVERTIDOS PARA O FORMULÁRIO ===');
        console.log('formData convertido:', formData);
        console.log('Campos específicos convertidos:');
        console.log('- houve_afastamento:', formData.houve_afastamento);
        console.log('- dias_perdidos:', formData.dias_perdidos);
        console.log('- dias_debitados:', formData.dias_debitados);
        console.log('- parte_corpo_atingida:', formData.parte_corpo_atingida);
        console.log('- lateralidade:', formData.lateralidade);
        console.log('- agente_causador:', formData.agente_causador);
        console.log('- situacao_geradora:', formData.situacao_geradora);
        console.log('- natureza_lesao:', formData.natureza_lesao);
        
        form.reset(formData);
      } catch (error) {
        console.error('Erro ao carregar ocorrência:', error);
        toast.error("Erro ao carregar dados da ocorrência");
      } finally {
        setLoading(false);
      }
    };

    loadOcorrencia();
  }, [id, form]);

  const onCancel = () => {
    navigate("/ocorrencias/consulta");
  };

  const handleFormSubmit = async () => {
    if (!id) return;
    
    setIsSubmitting(true);

    try {
      console.log('=== INÍCIO DO PROCESSO DE ATUALIZAÇÃO ===');
      const formData = form.getValues();
      console.log('Dados do formulário antes da conversão:', formData);
      
      // Validate form
      const isValid = await form.trigger();
      if (!isValid) {
        toast.error("Por favor, corrija os erros no formulário antes de salvar.");
        setIsSubmitting(false);
        return;
      }

      // Convert camelCase to snake_case for database
      const updateData = {
        data: formData.data,
        hora: formData.hora,
        mes: formData.mes,
        ano: formData.ano,
        cca: formData.cca,
        empresa: formData.empresa,
        disciplina: formData.disciplina,
        engenheiro_responsavel: formData.engenheiro_responsavel,
        supervisor_responsavel: formData.supervisor_responsavel,
        encarregado_responsavel: formData.encarregado_responsavel,
        colaboradores_acidentados: formData.colaboradores_acidentados?.map(col => ({
          colaborador: col.colaborador || "",
          funcao: col.funcao || "",
          matricula: col.matricula || "",
          houve_afastamento: col.houve_afastamento || "",
          dias_perdidos: col.dias_perdidos || null,
          dias_debitados: col.dias_debitados || null,
          parte_corpo_atingida: col.parte_corpo_atingida || "",
          lateralidade: col.lateralidade || "",
          agente_causador: col.agente_causador || "",
          situacao_geradora: col.situacao_geradora || "",
          natureza_lesao: col.natureza_lesao || "",
          numero_cat: col.numero_cat || "",
          cid: col.cid || "",
          arquivo_cat: col.arquivo_cat || null
        })) || [],
        tipo_ocorrencia: formData.tipoOcorrencia,
        tipo_evento: formData.tipoEvento,
        classificacao_ocorrencia: formData.classificacaoOcorrencia,
        houve_afastamento: formData.houve_afastamento,
        dias_perdidos: formData.dias_perdidos ? Number(formData.dias_perdidos) : null,
        dias_debitados: formData.dias_debitados ? Number(formData.dias_debitados) : null,
        parte_corpo_atingida: formData.parte_corpo_atingida,
        lateralidade: formData.lateralidade,
        agente_causador: formData.agente_causador,
        situacao_geradora: formData.situacao_geradora,
        natureza_lesao: formData.natureza_lesao,
        descricao_ocorrencia: formData.descricaoOcorrencia,
        numero_cat: formData.numeroCat,
        cid: formData.cid,
        exposicao: formData.exposicao,
        controle: formData.controle,
        deteccao: formData.deteccao,
        efeito_falha: formData.efeitoFalha,
        impacto: formData.impacto,
        probabilidade: formData.probabilidade,
        severidade: formData.severidade,
        classificacao_risco: formData.classificacaoRisco,
        acoes: formData.acoes?.map(acao => ({
          tratativa_aplicada: acao.tratativa_aplicada || "",
          data_adequacao: acao.data_adequacao,
          responsavel_acao: acao.responsavel_acao || "",
          funcao_responsavel: acao.funcao_responsavel || "",
          situacao: acao.situacao || "",
          status: acao.status || ""
        })) || [],
        investigacao_realizada: formData.investigacao_realizada,
        arquivo_cat: formData.colaboradores_acidentados?.[0]?.arquivo_cat || formData.arquivo_cat || null,
        informe_preliminar: formData.informe_preliminar,
        relatorio_analise: formData.relatorio_analise,
        licoes_aprendidas_enviada: formData.licoes_aprendidas_enviada,
        arquivo_licoes_aprendidas: formData.arquivo_licoes_aprendidas,
      };

      console.log('=== CAMPOS ESPECÍFICOS ANTES DE ENVIAR ===');
      console.log('houve_afastamento:', updateData.houve_afastamento);
      console.log('dias_perdidos:', updateData.dias_perdidos);
      console.log('dias_debitados:', updateData.dias_debitados);
      console.log('parte_corpo_atingida:', updateData.parte_corpo_atingida);
      console.log('lateralidade:', updateData.lateralidade);
      console.log('agente_causador:', updateData.agente_causador);
      console.log('situacao_geradora:', updateData.situacao_geradora);
      console.log('natureza_lesao:', updateData.natureza_lesao);
      console.log('updateData completo:', updateData);

      await updateOcorrencia(id, updateData);
      toast.success("Ocorrência atualizada com sucesso!");
      navigate("/ocorrencias/consulta");

    } catch (error) {
      console.error("Erro ao atualizar ocorrência:", error);
      toast.error("Erro ao atualizar ocorrência");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={onCancel}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Consulta
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Editar Ocorrência</h2>
      </div>

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
              isEditMode={true}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default OcorrenciasEdicao;
