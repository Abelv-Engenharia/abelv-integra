
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
  | "Advertência Escrita"
  | "Suspensão"
  | "Demissão";

export const tiposMedidaAplicada: { value: TipoMedidaAplicada; label: string }[] = [
  { value: "Advertência Verbal", label: "Advertência Verbal" },
  { value: "Advertência Escrita", label: "Advertência Escrita" },
  { value: "Suspensão", label: "Suspensão" },
  { value: "Demissão", label: "Demissão" },
];
