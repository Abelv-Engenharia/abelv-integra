export enum TipoServico {
  VOUCHER_UBER = 'voucher_uber',
  LOCACAO_VEICULO = 'locacao_veiculo',
  CARTAO_ABASTECIMENTO = 'cartao_abastecimento',
  VELOE_GO = 'veloe_go',
  PASSAGENS = 'passagens',
  HOSPEDAGEM = 'hospedagem',
  LOGISTICA = 'logistica',
  CORREIOS_LOGGI = 'correios_loggi'
}

export enum PrioridadeSolicitacao {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta'
}

export enum StatusSolicitacao {
  PENDENTE = 'pendente',
  APROVADO = 'aprovado',
  EM_ANDAMENTO = 'em_andamento',
  AGUARDANDO_APROVACAO = 'aguardando_aprovacao',
  CONCLUIDO = 'concluido',
  REJEITADO = 'rejeitado'
}

export enum TipoPassagem {
  AEREA = 'aerea',
  RODOVIARIA = 'rodoviaria'
}

export interface SolicitacaoBase {
  id: string;
  solicitante: string;
  dataSolicitacao: Date;
  prioridade: PrioridadeSolicitacao;
  centroCusto: string;
  observacoes?: string;
  tipoServico: TipoServico;
  status: StatusSolicitacao;
  
  // Campos para gestão
  observacoesgestao?: string;
  imagemanexo?: string;
  estimativavalor?: number;
  responsavelaprovacao?: string;
  
  // Campos para aprovação
  justificativaaprovacao?: string;
  justificativareprovacao?: string;
  dataaprovacao?: Date;
  aprovadopor?: string;
  
  // Campos para conclusão
  observacoesconclusao?: string;
  comprovanteconclusao?: string;
  dataconclusao?: Date;
  concluidopor?: string;
  
  // Campos para histórico de movimentação automática
  statusanterior?: StatusSolicitacao;
  datamudancaautomatica?: Date;
  motivomudancaautomatica?: string;
  foimovidoautomaticamente?: boolean;
}

export interface VoucherUber extends SolicitacaoBase {
  tipoServico: TipoServico.VOUCHER_UBER;
  cca: string;
  valor: number;
  dataUso: Date;
  localPartida: string;
  localDestino: string;
  motivo: string;
}

export interface LocacaoVeiculo extends SolicitacaoBase {
  tipoServico: TipoServico.LOCACAO_VEICULO;
  cca: string;
  nomeCondutor: string;
  motivo: string;
  dataRetirada: Date;
  periodoLocacao: string;
  franquiaKm?: number;
  localRetirada: string;
  termoResponsabilidade: boolean;
}

export interface VeloeGo extends SolicitacaoBase {
  tipoServico: TipoServico.VELOE_GO;
  valor: number;
  dataUso: Date;
  localPartida: string;
  localDestino: string;
}

export interface Passagens extends SolicitacaoBase {
  tipoServico: TipoServico.PASSAGENS;
  tipoPassagem: TipoPassagem;
  cca: string;
  motivo: string;
  origem: string;
  destino: string;
  dataViagem: Date;
  dataVolta?: Date;
  viajantes: Viajante[];
  precisaBagagem: boolean;
  observacoesViagem?: string;
}

export interface Hospedagem extends SolicitacaoBase {
  tipoServico: TipoServico.HOSPEDAGEM;
  hotel: string;
  dataInicio: Date;
  dataFim: Date;
  numeroPessoas: number;
  motivo: string;
  observacoesHospedagem?: string;
}

export interface Logistica extends SolicitacaoBase {
  tipoServico: TipoServico.LOGISTICA;
  dataServico: Date;
  motivo: string;
  tipoServicoLogistica: 'envio' | 'retirada';
  pesoAproximado: number;
  remetenteDestinatario: string;
  enderecoCompleto: string;
  cep: string;
  cidade: string;
  estado: string;
}

export interface CartaoAbastecimento extends SolicitacaoBase {
  tipoServico: TipoServico.CARTAO_ABASTECIMENTO;
  cca: string;
  nomeSolicitante: string;
  tipoSolicitacao: 'recarga_adicional' | 'cartao_novo' | 'bloqueio';
  motivo: string;
  data: Date;
  valorAdicional?: number;
  kmVeiculo?: number;
  placaAssociada?: string;
}

export interface CorreiosLoggi extends SolicitacaoBase {
  tipoServico: TipoServico.CORREIOS_LOGGI;
  tipoServicoCorreio: string;
  codigoRastreio?: string;
}


export interface Viajante {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: Date;
  telefone: string;
  email: string;
}

// Interface para solicitações combinadas
export interface SolicitacaoMultipla extends SolicitacaoBase {
  servicosSelecionados: TipoServico[];
  dadosServicos: {
    [key in TipoServico]?: any;
  };
}

export type SolicitacaoServico = 
  | VoucherUber 
  | LocacaoVeiculo 
  | CartaoAbastecimento
  | VeloeGo 
  | Passagens 
  | Hospedagem 
  | Logistica 
  | CorreiosLoggi 
  | SolicitacaoMultipla;

export interface CategoryInfo {
  id: TipoServico;
  title: string;
  description: string;
  icon: any;
  subcategories?: string[];
}