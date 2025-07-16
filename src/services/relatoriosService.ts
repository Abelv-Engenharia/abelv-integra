import { RelatorioConfig } from '@/hooks/useRelatoriosManager';

class RelatoriosService {
  private relatorios: RelatorioConfig[] = [];
  private observers: Array<(relatorios: RelatorioConfig[]) => void> = [];

  constructor() {
    // Registra os relatórios iniciais baseados na estrutura atual
    this.initializeRelatorios();
  }

  private initializeRelatorios() {
    const relatoriosIniciais: RelatorioConfig[] = [
      { value: 'ocorrencias', label: 'Relatório de Ocorrências', path: '/relatorios/ocorrencias' },
      { value: 'desvios', label: 'Relatório de Desvios', path: '/relatorios/desvios' },
      { value: 'treinamentos', label: 'Relatório de Treinamentos', path: '/relatorios/treinamentos' },
      { value: 'idsms', label: 'Relatório IDSMS', path: '/relatorios/idsms' },
      { value: 'hsa', label: 'Relatório de Execução HSA', path: '/relatorios/hsa' },
    ];
    
    this.relatorios = relatoriosIniciais;
    this.notifyObservers();
  }

  // Registra um novo relatório
  registrarRelatorio(config: RelatorioConfig) {
    const exists = this.relatorios.some(r => r.value === config.value);
    if (!exists) {
      this.relatorios.push(config);
      this.notifyObservers();
    }
  }

  // Remove um relatório
  removerRelatorio(value: string) {
    this.relatorios = this.relatorios.filter(r => r.value !== value);
    this.notifyObservers();
  }

  // Obter todos os relatórios
  getRelatorios(): RelatorioConfig[] {
    return [...this.relatorios];
  }

  // Obter um relatório específico
  getRelatorio(value: string): RelatorioConfig | undefined {
    return this.relatorios.find(r => r.value === value);
  }

  // Subscrever para mudanças
  subscribe(observer: (relatorios: RelatorioConfig[]) => void) {
    this.observers.push(observer);
    observer(this.relatorios); // Notifica imediatamente
    
    // Retorna função para cancelar a subscrição
    return () => {
      this.observers = this.observers.filter(obs => obs !== observer);
    };
  }

  // Notifica todos os observadores
  private notifyObservers() {
    this.observers.forEach(observer => observer(this.relatorios));
  }
}

// Singleton instance
export const relatoriosService = new RelatoriosService();