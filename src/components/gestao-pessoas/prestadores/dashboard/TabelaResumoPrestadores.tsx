import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DemonstrativoPrestador } from "@/types/gestao-pessoas/dashboard-prestadores";
import { ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabelaResumoPrestadoresProps {
  dados: DemonstrativoPrestador[];
}

type OrdenacaoColuna = 'nome' | 'empresa' | 'valornf' | 'valorliquido' | null;

export function TabelaResumoPrestadores({ dados }: TabelaResumoPrestadoresProps) {
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState<OrdenacaoColuna>(null);
  const [ordem, setOrdem] = useState<'asc' | 'desc'>('desc');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 20;

  const dadosFiltrados = useMemo(() => {
    let resultado = [...dados];

    if (busca) {
      resultado = resultado.filter(d => 
        d.nome.toLowerCase().includes(busca.toLowerCase()) ||
        d.nomeempresa.toLowerCase().includes(busca.toLowerCase()) ||
        d.obra.toLowerCase().includes(busca.toLowerCase())
      );
    }

    if (ordenacao) {
      resultado.sort((a, b) => {
        let valorA: any = a[ordenacao];
        let valorB: any = b[ordenacao];

        if (typeof valorA === 'string') {
          valorA = valorA.toLowerCase();
          valorB = valorB.toLowerCase();
        }

        if (ordem === 'asc') {
          return valorA > valorB ? 1 : -1;
        } else {
          return valorA < valorB ? 1 : -1;
        }
      });
    }

    return resultado;
  }, [dados, busca, ordenacao, ordem]);

  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
  const dadosPaginados = dadosFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const toggleOrdenacao = (coluna: OrdenacaoColuna) => {
    if (ordenacao === coluna) {
      setOrdem(ordem === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdenacao(coluna);
      setOrdem('desc');
    }
  };

  const formatarMoeda = (valor: number) => 
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (dados.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tabela resumida dos prestadores</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <p className="text-muted-foreground">Sem dados para exibir</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tabela resumida dos prestadores</CardTitle>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, empresa ou obra..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPaginaAtual(1);
              }}
              className="max-w-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleOrdenacao('nome')}
                    className="h-8 px-2"
                  >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleOrdenacao('empresa')}
                    className="h-8 px-2"
                  >
                    Empresa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Ajuda aluguel</TableHead>
                <TableHead className="text-right">Reembolso conv.</TableHead>
                <TableHead className="text-right">Desconto conv.</TableHead>
                <TableHead className="text-right">Multas</TableHead>
                <TableHead className="text-right">Desconto run</TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleOrdenacao('valornf')}
                    className="h-8 px-2"
                  >
                    Valor NF
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleOrdenacao('valorliquido')}
                    className="h-8 px-2"
                  >
                    Valor líquido
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosPaginados.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.nome}</TableCell>
                  <TableCell>{item.nomeempresa}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(item.ajudaaluguel)}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(item.reembolsoconvenio)}</TableCell>
                  <TableCell className="text-right text-red-600">
                    {formatarMoeda(item.descontoconvenio)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {formatarMoeda(item.multasdescontos)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {formatarMoeda(item.descontoabelvrun)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatarMoeda(item.valornf)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-green-600">
                    {formatarMoeda(item.valorliquido)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {(paginaAtual - 1) * itensPorPagina + 1} a{" "}
              {Math.min(paginaAtual * itensPorPagina, dadosFiltrados.length)} de{" "}
              {dadosFiltrados.length} registros
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
