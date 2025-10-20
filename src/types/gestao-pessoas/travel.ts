export type Agency = 'Onfly' | 'Biztrip';
export type ServiceType = 'rodoviario' | 'aereo' | 'hospedagem' | 'bagagem' | 'cancelamento' | 'reembolso' | 'remarcacao aereo';
export type ReservationStatus = 'Confirmada' | 'Cancelada' | 'Pendente';
export type PaymentMethod = 'Cartão Corporativo' | 'Dinheiro' | 'PIX' | 'Boleto' | 'Nota Fiscal';
export type InvoiceStatus = 'Pendente' | 'Pago' | 'Em Aprovação' | 'Lançado no Sienge';
export type HasLuggage = 'Sim' | 'Não';

export interface GeneralFields {
  id: string;
  agency: Agency;
  serviceType: ServiceType;
  employeeName: string;
  cpf: string;
  costCenter: string;
  requester: string;
  requestDate: string;
  status: ReservationStatus;
}

// Nova interface para os registros detalhados de viagem
export interface TravelDetailedRecord {
  id: string;
  dataEmissaoFat: string;
  agencia: Agency;
  numeroDeFat: string;
  protocolo: string;
  dataDaCompra: string;
  viajante: string;
  tipo: ServiceType;
  hospedagem: string;
  origem: string;
  destino: string;
  checkIn: string;
  checkOut: string;
  comprador: string;
  valorPago: number;
  motivoEvento: string;
  cca: string;
  descricaoCentroDeCusto: string;
  antecedencia: number; // calculado automaticamente em dias
  ciaIda: string;
  ciaVolta: string;
  possuiBagagem: HasLuggage;
  valorPagoDeBagagem: number;
  observacao: string;
  quemSolicitouForaPolitica: string;
  dentroDaPolitica: boolean; // calculado automaticamente
}

// Interface para faturas
export interface Invoice {
  id: string;
  agencia: Agency;
  numeroFatura: string;
  dataEmissao: string;
  periodoApuracao: string;
  valorTotal: number;
  status: InvoiceStatus;
  cca: string;
  pdfUrl?: string; // URL do PDF anexado
}

export interface AirTicket extends GeneralFields {
  serviceType: 'aereo';
  airline: string;
  ticketNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  ticketValue: number;
  paymentMethod: PaymentMethod;
}

export interface BusTicket extends GeneralFields {
  serviceType: 'rodoviario';
  transportCompany: string;
  ticketNumber: string;
  origin: string;
  destination: string;
  travelDate: string;
  ticketValue: number;
  paymentMethod: PaymentMethod;
}

export interface Hotel extends GeneralFields {
  serviceType: 'hospedagem';
  hotelName: string;
  city: string;
  state: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  totalValue: number;
  paymentMethod: PaymentMethod;
}

export type TravelRecord = AirTicket | BusTicket | Hotel;

export interface DashboardStats {
  totalReservations: number;
  totalSpent: number;
  onflyPercentage: number;
  biztripPercentage: number;
  serviceDistribution: {
    air: number;
    bus: number;
    hotel: number;
  };
  monthlySpending: Array<{
    month: string;
    onfly: number;
    biztrip: number;
  }>;
}

