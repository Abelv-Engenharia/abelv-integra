
export interface MedidaDisciplinar {
  id: string;
  cca_id: string;
  funcionario_id: string;
  tipo_medida: TipoMedidaAplicada;
  data_aplicacao: string; // ISO string
  descricao?: string;
  arquivo_url?: string;
  created_at?: string;
  funcionario?: { nome: string; };
  cca?: { codigo: string; nome: string };
}

export interface MedidaDisciplinarFormData {
  cca_id: string;
  funcionario_id: string;
  tipo_medida: TipoMedidaAplicada | "";
  data_aplicacao: string;
  descricao?: string;
  arquivo?: File | null;
}

export type TipoMedidaAplicada =
  | "Advertência Verbal"
  | "Advertência Formal"
  | "Suspensão"
  | "Demissão por Justa Causa";

// List used in UI
export const tiposMedidaAplicada: { value: TipoMedidaAplicada; label: string }[] = [
  { value: "Advertência Verbal", label: "Advertência Verbal" },
  { value: "Advertência Formal", label: "Advertência Formal" },
  { value: "Suspensão", label: "Suspensão" },
  { value: "Demissão por Justa Causa", label: "Demissão por Justa Causa" },
];

// Mapeamento entre DB (NOME) e os valores do enum usado no tipo
export const DB_TO_UI_TIPO_MAP: Record<string, TipoMedidaAplicada> = {
  "ADVERTÊNCIA VERBAL": "Advertência Verbal",
  "ADVERTÊNCIA FORMAL": "Advertência Formal",
  "SUSPENSÃO": "Suspensão",
  "DEMISSÃO POR JUSTA CAUSA": "Demissão por Justa Causa",
};
export const UI_TO_DB_TIPO_MAP: Record<TipoMedidaAplicada, string> = {
  "Advertência Verbal": "ADVERTÊNCIA VERBAL",
  "Advertência Formal": "ADVERTÊNCIA FORMAL",
  "Suspensão": "SUSPENSÃO",
  "Demissão por Justa Causa": "DEMISSÃO POR JUSTA CAUSA",
};

