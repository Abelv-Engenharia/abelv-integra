import { TravelDashboardData, CCASpendingData, EmailRecipients } from "@/types/travel";

export const mockCCASpending: CCASpendingData[] = [
  {
    cca: "CCA-001",
    descricao: "Obra Alpha - São Paulo",
    gastosAereo: 25000,
    gastosRodoviario: 350,
    gastosHotel: 4500,
    totalGasto: 29850,
    orcamentoTotal: 50000,
    saldoRestante: 20150,
    percentualUtilizado: 59.7,
    viagens: 15
  },
  {
    cca: "CCA-002",
    descricao: "Obra Beta - Rio de Janeiro",
    gastosAereo: 18500,
    gastosRodoviario: 200,
    gastosHotel: 3200,
    totalGasto: 21900,
    orcamentoTotal: 35000,
    saldoRestante: 13100,
    percentualUtilizado: 62.6,
    viagens: 10
  },
  {
    cca: "CCA-003",
    descricao: "Obra Gamma - Brasília",
    gastosAereo: 15800,
    gastosRodoviario: 186,
    gastosHotel: 1881,
    totalGasto: 17867,
    orcamentoTotal: 25000,
    saldoRestante: 7133,
    percentualUtilizado: 71.5,
    viagens: 8
  },
  {
    cca: "CCA-004",
    descricao: "Administração - Matriz",
    gastosAereo: 10019,
    gastosRodoviario: 0,
    gastosHotel: 0,
    totalGasto: 10019,
    orcamentoTotal: 15000,
    saldoRestante: 4981,
    percentualUtilizado: 66.8,
    viagens: 5
  }
];

export const mockEmailRecipients: EmailRecipients = {
  gestoresObra: [
    "gestor.obra1@empresa.com",
    "gestor.obra2@empresa.com"
  ],
  administradores: [
    "admin1@empresa.com",
    "admin2@empresa.com",
    "financeiro@empresa.com"
  ],
  emailsAdicionais: []
};

export const mockTravelDashboard: TravelDashboardData = {
  periodo: {
    inicio: "2025-01-01",
    fim: "2025-01-31"
  },
  resumoGeral: {
    totalGeral: 79636,
    aereo: 69319,
    hotel: 9581,
    automovel: 0,
    onibus: 736
  },
  reservasPorModal: {
    aereo: 36,
    hotel: 12,
    onibus: 4,
    automovel: 0
  },
  antecedenciaMedia: {
    aereo: 12.5,
    hotel: 10,
    onibus: 7.5
  },
  cancelamentos: {
    aereo: 3,
    hotel: 1,
    onibus: 0
  },
  tempoAprovacao: [
    { viajante: "João Silva", modal: "aereo", quantidade: 8, tempoMedio: 2.5 },
    { viajante: "Maria Santos", modal: "aereo", quantidade: 6, tempoMedio: 3.2 },
    { viajante: "Pedro Oliveira", modal: "hospedagem", quantidade: 5, tempoMedio: 1.8 },
    { viajante: "Ana Costa", modal: "aereo", quantidade: 4, tempoMedio: 4.1 },
    { viajante: "Carlos Lima", modal: "rodoviario", quantidade: 3, tempoMedio: 1.5 }
  ],
  detalhesAereo: {
    totalReservas: 36,
    valorTotal: 69319,
    ticketMedioDentro: 1750,
    ticketMedioFora: 2450,
    antecedenciaMedia: 12.5,
    nacionais: 32,
    internacionais: 4,
    comAcordo: 28,
    semAcordo: 8,
    emissaoCO2: 2850,
    companhias: [
      { nome: "Azul", dentroPolicy: 15200, foraPolicy: 8500 },
      { nome: "LATAM", dentroPolicy: 18300, foraPolicy: 12400 },
      { nome: "Gol", dentroPolicy: 9800, foraPolicy: 5119 }
    ],
    trechosComuns: [
      { origem: "São Paulo", destino: "Rio de Janeiro", quantidade: 12 },
      { origem: "Belo Horizonte", destino: "São Paulo", quantidade: 8 },
      { origem: "São Paulo", destino: "Brasília", quantidade: 6 },
      { origem: "Rio de Janeiro", destino: "Salvador", quantidade: 4 },
      { origem: "São Paulo", destino: "Fortaleza", quantidade: 3 },
      { origem: "Porto Alegre", destino: "São Paulo", quantidade: 3 }
    ]
  },
  detalhesHotel: {
    totalReservas: 12,
    valorTotal: 9581,
    ticketMedio: 798,
    hoteisMaisUsados: [
      { nome: "Ibis São Paulo Paulista", cidade: "São Paulo", quantidade: 4, valorTotal: 3200 },
      { nome: "Mercure Rio de Janeiro Botafogo", cidade: "Rio de Janeiro", quantidade: 3, valorTotal: 2700 },
      { nome: "Blue Tree Brasília", cidade: "Brasília", quantidade: 2, valorTotal: 1800 },
      { nome: "Comfort Hotel Belo Horizonte", cidade: "Belo Horizonte", quantidade: 2, valorTotal: 1400 },
      { nome: "Novotel Salvador", cidade: "Salvador", quantidade: 1, valorTotal: 481 }
    ],
    cidadesMaisVisitadas: [
      { cidade: "São Paulo", quantidade: 4 },
      { cidade: "Rio de Janeiro", quantidade: 3 },
      { cidade: "Brasília", quantidade: 2 },
      { cidade: "Belo Horizonte", quantidade: 2 },
      { cidade: "Salvador", quantidade: 1 }
    ]
  },
  detalhesRodoviario: {
    totalReservas: 4,
    valorTotal: 736,
    ticketMedio: 184,
    empresas: [
      { nome: "Gontijo", quantidade: 2, valorTotal: 380 },
      { nome: "Cometa", quantidade: 1, valorTotal: 198 },
      { nome: "Viação Itapemirim", quantidade: 1, valorTotal: 158 }
    ],
    rotasComuns: [
      { origem: "São Paulo", destino: "Campinas", quantidade: 2 },
      { origem: "Belo Horizonte", destino: "São Paulo", quantidade: 1 },
      { origem: "Rio de Janeiro", destino: "São Paulo", quantidade: 1 }
    ]
  },
  analisePorCCA: mockCCASpending
};
