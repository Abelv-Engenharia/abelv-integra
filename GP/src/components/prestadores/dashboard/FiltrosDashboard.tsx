import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FiltrosDashboard } from "@/types/dashboard-prestadores";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FiltrosDashboardProps {
  onAplicar: (filtros: FiltrosDashboard) => void;
}

export function FiltrosDashboardComponent({ onAplicar }: FiltrosDashboardProps) {
  const [dataInicial, setDataInicial] = useState<Date>();
  const [dataFinal, setDataFinal] = useState<Date>();
  const [prestador, setPrestador] = useState("");
  const [obra, setObra] = useState("");

  const handleAplicar = () => {
    onAplicar({
      datainicial: dataInicial,
      datafinal: dataFinal,
      prestador: prestador || undefined,
      obra: obra || undefined,
    });
  };

  const handleLimpar = () => {
    setDataInicial(undefined);
    setDataFinal(undefined);
    setPrestador("");
    setObra("");
    onAplicar({});
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label>Data inicial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataInicial && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicial ? format(dataInicial, "dd/MM/yyyy") : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dataInicial}
                  onSelect={setDataInicial}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Data final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataFinal && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFinal ? format(dataFinal, "dd/MM/yyyy") : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dataFinal}
                  onSelect={setDataFinal}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Prestador</Label>
            <Input
              placeholder="Nome do prestador"
              value={prestador}
              onChange={(e) => setPrestador(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Obra/CCA</Label>
            <Input
              placeholder="Nome da obra"
              value={obra}
              onChange={(e) => setObra(e.target.value)}
            />
          </div>

          <div className="space-y-2 flex items-end gap-2">
            <Button onClick={handleAplicar} className="flex-1">
              <Filter className="mr-2 h-4 w-4" />
              Aplicar
            </Button>
            <Button onClick={handleLimpar} variant="outline">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
