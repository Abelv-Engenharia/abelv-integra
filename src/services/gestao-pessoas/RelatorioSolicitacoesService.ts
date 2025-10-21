import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { SolicitacaoServico, StatusSolicitacao } from '@/types/gestao-pessoas/solicitacao';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatarNumeroSolicitacao } from '@/utils/gestao-pessoas/formatters';

interface EstatisticasSolicitacoes {
  total: number;
  pendentes: number;
  emandamento: number;
  aprovadas: number;
  concluidas: number;
  rejeitadas: number;
  valortotalestimado: number;
}

export function calcularEstatisticas(dados: SolicitacaoServico[]): EstatisticasSolicitacoes {
  const estatisticas: EstatisticasSolicitacoes = {
    total: dados.length,
    pendentes: 0,
    emandamento: 0,
    aprovadas: 0,
    concluidas: 0,
    rejeitadas: 0,
    valortotalestimado: 0,
  };

  dados.forEach((s) => {
    switch (s.status) {
      case StatusSolicitacao.PENDENTE:
        estatisticas.pendentes++;
        break;
      case StatusSolicitacao.EM_ANDAMENTO:
        estatisticas.emandamento++;
        break;
      case StatusSolicitacao.APROVADO:
        estatisticas.aprovadas++;
        break;
      case StatusSolicitacao.CONCLUIDO:
        estatisticas.concluidas++;
        break;
      case StatusSolicitacao.REJEITADO:
        estatisticas.rejeitadas++;
        break;
    }

    if (s.estimativavalor) {
      estatisticas.valortotalestimado += s.estimativavalor;
    }
  });

  return estatisticas;
}

const getTipoServicoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    voucher_uber: "Voucher Uber",
    locacao_veiculo: "Locação de Veículo",
    cartao_abastecimento: "Cartão Abastecimento",
    veloe_go: "Veloe Go",
    passagens: "Passagens",
    hospedagem: "Hospedagem",
    logistica: "Logística",
    correios_loggi: "Correios/Loggi",
  };
  return labels[tipo] || tipo;
};

const getStatusLabel = (status: StatusSolicitacao) => {
  const labels = {
    [StatusSolicitacao.PENDENTE]: "Pendente",
    [StatusSolicitacao.EM_ANDAMENTO]: "Em Andamento",
    [StatusSolicitacao.APROVADO]: "Aprovado",
    [StatusSolicitacao.CONCLUIDO]: "Concluído",
    [StatusSolicitacao.REJEITADO]: "Rejeitado",
  };
  return labels[status];
};

