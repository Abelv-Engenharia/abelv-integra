
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RiskBadge from "./RiskBadge";
import StatusBadge from "./StatusBadge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { desviosCompletosService, DesvioCompleto } from "@/services/desvios/desviosCompletosService";

interface Props {
  desvio: DesvioCompleto;
  onStatusUpdated?: (id: string, newStatus: string) => void;
}

const formatDate = (dateString: string) => (dateString ? new Date(dateString).toLocaleDateString("pt-BR") : "");

const DesvioDetailsDialog = ({ desvio, onStatusUpdated }: Props) => {
  const { toast } = useToast();
  const [actionStatus, setActionStatus] = useState<string>("");
  const updateStatus = async () => {
    if (!desvio.id || !actionStatus) return;
    try {
      await desviosCompletosService.update(desvio.id, { status: actionStatus });
      toast({
        title: "Status atualizado",
        description: `O status do desvio ${desvio.id} foi alterado para ${actionStatus}.`,
      });
      onStatusUpdated?.(desvio.id, actionStatus);
    } catch {
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status do desvio.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Desvio</DialogTitle>
          <DialogDescription className="pt-4 flex items-center gap-2">
            <span className="text-muted-foreground">ID: {desvio.id?.slice(0, 8)}...</span>
            <span>•</span>
            <span className="text-muted-foreground">Data: {formatDate(desvio.data_desvio)}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <h3 className="font-semibold">Informações do Desvio</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">CCA</p>
                <p className="text-sm text-muted-foreground">{(desvio as any).ccas?.nome || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Nível de Risco</p>
                <RiskBadge risk={desvio.classificacao_risco} />
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <StatusBadge status={desvio.status} />
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <h3 className="font-semibold">Descrição</h3>
            <p className="text-sm text-muted-foreground">{desvio.descricao_desvio}</p>
          </div>
          {desvio.acao_imediata && (
            <div className="grid gap-2">
              <h3 className="font-semibold">Ação Imediata</h3>
              <p className="text-sm text-muted-foreground">{desvio.acao_imediata}</p>
            </div>
          )}
          <div className="grid gap-2">
            <h3 className="font-semibold">Atualizar Status</h3>
            <div className="flex gap-4 items-end">
              <div className="grid gap-1.5 flex-1">
                <label htmlFor="status" className="text-sm font-medium">
                  Novo Status
                </label>
                <Select
                  value={actionStatus}
                  onValueChange={setActionStatus}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
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

export default DesvioDetailsDialog;
