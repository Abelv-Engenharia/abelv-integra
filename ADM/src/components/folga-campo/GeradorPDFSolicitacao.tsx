import React from 'react';
import jsPDF from 'jspdf';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DadosFormulario {
  // Dados gerais
  obra_projeto: string;
  cca: string;
  nome_colaborador: string;
  matricula: string;
  funcao: string;
  telefone?: string;
  
  // Período
  data_inicio: string;
  data_fim: string;
  cidade_destino: string;
  uf_destino: string;
  dias_folga?: number;
  
  // Itinerário IDA
  ida_data: string;
  ida_meio_transporte: string;
  ida_origem: string;
  ida_horario_saida: string;
  ida_destino: string;
  ida_horario_chegada: string;
  ida_voucher?: string;
  
  // Itinerário VOLTA
  volta_data: string;
  volta_meio_transporte: string;
  volta_origem: string;
  volta_horario_saida: string;
  volta_destino: string;
  volta_horario_chegada: string;
  volta_voucher?: string;
  
  // Informações adicionais
  observacoes_rota?: string;
  opcao_reembolso: boolean;
  voucher_localizador?: string;
  
  // Datas reais (preenchidas após execução)
  data_efetiva_folga?: string;
  data_retorno_real?: string;
  data_apresentacao_real?: string;
  
  // Status da compra
  status_compra?: 'solicitada' | 'emitida' | 'cancelada' | 'reembolsada';
  
  // Assinaturas digitais
  assinatura_supervisor?: string;
  assinatura_engenheiro?: string;
  assinatura_colaborador?: string;
  assinatura_administracao?: string;
}

interface GeradorPDFSolicitacaoProps {
  dados: DadosFormulario;
  onGerarPDF?: () => void;
}

