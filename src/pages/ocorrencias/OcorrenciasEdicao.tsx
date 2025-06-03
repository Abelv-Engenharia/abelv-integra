
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOcorrenciaById, updateOcorrencia } from "@/services/ocorrencias/ocorrenciasService";
import IdentificacaoForm from "@/components/ocorrencias/forms/IdentificacaoForm";
import InformacoesOcorrenciaForm from "@/components/ocorrencias/forms/InformacoesOcorrenciaForm";
import ClassificacaoRiscoForm from "@/components/ocorrencias/forms/ClassificacaoRiscoForm";
import PlanoAcaoForm from "@/components/ocorrencias/forms/PlanoAcaoForm";
import FechamentoForm from "@/components/ocorrencias/forms/FechamentoForm";

const OcorrenciasEdicao = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [ocorrencia, setOcorrencia] = useState<any>(null);

  const methods = useForm({
    defaultValues: {
      data: null,
      hora: "",
      mes: "",
      ano: "",
      cca: "",
      empresa: "",
      disciplina: "",
      engenheiro_responsavel: "",
      supervisor_responsavel: "",
      encarregado_responsavel: "",
      colaboradores_acidentados: [],
      tipo_ocorrencia: "",
      tipo_evento: "",
      classificacao_ocorrencia: "",
      houve_afastamento: "",
      dias_perdidos: null,
      dias_debitados: null,
      parte_corpo_atingida: "",
      lateralidade: "",
      agente_causador: "",
      situacao_geradora: "",
      natureza_lesao: "",
      descricao_ocorrencia: "",
      numero_cat: "",
      cid: "",
      arquivo_cat: null,
      exposicao: "",
      controle: "",
      deteccao: "",
      efeito_falha: "",
      impacto: "",
      probabilidade: null,
      severidade: null,
      classificacao_risco: "",
      acoes: [],
      investigacao_realizada: "",
      informe_preliminar: null,
      relatorio_analise: null,
      licoes_aprendidas_enviada: "",
      arquivo_licoes_aprendidas: null
    }
  });

  useEffect(() => {
    const loadOcorrencia = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getOcorrenciaById(id);
        setOcorrencia(data);
        
        // Convert data for form
        const formData = {
          ...data,
          data: data.data ? new Date(data.data) : null,
          mes: data.mes?.toString() || "",
          ano: data.ano?.toString() || "",
          colaboradores_acidentados: Array.isArray(data.colaboradores_acidentados) 
            ? data.colaboradores_acidentados 
            : [],
          acoes: Array.isArray(data.acoes) 
            ? data.acoes.map((acao: any) => ({
                ...acao,
                data_adequacao: acao.data_adequacao ? new Date(acao.data_adequacao) : null
              }))
            : []
        };

        methods.reset(formData);
      } catch (error) {
        console.error('Erro ao carregar ocorrência:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados da ocorrência",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadOcorrencia();
  }, [id, methods, toast]);

  const onSubmit = async (data: any) => {
    try {
      await updateOcorrencia(id!, data);
      toast({
        title: "Sucesso",
        description: "Ocorrência atualizada com sucesso",
      });
      navigate('/ocorrencias/consulta');
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ocorrência",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!ocorrencia) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Ocorrência não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/ocorrencias/consulta')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Editar Ocorrência</h2>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <IdentificacaoForm />
          <InformacoesOcorrenciaForm />
          <ClassificacaoRiscoForm />
          <PlanoAcaoForm />
          <FechamentoForm />

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/ocorrencias/consulta')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default OcorrenciasEdicao;
