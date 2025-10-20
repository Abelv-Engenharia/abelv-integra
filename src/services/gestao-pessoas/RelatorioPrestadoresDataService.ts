import { ModuloPrestador, DadosModulo, FiltrosRelatorioPrestadores } from '@/types/gestao-pessoas/relatorio-prestadores';
import { MODULOS_CONFIG } from '@/config/gestao-pessoas/colunas-prestadores';
import { mockNotasFiscais } from '@/data/gestao-pessoas/mockNotasFiscais';
import { mockContratos } from '@/data/gestao-pessoas/mockContratos';

export class RelatorioPrestadoresDataService {
  
  static carregarDadosModulo(modulo: ModuloPrestador): any[] {
    const config = MODULOS_CONFIG.find(m => m.id === modulo);
    if (!config) return [];

    if (config.storageKey) {
      const stored = localStorage.getItem(config.storageKey);
      return stored ? JSON.parse(stored) : [];
    }

    return this.getMockData(modulo);
  }

  static carregarDadosCompletos(
    modulosSelecionados: ModuloPrestador[],
    colunasPorModulo: Record<ModuloPrestador, string[]>
  ): DadosModulo[] {
    return modulosSelecionados.map(modulo => {
      const config = MODULOS_CONFIG.find(m => m.id === modulo);
      return {
        modulo,
        titulo: config?.titulo || '',
        dados: this.carregarDadosModulo(modulo),
        colunasSelecionadas: colunasPorModulo[modulo] || []
      };
    });
  }

  static aplicarFiltros(dados: any[], filtros: FiltrosRelatorioPrestadores): any[] {
    let dadosFiltrados = [...dados];

    if (filtros.prestador) {
      dadosFiltrados = dadosFiltrados.filter(d => 
        d.nomecompleto?.toLowerCase().includes(filtros.prestador!.toLowerCase()) ||
        d.nome?.toLowerCase().includes(filtros.prestador!.toLowerCase()) ||
        d.nomeprestador?.toLowerCase().includes(filtros.prestador!.toLowerCase()) ||
        d.prestador?.toLowerCase().includes(filtros.prestador!.toLowerCase())
      );
    }

    if (filtros.empresa) {
      dadosFiltrados = dadosFiltrados.filter(d => 
        d.razaosocial?.toLowerCase().includes(filtros.empresa!.toLowerCase()) ||
        d.nomeempresa?.toLowerCase().includes(filtros.empresa!.toLowerCase()) ||
        d.empresa?.toLowerCase().includes(filtros.empresa!.toLowerCase())
      );
    }

    if (filtros.status && filtros.status.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(d => 
        d.status && filtros.status!.includes(d.status.toLowerCase())
      );
    }

    if (filtros.valorMinimo !== undefined) {
      dadosFiltrados = dadosFiltrados.filter(d => {
        const valor = d.valor || d.valornf || d.valorprestacaoservico || d.total || d.salariobase || 0;
        return Number(valor) >= filtros.valorMinimo!;
      });
    }

    if (filtros.valorMaximo !== undefined) {
      dadosFiltrados = dadosFiltrados.filter(d => {
        const valor = d.valor || d.valornf || d.valorprestacaoservico || d.total || d.salariobase || 0;
        return Number(valor) <= filtros.valorMaximo!;
      });
    }

    if (filtros.dataInicial) {
      dadosFiltrados = dadosFiltrados.filter(d => {
        const data = new Date(d.dataemissao || d.datasolicitacao || d.datainicio || d.datacorte || d.datainiciocontrato || d.enviadoem);
        return data >= filtros.dataInicial!;
      });
    }

    if (filtros.dataFinal) {
      dadosFiltrados = dadosFiltrados.filter(d => {
        const data = new Date(d.dataemissao || d.datasolicitacao || d.datainicio || d.datacorte || d.datainiciocontrato || d.enviadoem);
        return data <= filtros.dataFinal!;
      });
    }

    if (filtros.tiposContrato && filtros.tiposContrato.length > 0) {
      dadosFiltrados = dadosFiltrados.filter(d => {
        if (!d.tipo) return false;
        const tipoOriginal = d.tipo.toLowerCase().includes('aditivo') ? 'aditivo' :
                             d.tipo.toLowerCase().includes('distrato') ? 'distrato' : 'contrato';
        return filtros.tiposContrato!.includes(tipoOriginal);
      });
    }

    if (filtros.statusContrato && filtros.statusContrato !== 'todos') {
      dadosFiltrados = dadosFiltrados.filter(d => 
        d.status?.toLowerCase() === filtros.statusContrato!.toLowerCase()
      );
    }

    return dadosFiltrados;
  }

  private static getMockData(modulo: ModuloPrestador): any[] {
    switch (modulo) {
      case 'contratos':
        return mockContratos.map(c => ({
          ...c,
          tipo: c.tipo === 'contrato' ? 'Contrato de Prestação de Serviço' :
                c.tipo === 'aditivo' ? 'Aditivo de Prestação de Serviço' :
                'Distrato de Prestação de Serviço'
        }));
      
      case 'demonstrativo':
        return [
          { codigo: 'DEM-001', periodocontabil: '2024-01', nome: 'João Silva', nomeempresa: 'Empresa A', salario: 5000, valornf: 5500, enviadoem: new Date('2024-01-15'), status: 'enviado' },
          { codigo: 'DEM-002', periodocontabil: '2024-01', nome: 'Maria Santos', nomeempresa: 'Empresa B', salario: 6000, valornf: 6600, enviadoem: new Date('2024-01-16'), status: 'enviado' },
          { codigo: 'DEM-003', periodocontabil: '2024-02', nome: 'Pedro Costa', nomeempresa: 'Empresa A', salario: 4500, valornf: 4950, enviadoem: new Date('2024-02-15'), status: 'pendente' },
        ];
      
      case 'emissao_nf':
        return mockNotasFiscais.map(nf => ({
          numeronf: nf.numero,
          prestador: nf.nomerepresentante,
          empresa: nf.nomeempresa,
          valor: nf.valor,
          dataemissao: nf.dataemissao,
          status: nf.status
        }));
      
      case 'aprovacao_nf':
        return mockNotasFiscais.filter(nf => nf.status !== 'Rascunho').map(nf => ({
          numeronf: nf.numero,
          prestador: nf.nomerepresentante,
          valor: nf.valor,
          datasolicitacao: nf.criadoem,
          status: nf.status,
          aprovadopor: nf.aprovadopor || '-'
        }));
      
      case 'ferias':
        return [
          { prestador: 'João Silva', datainicio: new Date('2024-01-10'), datafim: new Date('2024-01-24'), dias: 15, status: 'aprovada' },
          { prestador: 'Maria Santos', datainicio: new Date('2024-02-05'), datafim: new Date('2024-02-19'), dias: 15, status: 'pendente' },
        ];
      
      case 'aprovacao_ferias':
        return [
          { prestador: 'João Silva', datainicio: new Date('2024-01-10'), datafim: new Date('2024-01-24'), dias: 15, datasolicitacao: new Date('2023-12-15'), status: 'aprovada', aprovadopor: 'Admin' },
          { prestador: 'Maria Santos', datainicio: new Date('2024-02-05'), datafim: new Date('2024-02-19'), dias: 15, datasolicitacao: new Date('2024-01-20'), status: 'pendente', aprovadopor: '-' },
        ];
      
      default:
        return [];
    }
  }
}