export function exportarRelatorioPDF(dados: SolicitacaoServico[], filtros?: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Título
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Solicitações de Serviços', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Data de geração
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );
  yPosition += 15;

  // Estatísticas
  const estatisticas = calcularEstatisticas(dados);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo Executivo', 14, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total de Solicitações: ${estatisticas.total}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Pendentes: ${estatisticas.pendentes}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Em Andamento: ${estatisticas.emandamento}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Aprovadas: ${estatisticas.aprovadas}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Concluídas: ${estatisticas.concluidas}`, 14, yPosition);
  yPosition += 6;
  doc.text(`Rejeitadas: ${estatisticas.rejeitadas}`, 14, yPosition);
  yPosition += 6;
  doc.text(
    `Valor Total Estimado: ${estatisticas.valortotalestimado.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })}`,
    14,
    yPosition
  );
  yPosition += 10;

  // Tabela resumida
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalhamento das Solicitações', 14, yPosition);
  yPosition += 5;

  const tabelaResumo = dados.map((s) => [
    formatarNumeroSolicitacao(s.numeroSolicitacao),
    s.solicitante,
    format(new Date(s.dataSolicitacao), 'dd/MM/yyyy', { locale: ptBR }),
    s.dataconclusao ? format(new Date(s.dataconclusao), 'dd/MM/yyyy', { locale: ptBR }) : '-',
    'cca' in s ? (s as any).cca : '-',
    getTipoServicoLabel(s.tipoServico),
    getStatusLabel(s.status),
    s.estimativavalor
      ? s.estimativavalor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : '-',
  ]);

  autoTable(doc, {
    head: [['Nº', 'Solicitante', 'Dt. Abertura', 'Dt. Conclusão', 'CCA', 'Tipo', 'Status', 'Valor']],
    body: tabelaResumo,
    startY: yPosition,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
  });

  // Detalhamento completo de cada solicitação
  dados.forEach((solicitacao, index) => {
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Solicitação ${index + 1} de ${dados.length}`, 14, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.text(`ID: ${solicitacao.id}`, 14, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const detalhes = [
      `Solicitante: ${solicitacao.solicitante}`,
      `Data de Abertura: ${format(new Date(solicitacao.dataSolicitacao), "dd/MM/yyyy HH:mm", {
        locale: ptBR,
      })}`,
      `Status: ${getStatusLabel(solicitacao.status)}`,
      `Centro de Custo: ${solicitacao.centroCusto}`,
      `Tipo de Serviço: ${getTipoServicoLabel(solicitacao.tipoServico)}`,
      `Prioridade: ${solicitacao.prioridade}`,
    ];

    if ('cca' in solicitacao) {
      detalhes.push(`CCA: ${(solicitacao as any).cca}`);
    }

    if (solicitacao.estimativavalor) {
      detalhes.push(
        `Estimativa de Valor: ${solicitacao.estimativavalor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`
      );
    }

    detalhes.forEach((detalhe) => {
      doc.text(detalhe, 14, yPosition);
      yPosition += 6;
    });

    if (solicitacao.observacoes) {
      yPosition += 3;
      doc.setFont('helvetica', 'bold');
      doc.text('Observações:', 14, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const splitObservacoes = doc.splitTextToSize(solicitacao.observacoes, pageWidth - 28);
      doc.text(splitObservacoes, 14, yPosition);
      yPosition += splitObservacoes.length * 5 + 3;
    }

    if (solicitacao.observacoesgestao) {
      yPosition += 3;
      doc.setFont('helvetica', 'bold');
      doc.text('Observações de Gestão:', 14, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const splitGestao = doc.splitTextToSize(solicitacao.observacoesgestao, pageWidth - 28);
      doc.text(splitGestao, 14, yPosition);
      yPosition += splitGestao.length * 5 + 3;
    }

    if (solicitacao.dataaprovacao) {
      yPosition += 3;
      doc.setFont('helvetica', 'bold');
      doc.text('Aprovação:', 14, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Data: ${format(new Date(solicitacao.dataaprovacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
        14,
        yPosition
      );
      yPosition += 6;
      if (solicitacao.aprovadopor) {
        doc.text(`Aprovado por: ${solicitacao.aprovadopor}`, 14, yPosition);
        yPosition += 6;
      }
      if (solicitacao.justificativaaprovacao) {
        doc.text('Justificativa:', 14, yPosition);
        yPosition += 6;
        const splitJust = doc.splitTextToSize(solicitacao.justificativaaprovacao, pageWidth - 28);
        doc.text(splitJust, 14, yPosition);
        yPosition += splitJust.length * 5;
      }
    }

    if (solicitacao.justificativareprovacao) {
      yPosition += 3;
      doc.setFont('helvetica', 'bold');
      doc.text('Justificativa de Reprovação:', 14, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const splitReprova = doc.splitTextToSize(
        solicitacao.justificativareprovacao,
        pageWidth - 28
      );
      doc.text(splitReprova, 14, yPosition);
      yPosition += splitReprova.length * 5;
    }

    if (solicitacao.dataconclusao) {
      yPosition += 3;
      doc.setFont('helvetica', 'bold');
      doc.text('Conclusão:', 14, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Data: ${format(new Date(solicitacao.dataconclusao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
        14,
        yPosition
      );
      yPosition += 6;
      if (solicitacao.concluidopor) {
        doc.text(`Concluído por: ${solicitacao.concluidopor}`, 14, yPosition);
        yPosition += 6;
      }
      if (solicitacao.observacoesconclusao) {
        doc.text('Observações:', 14, yPosition);
        yPosition += 6;
        const splitConc = doc.splitTextToSize(solicitacao.observacoesconclusao, pageWidth - 28);
        doc.text(splitConc, 14, yPosition);
      }
    }
  });

  doc.save(`relatorio-solicitacoes-${format(new Date(), 'yyyyMMdd-HHmmss')}.pdf`);
}

export function exportarRelatorioExcel(dados: SolicitacaoServico[]) {
  const workbook = XLSX.utils.book_new();

  // Aba 1: Resumo
  const estatisticas = calcularEstatisticas(dados);
  const resumoData = [
    ['Relatório de Solicitações de Serviços'],
    [`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`],
    [],
    ['Resumo Executivo'],
    ['Total de Solicitações', estatisticas.total],
    ['Pendentes', estatisticas.pendentes],
    ['Em Andamento', estatisticas.emandamento],
    ['Aprovadas', estatisticas.aprovadas],
    ['Concluídas', estatisticas.concluidas],
    ['Rejeitadas', estatisticas.rejeitadas],
    [
      'Valor Total Estimado',
      estatisticas.valortotalestimado.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
    ],
  ];
  const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
  XLSX.utils.book_append_sheet(workbook, wsResumo, 'Resumo');

  // Aba 2: Todas Solicitações
  const todasData = dados.map((s) => ({
    ID: s.id,
    Solicitante: s.solicitante,
    'Data Abertura': format(new Date(s.dataSolicitacao), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
    'Data Conclusão': s.dataconclusao
      ? format(new Date(s.dataconclusao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
      : '',
    CCA: 'cca' in s ? (s as any).cca : '',
    'Centro de Custo': s.centroCusto,
    'Tipo de Serviço': getTipoServicoLabel(s.tipoServico),
    Status: getStatusLabel(s.status),
    Prioridade: s.prioridade,
    'Valor Estimado': s.estimativavalor || 0,
    'Responsável Aprovação': s.responsavelaprovacao || '',
    'Aprovado Por': s.aprovadopor || '',
    Observações: s.observacoes || '',
    'Obs. Gestão': s.observacoesgestao || '',
    'Obs. Conclusão': s.observacoesconclusao || '',
  }));
  const wsTodas = XLSX.utils.json_to_sheet(todasData);
  XLSX.utils.book_append_sheet(workbook, wsTodas, 'Todas Solicitações');

  // Aba 3: Detalhes Completos
  const detalhesData = dados.map((s) => {
    const base: any = {
      ID: s.id,
      Solicitante: s.solicitante,
      'Data Abertura': format(new Date(s.dataSolicitacao), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
      'Data Conclusão': s.dataconclusao
        ? format(new Date(s.dataconclusao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
        : '',
      CCA: 'cca' in s ? (s as any).cca : '',
      'Centro de Custo': s.centroCusto,
      'Tipo de Serviço': getTipoServicoLabel(s.tipoServico),
      Status: getStatusLabel(s.status),
      Prioridade: s.prioridade,
      'Valor Estimado': s.estimativavalor || 0,
      Observações: s.observacoes || '',
      'Obs. Gestão': s.observacoesgestao || '',
      'Resp. Aprovação': s.responsavelaprovacao || '',
      'Data Aprovação': s.dataaprovacao
        ? format(new Date(s.dataaprovacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
        : '',
      'Aprovado Por': s.aprovadopor || '',
      'Just. Aprovação': s.justificativaaprovacao || '',
      'Just. Reprovação': s.justificativareprovacao || '',
      'Concluído Por': s.concluidopor || '',
      'Obs. Conclusão': s.observacoesconclusao || '',
    };

    return base;
  });
  const wsDetalhes = XLSX.utils.json_to_sheet(detalhesData);
  XLSX.utils.book_append_sheet(workbook, wsDetalhes, 'Detalhes Completos');

  // Salvar arquivo
  XLSX.writeFile(workbook, `relatorio-solicitacoes-${format(new Date(), 'yyyyMMdd-HHmmss')}.xlsx`);
}
