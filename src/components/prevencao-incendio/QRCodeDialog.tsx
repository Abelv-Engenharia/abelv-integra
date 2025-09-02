import React from "react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extintorData: {
    codigo: string;
    tipo: string;
    capacidade: string;
    localizacao: string;
  };
}

const QRCodeDialog = ({ open, onOpenChange, extintorData }: QRCodeDialogProps) => {
  const qrValue = JSON.stringify({
    codigo: extintorData.codigo,
    tipo: extintorData.tipo,
    capacidade: extintorData.capacidade,
    localizacao: extintorData.localizacao,
    url: `${window.location.origin}/prevencao-incendio/extintor/${extintorData.codigo}`
  });

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrElement = document.getElementById('qr-code-element');
    if (!qrElement) return;

    const svgData = qrElement.outerHTML;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - Extintor ${extintorData.codigo}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              text-align: center;
            }
            .qr-container { 
              max-width: 400px; 
              margin: 0 auto; 
              padding: 20px;
              border: 2px solid #000;
            }
            .extintor-info {
              margin-bottom: 20px;
              text-align: left;
            }
            .extintor-info h2 {
              margin-bottom: 10px;
              text-align: center;
            }
            .info-item {
              margin: 5px 0;
            }
            @media print { 
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="extintor-info">
              <h2>Extintor de Incêndio</h2>
              <div class="info-item"><strong>Código:</strong> ${extintorData.codigo}</div>
              <div class="info-item"><strong>Tipo:</strong> ${extintorData.tipo}</div>
              <div class="info-item"><strong>Capacidade:</strong> ${extintorData.capacidade}</div>
              <div class="info-item"><strong>Localização:</strong> ${extintorData.localizacao}</div>
            </div>
            <div style="display: flex; justify-content: center;">
              ${svgData}
            </div>
            <p style="margin-top: 20px; font-size: 12px;">
              Escaneie este QR Code para acessar as informações do extintor
            </p>
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            QR Code Gerado com Sucesso!
          </DialogTitle>
          <DialogDescription className="text-center">
            QR Code para o extintor {extintorData.codigo}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <QRCode
              id="qr-code-element"
              value={qrValue}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          </div>
          
          <div className="text-sm text-muted-foreground text-center">
            <p><strong>Código:</strong> {extintorData.codigo}</p>
            <p><strong>Tipo:</strong> {extintorData.tipo}</p>
            <p><strong>Localização:</strong> {extintorData.localizacao}</p>
          </div>

          <div className="flex gap-2 w-full">
            <Button onClick={handlePrint} className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;