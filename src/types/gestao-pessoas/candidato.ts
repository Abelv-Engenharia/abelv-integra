export interface Candidato {
  id: string;
  nomeCompleto: string;
  cargoVagaPretendida: string;
  unidadeObra: string;
  origemCandidato: OrigemCandidato;
  dataCadastro: Date;
  telefone: string;
  email: string;
  cidadeEstado: string;
  dataEntrevista?: Date;
  etapaProcesso: EtapaProcesso;
  responsavelEtapa: string;
  feedbackGestorRH?: string;
  motivoNaoContratacao?: string;
  statusCandidato: StatusCandidato;
  dataUltimaAtualizacao: Date;
  possibilidadeReaproveitamento: boolean;
  observacoesGerais?: string;
  curriculo?: string;
  faixaSalarial?: string;
}

export enum OrigemCandidato {
  LINKEDIN = "LinkedIn",
  INDEED = "Indeed",
  INDICACAO = "Indicação",
  SITE_ABELV = "Site da Abelv",
  SOLIDES = "Solides",
  WHATSAPP = "WhatsApp",
  OUTROS = "Outros"
}

export enum EtapaProcesso {
  TRIAGEM_CURRICULAR = "Triagem Curricular",
  ENTREVISTA_RH = "Entrevista RH",
  ENTREVISTA_GESTOR = "Entrevista Gestor",
  TESTE_TECNICO = "Teste Técnico",
  APROVADO = "Aprovado",
  REPROVADO = "Reprovado"
}

export enum StatusCandidato {
  DISPONIVEL = "Disponível",
  EM_OUTRO_PROCESSO = "Em outro processo",
  CONTRATADO = "Contratado",
  NAO_DISPONIVEL = "Não disponível"
}
