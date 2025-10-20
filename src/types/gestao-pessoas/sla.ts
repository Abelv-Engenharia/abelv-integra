export interface EtapaSLA {
  id: string;
  vagaId: string;
  numeroVaga: string;
  cargoVaga: string;
  etapa: TipoEtapaSLA;
  descricao: string;
  slaPrazo: string;
  slaDiasUteis: number;
  responsavel: string;
  objetivo: string;
  status: StatusSLA;
  dataInicio?: Date;
  dataConclusao?: Date;
  diasDecorridos?: number;
  prazoLimite?: Date;
  atrasado?: boolean;
  observacoes?: string;
  historico?: HistoricoAtualizacao[];
}

export interface HistoricoAtualizacao {
  id: string;
  data: Date;
  usuario: string;
  statusAnterior: StatusSLA;
  statusNovo: StatusSLA;
  observacao?: string;
}

export interface VagaSLA {
  id: string;
  numeroVaga: string;
  cargo: string;
  gestor: string;
  dataCriacao: Date;
  etapas: EtapaSLA[];
}

export enum TipoEtapaSLA {
  SOLICITACAO_VAGA = "solicitacao_vaga",
  APROVACAO_DIVULGACAO = "aprovacao_divulgacao",
  TRIAGEM_CURRICULOS = "triagem_curriculos",
  ENVIO_CANDIDATOS = "envio_candidatos",
  DEVOLUTIVA_GESTOR = "devolutiva_gestor",
  AGENDAMENTO_ENTREVISTAS = "agendamento_entrevistas",
  APLICACAO_TESTES = "aplicacao_testes",
  ENTREVISTAS_FINAIS = "entrevistas_finais"
}

export enum StatusSLA {
  NAO_INICIADO = "nao_iniciado",
  EM_ANDAMENTO = "em_andamento",
  CONCLUIDO = "concluido",
  ATRASADO = "atrasado"
}

export const ETAPAS_SLA_CONFIG = [
  {
    tipo: TipoEtapaSLA.SOLICITACAO_VAGA,
    nome: "Solicitação da vaga",
    descricao: "Recebimento e registro da solicitação de vaga",
    slaPrazo: "0 dia",
    slaDiasUteis: 0,
    responsavel: "Gestor solicitante / RH",
    objetivo: "Início do processo"
  },
  {
    tipo: TipoEtapaSLA.APROVACAO_DIVULGACAO,
    nome: "Aprovação e Divulgação da vaga",
    descricao: "Validação da solicitação e publicação da vaga",
    slaPrazo: "Até 2 dias úteis",
    slaDiasUteis: 2,
    responsavel: "RH",
    objetivo: "Evitar atraso no início do processo"
  },
  {
    tipo: TipoEtapaSLA.TRIAGEM_CURRICULOS,
    nome: "Triagem de currículos",
    descricao: "Análise e seleção de perfis aderentes à vaga",
    slaPrazo: "Até 5 dias úteis",
    slaDiasUteis: 5,
    responsavel: "RH",
    objetivo: "Garantir assertividade no envio ao gestor"
  },
  {
    tipo: TipoEtapaSLA.ENVIO_CANDIDATOS,
    nome: "Envio de candidatos ao gestor",
    descricao: "Encaminhamento dos perfis selecionados",
    slaPrazo: "Até 7 dias úteis",
    slaDiasUteis: 7,
    responsavel: "RH",
    objetivo: "Agilizar avaliação do gestor"
  },
  {
    tipo: TipoEtapaSLA.DEVOLUTIVA_GESTOR,
    nome: "Devolutiva do gestor",
    descricao: "Retorno com candidatos aprovados para próxima etapa",
    slaPrazo: "Até 3 dias úteis",
    slaDiasUteis: 3,
    responsavel: "Gestor da área",
    objetivo: "Evitar gargalos na decisão"
  },
  {
    tipo: TipoEtapaSLA.AGENDAMENTO_ENTREVISTAS,
    nome: "Agendamento de entrevistas",
    descricao: "Contato com candidatos e definição de horários",
    slaPrazo: "Até 3 dias úteis",
    slaDiasUteis: 3,
    responsavel: "RH",
    objetivo: "Organização do cronograma de entrevistas"
  },
  {
    tipo: TipoEtapaSLA.APLICACAO_TESTES,
    nome: "Aplicação de testes e perfil comportamental",
    descricao: "Aplicação de testes técnicos ou de perfil (ex: Sólides)",
    slaPrazo: "Dentro do ciclo",
    slaDiasUteis: 3,
    responsavel: "RH",
    objetivo: "Avaliar aderência técnica e comportamental"
  },
  {
    tipo: TipoEtapaSLA.ENTREVISTAS_FINAIS,
    nome: "Entrevistas finais (com gestor)",
    descricao: "Entrevistas finais até decisão final de contratação",
    slaPrazo: "Até 15 dias úteis",
    slaDiasUteis: 15,
    responsavel: "RH + Gestor",
    objetivo: "Concluir processo dentro do prazo total"
  }
];
