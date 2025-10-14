import { OSEngenhariaMatricial } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";

// Tipo auxiliar para aceitar diferentes formatos de OS
type AnyOS = OSEngenhariaMatricial | any;

// Função para calcular HH por disciplina com base nas OS concluídas
export const obterHHPorDisciplinaAnual = (osList: AnyOS[]) => {
  const osMensal = new Map<string, { mes: string; eletrica: number; mecanica: number; meta: number }>();

  // Agregar HH das OS concluídas por mês/ano
  osList.forEach(os => {
    // Suportar ambos os formatos: data_conclusao (banco) e dataConclusao (contexto)
    const dataConclusao = os.data_conclusao || os.dataConclusao;
    const hhPlanejado = os.hh_planejado ?? os.hhPlanejado ?? 0;
    const hhAdicional = os.hh_adicional ?? os.hhAdicional ?? 0;
    
    if (os.status === 'concluida' && dataConclusao) {
      const data = new Date(dataConclusao);
      const mes = data.getMonth() + 1; // 1-12
      const ano = data.getFullYear();
      const chave = getChaveMes(mes, ano);
      if (!chave) return;

      const hh = hhPlanejado + hhAdicional;
      const disc = (os.disciplina || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const atual = osMensal.get(chave) || { mes: chave, eletrica: 0, mecanica: 0, meta: 152 };
      if (disc === 'eletrica') atual.eletrica += hh;
      else if (disc === 'mecanica') atual.mecanica += hh;

      osMensal.set(chave, atual);
    }
  });

  // Converter para array e ordenar
  const result = Array.from(osMensal.values());
  return result.sort((a, b) => {
    const [mesA, anoA] = a.mes.split('/');
    const [mesB, anoB] = b.mes.split('/');
    return parseInt(anoA) - parseInt(anoB) || getMesNumero(mesA) - getMesNumero(mesB);
  });
};

// Função para calcular HH por CCA com base nas OS concluídas
export const obterHHPorCCAAnual = (osList: AnyOS[]) => {
  const ccaMap = new Map<number, {
    cca: string;
    nome: string;
    jan: number; fev: number; mar: number; abr: number;
    mai: number; jun: number; jul: number; ago: number;
    set: number; out: number; nov: number; dez: number;
  }>();

  // Agregar HH por CCA e mês
  osList.forEach(os => {
    // Suportar ambos os formatos
    const dataConclusao = os.data_conclusao || os.dataConclusao;
    const hhPlanejado = os.hh_planejado ?? os.hhPlanejado ?? 0;
    const hhAdicional = os.hh_adicional ?? os.hhAdicional ?? 0;
    const ccaId = os.cca_id ?? os.cca;
    const ccaInfo = os.cca; // objeto { codigo, nome } quando vem do banco
    
    if (os.status === 'concluida' && dataConclusao && ccaId) {
      const data = new Date(dataConclusao);
      const mes = data.getMonth(); // 0-11
      const hh = hhPlanejado + hhAdicional;

      if (!ccaMap.has(ccaId)) {
        // Se ccaInfo é objeto, pegar codigo/nome dele, senão usar o próprio ccaId
        const ccaCodigo = typeof ccaInfo === 'object' && ccaInfo?.codigo ? ccaInfo.codigo : String(ccaId);
        const ccaNome = typeof ccaInfo === 'object' && ccaInfo?.nome ? ccaInfo.nome : 'CCA ' + ccaId;
        
        ccaMap.set(ccaId, {
          cca: ccaCodigo,
          nome: ccaNome,
          jan: 0, fev: 0, mar: 0, abr: 0,
          mai: 0, jun: 0, jul: 0, ago: 0,
          set: 0, out: 0, nov: 0, dez: 0
        });
      }

      const ccaData = ccaMap.get(ccaId)!;
      const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'] as const;
      const mesKey = meses[mes];
      ccaData[mesKey] = ccaData[mesKey] + hh;
    }
  });

  // Converter para array e ordenar por total
  const result = Array.from(ccaMap.values());
  return result.sort((a, b) => {
    const totalA = a.jan + a.fev + a.mar + a.abr + a.mai + a.jun + a.jul + a.ago + a.set + a.out + a.nov + a.dez;
    const totalB = b.jan + b.fev + b.mar + b.abr + b.mai + b.jun + b.jul + b.ago + b.set + b.out + b.nov + b.dez;
    return totalB - totalA;
  });
};

// Função auxiliar para converter mês/ano para chave
const getChaveMes = (mes: number, ano: number): string | null => {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  if (mes < 1 || mes > 12) return null;
  return `${meses[mes - 1]}/${String(ano).slice(-2)}`;
};

// Função auxiliar para obter número do mês
const getMesNumero = (mes: string): number => {
  const meses: Record<string, number> = {
    'Jan': 1, 'Fev': 2, 'Mar': 3, 'Abr': 4, 'Mai': 5, 'Jun': 6,
    'Jul': 7, 'Ago': 8, 'Set': 9, 'Out': 10, 'Nov': 11, 'Dez': 12
  };
  return meses[mes] || 0;
};

// Exportar dados vazios para compatibilidade (deprecated, usar obterHHPorCCAAnual)
export const hhPorCCAAnual: ReturnType<typeof obterHHPorCCAAnual> = [];

// Função auxiliar para calcular totais (agora recebe OS list)
export const calcularTotais = (osList: AnyOS[] = []) => {
  const dadosConsolidados = obterHHPorDisciplinaAnual(osList);
  
  const totalEletrica = dadosConsolidados.reduce((acc, curr) => acc + curr.eletrica, 0);
  const totalMecanica = dadosConsolidados.reduce((acc, curr) => acc + curr.mecanica, 0);
  const totalGeral = totalEletrica + totalMecanica;
  
  const mesesDecorridos = dadosConsolidados.length;
  const mediaEletrica = mesesDecorridos > 0 ? Math.round(totalEletrica / mesesDecorridos) : 0;
  const mediaMecanica = mesesDecorridos > 0 ? Math.round(totalMecanica / mesesDecorridos) : 0;
  const mediaGeral = mesesDecorridos > 0 ? Math.round(totalGeral / mesesDecorridos) : 0;
  
  return {
    totalEletrica,
    totalMecanica,
    totalGeral,
    mediaEletrica,
    mediaMecanica,
    mediaGeral,
    mesesDecorridos
  };
};
