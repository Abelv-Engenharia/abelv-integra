
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { validateRequiredFields } from "@/utils/desviosValidation";
import { desviosCompletosService } from "@/services/desvios/desviosCompletosService";
import { DesvioFormData } from "@/types/desvios";
import { calculateStatusAcao } from "@/utils/desviosUtils";

export const useDesviosForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<DesvioFormData>({
    defaultValues: {
      // Nova Identificação
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
      
      // Novas Informações
      descricaoDesvio: "",
      baseLegal: "",
      supervisorResponsavel: "",
      encarregadoResponsavel: "",
      colaboradorInfrator: "",
      funcao: "",
      matricula: "",
      
      // Ação Corretiva
      tratativaAplicada: "",
      responsavelAcao: "",
      prazoCorrecao: "",
      situacao: "EM ANDAMENTO",
      situacaoAcao: "EM ANDAMENTO",
      aplicacaoMedidaDisciplinar: false,
      
      // Classificação de Risco
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

  const handleSave = async () => {
    try {
      const formData = form.getValues();
      console.log('Dados do formulário antes da validação:', formData);
      
      const validation = validateRequiredFields(formData);
      
      if (!validation.isValid) {
        toast({
          title: "Campos obrigatórios não preenchidos",
          description: `Por favor, preencha os seguintes campos: ${validation.missingFields.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);
      
      // Calcular situação da ação automaticamente
      const situacaoAcaoCalculada = calculateStatusAcao(formData.situacao, formData.prazoCorrecao);
      
      const desvioData = {
        data_desvio: formData.data,
        hora_desvio: formData.hora || '00:00',
        local: formData.responsavelInspecao || "Local não especificado",
        cca_id: formData.ccaId ? parseInt(formData.ccaId) : null,
        empresa_id: formData.empresa ? parseInt(formData.empresa) : null,
        base_legal_opcao_id: formData.baseLegal ? parseInt(formData.baseLegal) : null,
        engenheiro_responsavel_id: formData.engenheiroResponsavel || null,
        supervisor_responsavel_id: formData.supervisorResponsavel || null,
        encarregado_responsavel_id: formData.encarregadoResponsavel || null,
        funcionarios_envolvidos: formData.colaboradorInfrator ? [{
          funcionario_id: formData.colaboradorInfrator,
          tipo: 'infrator',
          funcao: formData.funcao || '',
          matricula: formData.matricula || ''
        }] : [],
        tipo_registro_id: formData.tipoRegistro ? parseInt(formData.tipoRegistro) : null,
        processo_id: formData.processo ? parseInt(formData.processo) : null,
        evento_identificado_id: formData.eventoIdentificado ? parseInt(formData.eventoIdentificado) : null,
        causa_provavel_id: formData.causaProvavel ? parseInt(formData.causaProvavel) : null,
        disciplina_id: formData.disciplina ? parseInt(formData.disciplina) : null,
        descricao_desvio: formData.descricaoDesvio.trim(),
        acao_imediata: formData.tratativaAplicada || '',
        exposicao: formData.exposicao ? parseInt(formData.exposicao) : null,
        controle: formData.controle ? parseInt(formData.controle) : null,
        deteccao: formData.deteccao ? parseInt(formData.deteccao) : null,
        efeito_falha: formData.efeitoFalha ? parseInt(formData.efeitoFalha) : null,
        impacto: formData.impacto ? parseInt(formData.impacto) : null,
        status: formData.situacao || 'EM ANDAMENTO',
        classificacao_risco: formData.classificacaoRisco || '',
        responsavel_id: null,
        prazo_conclusao: formData.prazoCorrecao || null,
        acoes: formData.tratativaAplicada || formData.responsavelAcao ? [{
            responsavel: formData.responsavelAcao,
            prazo: formData.prazoCorrecao,
            situacao: formData.situacao,
            situacao_acao: situacaoAcaoCalculada,
            medida_disciplinar: formData.aplicacaoMedidaDisciplinar,
            tratativa: formData.tratativaAplicada
        }] : [],
      };

      console.log('Dados enviados para o Supabase:', desvioData);

      const result = await desviosCompletosService.create(desvioData);
      
      if (result && result.id) {
        console.log('Desvio criado com sucesso:', result);
        setShowSuccessDialog(true);
        toast({
          title: "Desvio cadastrado com sucesso!",
          description: "O desvio foi registrado no sistema.",
        });
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro detalhado ao salvar desvio:', error);
      
      let errorMessage = "Ocorreu um erro ao salvar o desvio.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = (error as any).message;
      }
      
      toast({
        title: "Erro ao cadastrar desvio",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setActiveTab("identificacao");
    window.location.href = "/desvios/consulta";
  };

  const handleNewRecord = () => {
    form.reset();
    setActiveTab("identificacao");
    setShowSuccessDialog(false);
  };

  return {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    showSuccessDialog,
    setShowSuccessDialog,
    handleSave,
    handleCancel,
    handleNewRecord,
  };
};