export interface TravelDashboardData {
  periodo: {
    inicio: string;
    fim: string;
  };
  resumoGeral: {
    totalGeral: number;
    aereo: number;
    hotel: number;
    automovel: number;
    onibus: number;
  };
  reservasPorModal: {
    aereo: number;
    hotel: number;
    onibus: number;
    automovel: number;
  };
  antecedenciaMedia: {
    aereo: number;
    hotel: number;
    onibus: number;
  };
  cancelamentos: {
    aereo: number;
    hotel: number;
    onibus: number;
  };
  tempoAprovacao: Array<{
    viajante: string;
    modal: ServiceType;
    quantidade: number;
    tempoMedio: number;
  }>;
  detalhesAereo: {
    totalReservas: number;
    valorTotal: number;
    ticketMedioDentro: number;
    ticketMedioFora: number;
    antecedenciaMedia: number;
    nacionais: number;
    internacionais: number;
    comAcordo: number;
    semAcordo: number;
    emissaoCO2: number;
    companhias: Array<{
      nome: string;
      dentroPolicy: number;
      foraPolicy: number;
    }>;
    trechosComuns: Array<{
      origem: string;
      destino: string;
      quantidade: number;
    }>;
  };
  detalhesHotel: {
    totalReservas: number;
    valorTotal: number;
    ticketMedio: number;
    hoteisMaisUsados: Array<{
      nome: string;
      cidade: string;
      quantidade: number;
      valorTotal: number;
    }>;
    cidadesMaisVisitadas: Array<{
      cidade: string;
      quantidade: number;
    }>;
  };
  detalhesRodoviario: {
    totalReservas: number;
    valorTotal: number;
    ticketMedio: number;
    empresas: Array<{
      nome: string;
      quantidade: number;
      valorTotal: number;
    }>;
    rotasComuns: Array<{
      origem: string;
      destino: string;
      quantidade: number;
    }>;
  };
  analisePorCCA: CCASpendingData[];
}

export interface PolicyCompliance {
  totalViagens: number;
  dentroPolicy: number;
  foraPolicy: number;
  percentualConformidade: number;
  motivosForaPolicy: Array<{
    motivo: string;
    quantidade: number;
  }>;
}

export interface CCASpendingData {
  cca: string;
  descricao: string;
  gastosAereo: number;
  gastosRodoviario: number;
  gastosHotel: number;
  totalGasto: number;
  orcamentoTotal: number;
  saldoRestante: number;
  percentualUtilizado: number;
  viagens: number;
}

export interface EmailRecipients {
  gestoresObra: string[];
  administradores: string[];
  emailsAdicionais: string[];
}

export interface DashboardEmailPayload {
  periodo: {
    inicio: string;
    fim: string;
  };
  secoesSelecionadas: {
    resumoGeral: boolean;
    reservasPorModal: boolean;
    antecedenciaMedia: boolean;
    cancelamentos: boolean;
    tempoAprovacao: boolean;
    detalhesAereo: boolean;
    detalhesHotel: boolean;
    detalhesRodoviario: boolean;
    analiseCCA: boolean;
  };
  destinatarios: EmailRecipients;
  assunto: string;
  mensagem: string;
  ccasFiltrados?: string[];
}

export interface FaturaIntegra {
  id: string;
  dataemissaofat: string;
  agencia: string;
  numerodefat: string;
  protocolo: string;
  datadacompra: string;
  viajante: string;
  tipo: string;
  hospedagem?: string;
  origem: string;
  destino: string;
  checkin?: string;
  checkout?: string;
  comprador: string;
  valorpago: number;
  motivoevento: string;
  cca: string;
  centrodecusto: string;
  antecedencia?: number;
  ciaida?: string;
  ciavolta?: string;
  possuibagagem: string;
  valorpagodebagagem?: number;
  observacao?: string;
  quemsolicitouforapolitica?: string;
  dentrodapolitica: string;
  codconta?: string;
  contafinanceira?: string;
}

export interface ReportFilters {
  dataInicial?: string;
  dataFinal?: string;
  agencia?: string[];
  tipo?: string[];
  cca?: string[];
  viajante?: string;
  dentroPolitica?: 'Sim' | 'Não' | 'Todas';
  valorMinimo?: number;
  valorMaximo?: number;
}

export interface ColumnDefinition {
  key: keyof FaturaIntegra;
  label: string;
  category: 'fatura' | 'viagem' | 'financeiro' | 'outros';
  type: 'text' | 'date' | 'currency' | 'number' | 'boolean';
}

export interface SavedReportConfig {
  id: string;
  nome: string;
  colunasSelecionadas: string[];
  filtros: ReportFilters;
  dataCriacao: string;
}