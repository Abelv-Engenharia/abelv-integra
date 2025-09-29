
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
  desvio_id?: string;
}

// Corrigir o tipo e mapeamento para os valores aceitos pelo banco
export type TipoMedidaAplicada =
  | "Advertência Verbal"
  | "Advertência Escrita"
  | "Suspensão"
  | "Demissão por Justa Causa";

// Lista usada no UI
export const tiposMedidaAplicada: { value: TipoMedidaAplicada; label: string }[] = [
  { value: "Advertência Verbal", label: "Advertência Verbal" },
  { value: "Advertência Escrita", label: "Advertência Escrita" },
  { value: "Suspensão", label: "Suspensão" },
  { value: "Demissão por Justa Causa", label: "Demissão por Justa Causa" },
];

// Mapeamento entre DB (NOME) e valores do enum usado no tipo
export const DB_TO_UI_TIPO_MAP: Record<string, TipoMedidaAplicada> = {
  "ADVERTÊNCIA VERBAL": "Advertência Verbal",
  "ADVERTÊNCIA ESCRITA": "Advertência Escrita",
  "SUSPENSÃO": "Suspensão",
  "DEMISSÃO POR JUSTA CAUSA": "Demissão por Justa Causa",
};

export const UI_TO_DB_TIPO_MAP: Record<TipoMedidaAplicada, string> = {
  "Advertência Verbal": "ADVERTÊNCIA VERBAL",
  "Advertência Escrita": "ADVERTÊNCIA ESCRITA",
  "Suspensão": "SUSPENSÃO",
  "Demissão por Justa Causa": "DEMISSÃO POR JUSTA CAUSA",
};
