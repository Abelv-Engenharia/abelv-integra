
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService } from "@/services/desvios/desviosCompletosService";

export interface DesvioFormData {
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
  
  // Classificação de Risco
  exposicao: string;
  controle: string;
  deteccao: string;
  efeitoFalha: string;
  impacto: string;
  probabilidade: number;
  severidade: number;
  classificacaoRisco: string;
}

export const useDesviosForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("identificacao");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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
      'situacaoAcao',
      'exposicao',
      'controle',
      'deteccao',
      'efeitoFalha',
      'impacto'
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
        situacaoAcao: 'Situação da Ação',
        exposicao: 'Exposição',
        controle: 'Controle',
        deteccao: 'Detecção',
        efeitoFalha: 'Efeito de Falha',
        impacto: 'Impacto'
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

  const handleSave = async () => {
    console.log("Botão Salvar clicado");
    
    if (!validateRequiredFields()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = form.getValues();
      console.log("Dados do formulário:", formData);
      
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
