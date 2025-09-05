import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";

// Mês pode chegar como "Setembro" ou "09": converte para "MM"
const MONTH_MAP: Record<string, string> = {
  janeiro: "01", fevereiro: "02", março: "03", abril: "04", maio: "05", junho: "06",
  julho: "07", agosto: "08", setembro: "09", outubro: "10", novembro: "11", dezembro: "12",
  Janeiro: "01", Fevereiro: "02", Março: "03", Abril: "04", Maio: "05", Junho: "06",
  Julho: "07", Agosto: "08", Setembro: "09", Outubro: "10", Novembro: "11", Dezembro: "12",
};
const toMonth2d = (m?: string) => {
  if (!m) return undefined;
  const mm = MONTH_MAP[m] ?? m;
  return mm.padStart(2, "0");
};

// Gera início/fim (YYYY-MM-DD) para filtro por mês/ano
function getDateRange(year?: string, month?: string): { start?: string; end?: string } {
  if (month && year) {
    const mm = toMonth2d(month)!;
    const start = `${year}-${mm}-01`;
    const nextMonth = mm === "12" ? "01" : String(Number(mm) + 1).padStart(2, "0");
    const nextYear = mm === "12" ? String(Number(year) + 1) : year;
    const end = `${nextYear}-${nextMonth}-01`;
    return { start, end };
  }
  if (year) {
    const start = `${year}-01-01`;
    const end = `${String(Number(year) + 1)}-01-01`;
    return { start, end };
  }
  return {};
}

// Normaliza chaves de classificação e aplica cores
const COLOR_MAP: Record<string, string> = {
  TRIVIAL: "#4ade80",
  TOLERÁVEL: "#60a5fa",
  TOLERAVEL: "#60a5fa", // variação sem acento
  MODERADO: "#facc15",
  SUBSTANCIAL: "#f97316",
  INTOLERÁVEL: "#ef4444",
  INTOLERAVEL: "#ef4444", // variação sem acento
};

type ChartItem = { name: string; value: number; color: string };

export const fetchDesviosByClassification = async (filters?: FilterParams): Promise<ChartItem[]> => {
  try {
    let query = supabase
      .from("desvios_completos")
      .select(
        `
        classificacao_risco,
        data_desvio,
        cca_id,
        disciplina_id,
        empresa_id
      `
      )
      .not("classificacao_risco", "is", null)
      .limit(50000);

    // ---- Filtros padronizados ----
    if (filters) {
      // CCAs permitidos ou CCA selecionado
      if (filters.ccaIds && filters.ccaIds.length > 0) {
        query = query.in("cca_id", filters.ccaIds);
      }
      if (filters.disciplinaId) query = query.eq("disciplina_id", filters.disciplinaId);
      if (filters.empresaId) query = query.eq("empresa_id", filters.empresaId);

      // Período por mês/ano -> usa intervalo de datas
      const year = filters.year && filters.year !== "todos" ? filters.year : undefined;
      // se só mês vier, assume ano corrente
      const monthRaw = filters.month && filters.month !== "todos" ? filters.month : undefined;
      const month = monthRaw ? toMonth2d(monthRaw) : undefined;
      const effectiveYear = year ?? (month ? String(new Date().getFullYear()) : undefined);

      const { start, end } = getDateRange(effectiveYear, month);
      if (start && end) {
        query = query.gte("data_desvio", start).lt("data_desvio", end);
      } else if (effectiveYear && !month) {
        // caso só ano
        const { start: ys, end: ye } = getDateRange(effectiveYear);
        if (ys && ye) query = query.gte("data_desvio", ys).lt("data_desvio", ye);
      }
    }
    // ------------------------------

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching desvios by classification:", error);
      return [];
    }

    // Contabiliza por classificação
    const classificationCounts: Record<string, number> = {};
    (data ?? []).forEach((desvio: any) => {
      // Normaliza para maiúsculas e remove espaços extras
      let key: string = String(desvio.classificacao_risco ?? "TRIVIAL").trim().toUpperCase();
      // Mapeia possíveis entradas "TRIVEL", etc., se necessário, aqui.
      classificationCounts[key] = (classificationCounts[key] || 0) + 1;
    });

    // Converte para array com cor
    const result: ChartItem[] = Object.entries(classificationCounts)
      .map(([name, value]) => ({
        name,
        value,
        color: COLOR_MAP[name] ?? "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);

    return result;
  } catch (err) {
    console.error("Exception fetching desvios by classification:", err);
    return [];
  }
};
