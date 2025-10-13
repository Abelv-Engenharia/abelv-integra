import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCCAs } from "@/hooks/useCCAs";
import { useNfeCompras } from "@/hooks/useNfeCompras";
import { useCredores } from "@/hooks/useCredores";

export default function EntradaMateriais() {
  const navigate = useNavigate();
  const { data: ccas = [], isLoading: ccasLoading } = useCCAs();
  const [ccaIdFiltro, setCcaIdFiltro] = useState<number | undefined>(undefined);
  const { data: nfeCompras = [], isLoading: nfeLoading } = useNfeCompras(ccaIdFiltro);
  const { data: credores = [], isLoading: credoresLoading } = useCredores();
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    cca: "all",
    credor: "all",
    documento: "",
    numeroDocumento: "",
    dataEmissaoInicio: undefined as Date | undefined,
    dataEmissaoFim: undefined as Date | undefined,
    dataMovimentoInicio: undefined as Date | undefined,
    dataMovimentoFim: undefined as Date | undefined,
    pcAbelv: "",
    pcCliente: ""
  });


  const handleFiltroChange = (campo: string, valor: any) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    
    // Aplicar filtro de CCA imediatamente
    if (campo === "cca") {
      if (valor === "all") {
        setCcaIdFiltro(undefined);
      } else {
        setCcaIdFiltro(parseInt(valor));
      }
    }
  };

  const handleFiltrar = () => {
    console.log("Filtros aplicados:", filtros);
    // Aqui seria implementada a lógica de filtro
  };

  const handleEditarEntrada = (id: string) => {
    navigate(`/suprimentos/estoque/entradas/editar/${id}`);
  };

  const DateRangePicker = ({ 
    startDate, 
    endDate, 
    onStartDateChange, 
    onEndDateChange, 
    placeholder 
  }: {
    startDate?: Date;
    endDate?: Date;
    onStartDateChange: (date: Date | undefined) => void;
    onEndDateChange: (date: Date | undefined) => void;
    placeholder: string;
  }) => (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "dd/MM/yyyy") : "Início"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={onStartDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "dd/MM/yyyy") : "Fim"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={onEndDateChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Entrada de Materiais</h1>
          <p className="text-muted-foreground">
            Registro de entrada de materiais no estoque
          </p>
        </div>
        <Button onClick={() => navigate("/suprimentos/estoque/entradas/nova-entrada")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Entrada
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
              <Label htmlFor="cca">CCA</Label>
              <Select 
                value={filtros.cca} 
                onValueChange={(value) => handleFiltroChange("cca", value)}
                disabled={ccasLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={ccasLoading ? "Carregando..." : "Selecione o CCA"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {ccas.filter(cca => cca.ativo).map((cca) => (
                    <SelectItem key={cca.id} value={cca.id.toString()}>
                      {cca.codigo} - {cca.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credor">Credor</Label>
              <Select 
                value={filtros.credor} 
                onValueChange={(value) => handleFiltroChange("credor", value)}
                disabled={credoresLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={credoresLoading ? "Carregando..." : "Selecione o credor"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {credores.map((credor) => (
                    <SelectItem key={credor.id} value={credor.id}>
                      {credor.razao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documento">Documento</Label>
              <Select value={filtros.documento} onValueChange={(value) => handleFiltroChange("documento", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NFe">NFe</SelectItem>
                  <SelectItem value="NFSe">NFSe</SelectItem>
                  <SelectItem value="ROM">ROM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroDocumento">Número do documento</Label>
              <Input
                id="numeroDocumento"
                value={filtros.numeroDocumento}
                onChange={(e) => handleFiltroChange("numeroDocumento", e.target.value)}
                placeholder="Digite o número do documento"
              />
            </div>

            <div className="space-y-2">
              <Label>Data da emissão</Label>
              <DateRangePicker
                startDate={filtros.dataEmissaoInicio}
                endDate={filtros.dataEmissaoFim}
                onStartDateChange={(date) => handleFiltroChange("dataEmissaoInicio", date)}
                onEndDateChange={(date) => handleFiltroChange("dataEmissaoFim", date)}
                placeholder="Período de emissão"
              />
            </div>

            <div className="space-y-2">
              <Label>Data do movimento</Label>
              <DateRangePicker
                startDate={filtros.dataMovimentoInicio}
                endDate={filtros.dataMovimentoFim}
                onStartDateChange={(date) => handleFiltroChange("dataMovimentoInicio", date)}
                onEndDateChange={(date) => handleFiltroChange("dataMovimentoFim", date)}
                placeholder="Período de movimento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pcAbelv">PC Abelv</Label>
              <Input
                id="pcAbelv"
                type="number"
                value={filtros.pcAbelv}
                onChange={(e) => handleFiltroChange("pcAbelv", e.target.value)}
                placeholder="Digite o PC Abelv"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pcCliente">PC Cliente</Label>
              <Input
                id="pcCliente"
                type="number"
                value={filtros.pcCliente}
                onChange={(e) => handleFiltroChange("pcCliente", e.target.value)}
                placeholder="Digite o PC Cliente"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={handleFiltrar}>
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Entradas */}
      <Card>
        <CardHeader>
          <CardTitle>Entradas Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Data emissão</TableHead>
                <TableHead>Data movimento</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Valor total</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nfeLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : nfeCompras.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    Nenhuma entrada encontrada
                  </TableCell>
                </TableRow>
              ) : (
                nfeCompras.map((nfe) => (
                  <TableRow key={nfe.id}>
                    <TableCell>NFe</TableCell>
                    <TableCell>{nfe.numero}/{nfe.id_documento}</TableCell>
                    <TableCell>{format(new Date(nfe.emissao), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{format(new Date(nfe.Movimenbto), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{nfe.id_credor}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditarEntrada(nfe.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
