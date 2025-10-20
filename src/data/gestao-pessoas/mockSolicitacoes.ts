import { 
  TipoServico, 
  PrioridadeSolicitacao, 
  StatusSolicitacao,
  TipoPassagem,
  CategoryInfo
} from "@/types/gestao-pessoas/solicitacao";
import { 
  Car, 
  Plane, 
  Package, 
  Building, 
  Send, 
  Mail, 
  Wrench,
  Route
} from "lucide-react";

export const categoriesInfo: CategoryInfo[] = [
  {
    id: TipoServico.VOUCHER_UBER,
    title: "Transporte",
    description: "Vouchers, locação de veículos, cartão de abastecimento",
    icon: Car,
    subcategories: ["Voucher Uber", "Locação Veículo", "Cartão Abastecimento"]
  },
  {
    id: TipoServico.PASSAGENS,
    title: "Passagens",
    description: "Passagens aéreas e rodoviárias para viagens",
    icon: Plane,
    subcategories: ["Aérea", "Rodoviária"]
  },
  {
    id: TipoServico.HOSPEDAGEM,
    title: "Hospedagem",
    description: "Reservas de hotéis e estadias para funcionários",
    icon: Building,
    subcategories: ["Hotéis", "Pousadas", "Apart-hotéis"]
  },
  {
    id: TipoServico.LOGISTICA,
    title: "Logística",
    description: "Envio/recebimento de objetos e serviços de correio",
    icon: Package,
    subcategories: ["Envio/Recebimento", "Correios", "Loggi"]
  }
];

export const mockSolicitacoes = [
  {
    id: "1",
    solicitante: "João Silva",
    dataSolicitacao: new Date("2024-01-15"),
    prioridade: PrioridadeSolicitacao.ALTA,
    centroCusto: "obra-001",
    observacoes: "Urgente para reunião com cliente",
    tipoServico: TipoServico.VOUCHER_UBER,
    status: StatusSolicitacao.APROVADO,
    cca: "obra-001",
    valor: 85.50,
    dataUso: new Date("2024-01-16"),
    localPartida: "Escritório Central",
    localDestino: "Aeroporto Internacional",
    motivo: "Urgente para reunião com cliente"
  },
  {
    id: "2",
    solicitante: "Maria Santos",
    dataSolicitacao: new Date("2024-01-14"),
    prioridade: PrioridadeSolicitacao.MEDIA,
    centroCusto: "obra-002",
    observacoes: "Para transporte de equipe",
    tipoServico: TipoServico.LOCACAO_VEICULO,
    status: StatusSolicitacao.EM_ANDAMENTO,
    cca: "obra-002",
    nomeCondutor: "Carlos Oliveira",
    motivo: "Para transporte de equipe",
    dataRetirada: new Date("2024-01-20"),
    periodoLocacao: "semanal",
    localRetirada: "Garagem Central",
    termoResponsabilidade: true
  },
  {
    id: "3",
    solicitante: "Carlos Mendes",
    dataSolicitacao: new Date("2024-01-13"),
    prioridade: PrioridadeSolicitacao.BAIXA,
    centroCusto: "obra-001",
    observacoes: "Cartão adicional para veículo de obra",
    tipoServico: TipoServico.CARTAO_ABASTECIMENTO,
    status: StatusSolicitacao.PENDENTE,
    cca: "obra-001",
    nomeSolicitante: "Carlos Mendes",
    tipoSolicitacao: "recarga_adicional",
    motivo: "Veículo com quilometragem alta necessita recarga adicional",
    data: new Date("2024-01-14"),
    valorAdicional: 300.00,
    kmVeiculo: 45000,
    placaAssociada: "ABC-1234"
  },
  {
    id: "4",
    solicitante: "Pedro Costa",
    dataSolicitacao: new Date("2024-01-13"),
    prioridade: PrioridadeSolicitacao.BAIXA,
    centroCusto: "administrativo",
    observacoes: "Viagem de negócios",
    tipoServico: TipoServico.PASSAGENS,
    status: StatusSolicitacao.PENDENTE,
    tipoPassagem: TipoPassagem.AEREA,
    origem: "São Paulo",
    destino: "Rio de Janeiro",
    dataIda: new Date("2024-01-25"),
    dataVolta: new Date("2024-01-27"),
    classe: "economica"
  },
  {
    id: "5",
    solicitante: "Ana Rodrigues",
    dataSolicitacao: new Date("2024-01-12"),
    prioridade: PrioridadeSolicitacao.MEDIA,
    centroCusto: "obra-001",
    observacoes: "Hospedagem para equipe de obra",
    tipoServico: TipoServico.HOSPEDAGEM,
    status: StatusSolicitacao.APROVADO,
    hotel: "Hotel Business Center",
    checkin: new Date("2024-01-22"),
    checkout: new Date("2024-01-24"),
    numeroPessoas: 3,
    observacoesHospedagem: "Quartos próximos, café da manhã incluso"
  }
];

export const responsavelAtendimento = "Aline Cerqueira de Oliveira";