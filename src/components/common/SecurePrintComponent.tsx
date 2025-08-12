
import { sanitizeHtml, escapeHtml } from "@/utils/sanitization";

interface SecurePrintComponentProps {
  content: string;
  title?: string;
  styles?: string;
  isHtml?: boolean;
}

/**
 * Secure component for printing content that prevents XSS attacks
 */
export const SecurePrintComponent = ({ 
  content, 
  title = "Relatório", 
  styles = "",
  isHtml = false 
}: SecurePrintComponentProps) => {
  
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error('Failed to open print window');
      return;
    }

    // Sanitize content based on type
    const safeContent = isHtml ? sanitizeHtml(content) : escapeHtml(content);
    const safeTitle = escapeHtml(title);
    const safeStyles = sanitizeHtml(styles);

    // Use safe document writing method
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${safeTitle}</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; margin-bottom: 20px; }
            .content { line-height: 1.6; }
            ${safeStyles}
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${safeTitle}</h1>
            <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          <div class="content">
            ${safeContent}
          </div>
        </body>
      </html>
    `;

    // Write content safely
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Print and cleanup
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return { handlePrint };
};
