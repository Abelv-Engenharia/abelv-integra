export enum StatusVaga {
  SOLICITACAO_ABERTA = "solicitacao_aberta",
  APROVADA = "aprovada", 
  DIVULGACAO_FEITA = "divulgacao_feita",
  EM_SELECAO = "em_selecao",
  FINALIZADA = "finalizada"
}

export enum PrioridadeVaga {
  BAIXA = "baixa",
  MEDIA = "media", 
  ALTA = "alta"
}

export enum TipoContrato {
  CLT = "clt",
  PJ = "pj",
  APRENDIZ = "aprendiz",
  ESTAGIO = "estagio"
}

export enum MotivoAbertura {
  SUBSTITUICAO = "substituicao",
  NOVA_OBRA = "nova_obra",
  AUMENTO_EQUIPE = "aumento_equipe"
}

export enum StatusAprovacao {
  PENDENTE = "pendente",
  APROVADO = "aprovado",
  REPROVADO = "reprovado"
}

export enum StatusCandidato {
  EM_ANALISE = "em_analise",
  ENTREVISTADO = "entrevistado", 
  APROVADO = "aprovado",
  REPROVADO = "reprovado"
}

export enum EtapaProcesso {
  TRIAGEM_CURRICULOS = "triagem_curriculos",
  ENVIO_CURRICULOS_GESTOR = "envio_curriculos_gestor",
  AGENDAMENTO_ENTREVISTAS = "agendamento_entrevistas",
  ENTREVISTAS_AGENDADAS = "entrevistas_agendadas",
  ENVIO_PROFILE = "envio_profile",
  ENVIO_TESTES = "envio_testes",
  ENTREVISTA_FINAL = "entrevista_final",
  PESQUISA_DACO = "pesquisa_daco",
  ENVIO_PROPOSTA = "envio_proposta",
  ENTREVISTA_RH = "entrevista_rh",
  ENVIO_GESTOR = "envio_gestor",
  DEVOLUTIVA_GESTOR = "devolutiva_gestor",
  AGENDAMENTO = "agendamento",
  TESTES_PROFILE = "testes_profile",
  ENTREVISTAS_FINAIS = "entrevistas_finais"
}

export interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: StatusCandidato;
  dataAplicacao: Date;
  observacoes?: string;
}

export interface Vaga {
  id: string;
  numeroVaga: string;
  cargo: string;
  area: string;
  setor: string;
  localTrabalho: string;
  motivoAbertura: MotivoAbertura;
  nomeColaboradorSubstituido?: string;
  prazoMobilizacao: Date;
  tipoContrato: TipoContrato;
  jornadaTrabalho: string;
  faixaSalarial: string;
  beneficios: string;
  formacaoMinima: string;
  experienciaDesejada: string;
  hardSkills: string[];
  softSkills: string[];
  aprovador: string;
  statusAprovacao: StatusAprovacao;
  status: StatusVaga;
  prioridade: PrioridadeVaga;
  dataCriacao: Date;
  dataAtualizacao: Date;
  candidatos: Candidato[];
  gestor: string;
  observacoes?: string;
  etapaAtual?: EtapaProcesso;
  diasRestantes?: number;
  atrasado?: boolean;
}