
import { supabase } from "@/integrations/supabase/client";

// Mock data for charts
const mockAcidenteTipoData = () => [
  { name: "Corte", value: 50 },
  { name: "Queimadura", value: 30 },
  { name: "Fratura", value: 20 },
];

const mockParteCorpoData = () => [
  { name: "Mão", value: 50 },
  { name: "Perna", value: 30 },
  { name: "Cabeça", value: 20 },
];

const mockLesoesData = () => [
  { name: "Lesão Leve", value: 50 },
  { name: "Lesão Moderada", value: 30 },
  { name: "Lesão Grave", value: 20 },
];

export async function fetchAcidenteTipoData() {
  try {
    const { data, error } = await supabase
      .from("ocorrencias")
      .select("tipo_acidente")
      .not("tipo_acidente", "is", null);

    if (error) {
      console.error("Erro ao buscar dados de tipo de acidente:", error);
      return mockAcidenteTipoData();
    }

    if (!data || data.length === 0) {
      return mockAcidenteTipoData();
    }

    // Realizar a contagem dos tipos de acidente
    const contagem: Record<string, number> = {};
    data.forEach((ocorrencia) => {
      const tipo = ocorrencia.tipo_acidente;
      if (tipo) {
        contagem[tipo] = (contagem[tipo] || 0) + 1;
      }
    });

    // Converter para o formato esperado pelo gráfico
    return Object.entries(contagem).map(([name, value]) => ({
      name,
      value,
    }));
  } catch (error) {
    console.error("Erro ao buscar dados de tipo de acidente:", error);
    return mockAcidenteTipoData();
  }
}

export async function fetchParteCorpoData() {
  try {
    const { data, error } = await supabase
      .from("ocorrencias")
      .select("partes_corpo_afetadas")
      .not("partes_corpo_afetadas", "is", null);

    if (error) {
      console.error("Erro ao buscar dados de partes do corpo:", error);
      return mockParteCorpoData();
    }

    if (!data || data.length === 0) {
      return mockParteCorpoData();
    }

    // Realizar a contagem das partes do corpo afetadas
    const contagem: Record<string, number> = {};
    
    data.forEach((ocorrencia) => {
      if (Array.isArray(ocorrencia.partes_corpo_afetadas)) {
        ocorrencia.partes_corpo_afetadas.forEach((parte) => {
          if (parte) {
            contagem[parte] = (contagem[parte] || 0) + 1;
          }
        });
      }
    });

    // Converter para o formato esperado pelo gráfico
    return Object.entries(contagem).map(([name, value]) => ({
      name,
      value: Number(value), // Garantindo que value seja um número
    }));
  } catch (error) {
    console.error("Erro ao buscar dados de partes do corpo:", error);
    return mockParteCorpoData();
  }
}

export async function fetchLesoesData() {
  try {
    const { data, error } = await supabase
      .from("ocorrencias")
      .select("tipo_lesao")
      .not("tipo_lesao", "is", null);

    if (error) {
      console.error("Erro ao buscar dados de tipo de lesão:", error);
      return mockLesoesData();
    }

    if (!data || data.length === 0) {
      return mockLesoesData();
    }

    // Realizar a contagem dos tipos de lesão
    const contagem: Record<string, number> = {};
    data.forEach((ocorrencia) => {
      const tipo = ocorrencia.tipo_lesao;
      if (tipo) {
        contagem[tipo] = (contagem[tipo] || 0) + 1;
      }
    });

    // Converter para o formato esperado pelo gráfico
    return Object.entries(contagem).map(([name, value]) => ({
      name,
      value,
    }));
  } catch (error) {
    console.error("Erro ao buscar dados de tipo de lesão:", error);
    return mockLesoesData();
  }
}

// Define the return type for fetchOcorrenciasStats to match the expected structure
export interface OcorrenciasStats {
  totalOcorrencias: number;
  ocorrenciasMes: number;
  ocorrenciasPendentes: number;
  riscoPercentage: number;
}

// Exported functions for other components
export const fetchOcorrenciasByEmpresa = () => mockAcidenteTipoData();
export const fetchOcorrenciasByRisco = () => mockAcidenteTipoData();
export const fetchOcorrenciasByTipo = () => mockAcidenteTipoData();
export const fetchOcorrenciasStats = async (): Promise<OcorrenciasStats> => {
  // Mock data with the correct property names to match the expected interface
  return {
    totalOcorrencias: 50,
    ocorrenciasMes: 40,
    ocorrenciasPendentes: 10,
    riscoPercentage: 25
  };
};
export const fetchLatestOcorrencias = () => [];
export const fetchOcorrenciasTimeline = () => [];
