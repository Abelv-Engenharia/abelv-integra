import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, CalendarIcon, Pencil, Filter } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

const EstoqueEnvioBeneficiamento = () => {
  const navigate = useNavigate();
  const [cca, setCca] = useState("");
  const [almoxarifadoOrigem, setAlmoxarifadoOrigem] = useState("");
  const [fornecedorDestino, setFornecedorDestino] = useState("");
  const [observacao, setObservacao] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Dados mockados para a tabela
  const envios = [
    {
      id: 1,
      cca: 123,
      almoxarifadoOrigem: "Interno",
      fornecedorDestino: "Empresa A",
      dataMovimento: "2024-01-15",
      observacao: "Material para reforma",
      status: "Enviado"
    },
    {
      id: 2,
      cca: 456,
      almoxarifadoOrigem: "Externo",
      fornecedorDestino: "Empresa B",
      dataMovimento: "2024-01-16",
      observacao: "",
      status: "Pendente"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Envio Para Beneficiamento</h1>
          <p className="text-muted-foreground">
            Registro de envio de materiais para beneficiamento
          </p>
        </div>
        <Button onClick={() => navigate("/suprimentos/estoque/beneficiamento/novo-envio-beneficiamento")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Envio
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-cca">Cca</Label>
              <Input
                id="filter-cca"
                type="number"
                placeholder="Digite o CCA"
                value={cca}
                onChange={(e) => setCca(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Almoxarifado De Origem</Label>
              <Select value={almoxarifadoOrigem} onValueChange={setAlmoxarifadoOrigem}>
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
              <Label>Fornecedor De Destino</Label>
              <Select value={fornecedorDestino} onValueChange={setFornecedorDestino}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empresa_a">Empresa A</SelectItem>
                  <SelectItem value="empresa_b">Empresa B</SelectItem>
                  <SelectItem value="empresa_c">Empresa C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Do Movimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Selecionar período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="filter-observacao">Observação</Label>
              <Input
                id="filter-observacao"
                placeholder="Digite a observação"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setCca("");
                setAlmoxarifadoOrigem("");
                setFornecedorDestino("");
                setObservacao("");
                setDateRange(undefined);
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Envios */}
      <Card>
        <CardHeader>
          <CardTitle>Envios Para Beneficiamento</CardTitle>
        </CardHeader>
        <CardContent>
          {envios.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cca</TableHead>
                    <TableHead>Almoxarifado Origem</TableHead>
                    <TableHead>Fornecedor Destino</TableHead>
                    <TableHead>Data Movimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {envios.map((envio) => (
                    <TableRow key={envio.id}>
                      <TableCell className="font-medium">{envio.cca}</TableCell>
                      <TableCell>{envio.almoxarifadoOrigem}</TableCell>
                      <TableCell>{envio.fornecedorDestino}</TableCell>
                      <TableCell>{format(new Date(envio.dataMovimento), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          envio.status === "Enviado" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                          envio.status === "Pendente" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        )}>
                          {envio.status}
                        </span>
                      </TableCell>
                      <TableCell>{envio.observacao || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/suprimentos/estoque/beneficiamento/editar-envio/${envio.id}`}>
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
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhum envio para beneficiamento encontrado.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EstoqueEnvioBeneficiamento;
