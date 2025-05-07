
import { supabase } from "@/integrations/supabase/client";

// Defina interfaces para os tipos de dados
interface Inspecao {
  id: string;
  data: string;
  tipo_inspecao: string;
  status: string;
  responsavel: string;
}

export async function fetchInspecoesSummary() {
  try {
    // Consultar tabela de inspeções - verificando se existe ou criando um mock
    const { data, error } = await supabase
      .rpc('get_inspecoes_summary');

    if (error) {
      console.error("Erro ao buscar sumário de inspeções:", error);
      // Retornar dados simulados se a tabela ou função não existir
      return {
        total: 0,
        pendentes: 0,
        concluidas: 0,
        emAndamento: 0
      };
    }

    if (!data || !data.length) {
      return {
        total: 0,
        pendentes: 0,
        concluidas: 0,
        emAndamento: 0
      };
    }

    return data[0];
  } catch (error) {
    console.error("Exceção ao buscar sumário de inspeções:", error);
    return {
      total: 0,
      pendentes: 0,
      concluidas: 0,
      emAndamento: 0
    };
  }
}

export async function fetchRecentInspections() {
  try {
    // Verificar se a tabela de inspeções existe
    const { data, error } = await supabase
      .rpc('get_recent_inspecoes');

    if (error) {
      console.error("Erro ao buscar inspeções recentes:", error);
      // Retornar array vazio se a tabela não existir
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exceção ao buscar inspeções recentes:", error);
    return [];
  }
}

export async function fetchInspecoesStats() {
  try {
    // Tentar buscar estatísticas por mês
    const { data, error } = await supabase
      .rpc('get_inspecoes_stats_by_month');

    if (error) {
      console.error("Erro ao buscar estatísticas de inspeções:", error);
      // Retornar dados simulados se a função não existir
      return Array.from({ length: 12 }, (_, i) => ({
        mes: i + 1, 
        concluidas: 0,
        programadas: 0
      }));
    }

    // Se não houver dados, retornar array vazio ou simulado
    if (!data || !data.length) {
      return Array.from({ length: 12 }, (_, i) => ({
        mes: i + 1, 
        concluidas: 0,
        programadas: 0
      }));
    }

    return data;
  } catch (error) {
    console.error("Exceção ao buscar estatísticas de inspeções:", error);
    return Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1, 
      concluidas: 0,
      programadas: 0
    }));
  }
}

export async function fetchInspecoesByTipo() {
  try {
    // Tentar buscar inspeções por tipo
    const { data, error } = await supabase
      .rpc('get_inspecoes_by_tipo');

    if (error) {
      console.error("Erro ao buscar inspeções por tipo:", error);
      // Retornar dados simulados se a função não existir
      return [{
        tipo: "Não Programada", 
        quantidade: 0
      }, {
        tipo: "Programada", 
        quantidade: 0
      }];
    }

    // Se não houver dados, retornar array simulado
    if (!data || !data.length) {
      return [{
        tipo: "Não Programada", 
        quantidade: 0
      }, {
        tipo: "Programada", 
        quantidade: 0
      }];
    }

    return data;
  } catch (error) {
    console.error("Exceção ao buscar inspeções por tipo:", error);
    return [{
      tipo: "Não Programada", 
      quantidade: 0
    }, {
      tipo: "Programada", 
      quantidade: 0
    }];
  }
}

export async function fetchInspecoesByResponsavel() {
  try {
    // Tentar buscar inspeções por responsável
    const { data, error } = await supabase
      .rpc('get_inspecoes_by_responsavel');

    if (error) {
      console.error("Erro ao buscar inspeções por responsável:", error);
      // Retornar array vazio se a função não existir
      return [];
    }

    // Se não houver dados, retornar array vazio
    if (!data || !data.length) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Exceção ao buscar inspeções por responsável:", error);
    return [];
  }
}
