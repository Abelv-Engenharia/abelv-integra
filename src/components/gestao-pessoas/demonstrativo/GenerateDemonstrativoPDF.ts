import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DemonstrativoItem {
  codigo: string;
  descricao: string;
  proventos: number;
  descontos: number;
}

interface DemonstrativoData {
  prestador: string;
  email: string;
  periodo: string;
  items: DemonstrativoItem[];
}

export const generateDemonstrativoPDF = async (data: DemonstrativoData): Promise<jsPDF> => {
  const doc = new jsPDF();
  
  // Configurações
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Adicionar logo da ABELV
  try {
    const response = await fetch('/abelv-logo.png');
    const blob = await response.blob();
    const reader = new FileReader();
    
    await new Promise((resolve) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        doc.addImage(base64data, 'PNG', 14, 10, 40, 15);
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erro ao carregar logo:', error);
  }
  
  // Cabeçalho
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('DEMONSTRATIVO DE PRESTAÇÃO DE SERVIÇO', pageWidth / 2, 32, { align: 'center' });
  
  // Nome do Prestador
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`NOME: ${data.prestador}`, 14, 47);
  doc.text(`PERÍODO: ${data.periodo}`, 14, 54);
  
  // Separar proventos e descontos
  const totalProventos = data.items.reduce((sum, item) => sum + item.proventos, 0);
  const totalDescontos = data.items.reduce((sum, item) => sum + item.descontos, 0);
  const liquidoReceber = totalProventos - totalDescontos;
  
  // Criar dados da tabela
  const tableData = data.items.map(item => [
    item.codigo,
    item.descricao,
    item.proventos > 0 ? `R$ ${item.proventos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
    item.descontos > 0 ? `R$ ${item.descontos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'
  ]);
  
  // Adicionar tabela
  autoTable(doc, {
    startY: 62,
    head: [['Cód.', 'Descrição', 'Proventos', 'Descontos']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 20 },
      1: { halign: 'left', cellWidth: 90 },
      2: { halign: 'right', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 40 }
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    }
  });
  
  // Posição após a tabela
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Totalizadores
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  
  // Total dos Vencimentos
  doc.text('Total dos Vencimentos:', 110, finalY);
  doc.text(`R$ ${totalProventos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 180, finalY, { align: 'right' });
  
  // Total dos Descontos
  doc.text('Total dos Descontos:', 110, finalY + 7);
  doc.text(`R$ ${totalDescontos.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 180, finalY + 7, { align: 'right' });
  
  // Linha separadora
  doc.setDrawColor(0, 0, 0);
  doc.line(110, finalY + 10, 180, finalY + 10);
  
  // Líquido a Receber (destaque)
  doc.setFontSize(12);
  doc.setTextColor(0, 100, 0);
  doc.text('Líquido a Receber:', 110, finalY + 17);
  doc.text(`R$ ${liquidoReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 180, finalY + 17, { align: 'right' });
  
  // Rodapé
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  const dataGeracao = format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  doc.text(`Documento gerado em: ${dataGeracao}`, 14, doc.internal.pageSize.getHeight() - 10);
  
  return doc;
};

export const downloadDemonstrativoPDF = async (data: DemonstrativoData) => {
  const doc = await generateDemonstrativoPDF(data);
  const fileName = `Demonstrativo_${data.prestador.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};
