
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
  situacao: string;
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
