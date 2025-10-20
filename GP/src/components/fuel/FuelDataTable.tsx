import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { FuelTransaction } from "@/types/fuel";

interface FuelDataTableProps {
  data: FuelTransaction[];
  loading: boolean;
}

export const FuelDataTable: React.FC<FuelDataTableProps> = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof FuelTransaction | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const itemsPerPage = 50;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Ordenação
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  // Paginação
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: keyof FuelTransaction) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const formatCardNumber = (cardNumber: string) => {
    if (cardNumber.length > 4) {
      return `****${cardNumber.slice(-4)}`;
    }
    return cardNumber;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Carregando dados...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">Nenhum dado de abastecimento encontrado</p>
        <p className="text-sm text-muted-foreground mt-2">
          Importe um relatório para visualizar os dados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com contadores */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/10 rounded-t-lg">
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            {data.length} registros totais
          </Badge>
          <Badge variant="outline">
            {paginatedData.length} exibidos
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('motorista')}
              >
                Motorista {sortColumn === 'motorista' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('centro_custo')}
              >
                Centro de Custo {sortColumn === 'centro_custo' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('placa')}
              >
                Placa {sortColumn === 'placa' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>Modelo do Veículo</TableHead>
              <TableHead>Tipo Cartão</TableHead>
              <TableHead>Número do Cartão</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('data_hora_transacao')}
              >
                Data/Hora {sortColumn === 'data_hora_transacao' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead>UF EC</TableHead>
              <TableHead>Cidade EC</TableHead>
              <TableHead>Nome EC</TableHead>
              <TableHead>Tipo Mercadoria</TableHead>
              <TableHead>Mercadoria</TableHead>
              <TableHead className="text-right">Qtd.</TableHead>
              <TableHead 
                className="text-right cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('valor')}
              >
                Valor {sortColumn === 'valor' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.id || index}>
                <TableCell className="font-medium">{item.motorista}</TableCell>
                <TableCell>{item.centro_custo}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.placa}</Badge>
                </TableCell>
                <TableCell>{item.modelo_veiculo}</TableCell>
                <TableCell>{item.tipo_cartao}</TableCell>
                <TableCell className="font-mono text-sm">
                  {formatCardNumber(item.numero_cartao)}
                </TableCell>
                <TableCell>{formatDateTime(item.data_hora_transacao)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.uf_ec}</Badge>
                </TableCell>
                <TableCell>{item.cidade_ec}</TableCell>
                <TableCell className="max-w-40 truncate" title={item.nome_ec}>
                  {item.nome_ec}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.tipo_mercadoria}</Badge>
                </TableCell>
                <TableCell>{item.mercadoria}</TableCell>
                <TableCell className="text-right">
                  {item.qtd_mercadoria.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.valor)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, data.length)} de {data.length} registros
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm">
              {currentPage} / {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};