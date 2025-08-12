
import React from 'react';
import { sanitizeHtml } from '@/utils/sanitization';

interface SecurePrintComponentProps {
  content: string;
  title?: string;
  className?: string;
}

export const SecurePrintComponent: React.FC<SecurePrintComponentProps> = ({ 
  content, 
  title = 'Documento',
  className = '' 
}) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Sanitize content before printing
    const sanitizedContent = sanitizeHtml(content);
    const sanitizedTitle = title.replace(/[<>]/g, ''); // Remove potential HTML tags from title

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${sanitizedTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .print-content { max-width: 800px; margin: 0 auto; }
            @media print { 
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-content">
            ${sanitizedContent}
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  return (
    <button 
      onClick={handlePrint}
      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors ${className}`}
    >
      Imprimir
    </button>
  );
};
