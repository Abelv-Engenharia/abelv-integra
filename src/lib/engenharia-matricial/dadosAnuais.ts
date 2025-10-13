import { OS } from "@/contexts/engenharia-matricial/OSContext";

// Dados históricos anuais por disciplina (Jan-Set 2025) - Dados base
const hhPorDisciplinaHistorico = [
  { mes: "Jan/25", eletrica: 200, mecanica: 190, meta: 152 },
  { mes: "Fev/25", eletrica: 170, mecanica: 190, meta: 152 },
  { mes: "Mar/25", eletrica: 200, mecanica: 44, meta: 152 },
  { mes: "Abr/25", eletrica: 372, mecanica: 191, meta: 152 },
  { mes: "Mai/25", eletrica: 131, mecanica: 190, meta: 152 },
  { mes: "Jun/25", eletrica: 149, mecanica: 201, meta: 152 },
  { mes: "Jul/25", eletrica: 208, mecanica: 196, meta: 152 },
  { mes: "Ago/25", eletrica: 176, mecanica: 192, meta: 152 },
  { mes: "Set/25", eletrica: 184, mecanica: 191, meta: 152 }
];

// Dados históricos por CCA (Jan-Set 2025) - Dados base
const hhPorCCAHistorico = [
  { cca: "23015", nome: "Hospital Sabará", jan: 40, fev: 130, mar: 154, abr: 196, mai: 5, jun: 17, jul: 102, ago: 142, set: 33 },
  { cca: "20119", nome: "Instituto Butantan", jan: 270, fev: 200, mar: 3, abr: 30, mai: 0, jun: 178, jul: 32, ago: 31, set: 0 },
  { cca: "22043", nome: "Monin", jan: 20, fev: 0, mar: 2, abr: 36, mai: 33, jun: 27, jul: 12, ago: 0, set: 8 },
  { cca: "24021", nome: "Rousselot", jan: 0, fev: 0, mar: 0, abr: 0, mai: 0, jun: 0, jul: 132, ago: 0, set: 63 },
  { cca: "25028", nome: "LIBBS", jan: 0, fev: 0, mar: 0, abr: 0, mai: 0, jun: 0, jul: 55, ago: 63, set: 77 },
  { cca: "24023", nome: "Brainfarma", jan: 0, fev: 0, mar: 0, abr: 152, mai: 16, jun: 15, jul: 16, ago: 6, set: 0 },
  { cca: "21084", nome: "TCA", jan: 0, fev: 20, mar: 20, abr: 0, mai: 0, jun: 0, jul: 0, ago: 0, set: 0 },
  { cca: "1521", nome: "Orçamentos", jan: 0, fev: 15, mar: 10, abr: 0, mai: 48, jun: 40, jul: 0, ago: 0, set: 8 },
  { cca: "23101", nome: "Nexa Resources", jan: 0, fev: 0, mar: 0, abr: 0, mai: 20, jun: 0, jul: 0, ago: 18, set: 0 },
  { cca: "25041", nome: "OPY - HMME", jan: 0, fev: 0, mar: 0, abr: 0, mai: 0, jun: 0, jul: 0, ago: 0, set: 60 }
];

// Função para mesclar dados históricos com OS concluídas
export const obterHHPorDisciplinaAnual = (osList: OS[]) => {
  // 1) Agregar HH das OS concluídas por mês/ano
  const osMensal = new Map<string, { mes: string; eletrica: number; mecanica: number; meta: number }>();

  osList.forEach(os => {
    if (os.status === 'concluida' && os.competencia) {
      const [mes, ano] = os.competencia.split('/');
      const chave = getChaveMes(parseInt(mes), parseInt(ano));
      if (!chave) return;

      const hh = (os.hhPlanejado || 0) + (os.hhAdicional || 0);
      const disc = (os.disciplina || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const atual = osMensal.get(chave) || { mes: chave, eletrica: 0, mecanica: 0, meta: 152 };
      if (disc === 'eletrica') atual.eletrica += hh;
      else if (disc === 'mecanica') atual.mecanica += hh;

      osMensal.set(chave, atual);
    }
  });

  // 2) Map do histórico para fallback
  const historicoMap = new Map(hhPorDisciplinaHistorico.map(h => [h.mes, h] as const));

  // 3) Unir meses: usa OS quando existir, senão histórico (evita somar 2x)
  const chaves = new Set<string>([...historicoMap.keys(), ...osMensal.keys()]);
  const result: { mes: string; eletrica: number; mecanica: number; meta: number }[] = [];

  chaves.forEach(chave => {
    if (osMensal.has(chave)) {
      result.push(osMensal.get(chave)!);
    } else {
      const h = historicoMap.get(chave)!;
      result.push({ mes: h.mes, eletrica: h.eletrica, mecanica: h.mecanica, meta: h.meta });
    }
  });

  // 4) Ordenar por ano e mês
  return result.sort((a, b) => {
    const [mesA, anoA] = a.mes.split('/');
    const [mesB, anoB] = b.mes.split('/');
    return parseInt(anoA) - parseInt(anoB) || getMesNumero(mesA) - getMesNumero(mesB);
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

// Exportar dados históricos para compatibilidade (deprecated, usar obterHHPorDisciplinaAnual)
export const hhPorDisciplinaAnual = hhPorDisciplinaHistorico;
export const hhPorCCAAnual = hhPorCCAHistorico;

// Função auxiliar para calcular totais (agora recebe OS list)
export const calcularTotais = (osList: OS[] = []) => {
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
