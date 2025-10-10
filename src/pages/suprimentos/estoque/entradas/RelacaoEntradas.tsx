import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

interface Entrada {
  id: string;
  numero: string;
  data: string;
  fornecedor: string;
  valorTotal: number;
}

export default function RelacaoEntradas() {
  const [numeroEntrada, setNumeroEntrada] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Mock de dados
  const entradas: Entrada[] = [
    {
      id: "1",
      numero: "ENT-001",
      data: "2024-03-15",
      fornecedor: "Fornecedor A",
      valorTotal: 15000.50
    },
    {
      id: "2",
      numero: "ENT-002",
      data: "2024-03-14",
      fornecedor: "Fornecedor B",
      valorTotal: 8500.00
    },
    {
      id: "3",
      numero: "ENT-003",
      data: "2024-03-13",
      fornecedor: "Fornecedor C",
      valorTotal: 22300.75
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relação de Entradas</h1>
          <p className="text-muted-foreground">
            Listagem de todas as entradas de materiais
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filtro-numero">Número da entrada</Label>
              <Input
                id="filtro-numero"
                value={numeroEntrada}
                onChange={(e) => setNumeroEntrada(e.target.value)}
                placeholder="Digite o número"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-data-inicio">Data (início)</Label>
              <Input
                id="filtro-data-inicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-data-fim">Data (fim)</Label>
              <Input
                id="filtro-data-fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setNumeroEntrada("");
              setDataInicio("");
              setDataFim("");
            }}>
              Limpar Filtros
            </Button>
            <Button>Filtrar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Entradas de Materiais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-right">Valor total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entradas.map((entrada) => (
                  <TableRow key={entrada.id}>
                    <TableCell className="font-medium">{entrada.numero}</TableCell>
                    <TableCell>{new Date(entrada.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{entrada.fornecedor}</TableCell>
                    <TableCell className="text-right">
                      R$ {entrada.valorTotal.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/suprimentos/estoque/entradas/editar/${entrada.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
