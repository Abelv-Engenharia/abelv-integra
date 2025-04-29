
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RelatorioFiltersProps {
  onFilter: (filters: any) => void;
}

const RelatorioFilters = ({ onFilter }: RelatorioFiltersProps) => {
  const [expanded, setExpanded] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined },
    funcionario: "",
    area: "",
    status: "",
    tipo: "",
  });

  const handleResetFilters = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      funcionario: "",
      area: "",
      status: "",
      tipo: "",
    });
    setDateRange({ from: undefined, to: undefined });
  };

  const handleApplyFilters = () => {
    const filtersToApply = {
      ...filters,
      dateRange,
    };
    
    onFilter(filtersToApply);
  };

  return (
    <Card>
      <CardContent className={`p-4 ${expanded ? "pb-4" : ""}`}>
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <h3 className="text-lg font-medium mb-2 sm:mb-0">Filtros</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Ocultar filtros" : "Expandir filtros"}
            </Button>
            {expanded && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center"
                onClick={handleResetFilters}
              >
                <FilterX className="mr-1 h-4 w-4" /> Limpar
              </Button>
            )}
          </div>
        </div>

        {expanded && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        <span>Selecionar período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange as any}
                      onSelect={(selected) => {
                        setDateRange(selected as any);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Funcionário</label>
                <Input
                  placeholder="Nome do funcionário"
                  value={filters.funcionario}
                  onChange={(e) => setFilters({ ...filters, funcionario: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="Válido">Válido</SelectItem>
                    <SelectItem value="Próximo ao vencimento">Próximo ao vencimento</SelectItem>
                    <SelectItem value="Vencido">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={filters.tipo}
                  onValueChange={(value) => setFilters({ ...filters, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="Formação">Formação</SelectItem>
                    <SelectItem value="Reciclagem">Reciclagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatorioFilters;
