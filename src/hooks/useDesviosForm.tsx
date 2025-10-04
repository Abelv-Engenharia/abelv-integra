
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { validateRequiredFields } from "@/utils/desviosValidation";
import { desviosCompletosService } from "@/services/desvios/desviosCompletosService";
import { DesvioFormData } from "@/types/desvios";
import { calculateStatusAcao } from "@/utils/desviosUtils";

export const useDesviosForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
      colaboradoresEnvolvidos: false,
      funcionarios_infratores: [
        {
          colaborador: "",
          funcao: "",
          matricula: ""
        }
      ],
      
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
      
      // Detectar se é empresa ABELV (ID = 6)
      const isAbelv = formData.empresa === "6";
      
      // Processar infratores apenas se toggle ativado
      const funcionarios_envolvidos = formData.colaboradoresEnvolvidos
        ? (formData.funcionarios_infratores || [])
            .filter(f => f.colaborador) // Apenas com colaborador preenchido
            .map(f => {
              // Se for ABELV, usar UUID. Se não, usar nome
              if (isAbelv) {
                return {
                  funcionario_id: f.colaborador,
                  tipo: 'infrator',
                  funcao: f.funcao || '',
                  matricula: f.matricula || ''
                };
              } else {
                return {
                  funcionario_id: null,
                  funcionario_nome: f.colaborador,
                  tipo: 'infrator',
                  funcao: f.funcao || '',
                  matricula: f.matricula || ''
                };
              }
            })
        : [];

      const desvioData = {
        data_desvio: formData.data,
        hora_desvio: formData.hora || '00:00',
        responsavel_inspecao: formData.responsavelInspecao || "Responsável não especificado",
        cca_id: formData.ccaId ? parseInt(formData.ccaId) : null,
        empresa_id: formData.empresa ? parseInt(formData.empresa) : null,
        base_legal_opcao_id: formData.baseLegal ? parseInt(formData.baseLegal) : null,
        engenheiro_responsavel_id: formData.engenheiroResponsavel || null,
        // Supervisor: UUID se ABELV, nome se outra empresa
        supervisor_responsavel_id: isAbelv ? (formData.supervisorResponsavel || null) : null,
        supervisor_responsavel_nome: !isAbelv ? (formData.supervisorResponsavel || null) : null,
        // Encarregado: UUID se ABELV, nome se outra empresa
        encarregado_responsavel_id: isAbelv ? (formData.encarregadoResponsavel || null) : null,
        encarregado_responsavel_nome: !isAbelv ? (formData.encarregadoResponsavel || null) : null,
        funcionarios_envolvidos,
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
        
        // Verificar se deve aplicar medida disciplinar
        if (formData.aplicacaoMedidaDisciplinar && funcionarios_envolvidos.length > 0) {
          toast({
            title: "Desvio cadastrado com sucesso!",
            description: "Você será redirecionado para cadastrar a medida disciplinar.",
          });
          
          const primeiroInfrator = funcionarios_envolvidos[0];
          
          // Redirecionar para cadastro de medida disciplinar com dados pré-preenchidos
          navigate('/medidas-disciplinares/cadastro', {
            state: {
              fromDesvio: true,
              cca_id: formData.ccaId,
              funcionario_id: primeiroInfrator.funcionario_id,
              descricao: formData.descricaoDesvio,
              desvio_id: result.id,
              multiplosInfratores: funcionarios_envolvidos.length > 1,
              todosInfratores: funcionarios_envolvidos
            }
          });
        } else {
          // Fluxo normal - apenas mostrar dialog
          setShowSuccessDialog(true);
          toast({
            title: "Desvio cadastrado com sucesso!",
            description: "O desvio foi registrado no sistema.",
          });
        }
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
