import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export const exportarParaExcel = (
  dados: any[],
  nomeArquivo: string,
  colunas: string[]
) => {
  const worksheet = XLSX.utils.json_to_sheet(dados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

  // Ajustar largura das colunas
  const maxWidth = colunas.map((col) => {
    const header = col.length;
    const values = dados.map((row) => String(row[col] || "").length);
    return Math.max(header, ...values);
  });

  worksheet["!cols"] = maxWidth.map((w) => ({ wch: w + 2 }));

  XLSX.writeFile(workbook, `${nomeArquivo}.xlsx`);
};

export const exportarParaPDF = async (
  titulo: string,
  dados: any[][],
  colunas: string[],
  chartRef?: React.RefObject<HTMLDivElement>
) => {
  const doc = new jsPDF();

  // Adicionar título
  doc.setFontSize(16);
  doc.text(titulo, 14, 15);

  // Adicionar data
  doc.setFontSize(10);
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 14, 22);

  // Adicionar tabela
  autoTable(doc, {
    head: [colunas],
    body: dados,
    startY: 28,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  // Adicionar gráfico se fornecido
  if (chartRef?.current) {
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const finalY = (doc as any).lastAutoTable.finalY || 28;
      const pageHeight = doc.internal.pageSize.height;

      // Adicionar nova página se necessário
      if (finalY + imgHeight + 20 > pageHeight) {
        doc.addPage();
        doc.addImage(imgData, "PNG", 15, 15, imgWidth, imgHeight);
      } else {
        doc.addImage(imgData, "PNG", 15, finalY + 10, imgWidth, imgHeight);
      }
    } catch (error) {
      console.error("Erro ao capturar gráfico:", error);
    }
  }

  doc.save(`${titulo.replace(/\s+/g, "_")}.pdf`);
};
