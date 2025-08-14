
import { DesvioFormData } from "@/types/desvios";

export const transformFormDataToDesvio = (formData: DesvioFormData) => {
  return {
    data_desvio: formData.data,
    hora_desvio: formData.hora,
    responsavel_inspecao: formData.responsavelInspecao || "Responsável não especificado",
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
    descricao_desvio: formData.descricaoDesvio.toUpperCase(),
    acao_imediata: formData.tratativaAplicada.toUpperCase(),
    situacao: formData.situacao,
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
      situacao: formData.situacao,
      situacao_acao: formData.situacaoAcao,
      medida_disciplinar: formData.aplicacaoMedidaDisciplinar
    }] : [],
    status: 'Aberto',
    prazo_conclusao: formData.prazoCorrecao || null,
  };
};
