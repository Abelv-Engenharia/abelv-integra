interface FaixaIR {
  min: number;
  max: number;
  aliquota: number;
  parcela: number;
  descricao: string;
}

const faixasIR: FaixaIR[] = [
  { min: 0, max: 2428.80, aliquota: 0, parcela: 0, descricao: 'Até R$ 2.428,80' },
  { min: 2428.81, max: 2826.65, aliquota: 7.5, parcela: 182.16, descricao: 'De R$ 2.428,81 a R$ 2.826,65' },
  { min: 2826.66, max: 3751.05, aliquota: 15.0, parcela: 394.16, descricao: 'De R$ 2.826,66 a R$ 3.751,05' },
  { min: 3751.06, max: 4664.68, aliquota: 22.5, parcela: 675.49, descricao: 'De R$ 3.751,06 a R$ 4.664,68' },
  { min: 4664.69, max: Infinity, aliquota: 27.5, parcela: 908.73, descricao: 'Acima de R$ 4.664,68' },
];

export interface DadosIR {
  baseCalculo: number;
  faixaDescricao: string;
  aliquota: number;
  parcelaADeduzir: number;
  valorIR: number;
  valorLiquido: number;
  isento: boolean;
}

export function calcularIR(valorAluguel: number): DadosIR {
  const faixa = faixasIR.find(f => valorAluguel >= f.min && valorAluguel <= f.max);
  
  if (!faixa) {
    return {
      baseCalculo: valorAluguel,
      faixaDescricao: 'Erro no cálculo',
      aliquota: 0,
      parcelaADeduzir: 0,
      valorIR: 0,
      valorLiquido: valorAluguel,
      isento: true,
    };
  }

  const valorIRBruto = (faixa.aliquota / 100) * valorAluguel - faixa.parcela;
  const valorIR = Math.max(0, valorIRBruto);
  const isento = valorIR === 0;

  return {
    baseCalculo: valorAluguel,
    faixaDescricao: faixa.descricao,
    aliquota: faixa.aliquota,
    parcelaADeduzir: faixa.parcela,
    valorIR,
    valorLiquido: valorAluguel - valorIR,
    isento,
  };
}
