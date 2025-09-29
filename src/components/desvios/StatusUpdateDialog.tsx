import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "./StatusBadge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService, DesvioCompleto } from "@/services/desvios/desviosCompletosService";

interface Props {
  desvio: DesvioCompleto;
  onStatusUpdated?: (id: string, newStatus: string) => void;
}

const StatusUpdateDialog = ({ desvio, onStatusUpdated }: Props) => {
  const { toast } = useToast();
  const [actionStatus, setActionStatus] = useState<string>("");
  const [open, setOpen] = useState(false);

  const updateStatus = async () => {
    if (!desvio.id || !actionStatus) return;
    try {
      await desviosCompletosService.update(desvio.id, { status: actionStatus });
      toast({
        title: "Status atualizado com sucesso!",
      });
      if (onStatusUpdated) {
        onStatusUpdated(desvio.id, actionStatus);
      }
      setOpen(false);
    } catch {
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do desvio.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Atualizar Status">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Atualizar Status do Desvio</DialogTitle>
          <DialogDescription>
            Altere o status do desvio conforme necessário.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">Status Atual</h3>
            <StatusBadge status={desvio.status} />
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Novo Status</h3>
            <div className="flex gap-4 items-end">
              <div className="grid gap-1.5 flex-1">
                <Select
                  value={actionStatus}
                  onValueChange={setActionStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o novo status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">PENDENTE</SelectItem>
                    <SelectItem value="EM ANDAMENTO">EM ANDAMENTO</SelectItem>
                    <SelectItem value="CONCLUÍDO">CONCLUÍDO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={updateStatus} disabled={!actionStatus}>
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateDialog;