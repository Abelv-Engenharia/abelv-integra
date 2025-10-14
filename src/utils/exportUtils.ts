import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportarParaExcel = (
  dados: Record<string, any>[],
  nomeArquivo: string,
  colunas: string[]
) => {
  // Criar worksheet com os dados
  const ws = XLSX.utils.json_to_sheet(dados, { header: colunas });
  
  // Criar workbook e adicionar worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dados');
  
  // Exportar arquivo
  XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
};

export const exportarParaPDF = async (
  titulo: string,
  dadosTabela: string[][],
  colunas: string[],
  chartRef?: React.RefObject<HTMLDivElement>
) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(16);
  doc.text(titulo, 14, 20);
  
  // Adicionar gráfico se fornecido
  let yPosition = 30;
  if (chartRef?.current) {
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      doc.addImage(imgData, 'PNG', 14, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    } catch (error) {
      console.error('Erro ao capturar gráfico:', error);
    }
  }
  
  // Adicionar tabela
  (doc as any).autoTable({
    startY: yPosition,
    head: [colunas],
    body: dadosTabela,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 8 }
  });
  
  // Salvar PDF
  doc.save(`${titulo.replace(/\s/g, '_')}.pdf`);
};
