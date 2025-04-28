
import { TreinamentoNormativo, Treinamento, MOCK_TREINAMENTOS } from "@/types/treinamentos";
import { addDays, format, isBefore, differenceInDays } from "date-fns";

export const calcularDataValidade = (
  treinamentoId: string,
  dataRealizacao: Date
): Date => {
  const treinamento = MOCK_TREINAMENTOS.find(t => t.id === treinamentoId);
  const validadeDias = treinamento?.validadeDias || 365; // Default to 1 year
  return addDays(dataRealizacao, validadeDias);
};

export const calcularStatusTreinamento = (
  dataValidade: Date
): "Válido" | "Próximo ao vencimento" | "Vencido" => {
  const hoje = new Date();
  const diasRestantes = differenceInDays(dataValidade, hoje);

  if (isBefore(dataValidade, hoje)) {
    return "Vencido";
  } else if (diasRestantes <= 30) {
    return "Próximo ao vencimento";
  } else {
    return "Válido";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Válido":
      return "text-green-600";
    case "Próximo ao vencimento":
      return "text-amber-600";
    case "Vencido":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

export const formatarData = (data: Date): string => {
  return format(data, "dd/MM/yyyy");
};

export const getTreinamentosValidos = (
  treinamentos: TreinamentoNormativo[]
): TreinamentoNormativo[] => {
  return treinamentos.filter(t => !t.arquivado && t.status !== "Vencido");
};

export const getTreinamentosHistorico = (
  treinamentos: TreinamentoNormativo[]
): TreinamentoNormativo[] => {
  return treinamentos.filter(t => t.arquivado);
};

export const getNomeTreinamento = (id: string): string => {
  return MOCK_TREINAMENTOS.find(t => t.id === id)?.nome || "Treinamento não encontrado";
};
