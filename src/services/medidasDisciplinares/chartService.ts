import { supabase } from "@/integrations/supabase/client";

export interface MedidasPorTipo {
  tipo: string;
  count: number;
}

export interface MedidasPorTipoCCA {
  tipo: string;
  cca_codigo: string;
  count: number;
}

export async function fetchMedidasPorTipo(ccaIds: number[]): Promise<MedidasPorTipo[]> {
  try {
    const { data, error } = await supabase
      .from("medidas_disciplinares")
      .select("medida")
      .in("cca_id", ccaIds);

    if (error) throw error;

    // Agrupar por tipo
    const grouped = data.reduce((acc: Record<string, number>, item) => {
      const tipo = item.medida || "Não especificado";
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([tipo, count]) => ({
      tipo,
      count: count as number,
    }));
  } catch (error) {
    console.error("Erro ao buscar medidas por tipo:", error);
    return [];
  }
}

export async function fetchMedidasPorTipoCCA(ccaIds: number[]): Promise<MedidasPorTipoCCA[]> {
  try {
    const { data, error } = await supabase
      .from("medidas_disciplinares")
      .select(`
        medida,
        cca_id,
        ccas!inner(codigo)
      `)
      .in("cca_id", ccaIds);

    if (error) throw error;

    // Agrupar por tipo e CCA
    const grouped: Record<string, Record<string, number>> = {};
    
    data.forEach((item: any) => {
      const tipo = item.medida || "Não especificado";
      const ccaCodigo = item.ccas?.codigo || "N/A";
      
      if (!grouped[tipo]) {
        grouped[tipo] = {};
      }
      grouped[tipo][ccaCodigo] = (grouped[tipo][ccaCodigo] || 0) + 1;
    });

    // Converter para array
    const result: MedidasPorTipoCCA[] = [];
    Object.entries(grouped).forEach(([tipo, ccas]) => {
      Object.entries(ccas).forEach(([cca_codigo, count]) => {
        result.push({ tipo, cca_codigo, count: count as number });
      });
    });

    return result;
  } catch (error) {
    console.error("Erro ao buscar medidas por tipo e CCA:", error);
    return [];
  }
}
