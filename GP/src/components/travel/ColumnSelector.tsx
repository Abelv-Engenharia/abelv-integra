import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, FileText, Search } from "lucide-react";
import { ColumnDefinition } from "@/types/travel";

interface ColumnSelectorProps {
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}

const AVAILABLE_COLUMNS: ColumnDefinition[] = [
  { key: 'dataemissaofat', label: 'Data Emissão Fat', category: 'fatura', type: 'date' },
  { key: 'agencia', label: 'Agência', category: 'fatura', type: 'text' },
  { key: 'numerodefat', label: 'Número de Fat', category: 'fatura', type: 'text' },
  { key: 'protocolo', label: 'Protocolo', category: 'fatura', type: 'text' },
  { key: 'datadacompra', label: 'Data da Compra', category: 'fatura', type: 'date' },
  { key: 'viajante', label: 'Viajante', category: 'viagem', type: 'text' },
  { key: 'tipo', label: 'Tipo', category: 'viagem', type: 'text' },
  { key: 'hospedagem', label: 'Hospedagem', category: 'viagem', type: 'text' },
  { key: 'origem', label: 'Origem', category: 'viagem', type: 'text' },
  { key: 'destino', label: 'Destino', category: 'viagem', type: 'text' },
  { key: 'checkin', label: 'Check-in', category: 'viagem', type: 'date' },
  { key: 'checkout', label: 'Check-out', category: 'viagem', type: 'date' },
  { key: 'comprador', label: 'Comprador', category: 'fatura', type: 'text' },
  { key: 'valorpago', label: 'Valor Pago', category: 'financeiro', type: 'currency' },
  { key: 'motivoevento', label: 'Motivo/Evento', category: 'outros', type: 'text' },
  { key: 'cca', label: 'CCA', category: 'financeiro', type: 'text' },
  { key: 'centrodecusto', label: 'Centro de Custo', category: 'financeiro', type: 'text' },
  { key: 'antecedencia', label: 'Antecedência', category: 'viagem', type: 'number' },
  { key: 'ciaida', label: 'Cia Ida', category: 'viagem', type: 'text' },
  { key: 'ciavolta', label: 'Cia Volta', category: 'viagem', type: 'text' },
  { key: 'possuibagagem', label: 'Possui Bagagem', category: 'viagem', type: 'text' },
  { key: 'valorpagodebagagem', label: 'Valor Pago de Bagagem', category: 'financeiro', type: 'currency' },
  { key: 'observacao', label: 'Observação', category: 'outros', type: 'text' },
  { key: 'quemsolicitouforapolitica', label: 'Quem Solicitou (Fora Política)', category: 'outros', type: 'text' },
  { key: 'dentrodapolitica', label: 'Dentro da Política', category: 'outros', type: 'boolean' },
  { key: 'codconta', label: 'Cód. Conta', category: 'financeiro', type: 'text' },
  { key: 'contafinanceira', label: 'Conta Financeira', category: 'financeiro', type: 'text' },
];

const DEFAULT_COLUMNS = [
  'dataemissaofat',
  'agencia',
  'numerodefat',
  'viajante',
  'tipo',
  'origem',
  'destino',
  'valorpago',
  'cca',
  'dentrodapolitica'
];

export function ColumnSelector({ selectedColumns, onColumnsChange }: ColumnSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredColumns = AVAILABLE_COLUMNS.filter(col =>
    col.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedColumns = filteredColumns.reduce((acc, col) => {
    if (!acc[col.category]) {
      acc[col.category] = [];
    }
    acc[col.category].push(col);
    return acc;
  }, {} as Record<string, ColumnDefinition[]>);

  const toggleColumn = (columnKey: string) => {
    if (selectedColumns.includes(columnKey)) {
      onColumnsChange(selectedColumns.filter(c => c !== columnKey));
    } else {
      onColumnsChange([...selectedColumns, columnKey]);
    }
  };

  const selectAll = () => {
    onColumnsChange(AVAILABLE_COLUMNS.map(c => c.key));
  };

  const clearAll = () => {
    onColumnsChange([]);
  };

  const restoreDefault = () => {
    onColumnsChange(DEFAULT_COLUMNS);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fatura':
        return <FileText className="h-4 w-4" />;
      case 'viagem':
        return <Calendar className="h-4 w-4" />;
      case 'financeiro':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      fatura: 'Dados da Fatura',
      viagem: 'Dados da Viagem',
      financeiro: 'Dados Financeiros',
      outros: 'Outros'
    };
    return labels[category] || category;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Seleção de Colunas</CardTitle>
          <Badge variant="secondary">
            {selectedColumns.length}/{AVAILABLE_COLUMNS.length} selecionadas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar colunas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={selectAll}>
            Selecionar Todas
          </Button>
          <Button size="sm" variant="outline" onClick={clearAll}>
            Limpar Seleção
          </Button>
          <Button size="sm" variant="outline" onClick={restoreDefault}>
            Restaurar Padrão
          </Button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {Object.entries(groupedColumns).map(([category, columns]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                {getCategoryIcon(category)}
                <span>{getCategoryLabel(category)}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.key}
                      checked={selectedColumns.includes(column.key)}
                      onCheckedChange={() => toggleColumn(column.key)}
                    />
                    <label
                      htmlFor={column.key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { AVAILABLE_COLUMNS, DEFAULT_COLUMNS };
