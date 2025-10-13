import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOS } from "@/contexts/OSContext";

interface ReplanejamentoOSModalProps {
  osId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ReplanejamentoOSModal = ({ osId, isOpen, onClose }: ReplanejamentoOSModalProps) => {
  const { replanejamentoOS, getOSById } = useOS();
  const { toast } = useToast();
  const os = getOSById(osId);

  const [novaDataInicio, setNovaDataInicio] = useState("");
  const [novaDataFim, setNovaDataFim] = useState("");
  const [hhAdicional, setHhAdicional] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaDataInicio || !novaDataFim || !hhAdicional || !motivo) {
      toast({
        title: "Campos obrigatórios",
        description: "Todos os campos são obrigatórios para o replanejamento.",
        variant: "destructive",
      });
      return;
    }

    const hhAdicionalNum = parseFloat(hhAdicional);

    if (hhAdicionalNum <= 0) {
      toast({
        title: "Valor inválido",
        description: "HH adicional deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      replanejamentoOS(osId, {
        novaDataInicio,
        novaDataFim,
        hhAdicional: hhAdicionalNum,
        motivo
      });

      toast({
        title: "OS replanejada",
        description: "OS replanejada e enviada para nova aprovação do solicitante.",
      });

      // Limpar formulário e fechar modal
      setNovaDataInicio("");
      setNovaDataFim("");
      setHhAdicional("");
      setMotivo("");
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao replanejar OS. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularNovoValorEstimado = () => {
    if (!os) return "R$ 0,00";
    const hhAdicionalNum = parseFloat(hhAdicional) || 0;
    const valorHora = 95.00;
    const hhTotalAtual = os.hhPlanejado + (os.hhAdicional || 0);
    const novoTotal = hhTotalAtual + hhAdicionalNum;
    return (novoTotal * valorHora).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  if (!os) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Replanejamento da OS #{os.id}
          </DialogTitle>
          <DialogDescription>
            Replaneje a OS {os.cca} - {os.cliente} com nova data e HH adicional
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações atuais da OS */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Situação atual</h4>
            <div className="text-sm space-y-1">
              <div>Período atual: {os.dataInicioPrevista && os.dataFimPrevista ? 
                `${new Date(os.dataInicioPrevista).toLocaleDateString('pt-BR')} - ${new Date(os.dataFimPrevista).toLocaleDateString('pt-BR')}` :
                'Não definido'}</div>
              <div>HH planejado: {os.hhPlanejado}h</div>
              <div>HH adicional atual: {os.hhAdicional || 0}h</div>
              <div>Total HH atual: {os.hhPlanejado + (os.hhAdicional || 0)}h</div>
            </div>
          </div>

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Novo Período de Execução */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="novaDataInicio" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Nova data início <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="novaDataInicio"
                  type="date"
                  value={novaDataInicio}
                  onChange={(e) => setNovaDataInicio(e.target.value)}
                  required
                  className={!novaDataInicio ? "border-red-300" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="novaDataFim" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Nova data fim <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="novaDataFim"
                  type="date"
                  value={novaDataFim}
                  onChange={(e) => setNovaDataFim(e.target.value)}
                  required
                  className={!novaDataFim ? "border-red-300" : ""}
                />
              </div>
            </div>

            {/* HH Adicional */}
            <div className="space-y-2">
              <Label htmlFor="hhAdicional" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                HH adicional necessário <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hhAdicional"
                type="number"
                step="0.5"
                min="0.5"
                placeholder="Ex: 16"
                value={hhAdicional}
                onChange={(e) => setHhAdicional(e.target.value)}
                required
                className={!hhAdicional ? "border-red-300" : ""}
              />
            </div>

            {/* Motivo do Replanejamento */}
            <div className="space-y-2">
              <Label htmlFor="motivo" className="text-sm font-medium">
                Motivo do replanejamento <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="motivo"
                placeholder="Descreva o motivo que levou ao replanejamento..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
                className={!motivo ? "border-red-300" : ""}
                rows={3}
              />
            </div>

            {/* Novo Resumo Financeiro */}
            {hhAdicional && (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg space-y-2">
                <h4 className="font-medium text-orange-800">Novo resumo financeiro</h4>
                <div className="text-sm space-y-1">
                  <div>HH total atual: {os.hhPlanejado + (os.hhAdicional || 0)}h</div>
                  <div>HH adicional: +{hhAdicional}h</div>
                  <div>Novo total HH: {os.hhPlanejado + (os.hhAdicional || 0) + (parseFloat(hhAdicional) || 0)}h</div>
                  <Separator className="my-2" />
                  <div className="font-medium text-orange-800">Novo valor estimado: {calcularNovoValorEstimado()}</div>
                </div>
              </div>
            )}
          </form>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || !novaDataInicio || !novaDataFim || !hhAdicional || !motivo}
            variant="destructive"
          >
            {loading ? "Replanejando..." : "Confirmar replanejamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplanejamentoOSModal;