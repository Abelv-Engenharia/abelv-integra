
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "@/types/desvios";

/* ==== helpers locais (simples) ==== */
const toNum = (v?: string | number | null) =>
  v === undefined || v === null || v === "" ? undefined : Number(v);

const toNumArray = (arr?: (string | number)[]) =>
  (arr ?? []).map(Number).filter(Number.isFinite);

// suporta "Setembro" e "09"
const MONTH_MAP: Record<string, string> = {
  janeiro: "01", fevereiro: "02", março: "03", abril: "04", maio: "05", junho: "06",
  julho: "07", agosto: "08", setembro: "09", outubro: "10", novembro: "11", dezembro: "12",
  Janeiro: "01", Fevereiro: "02", Março: "03", Abril: "04", Maio: "05", Junho: "06",
  Julho: "07", Agosto: "08", Setembro: "09", Outubro: "10", Novembro: "11", Dezembro: "12",
};
const toMonth2d = (m?: string) => (m ? (MONTH_MAP[m] ?? m).padStart(2, "0") : undefined);

function getDateRange(year?: string, month?: string): { start?: string; end?: string } {
  if (month && year) {
    const mm = toMonth2d(month)!;
    const start = `${year}-${mm}-01`;
    const nextMonth = mm === "12" ? "01" : String(Number(mm) + 1).padStart(2, "0");
    const nextYear = mm === "12" ? String(Number(year) + 1) : year;
    const end = `${nextYear}-${nextMonth}-01`;
    return { start, end };
  }
  if (year) return { start: `${year}-01-01`, end: `${String(Number(year) + 1)}-01-01` };
  return {};
}
/* ================================== */

const COLOR_MAP: Record<string, string> = {
  TRIVIAL: "#60a5fa",
  TOLERÁVEL: "#4ade80",
  TOLERAVEL: "#4ade80",
  MODERADO: "#facc15",
  SUBSTANCIAL: "#f97316",
  INTOLERÁVEL: "#ef4444",
  INTOLERAVEL: "#ef4444",
};

export type RiskChartItem = { name: string; value: number; color: string };

export const fetchDesviosByRiskLevel = async (
  filters?: FilterParams
): Promise<RiskChartItem[]> => {
  try {
    // log didático
    console.log("[risk] filtros recebidos:", filters);

    let query = supabase
      .from("desvios_completos")
      .select(`classificacao_risco, data_desvio, cca_id, disciplina_id, empresa_id`)
      .not("classificacao_risco", "is", null);

    if (filters) {
      const ccaIdsNum = toNumArray(filters.ccaIds as any);
      const disciplinaIdNum = toNum(filters.disciplinaId as any);
      const empresaIdNum = toNum(filters.empresaId as any);

      if (ccaIdsNum.length) query = query.in("cca_id", ccaIdsNum as readonly number[]);
      if (disciplinaIdNum !== undefined) query = query.eq("disciplina_id", disciplinaIdNum as number);
      if (empresaIdNum !== undefined) query = query.eq("empresa_id", empresaIdNum as number);

      const year = filters.year && filters.year !== "todos" ? filters.year : undefined;
      const month = filters.month && filters.month !== "todos" ? toMonth2d(filters.month) : undefined;
      const effectiveYear = year ?? (month ? String(new Date().getFullYear()) : undefined);
      const { start, end } = getDateRange(effectiveYear, month);

      console.log("[risk] intervalo efetivo:", { start, end });

      if (start && end) query = query.gte("data_desvio", start).lt("data_desvio", end);
      else if (effectiveYear && !month) {
        const { start: ys, end: ye } = getDateRange(effectiveYear);
        if (ys && ye) query = query.gte("data_desvio", ys).lt("data_desvio", ye);
      }
    }

    const { data, error } = await query;
    console.log("[risk] rows:", data?.length, "error:", error);

    if (error) return [];

    const counts: Record<string, number> = {};
    (data ?? []).forEach((row: any) => {
      const key = String(row.classificacao_risco ?? "TRIVIAL").trim().toUpperCase();
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, color: COLOR_MAP[name] ?? "#94a3b8" }))
      .sort((a, b) => b.value - a.value);
  } catch (err) {
    console.error("[risk] exception:", err);
    return [];
  }
};
