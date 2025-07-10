
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useOcorrenciasFormData } from "@/hooks/useOcorrenciasFormData";

interface OcorrenciasFiltrosProps {
  onFilter: () => void;
}

// Opções de classificação de risco
const classificacaoRiscoOptions = [
  "Todas",
  "TRIVIAL",
  "TOLERÁVEL", 
  "MODERADO",
  "SUBSTANCIAL",
  "INTOLERÁVEL"
];

export const OcorrenciasFiltros = ({ onFilter }: OcorrenciasFiltrosProps) => {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Filter state
  const [cca, setCca] = useState("Todos");
  const [empresa, setEmpresa] = useState("Todas");
  const [disciplina, setDisciplina] = useState("Todas");
  const [tipoOcorrencia, setTipoOcorrencia] = useState("Todos");
  const [classificacaoRisco, setClassificacaoRisco] = useState("Todas");

  // Get form data
  const {
    ccas,
    empresas,
    disciplinas,
    tiposOcorrencia,
    classificacoesOcorrencia
  } = useOcorrenciasFormData();

  const handleApplyFilter = () => {
    setOpen(false);
    onFilter();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrar ocorrências</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Período</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      format(dateRange.from, "dd/MM/yyyy")
                    ) : (
                      <span>Data inicial</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? (
                      format(dateRange.to, "dd/MM/yyyy")
                    ) : (
                      <span>Data final</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    disabled={(date) =>
                      date < (dateRange.from || new Date("1900-01-01"))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cca">CCA</Label>
              <Select value={cca} onValueChange={setCca}>
                <SelectTrigger id="cca">
                  <SelectValue placeholder="Selecione o CCA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  {ccas.map((ccaItem) => (
                    <SelectItem key={ccaItem.id} value={`${ccaItem.codigo} - ${ccaItem.nome}`}>
                      {ccaItem.codigo} - {ccaItem.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Select value={empresa} onValueChange={setEmpresa}>
                <SelectTrigger id="empresa">
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  {empresas.map((empresaItem) => (
                    <SelectItem key={empresaItem.id} value={empresaItem.nome}>
                      {empresaItem.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="disciplina">Disciplina</Label>
              <Select value={disciplina} onValueChange={setDisciplina}>
                <SelectTrigger id="disciplina">
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas</SelectItem>
                  {disciplinas.map((disciplinaItem) => (
                    <SelectItem key={disciplinaItem.id} value={disciplinaItem.nome}>
                      {disciplinaItem.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tipo-ocorrencia">Tipo de Ocorrência</Label>
              <Select value={tipoOcorrencia} onValueChange={setTipoOcorrencia}>
                <SelectTrigger id="tipo-ocorrencia">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  {tiposOcorrencia.map((tipoItem) => (
                    <SelectItem key={tipoItem.id} value={tipoItem.nome}>
                      {tipoItem.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="classificacao-risco">Classificação de Risco</Label>
            <Select
              value={classificacaoRisco}
              onValueChange={setClassificacaoRisco}
            >
              <SelectTrigger id="classificacao-risco">
                <SelectValue placeholder="Selecione a classificação" />
              </SelectTrigger>
              <SelectContent>
                {classificacaoRiscoOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleApplyFilter}>Aplicar filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
