import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

interface Requisicao {
  id: string;
  numero: string;
  data: string;
  solicitante: string;
  status: string;
  totalItens: number;
}

export default function RelacaoRequisicoes() {
  const [numeroRequisicao, setNumeroRequisicao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [status, setStatus] = useState("");

  // Mock de dados
  const requisicoes: Requisicao[] = [
    {
      id: "1",
      numero: "REQ-001",
      data: "2024-03-15",
      solicitante: "João Silva",
      status: "Pendente",
      totalItens: 5
    },
    {
      id: "2",
      numero: "REQ-002",
      data: "2024-03-14",
      solicitante: "Maria Santos",
      status: "Atendida",
      totalItens: 3
    },
    {
      id: "3",
      numero: "REQ-003",
      data: "2024-03-13",
      solicitante: "Pedro Oliveira",
      status: "Cancelada",
      totalItens: 8
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relação de Requisições</h1>
          <p className="text-muted-foreground">
            Listagem de todas as requisições de materiais
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filtro-numero">Número da requisição</Label>
              <Input
                id="filtro-numero"
                value={numeroRequisicao}
                onChange={(e) => setNumeroRequisicao(e.target.value)}
                placeholder="Digite o número"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtro-status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="atendida">Atendida</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
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
              setNumeroRequisicao("");
              setStatus("");
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
          <CardTitle>Requisições de Materiais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total de itens</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisicoes.map((requisicao) => (
                  <TableRow key={requisicao.id}>
                    <TableCell className="font-medium">{requisicao.numero}</TableCell>
                    <TableCell>{new Date(requisicao.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{requisicao.solicitante}</TableCell>
                    <TableCell>{requisicao.status}</TableCell>
                    <TableCell>{requisicao.totalItens}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/suprimentos/estoque/requisicoes/editar/${requisicao.id}`}>
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
