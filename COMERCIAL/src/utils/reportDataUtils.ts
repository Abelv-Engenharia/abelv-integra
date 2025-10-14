import { CommercialSpreadsheet } from "@/types/commercial";

export interface VendedorPerformance {
  vendedor: string;
  quantidade: number;
  totalOrcado: number;
  contemplado: number;
  perdido: number;
  estimativa: number;
  contempladoValor: number;
  perdidoValor: number;
  estimativaValor: number;
}

export interface SegmentoPerformance {
  segmento: string;
  quantidade: number;
  totalOrcado: number;
  contemplado: number;
  perdido: number;
  estimativa: number;
}

export interface ClientePerformance {
  cliente: string;
  quantidade: number;
  totalOrcado: number;
  contemplado: number;
  perdido: number;
  estimativa: number;
  contempladoValor: number;
  perdidoValor: number;
  estimativaValor: number;
}

export const agruparPorVendedor = (
  data: CommercialSpreadsheet[]
): VendedorPerformance[] => {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.vendedor]) {
      acc[item.vendedor] = {
        vendedor: item.vendedor,
        quantidade: 0,
        totalOrcado: 0,
        contemplado: 0,
        perdido: 0,
        estimativa: 0,
        contempladoValor: 0,
        perdidoValor: 0,
        estimativaValor: 0,
      };
    }

    acc[item.vendedor].quantidade += 1;
    acc[item.vendedor].totalOrcado += item.valorVenda;

    if (item.status === "Contemplado") {
      acc[item.vendedor].contemplado += 1;
      acc[item.vendedor].contempladoValor += item.valorVenda;
    } else if (item.status === "Perdido") {
      acc[item.vendedor].perdido += 1;
      acc[item.vendedor].perdidoValor += item.valorVenda;
    } else if (item.status === "Estimativa" || item.status === "Pré-Venda") {
      acc[item.vendedor].estimativa += 1;
      acc[item.vendedor].estimativaValor += item.valorVenda;
    }

    return acc;
  }, {} as Record<string, VendedorPerformance>);

  return Object.values(grouped);
};

export const agruparPorSegmento = (
  data: CommercialSpreadsheet[]
): SegmentoPerformance[] => {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.segmento]) {
      acc[item.segmento] = {
        segmento: item.segmento,
        quantidade: 0,
        totalOrcado: 0,
        contemplado: 0,
        perdido: 0,
        estimativa: 0,
      };
    }

    acc[item.segmento].quantidade += 1;
    acc[item.segmento].totalOrcado += item.valorVenda;

    if (item.status === "Contemplado") {
      acc[item.segmento].contemplado += 1;
    } else if (item.status === "Perdido") {
      acc[item.segmento].perdido += 1;
    } else if (item.status === "Estimativa" || item.status === "Pré-Venda") {
      acc[item.segmento].estimativa += 1;
    }

    return acc;
  }, {} as Record<string, SegmentoPerformance>);

  return Object.values(grouped);
};

export const agruparPorCliente = (
  data: CommercialSpreadsheet[]
): ClientePerformance[] => {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.cliente]) {
      acc[item.cliente] = {
        cliente: item.cliente,
        quantidade: 0,
        totalOrcado: 0,
        contemplado: 0,
        perdido: 0,
        estimativa: 0,
        contempladoValor: 0,
        perdidoValor: 0,
        estimativaValor: 0,
      };
    }

    acc[item.cliente].quantidade += 1;
    acc[item.cliente].totalOrcado += item.valorVenda;

    if (item.status === "Contemplado") {
      acc[item.cliente].contemplado += 1;
      acc[item.cliente].contempladoValor += item.valorVenda;
    } else if (item.status === "Perdido") {
      acc[item.cliente].perdido += 1;
      acc[item.cliente].perdidoValor += item.valorVenda;
    } else if (item.status === "Estimativa" || item.status === "Pré-Venda") {
      acc[item.cliente].estimativa += 1;
      acc[item.cliente].estimativaValor += item.valorVenda;
    }

    return acc;
  }, {} as Record<string, ClientePerformance>);

  return Object.values(grouped);
};

export const contarPorStatus = (data: CommercialSpreadsheet[]) => {
  const statusCount = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(statusCount).map(([name, value]) => ({
    name,
    value,
  }));
};

export const agruparValoresPorStatus = (data: CommercialSpreadsheet[]) => {
  const totais = data.reduce(
    (acc, item) => {
      if (item.status === "Contemplado") {
        acc.contemplado += item.valorVenda;
      } else if (item.status === "Perdido") {
        acc.perdido += item.valorVenda;
      } else if (item.status === "Estimativa" || item.status === "Pré-Venda") {
        acc.estimativa += item.valorVenda;
      }
      return acc;
    },
    { contemplado: 0, perdido: 0, estimativa: 0 }
  );

  return [
    { name: "Contemplado", value: totais.contemplado },
    { name: "Perdido", value: totais.perdido },
    { name: "Estimativa/Pré-Venda", value: totais.estimativa },
  ].filter((item) => item.value > 0);
};

export const agruparValoresMonetariosPorStatus = (
  data: CommercialSpreadsheet[]
) => {
  const totais = data.reduce(
    (acc, item) => {
      if (item.status === "Contemplado") {
        acc.contemplado += item.valorVenda;
      } else if (item.status === "Perdido") {
        acc.perdido += item.valorVenda;
      } else if (item.status === "Estimativa" || item.status === "Pré-Venda") {
        acc.estimativa += item.valorVenda;
      }
      return acc;
    },
    { contemplado: 0, perdido: 0, estimativa: 0 }
  );

  return [
    { name: "Contemplado", value: totais.contemplado },
    { name: "Perdido", value: totais.perdido },
    { name: "Estimativa/Pré-Venda", value: totais.estimativa },
  ].filter((item) => item.value > 0);
};

export const calcularMargemMediaContempladas = (
  data: CommercialSpreadsheet[]
) => {
  const contempladas = data.filter((item) => item.status === "Contemplado");

  if (contempladas.length === 0) {
    return {
      margemMedia: 0,
      quantidade: 0,
      valorTotal: 0,
    };
  }

  const somaMargens = contempladas.reduce(
    (acc, item) => acc + item.margemPercentual,
    0
  );

  const valorTotal = contempladas.reduce(
    (acc, item) => acc + item.valorVenda,
    0
  );

  return {
    margemMedia: somaMargens / contempladas.length,
    quantidade: contempladas.length,
    valorTotal: valorTotal,
  };
};

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};
