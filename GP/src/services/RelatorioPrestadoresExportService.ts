import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DadosModulo, FiltrosRelatorioPrestadores, ColunaRelatorio } from '@/types/relatorio-prestadores';
import { MODULOS_CONFIG } from '@/config/colunas-prestadores';

export class RelatorioPrestadoresExportService {
  
  static exportarExcel(dadosModulos: DadosModulo[], filtros: FiltrosRelatorioPrestadores) {
    const wb = XLSX.utils.book_new();

    dadosModulos.forEach(modulo => {
      const colunas = MODULOS_CONFIG.find(m => m.id === modulo.modulo)?.colunas || [];
      const colunasSelecionadas = colunas.filter(c => modulo.colunasSelecionadas.includes(c.key));
      
      const headers = colunasSelecionadas.map(c => c.label);
      const rows = modulo.dados.map(item => 
        colunasSelecionadas.map(col => this.formatarValor(item[col.key], col.type))
      );

      const totalsRow = this.calcularTotais(modulo.dados, colunasSelecionadas);
      
      const wsData = [headers, ...rows];
      if (totalsRow.some(t => t !== '' && t !== 'TOTAL')) {
        wsData.push(totalsRow);
      }
      
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      const colWidths = colunasSelecionadas.map(c => ({ wch: 20 }));
      ws['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(wb, ws, modulo.titulo.substring(0, 31));
    });

    this.adicionarAbaResumo(wb, dadosModulos, filtros);

    const fileName = `relatorio_prestadores_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  static exportarPDF(dadosModulos: DadosModulo[], filtros: FiltrosRelatorioPrestadores) {
    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(18);
    doc.text('RELATÓRIO PRESTADORES DE SERVIÇO', 14, 20);
    
    let yPos = 35;

    dadosModulos.forEach((modulo, index) => {
      if (index > 0) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text(modulo.titulo.toUpperCase(), 14, yPos);
      yPos += 10;

      const colunas = MODULOS_CONFIG.find(m => m.id === modulo.modulo)?.colunas || [];
      const colunasSelecionadas = colunas.filter(c => modulo.colunasSelecionadas.includes(c.key));
      
      const headers = colunasSelecionadas.map(c => c.label);
      const rows = modulo.dados.map(item => 
        colunasSelecionadas.map(col => this.formatarValor(item[col.key], col.type))
      );

      const totalsRow = this.calcularTotais(modulo.dados, colunasSelecionadas);
      if (totalsRow.some(t => t !== '' && t !== 'TOTAL')) {
        rows.push(totalsRow);
      }

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: yPos,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [66, 66, 66] },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    });

    const fileName = `relatorio_prestadores_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  private static formatarValor(valor: any, tipo: string): string {
    if (valor === undefined || valor === null) return '-';
    
    switch (tipo) {
      case 'currency':
        return Number(valor).toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        });
      case 'date':
        return new Date(valor).toLocaleDateString('pt-BR');
      case 'number':
        return Number(valor).toLocaleString('pt-BR');
      case 'boolean':
        return valor ? 'Sim' : 'Não';
      default:
        return String(valor);
    }
  }

  private static calcularTotais(dados: any[], colunas: ColunaRelatorio[]): string[] {
    return colunas.map((col, index) => {
      if (col.type === 'currency' || col.type === 'number') {
        const total = dados.reduce((sum, item) => 
          sum + (Number(item[col.key]) || 0), 0
        );
        return index === 0 ? 'TOTAL' : this.formatarValor(total, col.type);
      }
      return index === 0 ? 'TOTAL' : '';
    });
  }

  private static adicionarAbaResumo(
    wb: XLSX.WorkBook, 
    dadosModulos: DadosModulo[], 
    filtros: FiltrosRelatorioPrestadores
  ) {
    const resumoData = [
      ['RESUMO DO RELATÓRIO'],
      [''],
      ['Data de Geração', new Date().toLocaleString('pt-BR')],
      [''],
      ['MÓDULOS INCLUÍDOS'],
      [''],
      ...dadosModulos.map(m => [m.titulo, `${m.dados.length} registros`]),
      [''],
      ['FILTROS APLICADOS'],
      [''],
      ['Prestador', filtros.prestador || '-'],
      ['Empresa', filtros.empresa || '-'],
      ['Data Inicial', filtros.dataInicial?.toLocaleDateString('pt-BR') || '-'],
      ['Data Final', filtros.dataFinal?.toLocaleDateString('pt-BR') || '-'],
      ['Valor Mínimo', filtros.valorMinimo ? `R$ ${filtros.valorMinimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'],
      ['Valor Máximo', filtros.valorMaximo ? `R$ ${filtros.valorMaximo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(resumoData);
    ws['!cols'] = [{ wch: 30 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Resumo');
  }
}
