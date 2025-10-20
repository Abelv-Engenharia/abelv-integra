export interface EnderecoRota {
  id: string;
  nome: string;
  endereco: string;
  lat?: number;
  lng?: number;
  tipo: 'base' | 'obra' | 'adicional';
  frequenciaSemanal?: number;
}

export interface ConfiguracaoVeiculoRota {
  veiculoId: string;
  placa: string;
  modelo: string;
  consumoMedioKmL: number;
  tipoCombustivel: 'gasolina' | 'diesel' | 'etanol' | 'flex';
  cartaoId?: string;
  limiteAtualCartao?: number;
}

export interface ResultadoRotaCalculo {
  origem: string;
  destino: string;
  distanciaKm: number;
  duracaoMin: number;
  frequenciaDiaria: number;
  diasUteis: number;
  viagensMensaisIda: number;
  viagensMensaisVolta: number;
  distanciaMensalTotal: number;
  custoViagem: number;
  custoMensal: number;
}

export interface CalculoEstimativaCartao {
  id: string;
  veiculoId: string;
  placa: string;
  modelo: string;
  cartaoId?: string;
  consumoKmL: number;
  precoCombustivelPorLitro: number;
  tipoCombustivel: string;
  margemSegurancaPct: number;
  rotaPrincipal: ResultadoRotaCalculo;
  trajetosAdicionais: ResultadoRotaCalculo[];
  distanciaTotalMensalKm: number;
  litrosNecessarios: number;
  custoEstimadoBase: number;
  valorMargemSeguranca: number;
  custoEstimadoComMargem: number;
  limiteAtualCartao?: number;
  diferencaLimite?: number;
  percentualDiferenca?: number;
  dataCalculo: Date;
  observacoes?: string;
}
