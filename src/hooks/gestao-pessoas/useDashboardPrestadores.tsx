import { useMemo } from "react";
import { useDemonstrativos } from "./useDemonstrativos";
import { KPIData, FiltrosDashboard, DadosGraficoMensal, TopPrestador } from "@/types/gestao-pessoas/dashboard-prestadores";

export function useDashboardPrestadores(filtros?: FiltrosDashboard) {
  const { data: demonstrativos = [], isLoading, error } = useDemonstrativos();

  const demonstrativosFiltrados = useMemo(() => {
    if (!filtros) return demonstrativos;

    return demonstrativos.filter((demo) => {
      const dataMes = new Date(demo.mes + "-01");

      if (filtros.datainicial && dataMes < filtros.datainicial) return false;
      if (filtros.datafinal && dataMes > filtros.datafinal) return false;
      if (filtros.empresas && filtros.empresas.length > 0 && !filtros.empresas.includes(demo.nomeempresa)) return false;
      if (filtros.prestador && !demo.nome.toLowerCase().includes(filtros.prestador.toLowerCase())) return false;
      if (filtros.obra && !demo.obra.toLowerCase().includes(filtros.obra.toLowerCase())) return false;

      return true;
    });
  }, [demonstrativos, filtros]);

  const kpis = useMemo((): KPIData => {
    return {
      totalnf: demonstrativosFiltrados.reduce((sum, d) => sum + d.valornf, 0),
      totalajudaaluguel: demonstrativosFiltrados.reduce((sum, d) => sum + d.ajudaaluguel, 0),
      totalreembolsoconvenio: demonstrativosFiltrados.reduce((sum, d) => sum + d.reembolsoconvenio, 0),
      totaldescontoconvenio: demonstrativosFiltrados.reduce((sum, d) => sum + d.descontoconvenio, 0),
      totalmultas: demonstrativosFiltrados.reduce((sum, d) => sum + d.multasdescontos, 0),
      totaldescontoabelvrun: demonstrativosFiltrados.reduce((sum, d) => sum + d.descontoabelvrun, 0),
    };
  }, [demonstrativosFiltrados]);

  const dadosMensais = useMemo((): DadosGraficoMensal[] => {
    const mesesMap = new Map<string, DadosGraficoMensal>();

    demonstrativosFiltrados.forEach((demo) => {
      const mes = demo.mes;
      const existing = mesesMap.get(mes) || {
        mes,
        nf: 0,
        ajudaaluguel: 0,
        reembolso: 0,
        descontos: 0,
      };

      existing.nf += demo.valornf;
      existing.ajudaaluguel += demo.ajudaaluguel;
      existing.reembolso += demo.reembolsoconvenio;
      existing.descontos += demo.descontoconvenio + demo.multasdescontos + demo.descontoabelvrun;

      mesesMap.set(mes, existing);
    });

    return Array.from(mesesMap.values())
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .slice(-6);
  }, [demonstrativosFiltrados]);

  const top10Prestadores = useMemo((): TopPrestador[] => {
    const prestadoresMap = new Map<string, { nome: string; empresa: string; totalnf: number }>();

    demonstrativosFiltrados.forEach((demo) => {
      const key = `${demo.nome}-${demo.nomeempresa}`;
      const existing = prestadoresMap.get(key) || {
        nome: demo.nome,
        empresa: demo.nomeempresa,
        totalnf: 0,
      };

      existing.totalnf += demo.valornf;
      prestadoresMap.set(key, existing);
    });

    return Array.from(prestadoresMap.values())
      .sort((a, b) => b.totalnf - a.totalnf)
      .slice(0, 10);
  }, [demonstrativosFiltrados]);

  return {
    demonstrativos,
    demonstrativosFiltrados,
    kpis,
    dadosMensais,
    top10Prestadores,
    isLoading,
    error,
  };
}
