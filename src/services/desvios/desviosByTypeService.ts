
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "@/types/desvios";

/* helpers */
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

/** aplica filtros comuns */
function applyFilters(query: any, filters?: FilterParams) {
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

  if (start && end) query = query.gte("data_desvio", start).lt("data_desvio", end);
  else if (effectiveYear && !month) {
    const { start: ys, end: ye } = getDateRange(effectiveYear);
    if (ys && ye) query = query.gte("data_desvio", ys).lt("data_desvio", ye);
  }
  return query;
}

type TypeItem = { name: string; value: number };

/**
 * Usa `tipo_registro_id` e relaciona com `tipos_registro (nome)`.
 * Soma e devolve pares { name: 'Desvios' | 'OM' | <outro nome>, value }.
 */
export const fetchDesviosByType = async (filters?: FilterParams): Promise<TypeItem[]> => {
  try {
    // join correto: tipos_registro:tipo_registro_id(nome)
    let q = supabase
      .from("desvios_completos")
      .select(`tipo_registro_id, data_desvio, cca_id, disciplina_id, empresa_id, tipos_registro:tipo_registro_id ( nome )`)
      .not("tipo_registro_id", "is", null)
      .limit(50000);

    q = applyFilters(q, filters);

    const { data, error } = await q;
    if (error) {
      console.error("[type] supabase error:", error);
      return [];
    }

    const counts: Record<string, number> = {};
    (data ?? []).forEach((row: any) => {
      const nome = row?.tipos_registro?.nome?.toString().trim();
      // normaliza nomes comuns (se seu banco usa "Desvio" / "OM")
      let label = nome || (row?.tipo_registro_id ? `ID ${row.tipo_registro_id}` : "OUTROS");
      const up = (label || "").toUpperCase();
      if (up.includes("DESVIO")) label = "Desvios";
      else if (up === "OM" || up.includes("OPORTUNIDADE")) label = "OM";
      counts[label] = (counts[label] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  } catch (err) {
    console.error("[type] exception:", err);
    return [];
  }
};
