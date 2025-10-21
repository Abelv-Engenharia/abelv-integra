import { useMemo } from "react";
import { usePrestadoresPJ } from "./usePrestadoresPJ";
import { useContratos } from "./usePrestadoresContratos";
import { useDemonstrativos } from "./useDemonstrativos";
import { useNotasFiscais } from "./useNotasFiscais";
import { useFerias } from "./usePrestadoresFerias";
import { usePassivos } from "./usePrestadoresPassivos";
import { ModuloPrestador, FiltrosRelatorioPrestadores, DadosModulo } from "@/types/gestao-pessoas/relatorio-prestadores";

export function useRelatorioPrestadores() {
  const { data: prestadoresPJ = [], isLoading: loadingPJ } = usePrestadoresPJ();
  const { data: contratos = [], isLoading: loadingContratos } = useContratos();
  const { data: demonstrativos = [], isLoading: loadingDemonstrativos } = useDemonstrativos();
  const { data: notasFiscais = [], isLoading: loadingNF } = useNotasFiscais();
  const { data: ferias = [], isLoading: loadingFerias } = useFerias();
  const { data: passivos = [], isLoading: loadingPassivos } = usePassivos();

  const isLoading = loadingPJ || loadingContratos || loadingDemonstrativos || loadingNF || loadingFerias || loadingPassivos;

  const carregarDadosModulo = (modulo: ModuloPrestador): any[] => {
    switch (modulo) {
      case "cadastro_pj":
        return prestadoresPJ;
      case "contratos":
        return contratos;
      case "demonstrativo":
        return demonstrativos;
      case "emissao_nf":
      case "aprovacao_nf":
        return notasFiscais;
      case "ferias":
      case "aprovacao_ferias":
        return ferias;
      case "passivos":
        return passivos;
      default:
        return [];
    }
  };

  const aplicarFiltros = (dados: any[], filtros: FiltrosRelatorioPrestadores): any[] => {
    return dados.filter((item) => {
      // Filtro por prestador
      if (filtros.prestador) {
        const prestadorMatch =
          item.nomeCompleto?.toLowerCase().includes(filtros.prestador.toLowerCase()) ||
          item.prestador?.toLowerCase().includes(filtros.prestador.toLowerCase()) ||
          item.nomePrestador?.toLowerCase().includes(filtros.prestador.toLowerCase()) ||
          item.nomeprestador?.toLowerCase().includes(filtros.prestador.toLowerCase()) ||
          item.nome?.toLowerCase().includes(filtros.prestador.toLowerCase()) ||
          item.nomerepresentante?.toLowerCase().includes(filtros.prestador.toLowerCase());

        if (!prestadorMatch) return false;
      }

      // Filtro por empresa
      if (filtros.empresa) {
        const empresaMatch =
          item.empresa?.toLowerCase().includes(filtros.empresa.toLowerCase()) ||
          item.nomeempresa?.toLowerCase().includes(filtros.empresa.toLowerCase());

        if (!empresaMatch) return false;
      }

      // Filtro por status
      if (filtros.status && filtros.status.length > 0) {
        if (!filtros.status.includes(item.status)) return false;
      }

      // Filtro por data inicial
      if (filtros.dataInicial) {
        const itemDate = new Date(
          item.dataemissao || item.datainicio || item.datainicioferias || item.datacorte || item.mes + "-01"
        );
        if (itemDate < filtros.dataInicial) return false;
      }

      // Filtro por data final
      if (filtros.dataFinal) {
        const itemDate = new Date(
          item.dataemissao || item.datafim || item.datainicioferias || item.datacorte || item.mes + "-01"
        );
        if (itemDate > filtros.dataFinal) return false;
      }

      // Filtro por valor mínimo
      if (filtros.valorMinimo !== undefined) {
        const valor = item.valor || item.valornf || item.valorPrestacaoServico || item.total || 0;
        if (valor < filtros.valorMinimo) return false;
      }

      // Filtro por valor máximo
      if (filtros.valorMaximo !== undefined) {
        const valor = item.valor || item.valornf || item.valorPrestacaoServico || item.total || 0;
        if (valor > filtros.valorMaximo) return false;
      }

      // Filtro por tipos de contrato
      if (filtros.tiposContrato && filtros.tiposContrato.length > 0) {
        if (item.tipo && !filtros.tiposContrato.includes(item.tipo)) return false;
      }

      // Filtro por status de contrato
      if (filtros.statusContrato) {
        if (item.status !== filtros.statusContrato) return false;
      }

      return true;
    });
  };

  const carregarDadosCompletos = (
    modulosSelecionados: ModuloPrestador[],
    colunasPorModulo: Record<ModuloPrestador, string[]>
  ): DadosModulo[] => {
    return modulosSelecionados.map((modulo) => {
      const dados = carregarDadosModulo(modulo);
      const colunas = colunasPorModulo[modulo] || [];

      let titulo = "";
      switch (modulo) {
        case "cadastro_pj":
          titulo = "Cadastro de Prestadores PJ";
          break;
        case "contratos":
          titulo = "Contratos";
          break;
        case "demonstrativo":
          titulo = "Demonstrativos";
          break;
        case "emissao_nf":
          titulo = "Emissão de Notas Fiscais";
          break;
        case "aprovacao_nf":
          titulo = "Aprovação de Notas Fiscais";
          break;
        case "ferias":
          titulo = "Férias";
          break;
        case "aprovacao_ferias":
          titulo = "Aprovação de Férias";
          break;
        case "passivos":
          titulo = "Controle de Passivos";
          break;
      }

      return {
        modulo,
        titulo,
        dados,
        colunasSelecionadas: colunas,
      };
    });
  };

  return {
    carregarDadosModulo,
    carregarDadosCompletos,
    aplicarFiltros,
    isLoading,
    error: null,
  };
}
