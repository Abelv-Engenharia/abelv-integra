import { DemonstrativoPrestador, KPIData, FiltrosDashboard, DadosGraficoMensal, TopPrestador } from '@/types/gestao-pessoas/dashboard-prestadores';

export class DashboardPrestadoresService {
  
  private static STORAGE_KEY = 'demonstrativos_prestadores';
  
  static carregarDados(): DemonstrativoPrestador[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return this.getDadosMock();
  }
  
  static calcularKPIs(dados: DemonstrativoPrestador[]): KPIData {
    return {
      totalnf: dados.reduce((sum, d) => sum + d.valornf, 0),
      totalajudaaluguel: dados.reduce((sum, d) => sum + d.ajudaaluguel, 0),
      totalreembolsoconvenio: dados.reduce((sum, d) => sum + d.reembolsoconvenio, 0),
      totaldescontoconvenio: dados.reduce((sum, d) => sum + d.descontoconvenio, 0),
      totalmultas: dados.reduce((sum, d) => sum + d.multasdescontos, 0),
      totaldescontoabelvrun: dados.reduce((sum, d) => sum + d.descontoabelvrun, 0),
    };
  }
  
  static aplicarFiltros(
    dados: DemonstrativoPrestador[], 
    filtros: FiltrosDashboard
  ): DemonstrativoPrestador[] {
    let resultado = [...dados];
    
    if (filtros.datainicial) {
      resultado = resultado.filter(d => 
        new Date(d.admissao) >= filtros.datainicial!
      );
    }
    
    if (filtros.datafinal) {
      resultado = resultado.filter(d => 
        new Date(d.admissao) <= filtros.datafinal!
      );
    }
    
    if (filtros.empresas && filtros.empresas.length > 0) {
      resultado = resultado.filter(d => 
        filtros.empresas!.includes(d.nomeempresa)
      );
    }
    
    if (filtros.prestador) {
      resultado = resultado.filter(d => 
        d.nome.toLowerCase().includes(filtros.prestador!.toLowerCase())
      );
    }
    
    if (filtros.obra) {
      resultado = resultado.filter(d => 
        d.obra.toLowerCase().includes(filtros.obra!.toLowerCase())
      );
    }
    
    return resultado;
  }
  
  static obterTop10Prestadores(dados: DemonstrativoPrestador[]): TopPrestador[] {
    const agregado = new Map<string, { nome: string; empresa: string; total: number }>();
    
    dados.forEach(d => {
      const chave = `${d.nome}-${d.nomeempresa}`;
      const atual = agregado.get(chave) || { nome: d.nome, empresa: d.nomeempresa, total: 0 };
      atual.total += d.valornf;
      agregado.set(chave, atual);
    });
    
    return Array.from(agregado.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map(p => ({ nome: p.nome, empresa: p.empresa, totalnf: p.total }));
  }
  
  static obterDadosMensais(dados: DemonstrativoPrestador[]): DadosGraficoMensal[] {
    const porMes = new Map<string, DadosGraficoMensal>();
    
    dados.forEach(d => {
      const mes = d.mes || new Date(d.admissao).toISOString().substring(0, 7);
      const atual = porMes.get(mes) || { mes, nf: 0, ajudaaluguel: 0, reembolso: 0, descontos: 0 };
      
      atual.nf += d.valornf;
      atual.ajudaaluguel += d.ajudaaluguel;
      atual.reembolso += d.reembolsoconvenio;
      atual.descontos += d.descontoconvenio + d.multasdescontos + d.descontoabelvrun;
      
      porMes.set(mes, atual);
    });
    
    return Array.from(porMes.values())
      .sort((a, b) => a.mes.localeCompare(b.mes))
      .slice(-6);
  }
  
  private static getDadosMock(): DemonstrativoPrestador[] {
    const meses = ['2024-05', '2024-06', '2024-07', '2024-08', '2024-09', '2024-10'];
    const empresas = ['Construtora ABC Ltda', 'Obras e Construções XYZ', 'Engenharia Moderna SA', 'BuildTech Construtora'];
    const obras = ['Obra Centro', 'Obra Norte', 'Obra Sul', 'Projeto Alfa', 'Projeto Beta'];
    const nomes = [
      'João da Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira',
      'Juliana Souza', 'Roberto Lima', 'Fernanda Alves', 'Ricardo Mendes', 'Patrícia Rocha',
      'Lucas Cardoso', 'Mariana Dias', 'Gabriel Martins', 'Camila Ribeiro', 'Felipe Araujo',
      'Beatriz Carvalho', 'Rafael Barbosa', 'Amanda Correia', 'Bruno Teixeira', 'Larissa Pinto'
    ];
    
    return nomes.map((nome, index) => {
      const mesIndex = index % meses.length;
      const empresaIndex = index % empresas.length;
      const obraIndex = index % obras.length;
      
      const salario = 2000 + Math.random() * 3000;
      const ajudaaluguel = Math.random() > 0.5 ? 300 + Math.random() * 400 : 0;
      const reembolsoconvenio = Math.random() > 0.6 ? 100 + Math.random() * 300 : 0;
      const descontoconvenio = Math.random() > 0.3 ? 50 + Math.random() * 200 : 0;
      const multasdescontos = Math.random() > 0.7 ? 30 + Math.random() * 150 : 0;
      const descontoabelvrun = Math.random() > 0.5 ? 25 + Math.random() * 100 : 0;
      const premiacaonexa = Math.random() > 0.4 ? salario * 0.1 : 0;
      const ajudacustoobra = Math.random() > 0.6 ? 200 + Math.random() * 300 : 0;
      
      const valornf = salario + premiacaonexa + ajudacustoobra + ajudaaluguel + reembolsoconvenio;
      const valorliquido = valornf - descontoconvenio - multasdescontos - descontoabelvrun;
      
      return {
        id: `${index + 1}`,
        codigo: `00${index + 1}`.slice(-3),
        nome,
        obra: obras[obraIndex],
        funcao: ['Pedreiro', 'Eletricista', 'Encanador', 'Pintor', 'Servente'][index % 5],
        nomeempresa: empresas[empresaIndex],
        cpf: `${Math.floor(Math.random() * 1000000000)}`.padStart(11, '0'),
        datanascimento: `${15 + (index % 15)}/0${(index % 9) + 1}/198${index % 10}`,
        admissao: `01/${String(mesIndex + 1).padStart(2, '0')}/2024`,
        salario: Number(salario.toFixed(2)),
        premiacaonexa: Number(premiacaonexa.toFixed(2)),
        ajudacustoobra: Number(ajudacustoobra.toFixed(2)),
        multasdescontos: Number(multasdescontos.toFixed(2)),
        ajudaaluguel: Number(ajudaaluguel.toFixed(2)),
        descontoconvenio: Number(descontoconvenio.toFixed(2)),
        reembolsoconvenio: Number(reembolsoconvenio.toFixed(2)),
        descontoabelvrun: Number(descontoabelvrun.toFixed(2)),
        valornf: Number(valornf.toFixed(2)),
        mes: meses[mesIndex],
        valorliquido: Number(valorliquido.toFixed(2))
      };
    });
  }
}
