import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ControlePassivos } from "@/types/passivos";
import { PassivoStatusBadge } from "./PassivoStatusBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

interface VisualizarPassivoModalProps {
  passivo: ControlePassivos | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisualizarPassivoModal({ passivo, open, onOpenChange }: VisualizarPassivoModalProps) {
  if (!passivo) return null;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Passivo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Prestador</p>
              <p className="font-medium">{passivo.nomeprestador}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <PassivoStatusBadge status={passivo.status} />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Data admissão</p>
              <p className="font-medium">
                {format(new Date(passivo.dataadmissao), "PPP", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data de corte</p>
              <p className="font-medium">
                {format(new Date(passivo.datacorte), "PPP", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Salário base</p>
              <p className="font-medium">{formatCurrency(passivo.salariobase)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cargo</p>
              <p className="font-medium">{passivo.cargo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Empresa</p>
              <p className="font-medium">{passivo.empresa}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Cálculo de passivos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Saldo de férias</p>
                <p className="font-semibold text-lg">{formatCurrency(passivo.saldoferias)}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">13º salário</p>
                <p className="font-semibold text-lg">{formatCurrency(passivo.decimoterceiro)}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Aviso prévio</p>
                <p className="font-semibold text-lg">{formatCurrency(passivo.avisopravio)}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-primary/10 border-2 border-primary">
            <p className="text-sm text-muted-foreground mb-1">Total de passivos</p>
            <p className="font-bold text-2xl text-primary">{formatCurrency(passivo.total)}</p>
          </div>

          {passivo.observacoes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Observações</p>
                <p className="text-sm whitespace-pre-wrap">{passivo.observacoes}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <p>Criado em</p>
              <p>{format(new Date(passivo.datacriacao), "PPpp", { locale: ptBR })}</p>
            </div>
            <div>
              <p>Atualizado em</p>
              <p>{format(new Date(passivo.dataatualizacao), "PPpp", { locale: ptBR })}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
