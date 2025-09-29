import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { toast } from 'sonner';
import { Comunicado, ComunicadoCiencia } from '@/types/comunicados';

interface UseExportarComunicadoPdfProps {
  comunicado: Comunicado;
  ciencias: ComunicadoCiencia[];
}

export const useExportarComunicadoPdf = ({ comunicado, ciencias }: UseExportarComunicadoPdfProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const getFileUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `https://xexgdtlctyuycohzhmuu.supabase.co/storage/v1/object/public/comunicados-anexos/${url}`;
  };

  const isImage = (fileName: string) => {
    if (!fileName) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const loadImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Erro ao carregar imagem');
      
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erro ao converter imagem para base64:', error);
      return null;
    }
  };

  const getStatusText = () => {
    const today = new Date().toISOString().split('T')[0];
    
    if (!comunicado.ativo) return 'Inativo';
    if (today < comunicado.data_inicio) return 'Aguardando';
    if (today > comunicado.data_fim) return 'Expirado';
    return 'Ativo';
  };

  const getPublicoAlvoText = () => {
    return comunicado.publico_alvo.tipo === 'todos' 
      ? 'Todos os usuários' 
      : 'CCAs específicos';
  };

  const createPdfContent = async (): Promise<HTMLElement> => {
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.backgroundColor = 'white';
    container.style.color = 'black';

    // Header
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.borderBottom = '2px solid #333';
    header.style.paddingBottom = '20px';
    header.style.marginBottom = '30px';
    header.innerHTML = `
      <h1 style="margin: 0; font-size: 24px; color: #333;">RELATÓRIO - COMUNICADO</h1>
      <p style="margin: 10px 0 0 0; color: #666;">Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}</p>
    `;
    container.appendChild(header);

    // Informações básicas
    const infoSection = document.createElement('div');
    infoSection.style.marginBottom = '30px';
    infoSection.innerHTML = `
      <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Informações do Comunicado</h2>
      <div style="margin-top: 15px;">
        <p><strong>Título:</strong> ${comunicado.titulo}</p>
        <p><strong>Status:</strong> ${getStatusText()}</p>
        <p><strong>Período de Vigência:</strong> ${format(new Date(comunicado.data_inicio), "dd/MM/yyyy", { locale: pt })} até ${format(new Date(comunicado.data_fim), "dd/MM/yyyy", { locale: pt })}</p>
        <p><strong>Público-alvo:</strong> ${getPublicoAlvoText()}</p>
        <p><strong>Criado em:</strong> ${format(new Date(comunicado.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}</p>
        ${comunicado.updated_at !== comunicado.created_at ? `<p><strong>Última atualização:</strong> ${format(new Date(comunicado.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}</p>` : ''}
      </div>
    `;
    container.appendChild(infoSection);

    // Descrição
    if (comunicado.descricao) {
      const descSection = document.createElement('div');
      descSection.style.marginBottom = '30px';
      descSection.innerHTML = `
        <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Descrição</h2>
        <div style="margin-top: 15px; line-height: 1.6; white-space: pre-wrap;">
          ${comunicado.descricao}
        </div>
      `;
      container.appendChild(descSection);
    }

    // Anexo
    if (comunicado.arquivo_url && comunicado.arquivo_nome) {
      const anexoSection = document.createElement('div');
      anexoSection.style.marginBottom = '30px';
      
      let anexoContent = `
        <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Anexo</h2>
        <div style="margin-top: 15px;">
          <p><strong>Arquivo:</strong> ${comunicado.arquivo_nome}</p>
      `;

      // Se for imagem, tentar carregar e exibir
      if (isImage(comunicado.arquivo_nome)) {
        try {
          const imageUrl = getFileUrl(comunicado.arquivo_url);
          const base64Image = await loadImageAsBase64(imageUrl);
          
          if (base64Image) {
            anexoContent += `
              <div style="margin-top: 15px; text-align: center;">
                <img src="${base64Image}" style="max-width: 100%; max-height: 400px; border: 1px solid #ddd; border-radius: 4px;" />
              </div>
            `;
          } else {
            anexoContent += `<p style="color: #666; font-style: italic;">Imagem não pôde ser carregada</p>`;
          }
        } catch (error) {
          anexoContent += `<p style="color: #666; font-style: italic;">Erro ao carregar imagem</p>`;
        }
      } else {
        anexoContent += `<p style="color: #666; font-style: italic;">Arquivo disponível para download</p>`;
      }

      anexoContent += `</div>`;
      anexoSection.innerHTML = anexoContent;
      container.appendChild(anexoSection);
    }

    // Lista de ciências
    const cienciasSection = document.createElement('div');
    cienciasSection.style.marginBottom = '30px';
    
    const cienciasHtml = ciencias && ciencias.length > 0 ? 
      ciencias.map((ciencia, index) => `
        <div style="padding: 12px; border: 1px solid #ddd; margin-bottom: 10px; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <p style="margin: 0; font-weight: bold; font-size: 14px;">${index + 1}. ${ciencia.profiles?.nome || 'Nome não disponível'}</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">${ciencia.profiles?.email || 'Email não disponível'}</p>
            </div>
            <div style="text-align: right; color: #666; font-size: 12px;">
              ${format(new Date(ciencia.data_ciencia), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
            </div>
          </div>
        </div>
      `).join('') :
      '<p style="color: #666; font-style: italic;">Nenhum usuário deu ciência ainda</p>';

    cienciasSection.innerHTML = `
      <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
        Usuários que Deram Ciência ${ciencias && ciencias.length > 0 ? `(${ciencias.length})` : ''}
      </h2>
      <div style="margin-top: 15px;">
        ${cienciasHtml}
      </div>
    `;
    container.appendChild(cienciasSection);

    // Footer
    const footer = document.createElement('div');
    footer.style.marginTop = '40px';
    footer.style.borderTop = '1px solid #ddd';
    footer.style.paddingTop = '20px';
    footer.style.textAlign = 'center';
    footer.style.color = '#666';
    footer.style.fontSize = '12px';
    footer.innerHTML = `
      <p>Relatório gerado automaticamente pelo Sistema de Comunicados</p>
    `;
    container.appendChild(footer);

    return container;
  };

  const exportarPdf = async () => {
    if (isExporting) return;

    setIsExporting(true);
    
    try {
      toast.info('Gerando PDF...', { duration: 2000 });

      // Criar conteúdo HTML temporário
      const content = await createPdfContent();
      document.body.appendChild(content);

      // Aguardar um frame para renderização
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capturar como canvas
      const canvas = await html2canvas(content, {
        useCORS: true,
        allowTaint: false,
        scale: 2,
        width: 800,
        height: content.scrollHeight,
        backgroundColor: '#ffffff'
      });

      // Remover elemento temporário
      document.body.removeChild(content);

      // Criar PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // margem de 10mm de cada lado
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10; // margem superior

      // Adicionar primeira página
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20); // subtrair margens

      // Adicionar páginas adicionais se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }

      // Baixar PDF
      const fileName = `comunicado_${comunicado.titulo.replace(/[^a-zA-Z0-9]/g, '_')}_${format(new Date(), 'ddMMyyyy_HHmm')}.pdf`;
      pdf.save(fileName);

      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportarPdf,
    isExporting
  };
};