const GeradorPDFSolicitacao: React.FC<GeradorPDFSolicitacaoProps> = ({ dados, onGerarPDF }) => {
  const { toast } = useToast();

  const gerarPDF = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let currentY = 20;

      // Cabeçalho
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('FORMULÁRIO DE SOLICITAÇÃO DE PASSAGEM', pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;

      // Dados gerais
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DADOS GERAIS', margin, currentY);
      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      const dadosGerais = [
        `Obra/Projeto: ${dados.obra_projeto}`,
        `CCA: ${dados.cca}`,
        `Local: ${dados.cidade_destino}/${dados.uf_destino}`,
        `Nome: ${dados.nome_colaborador}`,
        `RE: ${dados.matricula}`,
        `Função: ${dados.funcao}`,
        `Data da Folga: ${dados.data_inicio} a ${dados.data_fim}`,
        `Período: ${dados.dias_folga || 'N/A'} dias`,
        `Cidade Destino: ${dados.cidade_destino}`,
        `UF: ${dados.uf_destino}`,
        `Telefone: ${dados.telefone || 'N/A'}`
      ];

      dadosGerais.forEach((texto, index) => {
        if (index % 2 === 0) {
          doc.text(texto, margin, currentY);
        } else {
          doc.text(texto, pageWidth / 2 + 10, currentY);
        }
        if (index % 2 === 1) currentY += 6;
      });
      
      if (dadosGerais.length % 2 === 1) currentY += 6;
      currentY += 10;

      // Datas previstas da viagem
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('DATAS PREVISTAS DA VIAGEM', margin, currentY);
      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Destino: ${dados.cidade_destino}`, margin, currentY);
      doc.text(`Previsão Saída da Obra: ${dados.ida_data}`, margin, currentY + 6);
      doc.text(`Retorno: ${dados.volta_data}`, margin, currentY + 12);
      doc.text(`Apresentação: ${dados.volta_data}`, margin, currentY + 18);
      currentY += 30;

      // Datas reais da viagem
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('DATAS REAIS DA VIAGEM', margin, currentY);
      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Destino: ${dados.cidade_destino}`, margin, currentY);
      doc.text(`Data Efetiva da Folga: ${dados.data_efetiva_folga || '___________'}`, margin, currentY + 6);
      doc.text(`Retorno: ${dados.data_retorno_real || '___________'}`, margin, currentY + 12);
      doc.text(`Apresentação: ${dados.data_apresentacao_real || '___________'}`, margin, currentY + 18);
      currentY += 30;

      // Reembolso
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('REEMBOLSO', margin, currentY);
      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const reembolsoMarcado = dados.opcao_reembolso ? '[X]' : '[ ]';
      doc.text(`${reembolsoMarcado} Solicitado conforme demanda do colaborador`, margin, currentY);
      currentY += 15;

      // Observação de rota
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('OBSERVAÇÃO DE ROTA', margin, currentY);
      currentY += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const observacao = dados.observacoes_rota || 'Nenhuma observação especial.';
      const linhasObservacao = doc.splitTextToSize(observacao, pageWidth - 2 * margin);
      doc.text(linhasObservacao, margin, currentY);
      currentY += linhasObservacao.length * 5 + 10;

      // Nova página se necessário
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      // Itinerário detalhado
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('ITINERÁRIO DETALHADO', margin, currentY);
      currentY += 10;

      // IDA
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('IDA', margin, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const dadosIda = [
        `Data: ${dados.ida_data}`,
        `Meio de Transporte: ${dados.ida_meio_transporte}`,
        `Local de Partida: ${dados.ida_origem}`,
        `Hora Saída: ${dados.ida_horario_saida}`,
        `Destino: ${dados.ida_destino}`,
        `Hora Chegada: ${dados.ida_horario_chegada}`,
        `Voucher: ${dados.ida_voucher || dados.voucher_localizador || '___________'}`
      ];

      dadosIda.forEach((texto) => {
        doc.text(texto, margin + 5, currentY);
        currentY += 5;
      });
      currentY += 5;

      // VOLTA
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('VOLTA', margin, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const dadosVolta = [
        `Data: ${dados.volta_data}`,
        `Meio de Transporte: ${dados.volta_meio_transporte}`,
        `Local de Partida: ${dados.volta_origem}`,
        `Hora Saída: ${dados.volta_horario_saida}`,
        `Destino: ${dados.volta_destino}`,
        `Hora Chegada: ${dados.volta_horario_chegada}`,
        `Voucher: ${dados.volta_voucher || dados.voucher_localizador || '___________'}`
      ];

      dadosVolta.forEach((texto) => {
        doc.text(texto, margin + 5, currentY);
        currentY += 5;
      });
      currentY += 15;

      // Assinaturas digitais
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('ASSINATURAS DIGITAIS', margin, currentY);
      currentY += 15;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const assinaturas = [
        { cargo: 'Supervisor', assinatura: dados.assinatura_supervisor },
        { cargo: 'Engenheiro', assinatura: dados.assinatura_engenheiro },
        { cargo: 'Colaborador', assinatura: dados.assinatura_colaborador },
        { cargo: 'Administração', assinatura: dados.assinatura_administracao }
      ];

      assinaturas.forEach((item, index) => {
        const x = margin + (index % 2) * (pageWidth / 2);
        const y = currentY + Math.floor(index / 2) * 20;
        
        doc.text(`${item.cargo}:`, x, y);
        doc.text(item.assinatura || '________________________', x, y + 8);
        doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, x, y + 16);
      });

      // Status da compra (se houver)
      if (dados.status_compra) {
        currentY += 50;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('STATUS DA COMPRA', margin, currentY);
        currentY += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Status: ${dados.status_compra.toUpperCase()}`, margin, currentY);
        if (dados.voucher_localizador) {
          doc.text(`Localizador: ${dados.voucher_localizador}`, margin, currentY + 6);
        }
      }

      // Rodapé
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Documento gerado automaticamente em ${new Date().toLocaleString('pt-BR')}`, margin, 285);

      // Salvar PDF
      const nomeArquivo = `solicitacao_passagem_${dados.matricula}_${dados.data_inicio.replace(/-/g, '')}.pdf`;
      doc.save(nomeArquivo);

      toast({
        title: "PDF gerado com sucesso",
        description: `Arquivo ${nomeArquivo} baixado`,
      });

      onGerarPDF?.();

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro durante a geração do documento",
        variant: "destructive"
      });
    }
  };

  return (
    <Button onClick={gerarPDF} className="flex items-center gap-2">
      <FileText className="h-4 w-4" />
      Gerar PDF
      <Download className="h-4 w-4" />
    </Button>
  );
};

export default GeradorPDFSolicitacao;