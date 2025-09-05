
import { supabase } from "@/integrations/supabase/client";
import { FilterParams } from "./types/dashboardTypes";

// ------- helpers -------
const toNum = (v?: string | number | null) =>
  v === undefined || v === null || v === "" ? undefined : Number(v);

const toNumArray = (arr?: (string | number)[]) =>
  (arr ?? []).map(Number).filter(n => Number.isFinite(n));

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
  if (year) {
    const start = `${year}-01-01`;
    const end = `${String(Number(year) + 1)}-01-01`;
    return { start, end };
  }
  return {};
}
// -----------------------

type ChartItem = { name: string; fullName: string; value: number };

export const fetchDesviosByCompany = async (filters?: FilterParams): Promise<ChartItem[]> => {
  try {
    // ⚠️ Se o relation name não for "empresas", ajuste para o nome real exposto pelo PostgREST
    let query = supabase
      .from("desvios_completos")
      .select(`
        empresa_id,
        data_desvio,
        cca_id,
        disciplina_id,
        empresas ( nome )
      `)
      .not("empresa_id", "is", null)
      .limit(50000);

    if (filters) {
      // IDs numéricos
      const ccaIdsNum = toNumArray(filters.ccaIds as any);
      const disciplinaIdNum = toNum(filters.disciplinaId as any);
      const empresaIdNum = toNum(filters.empresaId as any);

      if (ccaIdsNum.length > 0) query = query.in("cca_id", ccaIdsNum as readonly number[]);
      if (disciplinaIdNum !== undefined) query = query.eq("disciplina_id", disciplinaIdNum as number);
      if (empresaIdNum !== undefined) query = query.eq("empresa_id", empresaIdNum as number);

      // Período por mês/ano -> intervalo em data_desvio
      const year = filters.year && filters.year !== "todos" ? filters.year : undefined;
      const monthRaw = filters.month && filters.month !== "todos" ? filters.month : undefined;
      const month = toMonth2d(monthRaw);
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
      console.error("Error fetching desvios by company:", error);
      return [];
    }

    // Contagem por empresa (nome); fallback "OUTROS"
    const counts: Record<string, number> = {};
    (data ?? []).forEach((row: any) => {
      const nome = row?.empresas?.nome?.toString().trim() || "OUTROS";
      counts[nome] = (counts[nome] || 0) + 1;
    });

    // Array final para o gráfico
    return Object.entries(counts)
      .map(([nome, value]) => ({
        name: nome,          // rótulo curto (pode ser a própria razão/alias)
        fullName: nome,      // tooltip completo
        value,
      }))
      .sort((a, b) => b.value - a.value);
  } catch (err) {
    console.error("Exception fetching desvios by company:", err);
    return [];
  }
};
