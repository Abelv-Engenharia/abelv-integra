import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import QRCode from "react-qr-code";
import { formatarTipoExtintor } from "@/utils/extintorUtils";

interface ExtintorQRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extintor: any;
}

export function ExtintorQRCodeDialog({ open, onOpenChange, extintor }: ExtintorQRCodeDialogProps) {
  if (!extintor) return null;

  const qrValue = `${window.location.origin}/prevencao-incendio/extintor/${extintor.codigo}`;

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=600,height=600");
    if (!printWindow) return;

    const qrCodeSVG = document.querySelector("#qr-code-print svg")?.outerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${extintor.codigo}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .qr-container {
              text-align: center;
              border: 2px solid #000;
              padding: 20px;
              margin: 20px;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            .info {
              margin: 15px 0;
              font-size: 14px;
            }
            .qr-code {
              margin: 20px 0;
            }
            @media print {
              body {
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h1>Extintor de Incêndio</h1>
            <div class="info">
              <p><strong>Código:</strong> ${extintor.codigo}</p>
              <p><strong>Tipo:</strong> ${formatarTipoExtintor(extintor.tipo)}</p>
              <p><strong>Capacidade:</strong> ${extintor.capacidade}</p>
              <p><strong>Localização:</strong> ${extintor.localizacao}</p>
            </div>
            <div class="qr-code">
              ${qrCodeSVG}
            </div>
            <p style="font-size: 12px;">Escaneie o QR Code para visualizar o histórico de inspeções</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code do Extintor</DialogTitle>
          <DialogDescription>
            Imprima e cole este QR Code no extintor físico
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code */}
          <div id="qr-code-print" className="flex flex-col items-center gap-4 p-6 bg-muted rounded-lg">
            <QRCode value={qrValue} size={200} />
            <div className="text-center space-y-1">
              <p className="font-semibold text-lg">{extintor.codigo}</p>
              <p className="text-sm text-muted-foreground">
                {formatarTipoExtintor(extintor.tipo)} - {extintor.capacidade}
              </p>
              <p className="text-sm text-muted-foreground">{extintor.localizacao}</p>
            </div>
          </div>

          {/* Botão de impressão */}
          <Button onClick={handlePrint} className="w-full">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
