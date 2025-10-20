import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { FuelTransaction, FuelFilters as FuelFiltersType } from "@/types/fuel";

interface FuelFiltersProps {
  filters: FuelFiltersType;
  onFiltersChange: (filters: FuelFiltersType) => void;
  data: FuelTransaction[];
  onReset: () => void;
}

export const FuelFilters: React.FC<FuelFiltersProps> = ({
  filters,
  onFiltersChange,
  data,
  onReset
}) => {
  // Extrair valores únicos dos dados
  const uniqueValues = React.useMemo(() => {
    return {
      motoristas: [...new Set(data.map(item => item.motorista))].filter(Boolean).sort(),
      centrosCusto: [...new Set(data.map(item => item.centro_custo))].filter(Boolean).sort(),
      tiposMercadoria: [...new Set(data.map(item => item.tipo_mercadoria))].filter(Boolean).sort(),
      cidades: [...new Set(data.map(item => item.cidade_ec))].filter(Boolean).sort(),
      ufs: [...new Set(data.map(item => item.uf_ec))].filter(Boolean).sort(),
    };
  }, [data]);

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== null && value !== ""
  ).length;

  const handleFilterChange = (key: keyof FuelFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtros</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-auto p-1 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Motorista */}
            <div>
              <label className="text-sm font-medium mb-2 block">Motorista</label>
              <Select
                value={filters.motorista || ""}
                onValueChange={(value) => handleFilterChange('motorista', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos os motoristas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os motoristas</SelectItem>
                  {uniqueValues.motoristas.map((motorista) => (
                    <SelectItem key={motorista} value={motorista}>
                      {motorista}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Centro de Custo */}
            <div>
              <label className="text-sm font-medium mb-2 block">Centro de Custo</label>
              <Select
                value={filters.centro_custo || ""}
                onValueChange={(value) => handleFilterChange('centro_custo', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos os centros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os centros</SelectItem>
                  {uniqueValues.centrosCusto.map((centro) => (
                    <SelectItem key={centro} value={centro}>
                      {centro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Data Inicial</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
                        !filters.data_inicial && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.data_inicial ? (
                        format(filters.data_inicial, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Data inicial</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.data_inicial}
                      onSelect={(date) => handleFilterChange('data_inicial', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Data Final</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-full justify-start text-left font-normal",
                        !filters.data_final && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.data_final ? (
                        format(filters.data_final, "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Data final</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.data_final}
                      onSelect={(date) => handleFilterChange('data_final', date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Tipo Mercadoria */}
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo Mercadoria</label>
              <Select
                value={filters.tipo_mercadoria || ""}
                onValueChange={(value) => handleFilterChange('tipo_mercadoria', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {uniqueValues.tiposMercadoria.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cidade EC */}
            <div>
              <label className="text-sm font-medium mb-2 block">Cidade EC</label>
              <Select
                value={filters.cidade_ec || ""}
                onValueChange={(value) => handleFilterChange('cidade_ec', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todas as cidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as cidades</SelectItem>
                  {uniqueValues.cidades.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* UF EC */}
            <div>
              <label className="text-sm font-medium mb-2 block">UF EC</label>
              <Select
                value={filters.uf_ec || ""}
                onValueChange={(value) => handleFilterChange('uf_ec', value)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todas as UFs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as UFs</SelectItem>
                  {uniqueValues.ufs.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};