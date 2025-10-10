import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const EstoqueTransferenciaCCAs = () => {
  const navigate = useNavigate();
  
  const [filtros, setFiltros] = useState({
    ccaOrigem: "",
    almoxarifadoOrigem: "",
    ccaDestino: "",
    almoxarifadoDestino: "",
    requisitante: "",
    observacao: "",
    dataInicio: "",
    dataFim: ""
  });

  // Dados mock para a tabela
  const transferencias = [
    {
      id: 1,
      ccaOrigem: "001",
      almoxarifadoOrigem: "Interno",
      ccaDestino: "002",
      almoxarifadoDestino: "Externo",
      requisitante: "João",
      dataMovimento: "2024-01-15",
      observacao: "Transferência urgente",
      valor: "R$ 1.500,00"
    },
    {
      id: 2,
      ccaOrigem: "003",
      almoxarifadoOrigem: "Externo",
      ccaDestino: "001",
      almoxarifadoDestino: "Interno",
      requisitante: "Carlos",
      dataMovimento: "2024-01-20",
      observacao: "Material para obra",
      valor: "R$ 2.300,00"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transferência Entre CCAs</h1>
          <p className="text-muted-foreground">
            Transferência de materiais entre CCAs
          </p>
        </div>
        <Button onClick={() => navigate("/suprimentos/estoque/transferencias/nova-transferencia-ccas")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transferência
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ccaOrigem">CCA origem *</Label>
              <Input
                id="ccaOrigem"
                type="number"
                placeholder="Digite o CCA origem"
                value={filtros.ccaOrigem}
                onChange={(e) => setFiltros({...filtros, ccaOrigem: e.target.value})}
                className={!filtros.ccaOrigem ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="almoxarifadoOrigem">Almoxarifado origem</Label>
              <Select value={filtros.almoxarifadoOrigem} onValueChange={(value) => setFiltros({...filtros, almoxarifadoOrigem: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o almoxarifado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ccaDestino">CCA destino *</Label>
              <Input
                id="ccaDestino"
                type="number"
                placeholder="Digite o CCA destino"
                value={filtros.ccaDestino}
                onChange={(e) => setFiltros({...filtros, ccaDestino: e.target.value})}
                className={!filtros.ccaDestino ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="almoxarifadoDestino">Almoxarifado destino</Label>
              <Select value={filtros.almoxarifadoDestino} onValueChange={(value) => setFiltros({...filtros, almoxarifadoDestino: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o almoxarifado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requisitante">Requisitante</Label>
              <Select value={filtros.requisitante} onValueChange={(value) => setFiltros({...filtros, requisitante: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o requisitante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joao">João</SelectItem>
                  <SelectItem value="carlos">Carlos</SelectItem>
                  <SelectItem value="marcos">Marcos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacao">Observação</Label>
              <Input
                id="observacao"
                placeholder="Digite a observação"
                value={filtros.observacao}
                onChange={(e) => setFiltros({...filtros, observacao: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data início *</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                className={!filtros.dataInicio ? "border-red-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data fim *</Label>
              <Input
                id="dataFim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                className={!filtros.dataFim ? "border-red-500" : ""}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button>Pesquisar</Button>
            <Button variant="outline" onClick={() => setFiltros({
              ccaOrigem: "",
              almoxarifadoOrigem: "",
              ccaDestino: "",
              almoxarifadoDestino: "",
              requisitante: "",
              observacao: "",
              dataInicio: "",
              dataFim: ""
            })}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transferências */}
      <Card>
        <CardHeader>
          <CardTitle>Transferências</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CCA Origem</TableHead>
                <TableHead>Almox. Origem</TableHead>
                <TableHead>CCA Destino</TableHead>
                <TableHead>Almox. Destino</TableHead>
                <TableHead>Requisitante</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferencias.length > 0 ? (
                transferencias.map((transferencia) => (
                  <TableRow key={transferencia.id}>
                    <TableCell>{transferencia.ccaOrigem}</TableCell>
                    <TableCell>{transferencia.almoxarifadoOrigem}</TableCell>
                    <TableCell>{transferencia.ccaDestino}</TableCell>
                    <TableCell>{transferencia.almoxarifadoDestino}</TableCell>
                    <TableCell>{transferencia.requisitante}</TableCell>
                    <TableCell>{new Date(transferencia.dataMovimento).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{transferencia.observacao}</TableCell>
                    <TableCell>{transferencia.valor}</TableCell>
                    <TableCell>
                      <Link to={`/suprimentos/estoque/transferencias/editar/${transferencia.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Nenhuma transferência encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueTransferenciaCCAs;
