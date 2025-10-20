import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaturaIntegra, ReportFilters, ColumnDefinition } from '@/types/gestao-pessoas/travel';

// Temporariamente comentado até que os componentes sejam migrados na FASE 2
// import { AVAILABLE_COLUMNS } from '@/components/gestao-pessoas/travel/ColumnSelector';

// Mock temporário para AVAILABLE_COLUMNS
const AVAILABLE_COLUMNS: ColumnDefinition[] = [];

export function exportarRelatorioExcel(
  dados: FaturaIntegra[],
  colunasSelecionadas: string[],
  filtros: ReportFilters
): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Dados
  const columns = AVAILABLE_COLUMNS.filter(col => colunasSelecionadas.includes(col.key));
  
  const headers = columns.map(col => col.label);
  const rows = dados.map(item => 
    columns.map(col => {
      const value = item[col.key];
      
      if (value === undefined || value === null || value === '') return '-';
      
      if (col.type === 'currency' || col.type === 'number') {
        return Number(value);
      }
      
      if (col.type === 'date' && typeof value === 'string' && value.includes('-')) {
        const [year, month, day] = value.split('-');
        return `${day}/${month}/${year}`;
      }
      
      return value;
    })
  );

  // Adicionar linha de totais
  const totalsRow = columns.map(col => {
    if (col.type === 'currency' || col.type === 'number') {
      const total = dados.reduce((sum, item) => {
        const value = item[col.key];
        return sum + (Number(value) || 0);
      }, 0);
      return total;
    }
    return col.key === columns[0].key ? 'TOTAL' : '';
  });

  const wsData = [headers, ...rows, totalsRow];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Formatar colunas
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const column = columns[C];
    if (!column) continue;

    for (let R = 1; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = ws[cellAddress];
      if (!cell) continue;

      if (column.type === 'currency') {
        cell.z = 'R$ #,##0.00';
      } else if (column.type === 'number') {
        cell.z = '#,##0';
      }
    }
  }

  // Auto-ajustar largura das colunas
  const colWidths = columns.map(col => ({ wch: Math.max(col.label.length + 2, 15) }));
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Dados');

  // Sheet 2: Resumo
  const resumoData = [
    ['RESUMO DO RELATÓRIO'],
    [''],
    ['Total de Registros', dados.length],
    ['Valor Total', dados.reduce((sum, item) => sum + (item.valorpago || 0), 0)],
    [''],
    ['FILTROS APLICADOS'],
    [''],
    ['Período Inicial', filtros.dataInicial || '-'],
    ['Período Final', filtros.dataFinal || '-'],
    ['Agência', filtros.agencia?.join(', ') || 'Todas'],
    ['Tipo', filtros.tipo?.join(', ') || 'Todos'],
    ['CCA', filtros.cca?.join(', ') || 'Todos'],
    ['Viajante', filtros.viajante || '-'],
    ['Dentro da Política', filtros.dentroPolitica || 'Todas'],
    ['Valor Mínimo', filtros.valorMinimo || '-'],
    ['Valor Máximo', filtros.valorMaximo || '-'],
    [''],
    ['DISTRIBUIÇÃO POR AGÊNCIA'],
    [''],
    ['Onfly', dados.filter(d => d.agencia === 'Onfly').length],
    ['Biztrip', dados.filter(d => d.agencia === 'Biztrip').length],
    [''],
    ['CONFORMIDADE COM POLÍTICA'],
    [''],
    ['Dentro da Política', dados.filter(d => d.dentrodapolitica === 'Sim').length],
    ['Fora da Política', dados.filter(d => d.dentrodapolitica === 'Não').length],
  ];

  const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');

  // Sheet 3: Metadados
  const metadadosData = [
    ['METADADOS DO RELATÓRIO'],
    [''],
    ['Data de Geração', new Date().toLocaleString('pt-BR')],
    ['Total de Colunas', colunasSelecionadas.length],
    ['Total de Registros', dados.length],
    [''],
    ['COLUNAS INCLUÍDAS'],
    [''],
    ...columns.map(col => [col.label]),
  ];

  const wsMetadados = XLSX.utils.aoa_to_sheet(metadadosData);
  XLSX.utils.book_append_sheet(wb, wsMetadados, 'Metadados');

  // Salvar arquivo
  const fileName = `relatorio_viagens_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportarRelatorioPDF(
  dados: FaturaIntegra[],
  colunasSelecionadas: string[],
  filtros: ReportFilters
): void {
  const doc = new jsPDF({
    orientation: colunasSelecionadas.length > 8 ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header
  doc.setFontSize(18);
  doc.text('RELATÓRIO DINÂMICO DE VIAGENS', 14, 20);

  doc.setFontSize(10);
  let yPos = 30;
  
  if (filtros.dataInicial || filtros.dataFinal) {
    const inicio = filtros.dataInicial ? new Date(filtros.dataInicial).toLocaleDateString('pt-BR') : '-';
    const fim = filtros.dataFinal ? new Date(filtros.dataFinal).toLocaleDateString('pt-BR') : '-';
    doc.text(`Período: ${inicio} - ${fim}`, 14, yPos);
    yPos += 5;
  }
  
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, yPos);
  yPos += 10;

  // Filtros aplicados
  doc.setFontSize(12);
  doc.text('Filtros Aplicados:', 14, yPos);
  yPos += 5;
  
  doc.setFontSize(9);
  if (filtros.agencia && filtros.agencia.length > 0) {
    doc.text(`Agência: ${filtros.agencia.join(', ')}`, 14, yPos);
    yPos += 4;
  }
  if (filtros.tipo && filtros.tipo.length > 0) {
    doc.text(`Tipo: ${filtros.tipo.join(', ')}`, 14, yPos);
    yPos += 4;
  }
  if (filtros.cca && filtros.cca.length > 0) {
    doc.text(`CCA: ${filtros.cca.join(', ')}`, 14, yPos);
    yPos += 4;
  }
  if (filtros.viajante) {
    doc.text(`Viajante: ${filtros.viajante}`, 14, yPos);
    yPos += 4;
  }
  if (filtros.dentroPolitica && filtros.dentroPolitica !== 'Todas') {
    doc.text(`Dentro da Política: ${filtros.dentroPolitica}`, 14, yPos);
    yPos += 4;
  }
  
  yPos += 5;

  // Preparar dados da tabela
  const columns = AVAILABLE_COLUMNS.filter(col => colunasSelecionadas.includes(col.key));
  
  const headers = columns.map(col => col.label);
  const rows = dados.map(item => 
    columns.map(col => {
      const value = item[col.key];
      
      if (value === undefined || value === null || value === '') return '-';
      
      if (col.type === 'currency') {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(Number(value));
      }
      
      if (col.type === 'number') {
        return Number(value).toLocaleString('pt-BR');
      }
      
      if (col.type === 'date' && typeof value === 'string' && value.includes('-')) {
        const [year, month, day] = value.split('-');
        return `${day}/${month}/${year}`;
      }
      
      return String(value);
    })
  );

  // Adicionar linha de totais
  const totalsRow = columns.map(col => {
    if (col.type === 'currency' || col.type === 'number') {
      const total = dados.reduce((sum, item) => {
        const value = item[col.key];
        return sum + (Number(value) || 0);
      }, 0);
      
      if (col.type === 'currency') {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(total);
      }
      return total.toLocaleString('pt-BR');
    }
    return col.key === columns[0].key ? 'TOTAL' : '';
  });

  rows.push(totalsRow);

  // Tabela
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: yPos,
    styles: {
      fontSize: colunasSelecionadas.length > 10 ? 6 : 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [66, 66, 66],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    didDrawPage: (data) => {
      // Footer
      const pageCount = doc.getNumberOfPages();
      const pageHeight = doc.internal.pageSize.height;
      
      doc.setFontSize(8);
      const totalValue = dados.reduce((sum, item) => sum + (item.valorpago || 0), 0);
      const totalFormatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(totalValue);
      
      doc.text(
        `Total: ${totalFormatted} | ${dados.length} registros`,
        14,
        pageHeight - 10
      );
      
      doc.text(
        `Página ${data.pageNumber} de ${pageCount}`,
        doc.internal.pageSize.width - 40,
        pageHeight - 10
      );
    }
  });

  // Salvar arquivo
  const fileName = `relatorio_viagens_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
