import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const exportarRelatorioPDF = (
  tipo: string,
  dados: any[],
  colunas: string[],
  titulo: string,
  filtros?: any
) => {
  const doc = new jsPDF();
  
  // Cabeçalho
  doc.setFontSize(18);
  doc.text(titulo, 14, 20);
  
  doc.setFontSize(10);
  doc.text(`Data de Geração: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
  
  // Filtros aplicados
  if (filtros) {
    let y = 35;
    doc.setFontSize(9);
    doc.text('Filtros Aplicados:', 14, y);
    y += 5;
    
    if (filtros.periodo) {
      doc.text(`Período: ${filtros.periodo}`, 14, y);
      y += 5;
    }
    if (filtros.status && filtros.status.length > 0) {
      doc.text(`Status: ${filtros.status.join(', ')}`, 14, y);
      y += 5;
    }
  }
  
  // Tabela
  autoTable(doc, {
    startY: filtros ? 50 : 40,
    head: [colunas],
    body: dados.map(item => colunas.map(col => item[col.toLowerCase()] || '')),
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 8 }
  });
  
  // Rodapé
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`relatorio-${tipo}-${format(new Date(), 'yyyyMMdd-HHmm')}.pdf`);
};

export const exportarRelatorioExcel = (
  dados: any[],
  nomeaba: string,
  nomearquivo: string
) => {
  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, nomeaba);
  
  // Adicionar largura automática nas colunas
  const maxWidth = dados.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
  worksheet['!cols'] = Array(maxWidth).fill({ width: 15 });
  
  XLSX.writeFile(workbook, `${nomearquivo}-${format(new Date(), 'yyyyMMdd-HHmm')}.xlsx`);
};

export const exportarMultiplasAbas = (
  abas: { nome: string; dados: any[] }[],
  nomearquivo: string
) => {
  const workbook = XLSX.utils.book_new();
  
  abas.forEach(aba => {
    const worksheet = XLSX.utils.json_to_sheet(aba.dados);
    worksheet['!cols'] = Array(20).fill({ width: 15 });
    XLSX.utils.book_append_sheet(workbook, worksheet, aba.nome);
  });
  
  XLSX.writeFile(workbook, `${nomearquivo}-${format(new Date(), 'yyyyMMdd-HHmm')}.xlsx`);
};
