import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RNC } from '@/types/sgq';
import { useRNCData } from './useRNCData';

export const useRNCPdfGenerator = () => {
  const { getRNC } = useRNCData();

  const loadImageAsBase64 = async (url: string): Promise<{ data: string; width: number; height: number }> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Obter dimensões originais da imagem
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          resolve({ data: base64, width: img.width, height: img.height });
        };
        img.onerror = reject;
        img.src = base64;
      });
    } catch (error) {
      console.error('Erro ao carregar imagem:', error);
      return { data: '', width: 0, height: 0 };
    }
  };

  const generatePDF = async (rncId: string) => {
    try {
      // Buscar dados completos da RNC
      const rnc = await getRNC(rncId);
      if (!rnc) {
        throw new Error('RNC não encontrada');
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Função auxiliar para adicionar nova página se necessário
      const checkAndAddPage = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Função para adicionar seção
      const addSection = (title: string) => {
        checkAndAddPage(15);
        pdf.setFillColor(34, 197, 94); // bg-green-500
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(title, margin + 2, yPosition + 7);
        yPosition += 15;
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
      };

      // Remover anexos duplicados (mesmo url + número + descrição)
      const dedupeAnexos = <T extends { url?: string; evidence_number?: any; description?: string }>(arr: T[]) => {
        const seen = new Set<string>();
        return arr.filter((a) => {
          const key = `${a.url || ''}__${a.evidence_number || ''}__${(a.description || '').trim()}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      };

      const getImageFormat = (dataUrl: string): 'JPEG' | 'PNG' | 'WEBP' => {
        if (dataUrl.startsWith('data:image/png')) return 'PNG';
        if (dataUrl.startsWith('data:image/webp')) return 'WEBP';
        return 'JPEG';
      };

      // Cabeçalho
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`RNC #${rnc.numero}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Status e Prioridade
      pdf.setFontSize(10);
      const statusText = `Status: ${rnc.status === 'aberta' ? 'Aberta' : 'Fechada'}`;
      const prioridadeText = `Prioridade: ${rnc.prioridade === 'critica' ? 'Crítica' : rnc.prioridade === 'moderada' ? 'Moderada' : 'Leve'}`;
      pdf.text(`${statusText} | ${prioridadeText}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // 1. Informações Básicas
      addSection('1. Informações Básicas');
      
      const basicInfo = [
        ['CCA', rnc.cca],
        ['Emitente', rnc.emitente],
        ['Data de Emissão', new Date(rnc.data_emissao).toLocaleDateString('pt-BR')],
        ['Previsão de Fechamento', new Date(rnc.previsao_fechamento).toLocaleDateString('pt-BR')],
        ['Setor / Projeto', rnc.setor_projeto || '-'],
        ['Detectado por', rnc.detectado_por || '-'],
        ['Origem', rnc.origem],
        ['Disciplinas', rnc.disciplina.join(', ')]
      ];

      autoTable(pdf, {
        startY: yPosition,
        head: [],
        body: basicInfo,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 'auto' }
        },
        margin: { left: margin, right: margin }
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 10;

      // 2. Descrição da Não Conformidade
      addSection('2. Descrição da Não Conformidade');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Descrição:', margin, yPosition);
      yPosition += 5;
      
      pdf.setFont('helvetica', 'normal');
      const descLines = pdf.splitTextToSize(rnc.descricao_nc, pageWidth - 2 * margin);
      pdf.text(descLines, margin, yPosition);
      yPosition += descLines.length * 5 + 5;

      checkAndAddPage(15);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Evidências:', margin, yPosition);
      yPosition += 5;
      
      pdf.setFont('helvetica', 'normal');
      const evidLines = pdf.splitTextToSize(rnc.evidencias_nc, pageWidth - 2 * margin);
      pdf.text(evidLines, margin, yPosition);
      yPosition += evidLines.length * 5 + 10;

      // Evidências Fotográficas da NC
      const evidenciasNc = rnc.anexos_evidencias_nc ? dedupeAnexos(rnc.anexos_evidencias_nc) : [];
      if (evidenciasNc.length > 0) {
        checkAndAddPage(20);
        addSection('Evidências Fotográficas da Não Conformidade');

        for (const anexo of evidenciasNc) {
          checkAndAddPage(100);
          
          // Título da evidência
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Evidência ${anexo.evidence_number || ''}`, margin, yPosition);
          yPosition += 6;

          // Descrição da evidência
          if (anexo.description) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            const descEvidLines = pdf.splitTextToSize(anexo.description, pageWidth - 2 * margin);
            pdf.text(descEvidLines, margin, yPosition);
            yPosition += descEvidLines.length * 4 + 5;
          }

          // Adicionar imagem
          if (anexo.url) {
            try {
              const imageInfo = await loadImageAsBase64(anexo.url);
              if (imageInfo.data) {
                // Calcular dimensões mantendo proporção original
                const maxWidth = pageWidth - 2 * margin;
                const maxHeight = 100; // Altura máxima
                const aspectRatio = imageInfo.width / imageInfo.height;
                
                let imgWidth = maxWidth;
                let imgHeight = imgWidth / aspectRatio;
                
                // Se a altura calculada for maior que o máximo, ajustar pela altura
                if (imgHeight > maxHeight) {
                  imgHeight = maxHeight;
                  imgWidth = imgHeight * aspectRatio;
                }
                
                const format = getImageFormat(imageInfo.data);
                checkAndAddPage(imgHeight + 10);
                pdf.addImage(imageInfo.data, format, margin, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 10;
              }
            } catch (error) {
              console.error('Erro ao adicionar imagem:', error);
            }
          }
        }
      }

      // 3. Disposição da NC
      addSection('3. Disposição da NC');
      
      const disposicaoInfo = [
        ['Ações de Disposição', rnc.disposicao.join(', ')],
        ['Responsável', rnc.responsavel_disposicao || '-'],
        ['Prazo', rnc.prazo_disposicao ? new Date(rnc.prazo_disposicao).toLocaleDateString('pt-BR') : '-'],
      ];

      autoTable(pdf, {
        startY: yPosition,
        head: [],
        body: disposicaoInfo,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 'auto' }
        },
        margin: { left: margin, right: margin }
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 10;

      if (rnc.analise_disposicao) {
        checkAndAddPage(15);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Análise da Disposição:', margin, yPosition);
        yPosition += 5;
        
        pdf.setFont('helvetica', 'normal');
        const analiseLines = pdf.splitTextToSize(rnc.analise_disposicao, pageWidth - 2 * margin);
        pdf.text(analiseLines, margin, yPosition);
        yPosition += analiseLines.length * 5 + 10;
      }

      // Evidências Fotográficas da Disposição
      const evidenciasDisp = rnc.anexos_evidencia_disposicao ? dedupeAnexos(rnc.anexos_evidencia_disposicao) : [];
      if (evidenciasDisp.length > 0) {
        checkAndAddPage(20);
        addSection('Evidências Fotográficas da Disposição');

        for (const anexo of evidenciasDisp) {
          checkAndAddPage(100);
          
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Evidência ${anexo.evidence_number || ''}`, margin, yPosition);
          yPosition += 6;

          if (anexo.description) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            const descEvidLines = pdf.splitTextToSize(anexo.description, pageWidth - 2 * margin);
            pdf.text(descEvidLines, margin, yPosition);
            yPosition += descEvidLines.length * 4 + 5;
          }

          if (anexo.url) {
            try {
              const imageInfo = await loadImageAsBase64(anexo.url);
              if (imageInfo.data) {
                // Calcular dimensões mantendo proporção original
                const maxWidth = pageWidth - 2 * margin;
                const maxHeight = 100; // Altura máxima
                const aspectRatio = imageInfo.width / imageInfo.height;
                
                let imgWidth = maxWidth;
                let imgHeight = imgWidth / aspectRatio;
                
                // Se a altura calculada for maior que o máximo, ajustar pela altura
                if (imgHeight > maxHeight) {
                  imgHeight = maxHeight;
                  imgWidth = imgHeight * aspectRatio;
                }
                
                const format = getImageFormat(imageInfo.data);
                checkAndAddPage(imgHeight + 10);
                pdf.addImage(imageInfo.data, format, margin, yPosition, imgWidth, imgHeight);
                yPosition += imgHeight + 10;
              }
            } catch (error) {
              console.error('Erro ao adicionar imagem:', error);
            }
          }
        }
      }

      // Aprovações
      addSection('4. Aprovações');
      
      const aprovacoesInfo = [
        ['Emitente', rnc.aprovacao_emitente ? '✓ Aprovado' : '○ Pendente'],
        ['Qualidade', rnc.aprovacao_qualidade ? '✓ Aprovado' : '○ Pendente'],
        ['Cliente', rnc.aprovacao_cliente ? '✓ Aprovado' : '○ Pendente']
      ];

      autoTable(pdf, {
        startY: yPosition,
        head: [],
        body: aprovacoesInfo,
        theme: 'grid',
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: 'bold' },
          1: { cellWidth: 'auto' }
        },
        margin: { left: margin, right: margin }
      });

      // Salvar PDF
      pdf.save(`RNC_${rnc.numero}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  };

  return { generatePDF };
};
