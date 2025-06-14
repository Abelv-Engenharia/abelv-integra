import { format, addDays, isBefore, differenceInDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const calcularDataValidade = async (
  treinamentoId: string,
  dataRealizacao: Date
): Promise<Date> => {
  try {
    const { data: treinamento } = await supabase
      .from('treinamentos')
      .select('validade_dias')
      .eq('id', treinamentoId)
      .single();

    const validadeDias = treinamento?.validade_dias || 365; // Default to 1 year
    return addDays(dataRealizacao, validadeDias);
  } catch (error) {
    console.error("Erro ao buscar validade do treinamento:", error);
    return addDays(dataRealizacao, 365); // Default to 1 year in case of error
  }
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

export const formatarData = (data: Date | string): string => {
  if (!data) return "";
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return format(dataObj, "dd/MM/yyyy");
};

/**
 * Busca o nome do treinamento dado o ID. Tenta primeiro em 'treinamentos', depois em 'lista_treinamentos_normativos'.
 * Retorna 'Treinamento não encontrado' se não localizar em nenhuma tabela.
 */
export async function getNomeTreinamento(id: string): Promise<string> {
  // Tenta buscar na tabela treinamentos normal
  const { data: treinamento, error: errTreinamento } = await supabase
    .from('treinamentos')
    .select('nome')
    .eq('id', id)
    .maybeSingle();

  if (treinamento?.nome) {
    return treinamento.nome;
  }

  // Se não encontrou, tenta buscar na tabela lista_treinamentos_normativos
  const { data: treinamentoNormativo, error: errNormativo } = await supabase
    .from('lista_treinamentos_normativos')
    .select('nome')
    .eq('id', id)
    .maybeSingle();

  if (treinamentoNormativo?.nome) {
    return treinamentoNormativo.nome;
  }

  return "Treinamento não encontrado";
}

// New service to fetch all trainings from Supabase
export async function fetchTreinamentos() {
  try {
    const { data, error } = await supabase
      .from('treinamentos')
      .select('*')
      .order('nome');

    if (error) {
      console.error("Erro ao buscar treinamentos:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exceção ao buscar treinamentos:", error);
    return [];
  }
}

// New service to fetch funcionários from Supabase
export async function fetchFuncionarios() {
  try {
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error("Erro ao buscar funcionários:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exceção ao buscar funcionários:", error);
    return [];
  }
}

// Service to create a normative training record
export async function criarTreinamentoNormativo(dados: {
  funcionarioId: string;
  treinamentoId: string;
  tipo: 'Formação' | 'Reciclagem';
  dataRealizacao: Date;
  dataValidade: Date;
  certificadoUrl?: string;
}) {
  try {
    const status = calcularStatusTreinamento(dados.dataValidade);
    
    const { data, error } = await supabase
      .from('treinamentos_normativos')
      .insert({
        funcionario_id: dados.funcionarioId,
        treinamento_id: dados.treinamentoId,
        tipo: dados.tipo,
        data_realizacao: format(dados.dataRealizacao, 'yyyy-MM-dd'),
        data_validade: format(dados.dataValidade, 'yyyy-MM-dd'),
        certificado_url: dados.certificadoUrl,
        status,
        arquivado: false
      })
      .select('id')
      .single();

    if (error) {
      console.error("Erro ao criar treinamento normativo:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    console.error("Exceção ao criar treinamento normativo:", error);
    return { success: false, error: "Erro interno ao processar o registro" };
  }
}
