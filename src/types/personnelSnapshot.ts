export interface CCAInfo {
  id: number;
  codigo: string;
  nome: string;
}

export interface EmpresaInfo {
  id: number;
  nome: string;
  cnpj: string;
}

export interface PersonnelSnapshot {
  id: string;
  original_id: string;
  person_type: 'funcionario' | 'engenheiro' | 'supervisor' | 'encarregado';
  nome: string;
  funcao?: string;
  matricula?: string;
  email?: string;
  cca_info?: CCAInfo | CCAInfo[];
  empresa_info?: EmpresaInfo;
  snapshot_date: string;
  was_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonnelData {
  id: string;
  nome: string;
  funcao?: string;
  matricula?: string;
  email?: string;
  ativo: boolean;
  cca_info?: CCAInfo | CCAInfo[];
  is_snapshot?: boolean;
  snapshot_date?: string;
}

export type PersonType = 'funcionario' | 'engenheiro' | 'supervisor' | 'encarregado';
