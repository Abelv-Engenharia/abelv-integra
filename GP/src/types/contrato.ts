export type TipoContrato = 
  | 'contrato'
  | 'aditivo'
  | 'distrato';

export interface ContratoEmitido {
  id: string;
  numero: string;
  tipo: TipoContrato;
  prestador: string;
  cpf: string;
  cnpj: string;
  servico: string;
  valor: number;
  dataemissao: string;
  datainicio: string;
  datafim: string;
  status: 'ativo' | 'encerrado' | 'suspenso';
  empresa: string;
  obra: string;
}
