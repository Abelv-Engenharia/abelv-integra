import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FiltrosRelatorioPrestadores as Filtros } from "@/types/gestao-pessoas/relatorio-prestadores";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FiltrosRelatorioPrestadoresProps {
  filtros: Filtros;
  onChange: (filtros: Filtros) => void;
}

export function FiltrosRelatorioPrestadores({ filtros, onChange }: FiltrosRelatorioPrestadoresProps) {
  const limparFiltros = () => {
    onChange({
      modulos: filtros.modulos,
      dataInicial: undefined,
      dataFinal: undefined,
      prestador: undefined,
      empresa: undefined,
      status: [],
      valorMinimo: undefined,
      valorMaximo: undefined,
      tiposContrato: [],
      statusContrato: undefined,
    });
  };

  const temFiltrosAtivos = 
    filtros.dataInicial || 
    filtros.dataFinal || 
    filtros.prestador || 
    filtros.empresa || 
    filtros.valorMinimo !== undefined || 
    filtros.valorMaximo !== undefined ||
    (filtros.tiposContrato && filtros.tiposContrato.length > 0) ||
    (filtros.statusContrato && filtros.statusContrato !== 'todos');

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Etapa 3: Filtros avançados (opcional)</h3>
        {temFiltrosAtivos && (
          <Button variant="ghost" size="sm" onClick={limparFiltros}>
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Data inicial</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filtros.dataInicial ? format(filtros.dataInicial, "dd/MM/yyyy") : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filtros.dataInicial}
                onSelect={(date) => onChange({ ...filtros, dataInicial: date })}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Data final</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filtros.dataFinal ? format(filtros.dataFinal, "dd/MM/yyyy") : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filtros.dataFinal}
                onSelect={(date) => onChange({ ...filtros, dataFinal: date })}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Prestador</Label>
          <Input
            placeholder="Buscar por nome..."
            value={filtros.prestador || ''}
            onChange={(e) => onChange({ ...filtros, prestador: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Empresa</Label>
          <Input
            placeholder="Buscar por empresa..."
            value={filtros.empresa || ''}
            onChange={(e) => onChange({ ...filtros, empresa: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Valor mínimo</Label>
          <Input
            type="number"
            placeholder="R$ 0,00"
            value={filtros.valorMinimo || ''}
            onChange={(e) => onChange({ ...filtros, valorMinimo: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>

        <div className="space-y-2">
          <Label>Valor máximo</Label>
          <Input
            type="number"
            placeholder="R$ 0,00"
            value={filtros.valorMaximo || ''}
            onChange={(e) => onChange({ ...filtros, valorMaximo: e.target.value ? Number(e.target.value) : undefined })}
          />
        </div>

        {filtros.modulos.includes('contratos') && (
          <>
            <div className="space-y-2">
              <Label>Tipo de contrato</Label>
              <div className="flex flex-col gap-2 border rounded-md p-3">
                {[
                  { value: 'contrato', label: 'Contrato' },
                  { value: 'aditivo', label: 'Aditivo' },
                  { value: 'distrato', label: 'Distrato' }
                ].map((tipo) => (
                  <div key={tipo.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={tipo.value}
                      checked={filtros.tiposContrato?.includes(tipo.value) || false}
                      onCheckedChange={(checked) => {
                        const tipos = filtros.tiposContrato || [];
                        onChange({
                          ...filtros,
                          tiposContrato: checked
                            ? [...tipos, tipo.value]
                            : tipos.filter(t => t !== tipo.value)
                        });
                      }}
                    />
                    <label htmlFor={tipo.value} className="text-sm cursor-pointer">
                      {tipo.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status do contrato</Label>
              <Select
                value={filtros.statusContrato || 'todos'}
                onValueChange={(status) => onChange({ ...filtros, statusContrato: status })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="encerrado">Encerrado</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
