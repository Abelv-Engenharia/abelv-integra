import { CommercialSpreadsheet } from "@/types/commercial";

export const commercialMockData: CommercialSpreadsheet[] = [
  {
    id: "1",
    pc: "12345",
    dataSaidaProposta: "15/01/2024",
    orcamentoDuplicado: "Não",
    segmento: "Infraestrutura",
    cliente: "Construtora ABC Ltda",
    obra: "Shopping Center Vila Madalena",
    vendedor: "Adriano Benini",
    numeroRevisao: 1,
    valorVenda: 250000.50,
    margemPercentual: 15.5,
    margemValor: 38750.08,
    status: "Contemplado"
  },
  {
    id: "2",
    pc: "12346",
    dataSaidaProposta: "20/01/2024",
    orcamentoDuplicado: "Sim",
    segmento: "Químico e Petroquímico",
    cliente: "Petrobras S.A.",
    obra: "Refinaria Paulínia - Ampliação",
    vendedor: "Rogério Braga",
    numeroRevisao: 2,
    valorVenda: 1500000.00,
    margemPercentual: 22.3,
    margemValor: 334500.00,
    status: "On Hold"
  },
  {
    id: "3",
    pc: "12347",
    dataSaidaProposta: "22/01/2024",
    orcamentoDuplicado: "Não",
    segmento: "Hospitalar",
    cliente: "Hospital São Lucas",
    obra: "UTI Cardiológica",
    vendedor: "Roberval Adamo",
    numeroRevisao: 1,
    valorVenda: 800000.75,
    margemPercentual: 18.7,
    margemValor: 149600.14,
    status: "Estimativa"
  },
  {
    id: "4",
    pc: "12348",
    dataSaidaProposta: "25/01/2024",
    orcamentoDuplicado: "Não",
    segmento: "Residencial",
    cliente: "Incorporadora Viver Bem",
    obra: "Condomínio Bosque Verde",
    vendedor: "Adriano Benini",
    numeroRevisao: 3,
    valorVenda: 450000.25,
    margemPercentual: 12.8,
    margemValor: 57600.03,
    status: "Perdido"
  },
  {
    id: "5",
    pc: "12349",
    dataSaidaProposta: "28/01/2024",
    orcamentoDuplicado: "Sim",
    segmento: "Data Center",
    cliente: "TechCloud Solutions",
    obra: "Data Center Região Sul",
    vendedor: "Rogério Braga",
    numeroRevisao: 1,
    valorVenda: 2200000.00,
    margemPercentual: 25.4,
    margemValor: 558800.00,
    status: "Pré-Venda"
  }
];

export const segmentoOptions = [
  "Infraestrutura",
  "Químico e Petroquímico",
  "Óleo e Gás",
  "Siderurgia e Metalurgia",
  "Fertilizantes e Cimento",
  "Papel e Celulose",
  "Mineração",
  "Farmacêutica e Cosmético",
  "Alimentícia e Bebidas",
  "Automobilística",
  "Vidro e Borracha",
  "Shopping",
  "Residencial",
  "Galpão",
  "Comercial Predial",
  "Hospitalar",
  "Data Center"
];

export const statusOptions = [
  "Estimativa",
  "Contemplado",
  "On Hold",
  "Perdido",
  "Cancelado",
  "Pré-Venda"
];

export const vendedorOptions = [
  "Adriano Benini",
  "Rogério Braga",
  "Roberval Adamo"
];