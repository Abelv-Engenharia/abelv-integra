
export interface DesvioImportData {
  data: string;
  hora: string;
  ano: string;
  mes: string;
  cca_codigo?: string;
  tipo_registro?: string;
  processo?: string;
  evento_identificado?: string;
  causa_provavel?: string;
  responsavel_inspecao: string;
  empresa?: string;
  disciplina?: string;
  engenheiro_responsavel?: string;
  descricao_desvio: string;
  base_legal?: string;
  supervisor_responsavel?: string;
  encarregado_responsavel?: string;
  colaborador_infrator?: string;
  funcao?: string;
  matricula?: string;
  tratativa_aplicada?: string;
  responsavel_acao?: string;
  prazo_correcao?: string;
  situacao?: string;
  situacao_acao?: string;
  aplicacao_medida_disciplinar?: boolean;
  exposicao?: string;
  controle?: string;
  deteccao?: string;
  efeito_falha?: string;
  impacto?: string;
  probabilidade?: number;
  severidade?: number;
  classificacao_risco?: string;
}
