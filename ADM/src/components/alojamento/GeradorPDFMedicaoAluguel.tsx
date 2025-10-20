import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface DadosMedicao {
  id: string;
  numeroMedicao: string;
  contrato: string;
  obra: string;
  fornecedor: string;
  cpfCnpj: string;
  competencia: string;
  valor: number;
  diasAluguel: number;
  dataInicio: string;
  dataFim: string;
  empresa: string;
  colaboradores: any[];
  observacoes?: string;
  dados_sienge?: {
    valor_bruto?: number;
    ir_retido?: number;
    valor_liquido?: number;
    aliquota_ir?: number;
    parcela_deduzir?: number;
  };
}

export const gerarPDFMedicaoAluguel = async (dados: DadosMedicao): Promise<Blob> => {
  const doc = new jsPDF();
  let y = 20;

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);
  };

  const formatarData = (data: string): string => {
    if (!data) return '-';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const checkPage = () => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  const addSecao = (titulo: string) => {
    checkPage();
    doc.setFillColor(37, 99, 235);
    doc.rect(10, y - 5, 190, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, 15, y);
    doc.setTextColor(0, 0, 0);
    y += 12;
  };

  const addLinha = (label: string, valor: string) => {
    checkPage();
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(label + ":", 15, y);
    doc.setFont("helvetica", "normal");
    const textoValor = doc.splitTextToSize(valor, 110);
    doc.text(textoValor, 80, y);
    y += Math.max(6, textoValor.length * 5);
  };

  // Cabeçalho
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ESPELHO DE MEDIÇÃO DE ALUGUEL", 105, 12, { align: "center" });
  doc.setFontSize(11);
  doc.text(dados.numeroMedicao, 105, 19, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y = 35;

  // 1. Informações Gerais
  addSecao("1. INFORMAÇÕES GERAIS");
  addLinha("Contrato", dados.contrato);
  addLinha("Fornecedor", dados.fornecedor);
  addLinha("CPF/CNPJ", dados.cpfCnpj);
  addLinha("Obra/CCA", dados.obra);
  addLinha("Competência", dados.competencia);
  addLinha("Empresa", dados.empresa || 'Não informado');
  y += 5;

  // 2. Período e Valores
  addSecao("2. PERÍODO E VALORES");
  addLinha("Data Início", formatarData(dados.dataInicio));
  addLinha("Data Fim", formatarData(dados.dataFim));
  addLinha("Dias de Aluguel", String(dados.diasAluguel || 0) + ' dias');
  addLinha("Valor Diária", formatarMoeda((dados.valor || 0) / (dados.diasAluguel || 1)));
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  addLinha("VALOR TOTAL", formatarMoeda(dados.valor));
  y += 5;

  // 3. Imposto de Renda (se aplicável)
  if (dados.dados_sienge?.ir_retido) {
    addSecao("3. IMPOSTO DE RENDA");
    addLinha("Valor Bruto", formatarMoeda(dados.dados_sienge.valor_bruto || dados.valor));
    addLinha("Alíquota IR", (dados.dados_sienge.aliquota_ir || 0) + '%');
    addLinha("Parcela a Deduzir", formatarMoeda(dados.dados_sienge.parcela_deduzir || 0));
    addLinha("Valor IR Retido", formatarMoeda(dados.dados_sienge.ir_retido));
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    addLinha("VALOR LÍQUIDO A PAGAR", formatarMoeda(dados.dados_sienge.valor_liquido));
    y += 5;
  }

  // 4. Colaboradores Alocados
  if (dados.colaboradores && dados.colaboradores.length > 0) {
    addSecao("4. COLABORADORES ALOCADOS");
    
    // Cabeçalho da tabela
    doc.setFillColor(220, 220, 220);
    doc.rect(10, y - 2, 190, 8, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Nome", 12, y + 3);
    doc.text("Função", 70, y + 3);
    doc.text("Empresa", 120, y + 3);
    doc.text("Período", 160, y + 3);
    y += 10;

    // Linhas da tabela
    doc.setFont("helvetica", "normal");
    dados.colaboradores.forEach((colab: any, index: number) => {
      checkPage();
      
      // Alternar cor de fundo
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(10, y - 4, 190, 7, "F");
      }

      doc.setFontSize(8);
      doc.text(colab.nome || 'N/A', 12, y);
      doc.text(colab.funcao || 'N/A', 70, y);
      doc.text(colab.empresa || 'N/A', 120, y);
      
      const periodo = colab.dataInicio && colab.dataFim 
        ? `${formatarData(colab.dataInicio)} - ${formatarData(colab.dataFim)}`
        : 'N/A';
      doc.text(periodo, 160, y);
      y += 7;
    });
    y += 5;
  }

  // 5. Observações
  if (dados.observacoes) {
    addSecao("5. OBSERVAÇÕES");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const observacoesTexto = doc.splitTextToSize(dados.observacoes, 180);
    doc.text(observacoesTexto, 15, y);
    y += observacoesTexto.length * 5 + 5;
  }

  // Footer
  checkPage();
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Documento gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, 285, { align: "center" });
  doc.text(`Medição de Aluguel - Sistema ABELV`, 105, 290, { align: "center" });

  return doc.output('blob');
};

export const usarGeradorPDFMedicaoAluguel = () => {
  const { toast } = useToast();

  const gerarEDownload = async (dados: DadosMedicao) => {
    try {
      const pdfBlob = await gerarPDFMedicaoAluguel(dados);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Download automático
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Medicao_Aluguel_${dados.numeroMedicao}_${dados.competencia}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "PDF Gerado",
        description: "O espelho da medição foi gerado com sucesso.",
      });

      return pdfBlob;
    } catch (error: any) {
      toast({
        title: "Erro ao gerar PDF",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return { gerarEDownload };
};
