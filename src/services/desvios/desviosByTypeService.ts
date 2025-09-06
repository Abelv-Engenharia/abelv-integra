
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "@/types/desvios";

/* helpers locais */
const toNum = (v?: string | number | null) =>
  v === undefined || v === null || v === "" ? undefined : Number(v);
const toNumArray = (arr?: (string | number)[]) =>
  (arr ?? []).map(Number).filter(Number.isFinite);
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
/* fim helpers */

type TypeItem = { name: string; value: number };

/** Aplica filtros comuns a uma query do Supabase */
function applyCommonFilters<T extends any>(query: any, filters?: FilterParams) {
  if (!filters) return query;

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

  console.log("[type] intervalo efetivo:", { start, end });

  if (start && end) query = query.gte("data_desvio", start).lt("data_desvio", end);
  else if (effectiveYear && !month) {
    const { start: ys, end: ye } = getDateRange(effectiveYear);
    if (ys && ye) query = query.gte("data_desvio", ys).lt("data_desvio", ye);
  }

  return query;
}

export const fetchDesviosByType = async (filters?: FilterParams): Promise<TypeItem[]> => {
  try {
    console.log("[type] filtros recebidos:", filters);

    // 1ª tentativa: coluna texto "tipo_registro" (ex.: "DESVIO", "OM")
    let q1 = supabase
      .from("desvios_completos")
      .select(`tipo_registro, data_desvio, cca_id, disciplina_id, empresa_id`)
      .not("tipo_registro", "is", null)
      .limit(50000);

    q1 = applyCommonFilters(q1, filters);

    let { data: data1, error: err1 } = await q1;
    console.log("[type] tentativa tipo_registro -> rows:", data1?.length, "error:", err1);

    if (!err1) {
      const counts: Record<string, number> = {};
      (data1 ?? []).forEach((row: any) => {
        // normaliza nomes
        const raw = String(row.tipo_registro || "").trim().toUpperCase();
        const key = raw === "OM" || raw === "OPORTUNIDADE" ? "OM" : raw === "DESVIO" ? "DESVIO" : "OUTROS";
        counts[key] = (counts[key] || 0) + 1;
      });

      return [
        { name: "Desvios", value: counts["DESVIO"] || 0 },
        { name: "OM", value: counts["OM"] || 0 },
        ...(counts["OUTROS"] ? [{ name: "Outros", value: counts["OUTROS"] }] : []),
      ].filter(i => i.value > 0);
    }

    // 2ª tentativa (fallback): coluna booleana "is_om"
    let q2 = supabase
      .from("desvios_completos")
      .select(`is_om, data_desvio, cca_id, disciplina_id, empresa_id`)
      .not("is_om", "is", null)
      .limit(50000);

    q2 = applyCommonFilters(q2, filters);

    const { data: data2, error: err2 } = await q2;
    console.log("[type] tentativa is_om -> rows:", data2?.length, "error:", err2);

    if (err2) {
      console.error("[type] nenhuma coluna conhecida disponível (tipo_registro ou is_om).");
      return [];
    }

    let desvios = 0, om = 0;
    (data2 ?? []).forEach((row: any) => (row.is_om ? om++ : desvios++));

    return [
      { name: "Desvios", value: desvios },
      { name: "OM", value: om },
    ].filter(i => i.value > 0);
  } catch (err) {
    console.error("[type] exception:", err);
    return [];
  }
};
