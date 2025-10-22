import { GRD } from '@/types/document';

// Simple PDF generator using jsPDF since react-pdf is having import issues
import { Button } from '@/components/ui/button';

interface GRDPDFProps {
  grd: GRD;
  children: React.ReactNode;
}

const generateGRDPDF = (grd: GRD) => {
  // Create HTML content that mimics the GRD form
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>GRD - ${grd.numero}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 10px; margin: 20px; }
        .header { border: 1px solid #000; display: flex; }
        .header-left { flex: 7; border-right: 1px solid #000; padding: 5px; }
        .header-right { flex: 3; padding: 5px; }
        .title { font-size: 14px; font-weight: bold; text-align: center; margin-bottom: 5px; }
        .subtitle { font-size: 12px; font-weight: bold; text-align: center; margin-bottom: 10px; }
        .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .table, .table th, .table td { border: 1px solid #000; }
        .table th, .table td { padding: 3px; text-align: left; }
        .table th { background-color: #f0f0f0; text-align: center; }
        .checkbox { display: inline-block; width: 10px; height: 10px; border: 1px solid #000; margin-right: 5px; text-align: center; }
        .observations { border: 1px solid #000; padding: 5px; min-height: 60px; margin: 10px 0; }
        .signature { border: 1px solid #000; padding: 5px; height: 80px; margin: 10px 0; display: inline-block; width: 48%; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-left">
          <div class="title">SGI - OPE</div>
          <div class="subtitle">GRD - GUIA DE REMESSA DE DOCUMENTO</div>
        </div>
        <div class="header-right">
          <div><strong>CÓDIGO:</strong> FO-OPE-002</div>
          <div><strong>REVISÃO:</strong> 2</div>
          <div><strong>FOLHA:</strong> ÚNICA</div>
          <div><strong>DATA:</strong> ${new Date(grd.dataEnvio).toLocaleDateString('pt-BR')}</div>
        </div>
      </div>
      
      <table class="table" style="margin-top: 0;">
        <tr>
          <td colspan="4" style="background-color: #f0f0f0; font-weight: bold;">GRD - GUIA DE REMESSA DE DOCUMENTO</td>
          <td><strong>GRD Nº</strong></td>
          <td>${grd.numero}</td>
          <td><strong>CCA</strong></td>
          <td>${grd.cca}</td>
        </tr>
        <tr>
          <td><strong>DE</strong></td>
          <td colspan="3">${grd.remetente}</td>
          <td><strong>FOLHA</strong></td>
          <td>${grd.folha}</td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td><strong>PARA</strong></td>
          <td colspan="3">${grd.destinatario}</td>
          <td><strong>DATA</strong></td>
          <td>${new Date(grd.dataEnvio).toLocaleDateString('pt-BR')}</td>
          <td></td>
          <td></td>
        </tr>
      </table>

      <table class="table">
        <thead>
          <tr>
            <th>ITEM</th>
            <th>DISCRIMINAÇÃO DOS DOCUMENTOS</th>
            <th>REVISÃO</th>
            <th>Nº FOLHAS</th>
            <th>Nº CÓPIAS</th>
            <th>TV</th>
          </tr>
        </thead>
        <tbody>
          ${grd.documentos.map((doc, index) => `
            <tr>
              <td style="text-align: center;">${(index + 1).toString().padStart(2, '0')}</td>
              <td>${doc.discriminacao}</td>
              <td style="text-align: center;">${doc.revisao}</td>
              <td style="text-align: center;">${doc.numeroFolhas}</td>
              <td style="text-align: center;">${doc.numeroCopias}</td>
              <td style="text-align: center;">${doc.tipoVia}</td>
            </tr>
          `).join('')}
          ${Array.from({ length: Math.max(0, 10 - grd.documentos.length) }).map(() => `
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display: flex; margin: 10px 0;">
        <div style="flex: 1; border: 1px solid #000; padding: 5px; margin-right: 5px;">
          <div><strong>PROVIDÊNCIAS</strong></div>
          <div><span class="checkbox">${grd.providencias.aprovar ? 'X' : ''}</span>APROVAR</div>
          <div><span class="checkbox">${grd.providencias.arquivar ? 'X' : ''}</span>ARQUIVAR</div>
          <div><span class="checkbox">${grd.providencias.assinatura ? 'X' : ''}</span>ASSINATURA</div>
          <div><span class="checkbox">${grd.providencias.comentar ? 'X' : ''}</span>COMENTAR</div>
          <div><span class="checkbox">${grd.providencias.devolver ? 'X' : ''}</span>DEVOLVER</div>
          <div><span class="checkbox">${grd.providencias.informacao ? 'X' : ''}</span>INFORMAÇÃO</div>
          <div><span class="checkbox">${grd.providencias.revisar ? 'X' : ''}</span>REVISAR</div>
        </div>
        <div style="flex: 1; border: 1px solid #000; padding: 5px; margin: 0 5px;">
          <div><strong>PROJETOS:</strong></div>
          <div><span class="checkbox">${grd.providencias.liberadoConstrucao ? 'X' : ''}</span>LIBERADO PARA CONSTRUÇÃO</div>
          <div><span class="checkbox">${grd.providencias.liberadoDetalhamento ? 'X' : ''}</span>LIBERADO PARA DETALHAMENTO</div>
          <div><span class="checkbox">${grd.providencias.liberadoComentarios ? 'X' : ''}</span>LIBERADO PARA COMENTÁRIOS</div>
          <div><span class="checkbox">${grd.providencias.liberadoRevisao ? 'X' : ''}</span>LIBERADO PARA REVISÃO</div>
          <div><span class="checkbox">${grd.providencias.emitirParecer ? 'X' : ''}</span>EMITIR PARECER TÉCNICO</div>
          ${grd.providencias.outros ? `<div><span class="checkbox">X</span>${grd.providencias.outros}</div>` : ''}
        </div>
        <div style="flex: 1; border: 1px solid #000; padding: 5px; margin-left: 5px;">
          <div><strong>TV = TIPO DE VIA</strong></div>
          <div>O - ORIGINAL</div>
          <div>C - CÓPIA</div>
          <div>M - MEIO MAGNÉTICO</div>
          <div>W - OUTROS</div>
        </div>
      </div>

      <div class="observations">
        <div><strong>OBSERVAÇÕES</strong></div>
        <div>${grd.observacoes || ''}</div>
      </div>

      <div>
        <div class="signature">
          <strong>REMETENTE (CARIMBO/ASSINATURA/DATA)</strong>
        </div>
        <div class="signature" style="float: right;">
          <strong>DESTINATÁRIO (CARIMBO/ASSINATURA/DATA)</strong>
        </div>
      </div>
    </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  }
};

export function GRDPDFGenerator({ grd, children }: GRDPDFProps) {
  const handleClick = () => {
    generateGRDPDF(grd);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {children}
    </div>
  );
}