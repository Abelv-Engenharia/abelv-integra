import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Pencil, CalendarIcon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCCAs } from "@/hooks/useCCAs";

const EstoqueTransferenciaAlmoxarifados = () => {
  const navigate = useNavigate();
  const { data: ccas, isLoading: isLoadingCcas } = useCCAs();
  const [cca, setCca] = useState("");
  const [almoxarifadoOrigem, setAlmoxarifadoOrigem] = useState("");
  const [almoxarifadoDestino, setAlmoxarifadoDestino] = useState("");
  const [observacao, setObservacao] = useState("");
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();

  // Mock data para a tabela
  const transferencias = [
    {
      id: 1,
      cca: 123,
      almoxarifadoOrigem: "Interno",
      almoxarifadoDestino: "Externo",
      observacao: "Transferência de emergência",
      dataMovimento: "2024-01-15",
      status: "Finalizada"
    },
    {
      id: 2,
      cca: 456,
      almoxarifadoOrigem: "Externo",
      almoxarifadoDestino: "Interno",
      observacao: "Reposição de estoque",
      dataMovimento: "2024-01-14",
      status: "Em processamento"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transferência Entre Almoxarifados</h1>
          <p className="text-muted-foreground">
            Transferência de materiais entre almoxarifados
          </p>
        </div>
        <Button onClick={() => navigate("/suprimentos/estoque/transferencias/nova-transferencia-almoxarifados")}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cca">Cca</Label>
              <Select value={cca} onValueChange={setCca} disabled={isLoadingCcas}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCcas ? "Carregando..." : "Selecione o CCA"} />
                </SelectTrigger>
                <SelectContent>
                  {ccas?.map((ccaItem) => (
                    <SelectItem key={ccaItem.id} value={ccaItem.id.toString()}>
                      {ccaItem.codigo} - {ccaItem.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="almoxarifado-origem">Almoxarifado de origem</Label>
              <Select value={almoxarifadoOrigem} onValueChange={setAlmoxarifadoOrigem}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="almoxarifado-destino">Almoxarifado de destino</Label>
              <Select value={almoxarifadoDestino} onValueChange={setAlmoxarifadoDestino}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interno">Interno</SelectItem>
                  <SelectItem value="externo">Externo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacao">Observação</Label>
              <Input
                id="observacao"
                placeholder="Digite a observação"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Data início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecione"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2">
            <Button>Buscar</Button>
            <Button variant="outline">Limpar Filtros</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Transferências */}
      <Card>
        <CardHeader>
          <CardTitle>Transferências Entre Almoxarifados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cca</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Observação</TableHead>
                <TableHead>Data movimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transferencias.map((transferencia) => (
                <TableRow key={transferencia.id}>
                  <TableCell>{transferencia.cca}</TableCell>
                  <TableCell>{transferencia.almoxarifadoOrigem}</TableCell>
                  <TableCell>{transferencia.almoxarifadoDestino}</TableCell>
                  <TableCell>{transferencia.observacao}</TableCell>
                  <TableCell>{format(new Date(transferencia.dataMovimento), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{transferencia.status}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/suprimentos/estoque/transferencias/editar/${transferencia.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueTransferenciaAlmoxarifados;
