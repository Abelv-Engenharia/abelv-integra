import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatarTipoExtintor, getStatusExtintorTexto, getStatusExtintorBadgeClass } from "@/utils/extintorUtils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import QRCode from "react-qr-code";

interface ExtintorViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extintor: any;
}

export function ExtintorViewDialog({ open, onOpenChange, extintor }: ExtintorViewDialogProps) {
  if (!extintor) return null;

  const qrValue = `${window.location.origin}/prevencao-incendio/extintor/${extintor.codigo}`;
  const statusTexto = getStatusExtintorTexto(extintor.data_vencimento);
  const statusClass = getStatusExtintorBadgeClass(extintor.data_vencimento);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Extintor</DialogTitle>
          <DialogDescription>
            Informações completas do extintor cadastrado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center p-4 bg-muted rounded-lg">
            <QRCode value={qrValue} size={150} />
          </div>

          {/* Informações principais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Código</p>
              <p className="text-lg font-semibold">{extintor.codigo}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className={statusClass}>{statusTexto}</Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">CCA</p>
              <p className="text-base">
                {extintor.ccas?.codigo} - {extintor.ccas?.nome}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Tipo</p>
              <p className="text-base">{formatarTipoExtintor(extintor.tipo)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Capacidade</p>
              <p className="text-base">{extintor.capacidade}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Fabricante</p>
              <p className="text-base">{extintor.fabricante || "—"}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Fabricação</p>
              <p className="text-base">
                {extintor.data_fabricacao
                  ? format(new Date(extintor.data_fabricacao), "dd/MM/yyyy", { locale: ptBR })
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Vencimento</p>
              <p className="text-base">
                {extintor.data_vencimento
                  ? format(new Date(extintor.data_vencimento), "dd/MM/yyyy", { locale: ptBR })
                  : "—"}
              </p>
            </div>
          </div>

          {/* Localização */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Localização</p>
            <p className="text-base">{extintor.localizacao}</p>
          </div>

          {/* Observações */}
          {extintor.observacoes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Observações</p>
              <p className="text-base text-muted-foreground">{extintor.observacoes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
