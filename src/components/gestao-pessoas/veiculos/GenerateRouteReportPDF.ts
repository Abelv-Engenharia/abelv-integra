import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CalculoEstimativaCartao } from '@/types/route';

export const generateRouteReportPDF = (calculo: CalculoEstimativaCartao) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Estimativa de Custo de Combustível', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${new Date(calculo.dataCalculo).toLocaleDateString('pt-BR')}`, pageWidth / 2, 28, { align: 'center' });
  
  // Dados do Veículo
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Veículo', 14, 40);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  let yPos = 48;
  
  doc.text(`Placa: ${calculo.placa}`, 14, yPos);
  doc.text(`Modelo: ${calculo.modelo}`, 100, yPos);
  yPos += 7;
  
  doc.text(`Consumo Médio: ${calculo.consumoKmL} km/l`, 14, yPos);
  doc.text(`Tipo Combustível: ${calculo.tipoCombustivel}`, 100, yPos);
  yPos += 7;
  
  doc.text(`Preço Combustível: R$ ${calculo.precoCombustivelPorLitro.toFixed(2)}/L`, 14, yPos);
  doc.text(`Margem Segurança: ${calculo.margemSegurancaPct}%`, 100, yPos);
  yPos += 12;
  
  // Rota Principal
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Rota Principal', 14, yPos);
  yPos += 8;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Trajeto', 'Distância', 'Tempo', 'Freq. Diária', 'Viagens/Mês', 'Dist. Mensal', 'Custo Mensal']],
    body: [[
      `${calculo.rotaPrincipal.origem} → ${calculo.rotaPrincipal.destino}`,
      `${calculo.rotaPrincipal.distanciaKm} km`,
      `${calculo.rotaPrincipal.duracaoMin} min`,
      `${calculo.rotaPrincipal.frequenciaDiaria}x`,
      `${calculo.rotaPrincipal.viagensMensaisIda + calculo.rotaPrincipal.viagensMensaisVolta}x`,
      `${calculo.rotaPrincipal.distanciaMensalTotal.toLocaleString('pt-BR')} km`,
      `R$ ${calculo.rotaPrincipal.custoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]],
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 8 }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Trajetos Adicionais
  if (calculo.trajetosAdicionais.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Trajetos Adicionais', 14, yPos);
    yPos += 8;
    
    const trajetosData = calculo.trajetosAdicionais.map(t => [
      `${t.origem} → ${t.destino}`,
      `${t.distanciaKm} km`,
      `${t.viagensMensaisIda + t.viagensMensaisVolta}x/mês`,
      `${t.distanciaMensalTotal.toLocaleString('pt-BR')} km`,
      `R$ ${t.custoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Trajeto', 'Distância', 'Freq. Mensal', 'Dist. Mensal', 'Custo Mensal']],
      body: trajetosData,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] },
      styles: { fontSize: 8 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Totalizadores
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Totalizadores', 14, yPos);
  yPos += 8;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Item', 'Valor']],
    body: [
      ['Distância Total Mensal', `${calculo.distanciaTotalMensalKm.toLocaleString('pt-BR')} km`],
      ['Litros Necessários', `${calculo.litrosNecessarios.toLocaleString('pt-BR')} L`],
      ['Custo Base', `R$ ${calculo.custoEstimadoBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      [`Margem Segurança (${calculo.margemSegurancaPct}%)`, `R$ ${calculo.valorMargemSeguranca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['ESTIMATIVA TOTAL', `R$ ${calculo.custoEstimadoComMargem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129] },
    styles: { fontSize: 10 }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Comparação com Limite Atual
  if (calculo.limiteAtualCartao) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Comparação com Limite Atual', 14, yPos);
    yPos += 8;
    
    const statusSuficiente = calculo.diferencaLimite! >= 0;
    
    autoTable(doc, {
      startY: yPos,
      head: [['Item', 'Valor']],
      body: [
        ['Limite Atual do Cartão', `R$ ${calculo.limiteAtualCartao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
        ['Estimativa com Margem', `R$ ${calculo.custoEstimadoComMargem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
        ['Diferença', `R$ ${Math.abs(calculo.diferencaLimite!).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
        ['Status', statusSuficiente ? 'SUFICIENTE' : 'INSUFICIENTE']
      ],
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Observações
  if (calculo.observacoes) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Observações', 14, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(calculo.observacoes, pageWidth - 28);
    doc.text(splitText, 14, yPos);
  }
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Gerado em ${new Date().toLocaleString('pt-BR')} - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Salvar PDF
  doc.save(`estimativa-rota-${calculo.placa}-${new Date().toISOString().split('T')[0]}.pdf`);
};
