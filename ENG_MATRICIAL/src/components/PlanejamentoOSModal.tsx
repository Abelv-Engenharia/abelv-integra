import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOS } from "@/contexts/OSContext";

interface PlanejamentoOSModalProps {
  osId: number;
  isOpen: boolean;
  onClose: () => void;
}

const PlanejamentoOSModal = ({ osId, isOpen, onClose }: PlanejamentoOSModalProps) => {
  const { updateOSPlanejamento, getOSById } = useOS();
  const { toast } = useToast();
  const os = getOSById(osId);

  const [dataInicioPrevista, setDataInicioPrevista] = useState("");
  const [dataFimPrevista, setDataFimPrevista] = useState("");
  const [hhPlanejado, setHhPlanejado] = useState("");
  const [hhAdicional, setHhAdicional] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== DADOS DO PLANEJAMENTO ===");
    console.log("Data início prevista:", dataInicioPrevista);
    console.log("Data fim prevista:", dataFimPrevista);
    console.log("HH planejado:", hhPlanejado);
    console.log("HH adicional:", hhAdicional);
    
    if (!dataInicioPrevista || !dataFimPrevista || !hhPlanejado) {
      toast({
        title: "Campos obrigatórios",
        description: "Data de início, fim e HH planejado são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validar se a data de fim é posterior à data de início
    if (new Date(dataFimPrevista) <= new Date(dataInicioPrevista)) {
      toast({
        title: "Período inválido",
        description: "A data de fim deve ser posterior à data de início.",
        variant: "destructive",
      });
      return;
    }

    const hhPlanejadoNum = parseFloat(hhPlanejado);
    const hhAdicionalNum = hhAdicional ? parseFloat(hhAdicional) : 0;

    if (hhPlanejadoNum <= 0) {
      toast({
        title: "Valor inválido",
        description: "HH planejado deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (hhAdicionalNum < 0) {
      toast({
        title: "Valor inválido",
        description: "HH adicional não pode ser negativo.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const dadosParaSalvar = {
        dataInicioPrevista,
        dataFimPrevista,
        hhPlanejado: hhPlanejadoNum,
        hhAdicional: hhAdicionalNum
      };
      
      console.log("=== SALVANDO PLANEJAMENTO ===");
      console.log("Dados para salvar:", dadosParaSalvar);
      
      updateOSPlanejamento(osId, dadosParaSalvar);

      toast({
        title: "Planejamento salvo",
        description: `Período: ${new Date(dataInicioPrevista).toLocaleDateString('pt-BR')} - ${new Date(dataFimPrevista).toLocaleDateString('pt-BR')}`,
      });

      // Limpar formulário e fechar modal
      setDataInicioPrevista("");
      setDataFimPrevista("");
      setHhPlanejado("");
      setHhAdicional("");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar planejamento:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar planejamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularValorEstimado = () => {
    const hhPlanejadoNum = parseFloat(hhPlanejado) || 0;
    const hhAdicionalNum = parseFloat(hhAdicional) || 0;
    const valorHora = 95.00; // Valor padrão
    return ((hhPlanejadoNum + hhAdicionalNum) * valorHora).toLocaleString('pt-BR', {
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
            <Calendar className="h-5 w-5" />
            Planejamento da OS #{os.id}
          </DialogTitle>
          <DialogDescription>
            Defina o planejamento para a OS {os.cca} - {os.cliente}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações da OS */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Cliente:</span> {os.cliente}
            </div>
            <div><span className="font-medium">Disciplina:</span> {os.disciplina}</div>
            <div><span className="font-medium">Descrição:</span> {os.descricao}</div>
            <div><span className="font-medium">Valor OS:</span> {os.valorOrcamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
          </div>

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Período de Execução */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicioPrevista" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data início prevista <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dataInicioPrevista"
                  type="date"
                  value={dataInicioPrevista}
                  onChange={(e) => setDataInicioPrevista(e.target.value)}
                  required
                  className={!dataInicioPrevista ? "border-red-300" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFimPrevista" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data fim prevista <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dataFimPrevista"
                  type="date"
                  value={dataFimPrevista}
                  onChange={(e) => setDataFimPrevista(e.target.value)}
                  required
                  className={!dataFimPrevista ? "border-red-300" : ""}
                />
              </div>
            </div>

            {/* HH Planejado */}
            <div className="space-y-2">
              <Label htmlFor="hhPlanejado" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                HH planejado <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hhPlanejado"
                type="number"
                step="0.5"
                min="0.5"
                placeholder="Ex: 40"
                value={hhPlanejado}
                onChange={(e) => setHhPlanejado(e.target.value)}
                required
                className={!hhPlanejado ? "border-red-300" : ""}
              />
            </div>

            {/* HH Adicional */}
            <div className="space-y-2">
              <Label htmlFor="hhAdicional" className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                HH adicional (opcional)
              </Label>
              <Input
                id="hhAdicional"
                type="number"
                step="0.5"
                min="0"
                placeholder="Ex: 8"
                value={hhAdicional}
                onChange={(e) => setHhAdicional(e.target.value)}
              />
            </div>

            {/* Resumo Financeiro */}
            {(hhPlanejado || hhAdicional) && (
              <div className="bg-primary/5 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Resumo financeiro</h4>
                <div className="text-sm space-y-1">
                  <div>HH planejado: {hhPlanejado || 0}h</div>
                  <div>HH adicional: {hhAdicional || 0}h</div>
                  <div>Total HH: {(parseFloat(hhPlanejado) || 0) + (parseFloat(hhAdicional) || 0)}h</div>
                  <Separator className="my-2" />
                  <div className="font-medium">Valor estimado: {calcularValorEstimado()}</div>
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
            disabled={loading || !dataInicioPrevista || !dataFimPrevista || !hhPlanejado}
          >
            {loading ? "Salvando..." : "Salvar planejamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanejamentoOSModal;