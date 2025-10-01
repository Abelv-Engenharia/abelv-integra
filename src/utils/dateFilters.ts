// src/utils/dateFilters.ts
export const MONTH_MAP: Record<string, string> = {
  janeiro: "01", fevereiro: "02", março: "03", abril: "04", maio: "05", junho: "06",
  julho: "07", agosto: "08", setembro: "09", outubro: "10", novembro: "11", dezembro: "12",
  Janeiro: "01", Fevereiro: "02", Março: "03", Abril: "04", Maio: "05", Junho: "06",
  Julho: "07", Agosto: "08", Setembro: "09", Outubro: "10", Novembro: "11", Dezembro: "12",
};

export type NormalizableFilters = {
  year: string;
  month: string;
  ccaId: string;
  disciplinaId: string;
  empresaId: string;
  userCcaIds: string[];
};

export type NormalizedFilters = {
  year?: string;       // "2025"
  month?: string;      // "09"
  ccaIds?: string[];   // sempre aplicar CCAs permitidos
  disciplinaId?: string;
  empresaId?: string;
};

export function normalizeFilters(raw: NormalizableFilters): NormalizedFilters {
  const filters: NormalizedFilters = { ccaIds: raw.userCcaIds };

  const monthProvided = raw.month && raw.month !== "todos";
  const yearProvided  = raw.year  && raw.year  !== "todos";

  if (yearProvided) {
    filters.year = raw.year;
  } else if (monthProvided) {
    filters.year = String(new Date().getFullYear()); // ano corrente se só mês for escolhido
  }

  if (monthProvided) {
    const key = raw.month.trim();
    const monthNum = MONTH_MAP[key] ?? key;
    filters.month = String(parseInt(monthNum)); // normaliza para formato sem zero à esquerda: "09" -> "9"
  }

  if (raw.ccaId && raw.ccaId !== "todos") {
    filters.ccaIds = [raw.ccaId]; // CCA específico sobrepõe lista permitida
  }
  if (raw.disciplinaId && raw.disciplinaId !== "todos") filters.disciplinaId = raw.disciplinaId;
  if (raw.empresaId    && raw.empresaId    !== "todos") filters.empresaId    = raw.empresaId;

  return filters;
}