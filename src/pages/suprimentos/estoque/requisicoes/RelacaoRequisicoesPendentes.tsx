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
import { Search, FileText, CheckCircle } from "lucide-react";

const requisicoesPendentes = [
  { id: 1, numero: "REQ-2024-045", cca: 1001, data: "02/02/2024", valor: "R$ 4.120,00", solicitante: "João Silva" },
  { id: 2, numero: "REQ-2024-046", cca: 1002, data: "03/02/2024", valor: "R$ 2.890,00", solicitante: "Maria Santos" },
  { id: 3, numero: "REQ-2024-047", cca: 1001, data: "04/02/2024", valor: "R$ 6.450,00", solicitante: "Pedro Costa" },
  { id: 4, numero: "REQ-2024-048", cca: 1003, data: "05/02/2024", valor: "R$ 1.780,00", solicitante: "Ana Paula" },
];

export default function RelacaoRequisicoesPendentes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Requisições Pendentes</h1>
        <p className="text-muted-foreground">
          Listagem de requisições aguardando aprovação
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
              <Label htmlFor="solicitante">Solicitante</Label>
              <Input id="solicitante" placeholder="Digite o nome..." />
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
          <CardTitle>Lista de Requisições Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>CCA</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requisicoesPendentes.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.numero}</TableCell>
                  <TableCell>{req.cca}</TableCell>
                  <TableCell>{req.data}</TableCell>
                  <TableCell>{req.solicitante}</TableCell>
                  <TableCell>{req.valor}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Ver Detalhes</Button>
                      <Button variant="default" size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprovar
                      </Button>
                    </div>
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
