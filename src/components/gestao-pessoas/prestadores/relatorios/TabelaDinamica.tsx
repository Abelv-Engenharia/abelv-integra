import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { DadosModulo } from "@/types/gestao-pessoas/relatorio-prestadores";
import { MODULOS_CONFIG } from "@/config/gestao-pessoas/colunas-prestadores";

interface TabelaDinamicaProps {
  dadosModulo: DadosModulo;
}

export function TabelaDinamica({ dadosModulo }: TabelaDinamicaProps) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [ordenacao, setOrdenacao] = useState<{ coluna: string; ordem: 'asc' | 'desc' } | null>(null);

  const config = MODULOS_CONFIG.find(m => m.id === dadosModulo.modulo);
  const colunas = config?.colunas.filter(c => dadosModulo.colunasSelecionadas.includes(c.key)) || [];

  const dadosOrdenados = useMemo(() => {
    if (!ordenacao) return dadosModulo.dados;

    return [...dadosModulo.dados].sort((a, b) => {
      const valorA = a[ordenacao.coluna];
      const valorB = b[ordenacao.coluna];

      if (valorA === valorB) return 0;
      
      const comparacao = valorA < valorB ? -1 : 1;
      return ordenacao.ordem === 'asc' ? comparacao : -comparacao;
    });
  }, [dadosModulo.dados, ordenacao]);

  const totalPaginas = Math.ceil(dadosOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const dadosPagina = dadosOrdenados.slice(inicio, fim);

  const formatarValor = (valor: any, tipo: string): string => {
    if (valor === undefined || valor === null) return '-';
    
    switch (tipo) {
      case 'currency':
        return Number(valor).toLocaleString('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        });
      case 'date':
        return new Date(valor).toLocaleDateString('pt-BR');
      case 'number':
        return Number(valor).toLocaleString('pt-BR');
      case 'boolean':
        return valor ? 'Sim' : 'Não';
      default:
        return String(valor);
    }
  };

  const calcularTotal = (key: string, tipo: string): string => {
    if (tipo !== 'currency' && tipo !== 'number') return '';
    
    const total = dadosModulo.dados.reduce((sum, item) => 
      sum + (Number(item[key]) || 0), 0
    );
    
    return formatarValor(total, tipo);
  };

  const toggleOrdenacao = (coluna: string) => {
    if (ordenacao?.coluna === coluna) {
      setOrdenacao({
        coluna,
        ordem: ordenacao.ordem === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setOrdenacao({ coluna, ordem: 'asc' });
    }
  };

  if (dadosModulo.dados.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{dadosModulo.titulo}</h3>
        <p className="text-muted-foreground">Nenhum dado encontrado para este módulo.</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {dadosModulo.titulo} ({dadosModulo.dados.length} registros)
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Itens por página:</span>
          <Select
            value={String(itensPorPagina)}
            onValueChange={(value) => {
              setItensPorPagina(Number(value));
              setPaginaAtual(1);
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
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {colunas.map((coluna) => (
                <TableHead 
                  key={coluna.key}
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => toggleOrdenacao(coluna.key)}
                >
                  <div className="flex items-center gap-2">
                    {coluna.label}
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dadosPagina.map((item, index) => (
              <TableRow key={index}>
                {colunas.map((coluna) => (
                  <TableCell key={coluna.key}>
                    {formatarValor(item[coluna.key], coluna.type)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow className="bg-muted font-semibold">
              {colunas.map((coluna, index) => (
                <TableCell key={coluna.key}>
                  {index === 0 ? 'TOTAL' : calcularTotal(coluna.key, coluna.type)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {inicio + 1} a {Math.min(fim, dadosOrdenados.length)} de {dadosOrdenados.length} registros
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm py-2 px-3">
              Página {paginaAtual} de {totalPaginas}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
