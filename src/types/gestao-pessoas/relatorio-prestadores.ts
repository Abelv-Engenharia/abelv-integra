export interface ColunaRelatorio {
  key: string;
  label: string;
  type: 'text' | 'currency' | 'date' | 'number' | 'email' | 'cpf' | 'cnpj' | 'boolean';
  modulo: ModuloPrestador;
}

export type ModuloPrestador = 
  | 'cadastro_pj'
  | 'contratos'
  | 'demonstrativo'
  | 'emissao_nf'
  | 'aprovacao_nf'
  | 'ferias'
  | 'aprovacao_ferias'
  | 'passivos';

export interface FiltrosRelatorioPrestadores {
  modulos: ModuloPrestador[];
  dataInicial?: Date;
  dataFinal?: Date;
  prestador?: string;
  empresa?: string;
  status?: string[];
  valorMinimo?: number;
  valorMaximo?: number;
  tiposContrato?: string[];
  statusContrato?: string;
}

export interface DadosModulo {
  modulo: ModuloPrestador;
  titulo: string;
  dados: any[];
  colunasSelecionadas: string[];
}

export interface ConfigModulo {
  id: ModuloPrestador;
  titulo: string;
  icone: string;
  colunas: ColunaRelatorio[];
  storageKey: string | null;
}
