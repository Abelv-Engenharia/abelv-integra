export interface DemonstrativoPrestador {
  id: string;
  codigo: string;
  nome: string;
  obra: string;
  funcao: string;
  nomeempresa: string;
  cpf: string;
  datanascimento: string;
  admissao: string;
  salario: number;
  premiacaonexa: number;
  ajudacustoobra: number;
  multasdescontos: number;
  ajudaaluguel: number;
  descontoconvenio: number;
  reembolsoconvenio: number;
  descontoabelvrun: number;
  valornf: number;
  mes: string;
  valorliquido: number;
}

export interface KPIData {
  totalnf: number;
  totalajudaaluguel: number;
  totalreembolsoconvenio: number;
  totaldescontoconvenio: number;
  totalmultas: number;
  totaldescontoabelvrun: number;
}

export interface FiltrosDashboard {
  datainicial?: Date;
  datafinal?: Date;
  empresas?: string[];
  prestador?: string;
  obra?: string;
}

export interface DadosGraficoMensal {
  mes: string;
  nf: number;
  ajudaaluguel: number;
  reembolso: number;
  descontos: number;
}

export interface TopPrestador {
  nome: string;
  empresa: string;
  totalnf: number;
}
