// Sistema de cache local para geocodificação
// TTL: 30 dias

interface CachedAddress {
  endereco: string;
  lat: number;
  lng: number;
  display_name: string;
  timestamp: number;
}

const CACHE_KEY = 'geocoding_cache';
const TTL_DAYS = 30;
const TTL_MS = TTL_DAYS * 24 * 60 * 60 * 1000;

export class GeocodingCacheService {
  // Obter do cache
  static get(endereco: string): { lat: number; lng: number; display_name: string } | null {
    try {
      const cache = this.loadCache();
      const hash = this.hashAddress(endereco);
      const cached = cache[hash];

      if (!cached) return null;

      // Verificar se expirou
      const age = Date.now() - cached.timestamp;
      if (age > TTL_MS) {
        this.remove(endereco);
        return null;
      }

      console.log('💾 Cache HIT:', endereco);
      return {
        lat: cached.lat,
        lng: cached.lng,
        display_name: cached.display_name
      };
    } catch (error) {
      console.error('Erro ao ler cache:', error);
      return null;
    }
  }

  // Salvar no cache
  static set(endereco: string, lat: number, lng: number, display_name: string): void {
    try {
      const cache = this.loadCache();
      const hash = this.hashAddress(endereco);

      cache[hash] = {
        endereco,
        lat,
        lng,
        display_name,
        timestamp: Date.now()
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      console.log('💾 Cache SAVED:', endereco);
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }

  // Remover do cache
  static remove(endereco: string): void {
    try {
      const cache = this.loadCache();
      const hash = this.hashAddress(endereco);
      delete cache[hash];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Erro ao remover do cache:', error);
    }
  }

  // Limpar cache antigo
  static cleanOldEntries(): void {
    try {
      const cache = this.loadCache();
      const now = Date.now();
      let removed = 0;

      Object.keys(cache).forEach(hash => {
        const age = now - cache[hash].timestamp;
        if (age > TTL_MS) {
          delete cache[hash];
          removed++;
        }
      });

      if (removed > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        console.log(`🧹 Cache limpo: ${removed} entradas removidas`);
      }
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }

  // Obter estatísticas do cache
  static getStats(): { total: number; oldest: Date | null; newest: Date | null } {
    try {
      const cache = this.loadCache();
      const entries = Object.values(cache);

      if (entries.length === 0) {
        return { total: 0, oldest: null, newest: null };
      }

      const timestamps = entries.map(e => e.timestamp);
      return {
        total: entries.length,
        oldest: new Date(Math.min(...timestamps)),
        newest: new Date(Math.max(...timestamps))
      };
    } catch (error) {
      return { total: 0, oldest: null, newest: null };
    }
  }

  // Limpar todo o cache
  static clearAll(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
      console.log('🧹 Cache completamente limpo');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }

  // Helpers privados
  private static loadCache(): Record<string, CachedAddress> {
    try {
      const data = localStorage.getItem(CACHE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      return {};
    }
  }

  private static hashAddress(endereco: string): string {
    // Hash simples normalizado
    return endereco
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s-]/g, '');
  }
}
