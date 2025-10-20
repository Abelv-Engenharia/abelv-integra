export interface FiltroRelatorio {
  periodo: 'hoje' | 'semana' | 'mes' | 'trimestre' | 'ano' | 'personalizado';
  datainicial?: Date;
  datafinal?: Date;
  status?: string[];
  condutor?: string;
  placa?: string;
  locadora?: string[];
  cca?: string;
  valorminimo?: number;
  valormaximo?: number;
}

export interface DadosRelatorioConsolidado {
  totalveiculosativos: number;
  custototalmensal: number;
  multaspendentes: number;
  cnhsvencendo: number;
  alertascriticos: number;
  distribuicaocustos: {
    categoria: string;
    valor: number;
  }[];
  evolucaocustos: {
    mes: string;
    locacao: number;
    combustivel: number;
    multas: number;
    pedagios: number;
  }[];
  top5veiculos: {
    placa: string;
    modelo: string;
    custototal: number;
  }[];
  top5condutores: {
    nome: string;
    multas: number;
    pontos: number;
  }[];
  alertasprioritarios: {
    tipo: 'cnh' | 'multa' | 'checklist';
    mensagem: string;
    prioridade: 'alta' | 'media' | 'baixa';
  }[];
}

export interface ResumoCategoria {
  categoria: string;
  quantidademensal: number;
  valormensal: number;
  valoracumulado: number;
  variacao: number;
}
