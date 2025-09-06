
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
  descricaoDesvio: string; // Campo corrigido para mapear para descricao_desvio
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

// Filtros usados pelos serviços do dashboard de Desvios
export interface FilterParams {
  year?: string;                  // ex.: "2025"
  month?: string;                 // ex.: "09" (ou "Setembro" — os services normalizam)
  ccaIds?: (string | number)[];   // lista de CCAs permitidos
  disciplinaId?: string | number; // filtro por disciplina (opcional)
  empresaId?: string | number;    // filtro por empresa (opcional)
}
