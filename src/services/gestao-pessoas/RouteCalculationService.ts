import type { EnderecoRota, ConfiguracaoVeiculoRota, ResultadoRotaCalculo, CalculoEstimativaCartao } from "@/types/gestao-pessoas/route";
import { GeocodingCacheService } from "./GeocodingCacheService";

interface RouteResponse {
  distanciaKm: number;
  duracaoMin: number;
  sucesso: boolean;
  erro?: string;
}

interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
}

// Geocoding usando Nominatim (OpenStreetMap) com cache
const geocodificarEndereco = async (endereco: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    console.log('🔍 Geocodificando:', endereco);
    
    // Verificar se é coordenada direta (modo manual)
    if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(endereco.trim())) {
      const [lat, lng] = endereco.split(',').map(c => parseFloat(c.trim()));
      console.log('📍 Coordenadas diretas:', { lat, lng });
      return { lat, lng };
    }
    
    // Verificar cache primeiro
    const cached = GeocodingCacheService.get(endereco);
    if (cached) {
      return { lat: cached.lat, lng: cached.lng };
    }
    
    // Limpar cache antigo automaticamente
    GeocodingCacheService.cleanOldEntries();
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}&limit=1`,
      {
        headers: {
          'User-Agent': 'GestaoVeiculos/1.0'
        }
      }
    );
    
    if (!response.ok) {
      console.error('❌ Erro na API Nominatim:', response.status);
      return null;
    }
    
    const data: GeocodingResult[] = await response.json();
    
    if (data.length === 0) {
      console.error('❌ Endereço não encontrado:', endereco);
      return null;
    }
    
    const coords = {
      lat: typeof data[0].lat === 'string' ? parseFloat(data[0].lat) : data[0].lat,
      lng: typeof data[0].lon === 'string' ? parseFloat(data[0].lon) : data[0].lon
    };
    
    // Salvar no cache
    GeocodingCacheService.set(endereco, coords.lat, coords.lng, data[0].display_name);
    
    console.log('✅ Coordenadas obtidas:', coords, '|', data[0].display_name);
    
    return coords;
  } catch (error) {
    console.error('❌ Erro ao geocodificar endereço:', endereco, error);
    return null;
  }
};

// Calcular rota usando OSRM (gratuito)
const calcularRotaOSRM = async (
  origemLat: number,
  origemLng: number,
  destinoLat: number,
  destinoLng: number
): Promise<RouteResponse> => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${origemLng.toString()},${origemLat.toString()};${destinoLng.toString()},${destinoLat.toString()}?overview=false`
    );
    
    if (!response.ok) {
      return {
        distanciaKm: 0,
        duracaoMin: 0,
        sucesso: false,
        erro: 'Erro ao calcular rota'
      };
    }
    
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      return {
        distanciaKm: 0,
        duracaoMin: 0,
        sucesso: false,
        erro: 'Nenhuma rota encontrada'
      };
    }
    
    const route = data.routes[0];
    
    return {
      distanciaKm: Math.round((route.distance / 1000) * 10) / 10,
      duracaoMin: Math.round(route.duration / 60),
      sucesso: true
    };
  } catch (error) {
    console.error('Erro OSRM:', error);
    return {
      distanciaKm: 0,
      duracaoMin: 0,
      sucesso: false,
      erro: 'Erro ao conectar com serviço de rotas'
    };
  }
};

// Função principal para calcular rota
export const calcularRota = async (
  origemEndereco: string,
  destinoEndereco: string
): Promise<RouteResponse> => {
  try {
    console.log('🚗 Calculando rota entre:', { origem: origemEndereco, destino: destinoEndereco });
    
    // Delay para respeitar rate limit da API (1 req/segundo)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Geocodificar origem e destino
    const origemCoords = await geocodificarEndereco(origemEndereco);
    
    if (!origemCoords) {
      return {
        distanciaKm: 0,
        duracaoMin: 0,
        sucesso: false,
        erro: `Endereço Base não encontrado. Verifique se está completo com rua, número, cidade e estado.`
      };
    }
    
    // Delay entre geocodificações
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const destinoCoords = await geocodificarEndereco(destinoEndereco);
    
    if (!destinoCoords) {
      return {
        distanciaKm: 0,
        duracaoMin: 0,
        sucesso: false,
        erro: `Endereço da Obra não encontrado. Verifique se está completo com rua, número, cidade e estado.`
      };
    }
    
    // Calcular rota usando OSRM
    const resultado = await calcularRotaOSRM(
      origemCoords.lat,
      origemCoords.lng,
      destinoCoords.lat,
      destinoCoords.lng
    );
    
    if (resultado.sucesso) {
      console.log('✅ Rota calculada:', resultado.distanciaKm, 'km');
    }
    
    return resultado;
  } catch (error) {
    console.error('❌ Erro ao calcular rota:', error);
    return {
      distanciaKm: 0,
      duracaoMin: 0,
      sucesso: false,
      erro: 'Erro ao calcular rota. Tente novamente.'
    };
  }
};

