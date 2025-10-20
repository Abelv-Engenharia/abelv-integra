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
import { ControlePassivos, StatusPassivo } from "@/types/gestao-pessoas/passivos";
import { calcularDecimoTerceiro, calcularAvisoPreavio, calcularTotalPassivo } from "@/utils/passivosCalculos";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NovoPassivoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (passivo: ControlePassivos) => void;
}

interface Prestador {
  cpf: string;
  nomecompleto: string;
  razaosocial: string;
  servico: string;
  valorprestacaoservico: number;
  datainiciocontrato: string;
}

export function NovoPassivoModal({ open, onOpenChange, onSave }: NovoPassivoModalProps) {
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [prestadorselecionado, setPrestadorSelecionado] = useState<string>("");
  const [datacorte, setDataCorte] = useState<Date>();
  const [saldoferias, setSaldoFerias] = useState<string>("");
  const [status, setStatus] = useState<StatusPassivo>("ativo");
  const [observacoes, setObservacoes] = useState<string>("");
  
  const [prestadordata, setPrestadorData] = useState<Prestador | null>(null);
  const [decimoterceiro, setDecimoTerceiro] = useState<number>(0);
  const [avisopravio, setAvisoPreavio] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem("cadastros_pessoa_juridica");
      if (stored) {
        setPrestadores(JSON.parse(stored));
      }
    }
  }, [open]);

  useEffect(() => {
    if (prestadorselecionado) {
      const prestador = prestadores.find(p => p.cpf === prestadorselecionado);
      if (prestador) {
        setPrestadorData(prestador);
        setAvisoPreavio(calcularAvisoPreavio(prestador.valorprestacaoservico));
      }
    } else {
      setPrestadorData(null);
      setDecimoTerceiro(0);
      setAvisoPreavio(0);
    }
  }, [prestadorselecionado, prestadores]);

  useEffect(() => {
    if (prestadordata && datacorte) {
      const dataadmissao = new Date(prestadordata.datainiciocontrato);
      const decimocalculado = calcularDecimoTerceiro(prestadordata.valorprestacaoservico, dataadmissao, datacorte);
      setDecimoTerceiro(decimocalculado);
    } else {
      setDecimoTerceiro(0);
    }
  }, [prestadordata, datacorte]);

  useEffect(() => {
    const saldoferiasnum = parseFloat(saldoferias) || 0;
    const totalcalculado = calcularTotalPassivo(saldoferiasnum, decimoterceiro, avisopravio);
    setTotal(totalcalculado);
  }, [saldoferias, decimoterceiro, avisopravio]);

  const handleSave = () => {
    if (!prestadorselecionado || !datacorte || !saldoferias || parseFloat(saldoferias) < 0 || !prestadordata) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const dataadmissao = new Date(prestadordata.datainiciocontrato);
    if (datacorte < dataadmissao || datacorte > new Date()) {
      toast.error("Data de corte inválida");
      return;
    }

    const novopassivo: ControlePassivos = {
      id: crypto.randomUUID(),
      prestadorid: prestadordata.cpf,
      nomeprestador: prestadordata.nomecompleto,
      empresa: prestadordata.razaosocial,
      cargo: prestadordata.servico,
      salariobase: prestadordata.valorprestacaoservico,
      dataadmissao: dataadmissao,
      datacorte: datacorte,
      saldoferias: parseFloat(saldoferias),
      decimoterceiro: decimoterceiro,
      avisopravio: avisopravio,
      total: total,
      status: status,
      observacoes: observacoes,
      datacriacao: new Date(),
      dataatualizacao: new Date(),
    };

    onSave(novopassivo);
    toast.success("Cálculo de passivo criado!");
    onOpenChange(false);
    setPrestadorSelecionado("");
    setDataCorte(undefined);
    setSaldoFerias("");
    setStatus("ativo");
    setObservacoes("");
  };

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo cálculo de passivo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-destructive">Prestador *</Label>
            <Select value={prestadorselecionado} onValueChange={setPrestadorSelecionado}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {prestadores.map((p) => (
                  <SelectItem key={p.cpf} value={p.cpf}>{p.nomecompleto} - {p.razaosocial}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-destructive">Data de corte *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start", !datacorte && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {datacorte ? format(datacorte, "dd/MM/yyyy") : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={datacorte} onSelect={setDataCorte} initialFocus className="pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          {prestadordata && (
            <>
              <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold">Dados do prestador</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><Label className="text-muted-foreground">Nome</Label><p>{prestadordata.nomecompleto}</p></div>
                  <div><Label className="text-muted-foreground">Empresa</Label><p>{prestadordata.razaosocial}</p></div>
                  <div><Label className="text-muted-foreground">Cargo</Label><p>{prestadordata.servico}</p></div>
                  <div><Label className="text-muted-foreground">Salário</Label><p>R$ {formatCurrency(prestadordata.valorprestacaoservico)}</p></div>
                  <div><Label className="text-muted-foreground">Admissão</Label><p>{format(new Date(prestadordata.datainiciocontrato), "dd/MM/yyyy")}</p></div>
                </div>
              </div>
              <div className="border-t pt-4 space-y-3">
                <h3 className="font-semibold">Cálculo</h3>
                <div><Label className="text-destructive">Saldo de férias *</Label><Input type="number" step="0.01" min="0" value={saldoferias} onChange={(e) => setSaldoFerias(e.target.value)} /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label>13º salário (calculado)</Label>
                    <TooltipProvider><Tooltip><TooltipTrigger><InfoIcon className="h-4 w-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>Calculado: (Salário ÷ 12) × meses até data de corte</p></TooltipContent></Tooltip></TooltipProvider>
                  </div>
                  <Input value={`R$ ${formatCurrency(decimoterceiro)}`} disabled className="bg-muted" />
                </div>
                <div><Label>Aviso prévio</Label><Input value={`R$ ${formatCurrency(avisopravio)}`} disabled className="bg-muted" /></div>
                <div className="border-t pt-2"><Label className="font-bold">Total</Label><Input value={`R$ ${formatCurrency(total)}`} disabled className="bg-primary/10 font-bold" /></div>
              </div>
              <div><Label className="text-destructive">Status *</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as StatusPassivo)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="quitado">Quitado</SelectItem>
                    <SelectItem value="parcial">Parcial</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Observações</Label><Textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} /></div>
            </>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
