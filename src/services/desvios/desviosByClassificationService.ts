
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";

// --- helpers de conversão segura ---
const toNum = (v?: string | number | null) =>
  v === undefined || v === null || v === "" ? undefined : Number(v);

const toNumArray = (arr?: (string | number)[]) =>
  (arr ?? [])
    .map(n => Number(n))
    .filter(n => Number.isFinite(n));

// --- mês pode vir "Setembro" ou "09": converte p/ "MM" ---
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

// --- range de datas por ano/mês (YYYY-MM-DD) ---
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

const COLOR_MAP: Record<string, string> = {
  TRIVIAL: "#4ade80",
  TOLERÁVEL: "#60a5fa",
  TOLERAVEL: "#60a5fa",
  MODERADO: "#facc15",
  SUBSTANCIAL: "#f97316",
  INTOLERÁVEL: "#ef4444",
  INTOLERAVEL: "#ef4444",
};

type ChartItem = { name: string; value: number; color: string };

export const fetchDesviosByClassification = async (filters?: FilterParams): Promise<ChartItem[]> => {
  try {
    let query = supabase
      .from("desvios_completos")
      .select(`
        classificacao_risco,
        data_desvio,
        cca_id,
        disciplina_id,
        empresa_id
      `)
      .not("classificacao_risco", "is", null)
      .limit(50000);

    if (filters) {
      // --- IDs numéricos ---
      const ccaIdsNum = toNumArray(filters.ccaIds as any);
      const disciplinaIdNum = toNum(filters.disciplinaId as any);
      const empresaIdNum = toNum(filters.empresaId as any);

      if (ccaIdsNum.length > 0) query = query.in("cca_id", ccaIdsNum as readonly number[]);
      if (disciplinaIdNum !== undefined) query = query.eq("disciplina_id", disciplinaIdNum as number);
      if (empresaIdNum !== undefined) query = query.eq("empresa_id", empresaIdNum as number);

      // --- período ---
      const year = filters.year && filters.year !== "todos" ? filters.year : undefined;
      const monthRaw = filters.month && filters.month !== "todos" ? filters.month : undefined;
      const month = monthRaw ? toMonth2d(monthRaw) : undefined;
      const effectiveYear = year ?? (month ? String(new Date().getFullYear()) : undefined);

      const { start, end } = getDateRange(effectiveYear, month);
      if (start && end) {
        query = query.gte("data_desvio", start).lt("data_desvio", end);
      } else if (effectiveYear && !month) {
        const { start: ys, end: ye } = getDateRange(effectiveYear);
        if (ys && ye) query = query.gte("data_desvio", ys).lt("data_desvio", ye);
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching desvios by classification:", error);
      return [];
    }

    const counts: Record<string, number> = {};
    (data ?? []).forEach((row: any) => {
      const key = String(row.classificacao_risco ?? "TRIVIAL").trim().toUpperCase();
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
        color: COLOR_MAP[name] ?? "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);
  } catch (err) {
    console.error("Exception fetching desvios by classification:", err);
    return [];
  }
};
