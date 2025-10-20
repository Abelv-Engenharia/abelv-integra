import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import PdfViewerModal from '@/components/pdf/PdfViewerModal';

interface DadosContrato {
  codigo: string;
  nome: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  qtdeQuartos: number;
  lotacaoMaxima: number;
  lotacaoAtual: number;
  distanciaObra: number;
  tipoImovel: string;
  inicioLocacao: string;
  fimLocacao: string;
  vigenciaContrato: number;
  dataAssinatura: string;
  multaContratual: number;
  observacoes?: string;
  tipoGarantia: string;
  valorGarantia?: number;
  dataPagamentoGarantia?: string;
  proprietario: string;
  cpfCnpjProprietario: string;
  tipoProprietario: string;
  favorecido: string;
  cpfCnpjFavorecido: string;
  tipoChavePix?: string;
  formaPagamento: string;
  banco: string;
  agencia: string;
  operacao?: string;
  contaCorrente: string;
}

interface GeradorPDFContratoAlojamentoProps {
  dados: DadosContrato;
}

export default function GeradorPDFContratoAlojamento({ dados }: GeradorPDFContratoAlojamentoProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);

  const gerarPDF = () => {
    try {
      const doc = new jsPDF('portrait', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      // Cores
      const azulEscuro = [25, 25, 112];
      const cinzaClaro = [220, 220, 220];
      const branco = [255, 255, 255];

      // Função auxiliar para criar célula
      const criarCelula = (x: number, y: number, w: number, h: number, cor: number[], texto: string, fontSize = 8, bold = false) => {
        doc.setFillColor(cor[0], cor[1], cor[2]);
        doc.rect(x, y, w, h, 'FD');
        doc.setDrawColor(0, 0, 0);
        doc.rect(x, y, w, h);
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', bold ? 'bold' : 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(texto, x + 2, y + h - 2);
      };

      // Cabeçalho
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('CONTRATO DE LOCAÇÃO DE ALOJAMENTO', pageWidth / 2, yPos, { align: 'center' });

      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Código: ${dados.codigo}`, pageWidth / 2, yPos, { align: 'center' });

      // IDENTIFICAÇÃO
      yPos += 15;
      doc.setFillColor(azulEscuro[0], azulEscuro[1], azulEscuro[2]);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('IDENTIFICAÇÃO', 17, yPos + 5);

      yPos += 8;
      criarCelula(15, yPos, 60, 8, cinzaClaro, 'Nome do Contrato:', 8, true);
      criarCelula(75, yPos, pageWidth - 90, 8, branco, dados.nome, 8, false);

      // DADOS DA LOCALIZAÇÃO
      yPos += 10;
      doc.setFillColor(azulEscuro[0], azulEscuro[1], azulEscuro[2]);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('DADOS DA LOCALIZAÇÃO', 17, yPos + 5);

      yPos += 8;
      criarCelula(15, yPos, 40, 8, cinzaClaro, 'Logradouro:', 8, true);
      criarCelula(55, yPos, pageWidth - 70, 8, branco, dados.logradouro, 8, false);

      yPos += 8;
      criarCelula(15, yPos, 40, 8, cinzaClaro, 'Complemento:', 8, true);
      criarCelula(55, yPos, 60, 8, branco, dados.complemento || '', 8, false);
      criarCelula(115, yPos, 30, 8, cinzaClaro, 'Bairro:', 8, true);
      criarCelula(145, yPos, pageWidth - 160, 8, branco, dados.bairro, 8, false);

      yPos += 8;
      criarCelula(15, yPos, 40, 8, cinzaClaro, 'Município:', 8, true);
      criarCelula(55, yPos, 60, 8, branco, dados.municipio, 8, false);
      criarCelula(115, yPos, 20, 8, cinzaClaro, 'UF:', 8, true);
      criarCelula(135, yPos, 15, 8, branco, dados.uf, 8, false);
      criarCelula(150, yPos, 20, 8, cinzaClaro, 'CEP:', 8, true);
      criarCelula(170, yPos, pageWidth - 185, 8, branco, dados.cep, 8, false);

      // CARACTERÍSTICAS DO ALOJAMENTO
      yPos += 10;
      doc.setFillColor(azulEscuro[0], azulEscuro[1], azulEscuro[2]);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('CARACTERÍSTICAS DO ALOJAMENTO', 17, yPos + 5);

      yPos += 8;
      criarCelula(15, yPos, 40, 8, cinzaClaro, 'Qtde Quartos:', 8, true);
      criarCelula(55, yPos, 25, 8, branco, String(dados.qtdeQuartos), 8, false);
      criarCelula(80, yPos, 50, 8, cinzaClaro, 'Lotação Máxima:', 8, true);
      criarCelula(130, yPos, 25, 8, branco, String(dados.lotacaoMaxima), 8, false);
      criarCelula(155, yPos, 40, 8, cinzaClaro, 'Lotação Atual:', 8, true);
      criarCelula(pageWidth - 15, yPos, -pageWidth + 210, 8, branco, String(dados.lotacaoAtual), 8, false);

      yPos += 8;
      criarCelula(15, yPos, 40, 8, cinzaClaro, 'Tipo Imóvel:', 8, true);
      criarCelula(55, yPos, 50, 8, branco, dados.tipoImovel, 8, false);
      criarCelula(105, yPos, 50, 8, cinzaClaro, 'Distância Obra:', 8, true);
      criarCelula(155, yPos, pageWidth - 170, 8, branco, `${dados.distanciaObra} km`, 8, false);

      // DADOS CONTRATUAIS
      yPos += 10;
      doc.setFillColor(azulEscuro[0], azulEscuro[1], azulEscuro[2]);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('DADOS CONTRATUAIS', 17, yPos + 5);

      yPos += 8;
      criarCelula(15, yPos, 50, 8, cinzaClaro, 'Início Locação:', 8, true);
      criarCelula(65, yPos, 35, 8, branco, new Date(dados.inicioLocacao).toLocaleDateString('pt-BR'), 8, false);
      criarCelula(100, yPos, 45, 8, cinzaClaro, 'Fim Locação:', 8, true);
      criarCelula(145, yPos, pageWidth - 160, 8, branco, new Date(dados.fimLocacao).toLocaleDateString('pt-BR'), 8, false);

      yPos += 8;
      criarCelula(15, yPos, 50, 8, cinzaClaro, 'Vigência (meses):', 8, true);
      criarCelula(65, yPos, 25, 8, branco, String(dados.vigenciaContrato), 8, false);
      criarCelula(90, yPos, 55, 8, cinzaClaro, 'Data Assinatura:', 8, true);
      criarCelula(145, yPos, pageWidth - 160, 8, branco, new Date(dados.dataAssinatura).toLocaleDateString('pt-BR'), 8, false);

      yPos += 8;
      criarCelula(15, yPos, 50, 8, cinzaClaro, 'Multa Contratual:', 8, true);
      criarCelula(65, yPos, pageWidth - 80, 8, branco, `${dados.multaContratual}%`, 8, false);

      // GARANTIA
      yPos += 10;
      doc.setFillColor(azulEscuro[0], azulEscuro[1], azulEscuro[2]);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('GARANTIA', 17, yPos + 5);

      yPos += 8;
      criarCelula(15, yPos, 50, 8, cinzaClaro, 'Tipo de Garantia:', 8, true);
      criarCelula(65, yPos, 50, 8, branco, dados.tipoGarantia === 'caucao' ? 'Caução' : dados.tipoGarantia === 'titulo-capitalizacao' ? 'Título Capitalização' : 'Nenhum', 8, false);

      if (dados.tipoGarantia !== 'nenhum' && dados.valorGarantia) {
        criarCelula(115, yPos, 40, 8, cinzaClaro, 'Valor:', 8, true);
        criarCelula(155, yPos, pageWidth - 170, 8, branco, `R$ ${dados.valorGarantia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 8, false);

        if (dados.dataPagamentoGarantia) {
          yPos += 8;
          criarCelula(15, yPos, 50, 8, cinzaClaro, 'Data Pagamento:', 8, true);
          criarCelula(65, yPos, pageWidth - 80, 8, branco, new Date(dados.dataPagamentoGarantia).toLocaleDateString('pt-BR'), 8, false);
        }
      }

      // DADOS DO PROPRIETÁRIO
      yPos += 10;
      doc.setFillColor(azulEscuro[0], azulEscuro[1], azulEscuro[2]);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('DADOS DO PROPRIETÁRIO', 17, yPos + 5);

      yPos += 8;
      criarCelula(15, yPos, 40, 8, cinzaClaro, 'Nome:', 8, true);
      criarCelula(55, yPos, pageWidth - 70, 8, branco, dados.proprietario, 8, false);

      yPos += 8;
      criarCelula(15, yPos, 40, 8, cinzaClaro, 'CPF/CNPJ:', 8, true);
      criarCelula(55, yPos, 60, 8, branco, dados.cpfCnpjProprietario, 8, false);
      criarCelula(115, yPos, 30, 8, cinzaClaro, 'Tipo:', 8, true);
      criarCelula(145, yPos, pageWidth - 160, 8, branco, dados.tipoProprietario === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica', 8, false);

      // DADOS BANCÁRIOS
      yPos += 10;
      doc.setFillColor(azulEscuro[0], azulEscuro[1], azulEscuro[2]);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('DADOS BANCÁRIOS', 17, yPos + 5);

      yPos += 8;
      criarCelula(15, yPos, 40, 8, cinzaClaro, 'Favorecido:', 8, true);
      criarCelula(55, yPos, pageWidth - 70, 8, branco, dados.favorecido, 8, false);

      yPos += 8;
      criarCelula(15, yPos, 40, 8, cinzaClaro, 'CPF/CNPJ:', 8, true);
      criarCelula(55, yPos, pageWidth - 70, 8, branco, dados.cpfCnpjFavorecido, 8, false);

      yPos += 8;
      criarCelula(15, yPos, 50, 8, cinzaClaro, 'Forma Pagamento:', 8, true);
      criarCelula(65, yPos, 40, 8, branco, dados.formaPagamento.toUpperCase(), 8, false);
      if (dados.tipoChavePix) {
        criarCelula(105, yPos, 45, 8, cinzaClaro, 'Tipo Chave PIX:', 8, true);
        criarCelula(150, yPos, pageWidth - 165, 8, branco, dados.tipoChavePix, 8, false);
      }

      yPos += 8;
      criarCelula(15, yPos, 30, 8, cinzaClaro, 'Banco:', 8, true);
      criarCelula(45, yPos, 25, 8, branco, dados.banco, 8, false);
      criarCelula(70, yPos, 35, 8, cinzaClaro, 'Agência:', 8, true);
      criarCelula(105, yPos, 25, 8, branco, dados.agencia, 8, false);
      if (dados.operacao) {
        criarCelula(130, yPos, 35, 8, cinzaClaro, 'Operação:', 8, true);
        criarCelula(165, yPos, pageWidth - 180, 8, branco, dados.operacao, 8, false);
      }

      yPos += 8;
      criarCelula(15, yPos, 45, 8, cinzaClaro, 'Conta Corrente:', 8, true);
      criarCelula(60, yPos, pageWidth - 75, 8, branco, dados.contaCorrente, 8, false);

      // OBSERVAÇÕES
      if (dados.observacoes) {
        yPos += 10;
        doc.setFillColor(azulEscuro[0], azulEscuro[1], azulEscuro[2]);
        doc.rect(15, yPos, pageWidth - 30, 8, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('OBSERVAÇÕES', 17, yPos + 5);

        yPos += 8;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const splitObs = doc.splitTextToSize(dados.observacoes, pageWidth - 34);
        doc.text(splitObs, 17, yPos + 5);
      }

      const nomeArquivo = `contrato_alojamento_${dados.codigo}.pdf`;
      
      // preparar dados para visualização embutida (sem blob/data URL)
      const arrayBuffer = doc.output('arraybuffer') as ArrayBuffer;
      setPdfData(new Uint8Array(arrayBuffer));
      setOpen(true);

      toast({
        title: 'PDF Gerado com Sucesso',
        description: `Arquivo ${nomeArquivo} aberto no visualizador`,
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: 'Erro ao Gerar PDF',
        description: 'Ocorreu um erro ao gerar o documento PDF',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <PdfViewerModal open={open} setOpen={setOpen} data={pdfData} title="Contrato de Alojamento" />
      <Button onClick={gerarPDF} variant="outline">
        <FileText className="h-4 w-4 mr-2" />
        Visualizar Contrato PDF
      </Button>
    </>
  );
}
