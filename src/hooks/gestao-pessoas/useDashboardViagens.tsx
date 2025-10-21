import { useMemo } from "react";
import { useFaturasViagens } from "./useFaturasViagens";
import { TravelDashboardData, CCASpendingData } from "@/types/gestao-pessoas/travel";

export const useDashboardViagens = (dataInicial: string, dataFinal: string, ccaFilter?: string[]) => {
  const { data: faturas = [], isLoading, error } = useFaturasViagens({
    dataInicial,
    dataFinal,
    cca: ccaFilter
  });

  const dashboardData: TravelDashboardData = useMemo(() => {
    if (!faturas.length) {
      return {
        periodo: { inicio: dataInicial, fim: dataFinal },
        resumoGeral: { totalGeral: 0, aereo: 0, hotel: 0, automovel: 0, onibus: 0 },
        reservasPorModal: { aereo: 0, hotel: 0, onibus: 0, automovel: 0 },
        antecedenciaMedia: { aereo: 0, hotel: 0, onibus: 0 },
        cancelamentos: { aereo: 0, hotel: 0, onibus: 0 },
        tempoAprovacao: [],
        detalhesAereo: {
          totalReservas: 0,
          valorTotal: 0,
          ticketMedioDentro: 0,
          ticketMedioFora: 0,
          antecedenciaMedia: 0,
          nacionais: 0,
          internacionais: 0,
          comAcordo: 0,
          semAcordo: 0,
          emissaoCO2: 0,
          companhias: [],
          trechosComuns: []
        },
        detalhesHotel: {
          totalReservas: 0,
          valorTotal: 0,
          ticketMedio: 0,
          hoteisMaisUsados: [],
          cidadesMaisVisitadas: []
        },
        detalhesRodoviario: {
          totalReservas: 0,
          valorTotal: 0,
          ticketMedio: 0,
          empresas: [],
          rotasComuns: []
        },
        analisePorCCA: []
      };
    }

    // Calcular resumo geral
    const totalAereo = faturas
      .filter(f => f.tipo === 'aereo')
      .reduce((sum, f) => sum + f.valorpago, 0);
    
    const totalHotel = faturas
      .filter(f => f.tipo === 'hospedagem')
      .reduce((sum, f) => sum + f.valorpago, 0);
    
    const totalRodoviario = faturas
      .filter(f => f.tipo === 'rodoviario')
      .reduce((sum, f) => sum + f.valorpago, 0);

    const totalGeral = totalAereo + totalHotel + totalRodoviario;

    // Calcular reservas por modal
    const reservasAereo = faturas.filter(f => f.tipo === 'aereo').length;
    const reservasHotel = faturas.filter(f => f.tipo === 'hospedagem').length;
    const reservasRodoviario = faturas.filter(f => f.tipo === 'rodoviario').length;

    // Calcular antecedência média
    const faturasAereoComAntecedencia = faturas.filter(f => f.tipo === 'aereo' && f.antecedencia);
    const antecedenciaMediaAereo = faturasAereoComAntecedencia.length > 0
      ? faturasAereoComAntecedencia.reduce((sum, f) => sum + (f.antecedencia || 0), 0) / faturasAereoComAntecedencia.length
      : 0;

    const faturasHotelComAntecedencia = faturas.filter(f => f.tipo === 'hospedagem' && f.antecedencia);
    const antecedenciaMediaHotel = faturasHotelComAntecedencia.length > 0
      ? faturasHotelComAntecedencia.reduce((sum, f) => sum + (f.antecedencia || 0), 0) / faturasHotelComAntecedencia.length
      : 0;

    const faturasRodoviarioComAntecedencia = faturas.filter(f => f.tipo === 'rodoviario' && f.antecedencia);
    const antecedenciaMediaRodoviario = faturasRodoviarioComAntecedencia.length > 0
      ? faturasRodoviarioComAntecedencia.reduce((sum, f) => sum + (f.antecedencia || 0), 0) / faturasRodoviarioComAntecedencia.length
      : 0;

    // Calcular cancelamentos (usando tipo 'cancelamento')
    const cancelamentosAereo = faturas.filter(f => f.tipo === 'cancelamento' && f.observacao?.toLowerCase().includes('aéreo')).length;
    const cancelamentosHotel = faturas.filter(f => f.tipo === 'cancelamento' && f.observacao?.toLowerCase().includes('hotel')).length;
    const cancelamentosRodoviario = faturas.filter(f => f.tipo === 'cancelamento' && f.observacao?.toLowerCase().includes('rodoviário')).length;

    // Detalhes Aéreo
    const faturasAereo = faturas.filter(f => f.tipo === 'aereo');
    const faturasAereoDentro = faturasAereo.filter(f => f.dentrodapolitica === 'Sim');
    const faturasAereoFora = faturasAereo.filter(f => f.dentrodapolitica === 'Não');

    const ticketMedioDentro = faturasAereoDentro.length > 0
      ? faturasAereoDentro.reduce((sum, f) => sum + f.valorpago, 0) / faturasAereoDentro.length
      : 0;

    const ticketMedioFora = faturasAereoFora.length > 0
      ? faturasAereoFora.reduce((sum, f) => sum + f.valorpago, 0) / faturasAereoFora.length
      : 0;

    // Agrupar companhias aéreas
    const companhiasMap = new Map<string, { dentroPolicy: number; foraPolicy: number }>();
    faturasAereo.forEach(f => {
      const cia = f.ciaida || 'Não informado';
      if (!companhiasMap.has(cia)) {
        companhiasMap.set(cia, { dentroPolicy: 0, foraPolicy: 0 });
      }
      const stats = companhiasMap.get(cia)!;
      if (f.dentrodapolitica === 'Sim') {
        stats.dentroPolicy++;
      } else {
        stats.foraPolicy++;
      }
    });

    const companhias = Array.from(companhiasMap.entries()).map(([nome, stats]) => ({
      nome,
      ...stats
    }));

    // Agrupar trechos comuns
    const trechosMap = new Map<string, number>();
    faturasAereo.forEach(f => {
      const trecho = `${f.origem} - ${f.destino}`;
      trechosMap.set(trecho, (trechosMap.get(trecho) || 0) + 1);
    });

    const trechosComuns = Array.from(trechosMap.entries())
      .map(([trecho, quantidade]) => {
        const [origem, destino] = trecho.split(' - ');
        return { origem, destino, quantidade };
      })
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    // Detalhes Hotel
    const faturasHotel = faturas.filter(f => f.tipo === 'hospedagem');
    const ticketMedioHotel = faturasHotel.length > 0
      ? faturasHotel.reduce((sum, f) => sum + f.valorpago, 0) / faturasHotel.length
      : 0;

    // Agrupar hotéis mais usados
    const hoteisMap = new Map<string, { cidade: string; quantidade: number; valorTotal: number }>();
    faturasHotel.forEach(f => {
      const hotel = f.hospedagem || 'Não informado';
      const cidade = f.destino;
      if (!hoteisMap.has(hotel)) {
        hoteisMap.set(hotel, { cidade, quantidade: 0, valorTotal: 0 });
      }
      const stats = hoteisMap.get(hotel)!;
      stats.quantidade++;
      stats.valorTotal += f.valorpago;
    });

    const hoteisMaisUsados = Array.from(hoteisMap.entries())
      .map(([nome, stats]) => ({ nome, ...stats }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    // Agrupar cidades mais visitadas
    const cidadesMap = new Map<string, number>();
    faturasHotel.forEach(f => {
      const cidade = f.destino;
      cidadesMap.set(cidade, (cidadesMap.get(cidade) || 0) + 1);
    });

    const cidadesMaisVisitadas = Array.from(cidadesMap.entries())
      .map(([cidade, quantidade]) => ({ cidade, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    // Detalhes Rodoviário
    const faturasRodoviario = faturas.filter(f => f.tipo === 'rodoviario');
    const ticketMedioRodoviario = faturasRodoviario.length > 0
      ? faturasRodoviario.reduce((sum, f) => sum + f.valorpago, 0) / faturasRodoviario.length
      : 0;

    // Agrupar rotas comuns
    const rotasMap = new Map<string, number>();
    faturasRodoviario.forEach(f => {
      const rota = `${f.origem} - ${f.destino}`;
      rotasMap.set(rota, (rotasMap.get(rota) || 0) + 1);
    });

    const rotasComuns = Array.from(rotasMap.entries())
      .map(([rota, quantidade]) => {
        const [origem, destino] = rota.split(' - ');
        return { origem, destino, quantidade };
      })
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    // Análise por CCA
    const ccaMap = new Map<string, CCASpendingData>();
    faturas.forEach(f => {
      if (!ccaMap.has(f.cca)) {
        ccaMap.set(f.cca, {
          cca: f.cca,
          descricao: f.centrodecusto,
          gastosAereo: 0,
          gastosRodoviario: 0,
          gastosHotel: 0,
          totalGasto: 0,
          orcamentoTotal: 0, // TODO: buscar do banco
          saldoRestante: 0,
          percentualUtilizado: 0,
          viagens: 0
        });
      }
      const ccaData = ccaMap.get(f.cca)!;
      ccaData.viagens++;
      ccaData.totalGasto += f.valorpago;
      
      if (f.tipo === 'aereo') {
        ccaData.gastosAereo += f.valorpago;
      } else if (f.tipo === 'hospedagem') {
        ccaData.gastosHotel += f.valorpago;
      } else if (f.tipo === 'rodoviario') {
        ccaData.gastosRodoviario += f.valorpago;
      }
    });

    const analisePorCCA = Array.from(ccaMap.values());

    return {
      periodo: { inicio: dataInicial, fim: dataFinal },
      resumoGeral: {
        totalGeral,
        aereo: totalAereo,
        hotel: totalHotel,
        automovel: 0,
        onibus: totalRodoviario
      },
      reservasPorModal: {
        aereo: reservasAereo,
        hotel: reservasHotel,
        onibus: reservasRodoviario,
        automovel: 0
      },
      antecedenciaMedia: {
        aereo: Math.round(antecedenciaMediaAereo),
        hotel: Math.round(antecedenciaMediaHotel),
        onibus: Math.round(antecedenciaMediaRodoviario)
      },
      cancelamentos: {
        aereo: cancelamentosAereo,
        hotel: cancelamentosHotel,
        onibus: cancelamentosRodoviario
      },
      tempoAprovacao: [], // TODO: Implementar quando houver dados de aprovação
      detalhesAereo: {
        totalReservas: reservasAereo,
        valorTotal: totalAereo,
        ticketMedioDentro,
        ticketMedioFora,
        antecedenciaMedia: Math.round(antecedenciaMediaAereo),
        nacionais: 0, // TODO: Implementar lógica de nacional/internacional
        internacionais: 0,
        comAcordo: 0, // TODO: Implementar lógica de acordo
        semAcordo: 0,
        emissaoCO2: 0, // TODO: Implementar cálculo de emissão
        companhias,
        trechosComuns
      },
      detalhesHotel: {
        totalReservas: reservasHotel,
        valorTotal: totalHotel,
        ticketMedio: ticketMedioHotel,
        hoteisMaisUsados,
        cidadesMaisVisitadas
      },
      detalhesRodoviario: {
        totalReservas: reservasRodoviario,
        valorTotal: totalRodoviario,
        ticketMedio: ticketMedioRodoviario,
        empresas: [], // TODO: Adicionar campo de empresa rodoviária
        rotasComuns
      },
      analisePorCCA
    };
  }, [faturas, dataInicial, dataFinal]);

  return {
    dashboardData,
    isLoading,
    error,
    faturas
  };
};
