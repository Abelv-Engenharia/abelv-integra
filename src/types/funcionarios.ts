
export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
  ativo: boolean;
  data_admissao?: string | null;
  // Remover cca_id e ccas, agora será através do relacionamento
  funcionario_ccas?: { id: string; cca_id: number; ccas: { id: number; codigo: string; nome: string } }[];
}

export interface CCA {
  id: number;
  codigo: string;
  nome: string;
}

export interface FuncionarioFormData {
  nome: string;
  funcao: string;
  matricula: string;
  cca_ids: string[]; // Agora aceita múltiplos CCAs
  data_admissao?: string | null;
}
