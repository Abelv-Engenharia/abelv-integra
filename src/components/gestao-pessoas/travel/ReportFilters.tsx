import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportFilters as ReportFiltersType } from "@/types/gestao-pessoas/travel";
import { Filter, X } from "lucide-react";

interface ReportFiltersProps {
  filters: ReportFiltersType;
  onFiltersChange: (filters: ReportFiltersType) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function ReportFilters({ filters, onFiltersChange, onApplyFilters, onClearFilters }: ReportFiltersProps) {
  const updateFilter = <K extends keyof ReportFiltersType>(key: K, value: ReportFiltersType[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataInicial">Data Inicial</Label>
            <Input
              id="dataInicial"
              type="date"
              value={filters.dataInicial || ''}
              onChange={(e) => updateFilter('dataInicial', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataFinal">Data Final</Label>
            <Input
              id="dataFinal"
              type="date"
              value={filters.dataFinal || ''}
              onChange={(e) => updateFilter('dataFinal', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agencia">Agência</Label>
            <Select
              value={filters.agencia?.[0] || 'todas'}
              onValueChange={(value) => updateFilter('agencia', value === 'todas' ? [] : [value])}
            >
              <SelectTrigger id="agencia">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="Onfly">Onfly</SelectItem>
                <SelectItem value="Biztrip">Biztrip</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Serviço</Label>
            <Select
              value={filters.tipo?.[0] || 'todos'}
              onValueChange={(value) => updateFilter('tipo', value === 'todos' ? [] : [value])}
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aereo">Aéreo</SelectItem>
                <SelectItem value="rodoviario">Rodoviário</SelectItem>
                <SelectItem value="hospedagem">Hospedagem</SelectItem>
                <SelectItem value="bagagem">Bagagem</SelectItem>
                <SelectItem value="cancelamento">Cancelamento</SelectItem>
                <SelectItem value="reembolso">Reembolso</SelectItem>
                <SelectItem value="remarcacao aereo">Remarcação Aéreo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="viajante">Viajante</Label>
            <Input
              id="viajante"
              placeholder="Nome do viajante..."
              value={filters.viajante || ''}
              onChange={(e) => updateFilter('viajante', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cca">CCA</Label>
            <Input
              id="cca"
              placeholder="Código CCA..."
              value={filters.cca?.[0] || ''}
              onChange={(e) => updateFilter('cca', e.target.value ? [e.target.value] : [])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dentroPolitica">Dentro da Política</Label>
            <Select
              value={filters.dentroPolitica || 'Todas'}
              onValueChange={(value) => updateFilter('dentroPolitica', value as 'Sim' | 'Não' | 'Todas')}
            >
              <SelectTrigger id="dentroPolitica">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Sim">Sim</SelectItem>
                <SelectItem value="Não">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorMinimo">Valor Mínimo</Label>
            <Input
              id="valorMinimo"
              type="number"
              placeholder="0.00"
              value={filters.valorMinimo || ''}
              onChange={(e) => updateFilter('valorMinimo', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valorMaximo">Valor Máximo</Label>
            <Input
              id="valorMaximo"
              type="number"
              placeholder="0.00"
              value={filters.valorMaximo || ''}
              onChange={(e) => updateFilter('valorMaximo', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onApplyFilters} className="flex-1">
            Aplicar Filtros
          </Button>
          <Button variant="outline" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
