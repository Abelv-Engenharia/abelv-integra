
export interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
  matricula: string;
  cpf?: string;
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
  cpf?: string;
  cca_id: string;
  data_admissao?: string | null;
}

export interface FuncionarioImportData {
  nome: string;
  funcao: string;
  matricula: string;
  cpf?: string;
  cca_codigo?: string;
  data_admissao?: string;
  ativo?: boolean;
}
