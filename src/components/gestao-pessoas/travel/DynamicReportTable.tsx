import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaturaIntegra } from "@/types/gestao-pessoas/travel";
import { AVAILABLE_COLUMNS } from "./ColumnSelector";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DynamicReportTableProps {
  data: FaturaIntegra[];
  selectedColumns: string[];
  loading?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

export function DynamicReportTable({ data, selectedColumns, loading }: DynamicReportTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const columns = AVAILABLE_COLUMNS.filter(col => selectedColumns.includes(col.key));

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof FaturaIntegra];
      const bValue = b[sortColumn as keyof FaturaIntegra];

      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const formatValue = (value: any, type: string) => {
    if (value === undefined || value === null || value === '') return '-';

    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(Number(value));
      
      case 'date':
        if (typeof value === 'string' && value.includes('-')) {
          const [year, month, day] = value.split('-');
          return `${day}/${month}/${year}`;
        }
        return value;
      
      case 'number':
        return Number(value).toLocaleString('pt-BR');
      
      case 'boolean':
        return value === 'Sim' || value === true ? (
          <Badge className="bg-green-500">Sim</Badge>
        ) : (
          <Badge variant="destructive">Não</Badge>
        );
      
      default:
        return value;
    }
  };

  const calculateTotal = (columnKey: string, type: string) => {
    if (type !== 'currency' && type !== 'number') return null;

    const total = data.reduce((sum, item) => {
      const value = item[columnKey as keyof FaturaIntegra];
      return sum + (Number(value) || 0);
    }, 0);

    if (type === 'currency') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(total);
    }

    return total.toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-semibold">Nenhum registro encontrado</p>
          <p className="text-sm">Tente ajustar os filtros aplicados</p>
        </div>
      </div>
    );
  }

  if (selectedColumns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-semibold">Nenhuma coluna selecionada</p>
          <p className="text-sm">Selecione pelo menos uma coluna para visualizar o relatório</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {sortColumn === column.key && (
                        <ArrowUpDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={row.id} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {formatValue(row[column.key], column.type)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow className="bg-muted font-semibold">
                {columns.map((column) => {
                  const total = calculateTotal(column.key, column.type);
                  return (
                    <TableCell key={column.key}>
                      {total || (column.key === columns[0].key ? 'Total:' : '')}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Registros por página:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, sortedData.length)} de {sortedData.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
