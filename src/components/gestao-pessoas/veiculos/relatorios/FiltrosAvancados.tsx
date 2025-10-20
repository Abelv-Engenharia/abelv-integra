import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FiltroRelatorio } from "@/types/relatorio";

interface FiltrosAvancadosProps {
  filtros: FiltroRelatorio;
  onFiltrosChange: (filtros: FiltroRelatorio) => void;
  onAplicar: () => void;
  onLimpar: () => void;
  mostrarCampos?: {
    status?: boolean;
    condutor?: boolean;
    placa?: boolean;
    locadora?: boolean;
    cca?: boolean;
    valor?: boolean;
  };
}

export function FiltrosAvancados({
  filtros,
  onFiltrosChange,
  onAplicar,
  onLimpar,
  mostrarCampos = {}
}: FiltrosAvancadosProps) {
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  const updateFiltro = <K extends keyof FiltroRelatorio>(
    campo: K,
    valor: FiltroRelatorio[K]
  ) => {
    onFiltrosChange({ ...filtros, [campo]: valor });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <h3 className="font-semibold">Filtros Avançados</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            {mostrarFiltros ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>

        {mostrarFiltros && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Período */}
              <div className="space-y-2">
                <Label>Período</Label>
                <Select
                  value={filtros.periodo}
                  onValueChange={(value: any) => updateFiltro('periodo', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hoje">Hoje</SelectItem>
                    <SelectItem value="semana">Última Semana</SelectItem>
                    <SelectItem value="mes">Último Mês</SelectItem>
                    <SelectItem value="trimestre">Último Trimestre</SelectItem>
                    <SelectItem value="ano">Último Ano</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data Inicial */}
              {filtros.periodo === 'personalizado' && (
                <div className="space-y-2">
                  <Label>Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filtros.datainicial && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filtros.datainicial ? format(filtros.datainicial, 'dd/MM/yyyy') : 'Selecione'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filtros.datainicial}
                        onSelect={(date) => updateFiltro('datainicial', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Data Final */}
              {filtros.periodo === 'personalizado' && (
                <div className="space-y-2">
                  <Label>Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filtros.datafinal && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filtros.datafinal ? format(filtros.datafinal, 'dd/MM/yyyy') : 'Selecione'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filtros.datafinal}
                        onSelect={(date) => updateFiltro('datafinal', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Condutor */}
              {mostrarCampos.condutor && (
                <div className="space-y-2">
                  <Label>Condutor</Label>
                  <Input
                    placeholder="Nome do condutor"
                    value={filtros.condutor || ''}
                    onChange={(e) => updateFiltro('condutor', e.target.value)}
                  />
                </div>
              )}

              {/* Placa */}
              {mostrarCampos.placa && (
                <div className="space-y-2">
                  <Label>Placa</Label>
                  <Input
                    placeholder="ABC-1234"
                    value={filtros.placa || ''}
                    onChange={(e) => updateFiltro('placa', e.target.value)}
                  />
                </div>
              )}

              {/* CCA */}
              {mostrarCampos.cca && (
                <div className="space-y-2">
                  <Label>CCA/Centro de Custo</Label>
                  <Input
                    placeholder="Código CCA"
                    value={filtros.cca || ''}
                    onChange={(e) => updateFiltro('cca', e.target.value)}
                  />
                </div>
              )}

              {/* Valor Mínimo */}
              {mostrarCampos.valor && (
                <div className="space-y-2">
                  <Label>Valor Mínimo</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={filtros.valorminimo || ''}
                    onChange={(e) => updateFiltro('valorminimo', parseFloat(e.target.value))}
                  />
                </div>
              )}

              {/* Valor Máximo */}
              {mostrarCampos.valor && (
                <div className="space-y-2">
                  <Label>Valor Máximo</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={filtros.valormaximo || ''}
                    onChange={(e) => updateFiltro('valormaximo', parseFloat(e.target.value))}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onLimpar}>
                <X className="h-4 w-4 mr-2" />
                Limpar
              </Button>
              <Button onClick={onAplicar}>
                <Filter className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