// Calcular estimativa completa
export const calcularEstimativaCompleta = async (
  config: ConfiguracaoVeiculoRota,
  enderecoBase: EnderecoRota,
  enderecoObra: EnderecoRota,
  trajetosAdicionais: EnderecoRota[],
  precoCombustivel: number,
  margemSeguranca: number,
  diasUteis: number = 22,
  frequenciaDiaria: number = 2
): Promise<CalculoEstimativaCartao | null> => {
  try {
    // Calcular rota principal
    const rotaPrincipalResult = await calcularRota(
      enderecoBase.endereco,
      enderecoObra.endereco
    );
    
    if (!rotaPrincipalResult.sucesso) {
      throw new Error(rotaPrincipalResult.erro || 'Erro ao calcular rota principal');
    }
    
    const viagensMensaisIda = diasUteis * frequenciaDiaria;
    const viagensMensaisVolta = diasUteis * frequenciaDiaria;
    const distanciaMensalPrincipal = rotaPrincipalResult.distanciaKm * (viagensMensaisIda + viagensMensaisVolta);
    const custoViagem = (rotaPrincipalResult.distanciaKm / config.consumoMedioKmL) * precoCombustivel;
    const custoMensalPrincipal = custoViagem * (viagensMensaisIda + viagensMensaisVolta);
    
    const rotaPrincipal: ResultadoRotaCalculo = {
      origem: enderecoBase.nome,
      destino: enderecoObra.nome,
      distanciaKm: rotaPrincipalResult.distanciaKm,
      duracaoMin: rotaPrincipalResult.duracaoMin,
      frequenciaDiaria,
      diasUteis,
      viagensMensaisIda,
      viagensMensaisVolta,
      distanciaMensalTotal: distanciaMensalPrincipal,
      custoViagem,
      custoMensal: custoMensalPrincipal
    };
    
    // Calcular trajetos adicionais
    const trajetosCalculados: ResultadoRotaCalculo[] = [];
    let distanciaTotalAdicional = 0;
    let custoTotalAdicional = 0;
    
    for (const trajeto of trajetosAdicionais) {
      const trajetoResult = await calcularRota(
        enderecoBase.endereco,
        trajeto.endereco
      );
      
      if (trajetoResult.sucesso) {
        const frequenciaMensal = (trajeto.frequenciaSemanal || 1) * 4;
        const distanciaMensalTrajeto = trajetoResult.distanciaKm * frequenciaMensal * 2;
        const custoViagemTrajeto = (trajetoResult.distanciaKm / config.consumoMedioKmL) * precoCombustivel;
        const custoMensalTrajeto = custoViagemTrajeto * frequenciaMensal * 2;
        
        trajetosCalculados.push({
          origem: enderecoBase.nome,
          destino: trajeto.nome,
          distanciaKm: trajetoResult.distanciaKm,
          duracaoMin: trajetoResult.duracaoMin,
          frequenciaDiaria: trajeto.frequenciaSemanal || 1,
          diasUteis: 4,
          viagensMensaisIda: frequenciaMensal,
          viagensMensaisVolta: frequenciaMensal,
          distanciaMensalTotal: distanciaMensalTrajeto,
          custoViagem: custoViagemTrajeto,
          custoMensal: custoMensalTrajeto
        });
        
        distanciaTotalAdicional += distanciaMensalTrajeto;
        custoTotalAdicional += custoMensalTrajeto;
      }
    }
    
    // Totalizadores
    const distanciaTotalMensal = distanciaMensalPrincipal + distanciaTotalAdicional;
    const litrosNecessarios = distanciaTotalMensal / config.consumoMedioKmL;
    const custoEstimadoBase = custoMensalPrincipal + custoTotalAdicional;
    const valorMargemSeguranca = (custoEstimadoBase * margemSeguranca) / 100;
    const custoEstimadoComMargem = custoEstimadoBase + valorMargemSeguranca;
    
    // Comparação com limite atual
    let diferencaLimite: number | undefined;
    let percentualDiferenca: number | undefined;
    
    if (config.limiteAtualCartao) {
      diferencaLimite = config.limiteAtualCartao - custoEstimadoComMargem;
      percentualDiferenca = (diferencaLimite / config.limiteAtualCartao) * 100;
    }
    
    return {
      id: Date.now().toString(),
      veiculoId: config.veiculoId,
      placa: config.placa,
      modelo: config.modelo,
      cartaoId: config.cartaoId,
      consumoKmL: config.consumoMedioKmL,
      precoCombustivelPorLitro: precoCombustivel,
      tipoCombustivel: config.tipoCombustivel,
      margemSegurancaPct: margemSeguranca,
      rotaPrincipal,
      trajetosAdicionais: trajetosCalculados,
      distanciaTotalMensalKm: Math.round(distanciaTotalMensal * 10) / 10,
      litrosNecessarios: Math.round(litrosNecessarios * 10) / 10,
      custoEstimadoBase: Math.round(custoEstimadoBase * 100) / 100,
      valorMargemSeguranca: Math.round(valorMargemSeguranca * 100) / 100,
      custoEstimadoComMargem: Math.round(custoEstimadoComMargem * 100) / 100,
      limiteAtualCartao: config.limiteAtualCartao,
      diferencaLimite: diferencaLimite ? Math.round(diferencaLimite * 100) / 100 : undefined,
      percentualDiferenca: percentualDiferenca ? Math.round(percentualDiferenca * 10) / 10 : undefined,
      dataCalculo: new Date(),
      observacoes: ''
    };
  } catch (error) {
    console.error('Erro ao calcular estimativa completa:', error);
    return null;
  }
};
