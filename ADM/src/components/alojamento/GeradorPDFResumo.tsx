import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface GeradorPDFResumoProps {
  dados: any;
  onGerado?: (pdfUrl: string) => void;
}

export function GeradorPDFResumo({ dados, onGerado }: GeradorPDFResumoProps) {
  const [gerando, setGerando] = useState(false);
  const { toast } = useToast();

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

  const gerarPDF = async () => {
    setGerando(true);
    try {
      const doc = new jsPDF();
      let y = 20;

      // Título
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Resumo Do Contrato De Alojamento", 105, y, { align: "center" });
      y += 15;

      // Função auxiliar para adicionar seção
      const addSecao = (titulo: string) => {
        doc.setFillColor(59, 130, 246);
        doc.rect(10, y - 5, 190, 8, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(titulo, 15, y);
        doc.setTextColor(0, 0, 0);
        y += 12;
      };

      // Função auxiliar para adicionar linha
      const addLinha = (label: string, valor: string) => {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(label + ":", 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(valor, 80, y);
        y += 6;
      };

      // Verificar quebra de página
      const checkPage = () => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      };

      // 1. Dados do Locador e Imóvel
      addSecao("1. Dados Do Locador E Imóvel");
      checkPage();
      addLinha("Tipo de Locador", dados.tipo_locador === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica');
      addLinha("Nome/Razão Social", dados.fornecedor_nome || dados.nome_proprietario || '-');
      addLinha("CPF/CNPJ", dados.fornecedor_cnpj || dados.cpf_proprietario || '-');
      if (dados.imobiliaria) addLinha("Imobiliária", dados.imobiliaria);
      addLinha("Endereço", `${dados.logradouro}, ${dados.numero}`);
      addLinha("Bairro", dados.bairro || '-');
      addLinha("Cidade/UF", `${dados.cidade}/${dados.uf}` || '-');
      addLinha("CEP", dados.cep || '-');
      addLinha("Tipo Alojamento", dados.tipo_alojamento || '-');
      addLinha("Quartos", String(dados.quantidade_quartos || '-'));
      addLinha("Capacidade Total", String(dados.capacidade_total || '-'));
      addLinha("Distância Obra (km)", String(dados.distancia_obra || '-'));
      y += 5;

      // 2. Dados Financeiros
      checkPage();
      addSecao("2. Dados Financeiros");
      checkPage();
      addLinha("CCA", dados.cca_codigo || '-');
      addLinha("Nº Contrato", dados.numero_contrato || '-');
      addLinha("Aluguel Mensal", formatarMoeda(dados.valor_mensal));
      addLinha("Dia Vencimento", String(dados.dia_vencimento || '-'));
      addLinha("Tipo Pagamento", dados.tipo_pagamento_detalhado || dados.tipo_pagamento || '-');
      addLinha("Forma Pagamento", dados.forma_pagamento || '-');
      addLinha("Caução", formatarMoeda(dados.caucao));
      addLinha("Tipo Conta", dados.conta_poupanca || '-');
      addLinha("Meses Caução", String(dados.meses_caucao || '-'));
      addLinha("Prazo Contratual", `${dados.prazo_contratual || '-'} meses`);
      addLinha("Data Início", formatarData(dados.data_inicio_contrato));
      addLinha("Data Fim", formatarData(dados.data_fim_contrato));
      y += 5;

      // IR (se PF)
      if (dados.tipo_locador === 'pf' && dados.ir_valor_retido > 0) {
        checkPage();
        addSecao("3. Cálculo Do IR (Pessoa Física)");
        checkPage();
        addLinha("Base de Cálculo", formatarMoeda(dados.ir_base_calculo));
        addLinha("Alíquota", `${dados.ir_aliquota}%`);
        addLinha("Parcela a Deduzir", formatarMoeda(dados.ir_parcela_deduzir));
        addLinha("Valor do IR", formatarMoeda(dados.ir_valor_retido));
        addLinha("Valor Líquido", formatarMoeda(dados.valor_liquido_pagar));
        y += 5;
      }

      // Cláusulas
      checkPage();
      addSecao(dados.tipo_locador === 'pf' && dados.ir_valor_retido > 0 ? "4. Cláusulas E Despesas" : "3. Cláusulas E Despesas");
      checkPage();
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Despesas Adicionais:", 15, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      if (dados.tem_taxa_lixo) {
        doc.text("✓ Taxa de Lixo", 20, y);
        y += 5;
      }
      if (dados.tem_condominio) {
        doc.text("✓ Condomínio", 20, y);
        y += 5;
      }
      if (dados.tem_seguro_predial) {
        doc.text("✓ Seguro Predial", 20, y);
        y += 5;
      }
      y += 3;

      doc.setFont("helvetica", "bold");
      doc.text("Checklist de Cláusulas:", 15, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text((dados.checklist_reajuste ? "✓" : "✗") + " Reajuste Anual (IGPM/IPCA)", 20, y);
      y += 5;
      doc.text((dados.checklist_manutencao ? "✓" : "✗") + " Responsabilidade de Manutenção", 20, y);
      y += 5;
      doc.text((dados.checklist_vistoria_nr24 ? "✓" : "✗") + " Vistoria conforme NR-24", 20, y);
      y += 5;
      doc.text((dados.checklist_seguro ? "✓" : "✗") + " Seguro Predial Obrigatório", 20, y);
      y += 5;
      doc.text((dados.checklist_foro ? "✓" : "✗") + " Foro de Resolução de Conflitos", 20, y);
      y += 8;

      // Custos
      checkPage();
      const numSecaoCustos = dados.tipo_locador === 'pf' && dados.ir_valor_retido > 0 ? "5" : "4";
      addSecao(`${numSecaoCustos}. Custos E Indicadores`);
      checkPage();
      addLinha("Nº de Moradores", String(dados.numero_moradores || '-'));
      addLinha("Valor Mensal Líquido", formatarMoeda(dados.valor_mensal_liquido));
      addLinha("Valor Total Contrato", formatarMoeda(dados.valor_total_contrato));
      addLinha("Custo por Morador", formatarMoeda(dados.valor_por_morador));
      y += 5;

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, 285, { align: "center" });

      // Salvar PDF
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      doc.save(`Resumo_Contrato_${dados.numero_contrato || 'temp'}.pdf`);

      if (onGerado) {
        onGerado(pdfUrl);
      }

      toast({
        title: "PDF gerado com sucesso!",
        description: "O resumo do contrato foi gerado.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao gerar PDF",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGerando(false);
    }
  };

  return (
    <Button onClick={gerarPDF} disabled={gerando} variant="outline">
      <FileText className="mr-2 h-4 w-4" />
      {gerando ? 'Gerando PDF...' : 'Gerar PDF de Resumo'}
    </Button>
  );
}
