import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import PdfViewerModal from '@/components/pdf/PdfViewerModal';

interface DadosCaucao {
  // Dados do contrato
  contratoId: string;
  fornecedor: string;
  cpfCnpj: string;
  cca: string;
  tituloSienge: string;
  
  // Endereço em componentes
  logradouro: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  
  // Características do alojamento
  nomeAlojamento: string;
  qtdeQuartos: number;
  qtdeColaboradores: number;
  tipoImovel: string;
  distanciaObra: number;
  
  tipoGarantia: string;
  valorGarantia: number;
  valorAluguel: number;
  inicioLocacao: string;
  fimLocacao: string;
  
  // Dados do formulário
  dataEmissao: string;
  dataVencimento: string;
  tipoDocumento: string;
  observacoes: string;
  contaFinanceira: string;
  centroCusto: string;
  formaPagamento: string;
  banco: string;
  agencia: string;
  conta: string;
  operacao: string;
  
  // ID do cadastro
  cadastroId?: string;
}

interface GeradorPDFCaucaoProps {
  dados: DadosCaucao;
}

export default function GeradorPDFCaucao({ dados }: GeradorPDFCaucaoProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const gerarPDF = async () => {
    try {
      // Carrega o PDF modelo para garantir layout exatamente igual ao enviado (novo modelo cau-3.pdf)
      const templateUrl = '/templates/cau-3.pdf'
      const res = await fetch(templateUrl)
      if (!res.ok) throw new Error(`modelo não encontrado em ${templateUrl}`)
      const templateBytes = await res.arrayBuffer()

      const pdfDoc = await PDFDocument.load(templateBytes)
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      const pages = pdfDoc.getPages()
      const page = pages[0]
      const { width, height } = page.getSize()

      const draw = (
        text: string,
        x: number,
        yFromTop: number,
        size = 10,
        bold = false
      ) => {
        const value = (text ?? '').toString()
        if (!value) return
        page.drawText(value, {
          x,
          y: height - yFromTop,
          size,
          font: bold ? helveticaBold : helvetica,
          color: rgb(0, 0, 0),
        })
      }

      // Montagem de campos
      const endereco = [
        dados.logradouro,
        dados.complemento ? `, ${dados.complemento}` : '',
        ` - ${dados.bairro}`,
        ` - ${dados.municipio}/${dados.uf}`,
        ` - ${dados.cep}`,
      ].join('')

      const fmt = (n?: number) =>
        typeof n === 'number' ? n.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''

      const dt = (s?: string) => (s ? new Date(s).toLocaleDateString('pt-BR') : '')

      // Campos dinâmicos sobre o modelo (somente valores, sem rótulos para não sobrepor o template)
      // Identificação
      draw(dados.cca || '', 40, 82, 14, true)
      draw(dados.tituloSienge || '', 140, 98, 12)

      // Dados de localização
      draw(dados.nomeAlojamento || '', 140, 138, 10)
      draw(endereco || '', 100, 154, 10)

      // Dados do alojamento
      draw(String(dados.qtdeQuartos ?? ''), 120, 194, 10)
      draw(String(dados.qtdeColaboradores ?? ''), 320, 194, 10)
      draw(dados.tipoImovel || '', 120, 210, 10)
      draw(`${dados.distanciaObra ?? ''} km`, 320, 210, 10)

      // Dados contratuais
      draw(dt(dados.inicioLocacao), 140, 250, 10)
      draw(dt(dados.fimLocacao), 320, 250, 10)
      draw(fmt(dados.valorAluguel), 140, 266, 10)
      draw(fmt(dados.valorGarantia), 320, 266, 10)
      draw(dt(dados.dataEmissao), 180, 282, 10)

      // Dados do locador
      draw(dados.fornecedor || '', 120, 322, 10)
      draw(dados.cpfCnpj || '', 140, 338, 10)

      // Dados bancários
      draw(dados.formaPagamento || 'Boleto Bancário', 180, 378, 10)
      draw(dados.banco || '0', 80, 394, 10)
      draw(dados.agencia || '0', 200, 394, 10)
      draw(dados.operacao || '0', 320, 394, 10)
      draw(dados.conta || '0', 440, 394, 10)

      // Tabela “Obra completa” – somente valores
      draw(fmt(dados.valorAluguel), width - 140, 438, 10)
      draw(fmt(dados.valorAluguel), width - 140, 454, 10, true)

      // Gerar bytes e exibir no preview integrado
      const bytes = await pdfDoc.save()
      console.log('PDF gerado (modelo preenchido), bytes:', bytes.length)
      setPdfData(bytes)
      setOpen(true)

      toast({
        title: 'PDF gerado',
        description: 'Documento exibido na tela',
      })
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast({
        title: 'Erro ao Gerar PDF',
        description: 'Ocorreu um erro ao gerar o documento PDF',
        variant: 'destructive',
      })
    }
  };

  return (
    <>
      <PdfViewerModal open={open} setOpen={setOpen} data={pdfData} title="Pedido de Despesa" />
      <Button onClick={gerarPDF} variant="default">
        <FileText className="h-4 w-4 mr-2" />
        Gerar PDF
      </Button>
    </>
  );
}
