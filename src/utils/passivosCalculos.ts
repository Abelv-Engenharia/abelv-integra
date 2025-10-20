import { differenceInMonths } from 'date-fns';

export function calcularDecimoTerceiro(
  salariobase: number,
  dataadmissao: Date,
  datacorte: Date
): number {
  const anocorte = datacorte.getFullYear();
  const anoadmissao = dataadmissao.getFullYear();
  
  let mesestrabalhados: number;
  
  if (anoadmissao < anocorte) {
    // Se foi admitido antes do ano de corte, considera do início do ano até data de corte
    const inicioano = new Date(anocorte, 0, 1);
    mesestrabalhados = differenceInMonths(datacorte, inicioano) + 1;
  } else if (anoadmissao === anocorte) {
    // Se foi admitido no ano de corte, conta desde a admissão
    mesestrabalhados = differenceInMonths(datacorte, dataadmissao) + 1;
  } else {
    // Se data de admissão é posterior à data de corte (caso inválido)
    mesestrabalhados = 0;
  }
  
  // Garante que não ultrapasse 12 meses
  mesestrabalhados = Math.min(mesestrabalhados, 12);
  mesestrabalhados = Math.max(mesestrabalhados, 0);
  
  return (salariobase / 12) * mesestrabalhados;
}

export function calcularAvisoPreavio(salariobase: number): number {
  return salariobase;
}

export function calcularTotalPassivo(
  saldoferias: number,
  decimoterceiro: number,
  avisopravio: number
): number {
  return saldoferias + decimoterceiro + avisopravio;
}
