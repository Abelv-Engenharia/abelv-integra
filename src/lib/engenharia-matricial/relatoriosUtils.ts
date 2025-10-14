import { OSEngenhariaMatricial } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";

// Helper para normalizar OS e facilitar acesso a propriedades
export const normalizarOS = (os: OSEngenhariaMatricial) => ({
  ...os,
  dataConclusao: os.data_conclusao,
  hhPlanejado: os.hh_planejado,
  hhAdicional: os.hh_adicional,
  valorOrcamento: os.valor_orcamento,
  valorSAO: os.valor_sao,
  valorEngenharia: os.valor_engenharia,
  valorSuprimentos: os.valor_suprimentos,
  valorFinal: os.valor_final,
  valorHoraHH: os.valor_hora_hh,
  ccaDisplay: os.cca?.codigo || String(os.cca_id),
  ccaNome: os.cca?.nome || '',
});

export type OSNormalizada = ReturnType<typeof normalizarOS>;

// Função para filtrar OS por mês/ano
export const filtrarOSPorMes = (osList: OSEngenhariaMatricial[], mes: number, ano: number) => {
  return osList.filter(os => {
    if (os.status === "concluida" && os.data_conclusao) {
      const data = new Date(os.data_conclusao);
      return data.getMonth() === mes && data.getFullYear() === ano;
    }
    return false;
  });
};

// Função para filtrar OS por ano
export const filtrarOSPorAno = (osList: OSEngenhariaMatricial[], ano: number) => {
  return osList.filter(os => {
    if (os.status === "concluida" && os.data_conclusao) {
      const data = new Date(os.data_conclusao);
      return data.getFullYear() === ano;
    }
    return false;
  });
};

// Função para calcular HH total de uma lista de OS
export const calcularHHTotal = (osList: OSEngenhariaMatricial[]) => {
  return osList.reduce((acc, os) => acc + (os.hh_planejado || 0) + (os.hh_adicional || 0), 0);
};
