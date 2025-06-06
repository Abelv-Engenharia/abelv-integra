
import { DesvioFormData } from "@/types/desvios";

export const validateRequiredFields = (formData: DesvioFormData) => {
  const missingFields: string[] = [];

  // Campos obrigatórios da aba Identificação
  if (!formData.data) missingFields.push("Data");
  if (!formData.ccaId) missingFields.push("CCA");
  if (!formData.tipoRegistro) missingFields.push("Tipo de Registro");
  if (!formData.processo) missingFields.push("Processo");
  if (!formData.eventoIdentificado) missingFields.push("Evento Identificado");
  if (!formData.causaProvavel) missingFields.push("Causa Provável");
  if (!formData.empresa) missingFields.push("Empresa");
  if (!formData.disciplina) missingFields.push("Disciplina");

  // Campos obrigatórios da aba Informações
  if (!formData.descricaoDesvio || formData.descricaoDesvio.trim() === '') {
    missingFields.push("Descrição do Desvio");
  }
  if (!formData.baseLegal) missingFields.push("Base Legal");
  if (!formData.supervisorResponsavel) missingFields.push("Supervisor Responsável");
  if (!formData.encarregadoResponsavel) missingFields.push("Encarregado Responsável");

  // Campos obrigatórios da aba Ação Corretiva
  if (!formData.tratativaAplicada || formData.tratativaAplicada.trim() === '') {
    missingFields.push("Tratativa Aplicada");
  }
  if (!formData.responsavelAcao || formData.responsavelAcao.trim() === '') {
    missingFields.push("Responsável pela Ação");
  }
  if (!formData.prazoCorrecao) missingFields.push("Prazo para Correção");
  if (!formData.situacao) missingFields.push("Situação");

  // Campos obrigatórios da aba Classificação de Risco
  if (!formData.exposicao) missingFields.push("Exposição");
  if (!formData.controle) missingFields.push("Controle");
  if (!formData.deteccao) missingFields.push("Detecção");
  if (!formData.efeitoFalha) missingFields.push("Efeito de Falha");
  if (!formData.impacto) missingFields.push("Impacto");

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};
