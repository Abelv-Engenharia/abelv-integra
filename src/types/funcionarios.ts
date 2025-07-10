export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  foto?: string;
  ativo: boolean;
  cca_id?: number;
  ccas?: { id: number; codigo: string; nome: string };
  data_admissao?: string | null;
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
  cca_id: string;
  data_admissao?: string | null;
}
