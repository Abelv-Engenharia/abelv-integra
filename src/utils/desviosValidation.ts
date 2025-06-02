
import { DesvioFormData } from "@/types/desvios";

export const validateRequiredFields = (formData: DesvioFormData): { isValid: boolean; missingFields: string[] } => {
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
    'descricaoDesvio', // Corrigido: era 'descricao', agora é 'descricaoDesvio'
    'baseLegal',
    'supervisorResponsavel',
    'encarregadoResponsavel',
    'tratativaAplicada',
    'responsavelAcao',
    'prazoCorrecao',
    'situacao',
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

  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

export const getFieldDisplayNames = (): Record<string, string> => ({
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
  descricaoDesvio: 'Descrição do Desvio', // Corrigido: era 'descricao', agora é 'descricaoDesvio'
  baseLegal: 'Base Legal',
  supervisorResponsavel: 'Supervisor Responsável',
  encarregadoResponsavel: 'Encarregado Responsável',
  tratativaAplicada: 'Tratativa Aplicada',
  responsavelAcao: 'Responsável pela Ação',
  prazoCorrecao: 'Prazo para Correção',
  situacao: 'Situação',
  exposicao: 'Exposição',
  controle: 'Controle',
  deteccao: 'Detecção',
  efeitoFalha: 'Efeito de Falha',
  impacto: 'Impacto'
});
