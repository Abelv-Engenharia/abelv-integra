import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ControlePassivos, StatusPassivo } from "@/types/passivos";
import { calcularDecimoTerceiro, calcularAvisoPreavio, calcularTotalPassivo } from "@/utils/passivosCalculos";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EditarPassivoModalProps {
  passivo: ControlePassivos | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (passivo: ControlePassivos) => void;
}

export function EditarPassivoModal({ passivo, open, onOpenChange, onSave }: EditarPassivoModalProps) {
  const [datacorte, setDataCorte] = useState<Date>();
  const [saldoferias, setSaldoFerias] = useState<string>("");
  const [status, setStatus] = useState<StatusPassivo>("ativo");
  const [observacoes, setObservacoes] = useState<string>("");
  
  const [decimoterceiro, setDecimoTerceiro] = useState<number>(0);
  const [avisopravio, setAvisoPreavio] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (passivo) {
      setDataCorte(new Date(passivo.datacorte));
      setSaldoFerias(passivo.saldoferias.toString());
      setStatus(passivo.status);
      setObservacoes(passivo.observacoes || "");
      setAvisoPreavio(calcularAvisoPreavio(passivo.salariobase));
    }
  }, [passivo]);

  useEffect(() => {
    if (passivo && datacorte) {
      const decimocalculado = calcularDecimoTerceiro(
        passivo.salariobase,
        new Date(passivo.dataadmissao),
        datacorte
      );
      setDecimoTerceiro(decimocalculado);
    }
  }, [passivo, datacorte]);

  useEffect(() => {
    const saldoferiasnum = parseFloat(saldoferias) || 0;
    const totalcalculado = calcularTotalPassivo(saldoferiasnum, decimoterceiro, avisopravio);
    setTotal(totalcalculado);
  }, [saldoferias, decimoterceiro, avisopravio]);

  const handleSave = () => {
    if (!passivo) return;

    if (!datacorte) {
      toast.error("Selecione a data de corte");
      return;
    }

    if (!saldoferias || parseFloat(saldoferias) < 0) {
      toast.error("Informe o saldo de férias (valor >= 0)");
      return;
    }

    const dataadmissao = new Date(passivo.dataadmissao);
    
    if (datacorte < dataadmissao) {
      toast.error("Data de corte não pode ser anterior à data de admissão");
      return;
    }

    if (datacorte > new Date()) {
      toast.error("Data de corte não pode ser futura");
      return;
    }

    const passivoeditado: ControlePassivos = {
      ...passivo,
      datacorte: datacorte,
      saldoferias: parseFloat(saldoferias),
      decimoterceiro: decimoterceiro,
      avisopravio: avisopravio,
      total: total,
      status: status,
      observacoes: observacoes,
      dataatualizacao: new Date(),
    };

    onSave(passivoeditado);
    toast.success("Passivo atualizado com sucesso!");
    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (!passivo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar cálculo de passivo</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Dados do prestador (não editável)</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <Label className="text-muted-foreground">Nome</Label>
                <p className="font-medium">{passivo.nomeprestador}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Empresa</Label>
                <p className="font-medium">{passivo.empresa}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Cargo</Label>
                <p className="font-medium">{passivo.cargo}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Salário base</Label>
                <p className="font-medium">R$ {formatCurrency(passivo.salariobase)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Data admissão</Label>
                <p className="font-medium">{format(new Date(passivo.dataadmissao), "dd/MM/yyyy")}</p>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-destructive">Data de corte (simulação) *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !datacorte && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {datacorte ? format(datacorte, "dd/MM/yyyy") : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={datacorte}
                  onSelect={setDataCorte}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="saldoferias" className="text-destructive">Saldo de férias *</Label>
              <Input
                id="saldoferias"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={saldoferias}
                onChange={(e) => setSaldoFerias(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label>13º salário (calculado)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Calculado automaticamente: (Salário base ÷ 12) × meses trabalhados no ano até a data de corte</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                value={`R$ ${formatCurrency(decimoterceiro)}`}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label>Aviso prévio</Label>
              <Input
                value={`R$ ${formatCurrency(avisopravio)}`}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="border-t pt-3">
              <Label className="text-lg font-bold">Total</Label>
              <Input
                value={`R$ ${formatCurrency(total)}`}
                disabled
                className="bg-primary/10 font-bold text-lg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="text-destructive">Status *</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as StatusPassivo)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="quitado">Quitado</SelectItem>
                <SelectItem value="parcial">Parcial</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações sobre o cálculo"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
