import { CommercialSpreadsheet } from "@/types/commercial";

export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

export const agruparPorVendedor = (data: CommercialSpreadsheet[]) => {
  const agrupado = data.reduce((acc, item) => {
    const vendedor = item.vendedor;
    if (!acc[vendedor]) {
      acc[vendedor] = { vendedor, quantidade: 0, totalOrcado: 0 };
    }
    acc[vendedor].quantidade += 1;
    acc[vendedor].totalOrcado += item.valorVenda;
    return acc;
  }, {} as Record<string, { vendedor: string; quantidade: number; totalOrcado: number }>);
  
  return Object.values(agrupado);
};

export const agruparPorSegmento = (data: CommercialSpreadsheet[]) => {
  const agrupado = data.reduce((acc, item) => {
    const segmento = item.segmento;
    if (!acc[segmento]) {
      acc[segmento] = { segmento, quantidade: 0, totalOrcado: 0 };
    }
    acc[segmento].quantidade += 1;
    acc[segmento].totalOrcado += item.valorVenda;
    return acc;
  }, {} as Record<string, { segmento: string; quantidade: number; totalOrcado: number }>);
  
  return Object.values(agrupado);
};

export const agruparPorCliente = (data: CommercialSpreadsheet[]) => {
  const agrupado = data.reduce((acc, item) => {
    const cliente = item.cliente;
    if (!acc[cliente]) {
      acc[cliente] = { cliente, quantidade: 0, totalOrcado: 0 };
    }
    acc[cliente].quantidade += 1;
    acc[cliente].totalOrcado += item.valorVenda;
    return acc;
  }, {} as Record<string, { cliente: string; quantidade: number; totalOrcado: number }>);
  
  return Object.values(agrupado);
};

export const contarPorStatus = (data: CommercialSpreadsheet[]) => {
  const contagem = data.reduce((acc, item) => {
    const status = item.status;
    if (!acc[status]) {
      acc[status] = { name: status, value: 0 };
    }
    acc[status].value += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);
  
  return Object.values(contagem);
};

export const agruparValoresPorStatus = (data: CommercialSpreadsheet[]) => {
  const agrupado = data.reduce((acc, item) => {
    const status = item.status;
    if (!acc[status]) {
      acc[status] = { name: status, value: 0 };
    }
    acc[status].value += item.valorVenda;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);
  
  return Object.values(agrupado);
};

export const agruparValoresMonetariosPorStatus = (data: CommercialSpreadsheet[]) => {
  const agrupado = data.reduce((acc, item) => {
    const status = item.status;
    if (!acc[status]) {
      acc[status] = { name: status, value: 0 };
    }
    acc[status].value += item.valorVenda;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);
  
  return Object.values(agrupado);
};

export const calcularMargemMediaContempladas = (data: CommercialSpreadsheet[]) => {
  const contempladas = data.filter(item => item.status === 'Contemplado');
  const totalMargens = contempladas.reduce((sum, item) => sum + item.margemPercentual, 0);
  const valorTotal = contempladas.reduce((sum, item) => sum + item.valorVenda, 0);
  
  return {
    margemMedia: contempladas.length > 0 ? totalMargens / contempladas.length : 0,
    quantidade: contempladas.length,
    valorTotal
  };
};
