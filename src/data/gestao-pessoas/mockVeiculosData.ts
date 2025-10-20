import type { MultaCompleta } from "@/types/gestao-pessoas/multa";

export const indicadores = {
  veiculosAtivos: 45,
  cnhsVencendo: 8,
  multasPendentes: 12,
  checklistsPendentes: 5,
  gastoCombustivel: 85420.50,
  custoSemParar: 12850.30
};

export const veiculosData = [
  {
    id: 1,
    status: "Ativo",
    locadora: "Localiza", 
    tipo: "mensal",
    placa: "ABC-1234",
    modelo: "Toyota Hilux",
    franquiaKm: "2000 km",
    condutorPrincipal: "João Silva",
    dataRetirada: "2024-01-15",
    dataDevolucao: "2024-02-15",
    motivoDevolucao: ""
  },
  {
    id: 2,
    status: "Encerrado",
    locadora: "Hertz",
    tipo: "esporadico", 
    placa: "DEF-5678",
    modelo: "Honda Civic",
    franquiaKm: "1500 km",
    condutorPrincipal: "Carlos Oliveira",
    dataRetirada: "2024-02-01",
    dataDevolucao: "2024-02-28",
    motivoDevolucao: "Fim do projeto"
  }
];

export const multasDataInitial: MultaCompleta[] = [
  {
    id: "1",
    numeroAutoInfracao: "L004691975",
    dataMulta: new Date("2024-09-10"),
    horario: "07:01:00",
    ocorrencia: "Excesso de velocidade",
    pontos: 5,
    dataNotificacao: new Date("2024-09-15"),
    responsavel: "João Silva",
    condutorInfrator: "Gustavo Silva", 
    placa: "TEI6D96",
    veiculo: "Toyota Hilux",
    locadora: "Localiza",
    numeroFatura: "FAT001",
    tituloSienge: "SIE001",
    valor: 195.23,
    indicadoOrgao: "Sim" as const,
    statusMulta: "Registrada" as const,
    emailCondutorEnviado: undefined,
    emailRHFinanceiroEnviado: undefined,
    descontoConfirmado: false,
    createdAt: new Date("2024-09-10"),
    updatedAt: new Date("2024-09-15"),
    createdBy: "admin"
  },
  {
    id: "2",
    numeroAutoInfracao: "AI987654321",
    dataMulta: new Date("2024-08-15"),
    horario: "15:45:00",
    ocorrencia: "Estacionamento em local proibido",
    pontos: 3,
    dataNotificacao: new Date("2024-08-20"),
    responsavel: "Maria Santos",
    condutorInfrator: "Maria Santos", 
    placa: "DEF-5678",
    veiculo: "Honda Civic",
    locadora: "Hertz",
    numeroFatura: "FAT002",
    tituloSienge: "SIE002",
    valor: 130.16,
    indicadoOrgao: "Não" as const,
    statusMulta: "RH/Financeiro Notificado" as const,
    emailCondutorEnviado: new Date("2024-08-25"),
    emailRHFinanceiroEnviado: new Date("2024-08-30"),
    descontoConfirmado: true,
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2024-09-01"),
    createdBy: "admin"
  }
];

export const condutoresData = [
  {
    id: 1,
    nome: "João Silva",
    cpf: "123.456.789-00",
    categoriaCnh: "AB",
    validadeCnh: "2025-06-15",
    pontuacaoAtual: 5,
    statusCnh: "Válida",
    termoResponsabilidade: "Sim",
    termoAnexado: true,
    observacao: ""
  },
  {
    id: 2,
    nome: "Maria Santos", 
    cpf: "987.654.321-00",
    categoriaCnh: "B",
    validadeCnh: "2024-12-30",
    pontuacaoAtual: 0,
    statusCnh: "Vencendo",
    termoResponsabilidade: "Não",
    termoAnexado: false,
    observacao: "Renovação em andamento"
  }
];

export const cartoesData = [
  {
    id: 1,
    status: "Ativo",
    motorista: "João Silva",
    placa: "ABC-1234",
    modelo: "Toyota Hilux",
    numeroCartao: "**** **** **** 3456",
    vencimento: "2025-12-31",
    tipoCartao: "fixo",
    limiteCredito: 2000.00
  },
  {
    id: 2,
    status: "Ativo",
    motorista: "Carlos Oliveira",
    placa: "DEF-5678", 
    modelo: "Honda Civic",
    numeroCartao: "**** **** **** 7654",
    vencimento: "2025-08-31",
    tipoCartao: "fixo",
    limiteCredito: 1500.00
  }
];

export const semPararData = [
  {
    id: 1,
    placa: "ABC-1234",
    condutor: "João Silva",
    dataUtilizacao: "2024-02-10",
    local: "Praça da Sé - SP",
    horario: "08:30",
    valor: 12.50,
    tipoServico: "Estacionamento",
    cca: "CC001",
    finalidade: "Serviço"
  },
  {
    id: 2,
    placa: "ABC-1234",
    condutor: "João Silva",
    dataUtilizacao: "2024-02-10",
    local: "Rodovia Castello Branco",
    horario: "10:15",
    valor: 8.90,
    tipoServico: "Pedágio",
    cca: "CC001",
    finalidade: "Serviço"
  }
];

export const dashboardData = [
  {
    categoria: "Locação de Veículos",
    valorMesAtual: 125000.00,
    valorAcumulado: 1250000.00,
    observacoes: "45 veículos ativos"
  },
  {
    categoria: "Combustível",
    valorMesAtual: 85420.50,
    valorAcumulado: 854205.00,
    observacoes: "Consumo acima da média"
  },
  {
    categoria: "Multas",
    valorMesAtual: 2890.45,
    valorAcumulado: 28904.50,
    observacoes: "12 multas pendentes"
  },
  {
    categoria: "Sem Parar",
    valorMesAtual: 12850.30,
    valorAcumulado: 128503.00,
    observacoes: "Pedágios e estacionamentos"
  },
  {
    categoria: "Manutenção",
    valorMesAtual: 8500.00,
    valorAcumulado: 85000.00,
    observacoes: "Revisões programadas"
  }
];
