import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText } from "lucide-react";

const requisicoesEmitidas = [
  { id: 1, numero: "REQ-2024-001", cca: 1001, data: "15/01/2024", valor: "R$ 5.420,00", status: "Aprovada" },
  { id: 2, numero: "REQ-2024-002", cca: 1002, data: "18/01/2024", valor: "R$ 3.280,00", status: "Aprovada" },
  { id: 3, numero: "REQ-2024-003", cca: 1001, data: "22/01/2024", valor: "R$ 7.150,00", status: "Aprovada" },
  { id: 4, numero: "REQ-2024-004", cca: 1003, data: "25/01/2024", valor: "R$ 2.890,00", status: "Aprovada" },
];

export default function RelacaoRequisicoesEmitidas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Requisições Emitidas</h1>
        <p className="text-muted-foreground">
          Listagem de todas as requisições emitidas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="numero">Número da Requisição</Label>
              <Input id="numero" placeholder="Digite o número..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cca">CCA</Label>
              <Input id="cca" type="number" placeholder="Digite o CCA..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input id="data" type="date" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Requisições Emitidas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>CCA</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requisicoesEmitidas.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.numero}</TableCell>
                  <TableCell>{req.cca}</TableCell>
                  <TableCell>{req.data}</TableCell>
                  <TableCell>{req.valor}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      {req.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Ver Detalhes</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
