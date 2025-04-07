
import { useState } from "react";
import { ArrowLeft, Download, Filter, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import DesviosTable from "@/components/desvios/DesviosTable";

// Mock data
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const DesviosConsulta = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    year: currentYear.toString(),
    month: "",
    cca: "",
    company: "",
    status: "",
    risk: "",
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const applyFilters = () => {
    toast({
      title: "Filtros aplicados",
      description: "Os resultados foram filtrados conforme solicitado.",
    });
  };

  const clearFilters = () => {
    setFilters({
      year: currentYear.toString(),
      month: "",
      cca: "",
      company: "",
      status: "",
      risk: "",
    });
    setSearchTerm("");
    toast({
      title: "Filtros limpos",
      description: "Todos os filtros foram removidos.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          onClick={() => navigate("/desvios/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Dashboard
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Consulta de Desvios</h1>
        <p className="text-muted-foreground">
          Visualize, filtre e gerencie os desvios registrados no sistema.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar desvio..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" onClick={() => toast({ title: "Relatório gerado", description: "O relatório foi gerado com sucesso." })}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={() => toast({ title: "Exportação concluída", description: "Os dados foram exportados com sucesso." })}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Filtros Avançados</CardTitle>
          <CardDescription>
            Refine sua busca por desvios utilizando vários critérios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="grid gap-1.5">
              <label htmlFor="filter-year" className="text-sm font-medium">
                Ano
              </label>
              <Select
                value={filters.year}
                onValueChange={(value) => handleFilterChange("year", value)}
              >
                <SelectTrigger id="filter-year">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={(currentYear - 2).toString()}>{currentYear - 2}</SelectItem>
                  <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                  <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-month" className="text-sm font-medium">
                Mês
              </label>
              <Select
                value={filters.month}
                onValueChange={(value) => handleFilterChange("month", value)}
              >
                <SelectTrigger id="filter-month">
                  <SelectValue placeholder="Todos os meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="1">Janeiro</SelectItem>
                  <SelectItem value="2">Fevereiro</SelectItem>
                  <SelectItem value="3">Março</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Maio</SelectItem>
                  <SelectItem value="6">Junho</SelectItem>
                  <SelectItem value="7">Julho</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Setembro</SelectItem>
                  <SelectItem value="10">Outubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-cca" className="text-sm font-medium">
                CCA
              </label>
              <Select
                value={filters.cca}
                onValueChange={(value) => handleFilterChange("cca", value)}
              >
                <SelectTrigger id="filter-cca">
                  <SelectValue placeholder="Todos os CCAs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="CCA-001">CCA-001</SelectItem>
                  <SelectItem value="CCA-002">CCA-002</SelectItem>
                  <SelectItem value="CCA-003">CCA-003</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-company" className="text-sm font-medium">
                Empresa
              </label>
              <Select
                value={filters.company}
                onValueChange={(value) => handleFilterChange("company", value)}
              >
                <SelectTrigger id="filter-company">
                  <SelectValue placeholder="Todas as empresas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="Abelv">Abelv</SelectItem>
                  <SelectItem value="Fornecedor A">Fornecedor A</SelectItem>
                  <SelectItem value="Fornecedor B">Fornecedor B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-status" className="text-sm font-medium">
                Status da Ação
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-1.5">
              <label htmlFor="filter-risk" className="text-sm font-medium">
                Nível de Risco
              </label>
              <Select
                value={filters.risk}
                onValueChange={(value) => handleFilterChange("risk", value)}
              >
                <SelectTrigger id="filter-risk">
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Trivial">Trivial</SelectItem>
                  <SelectItem value="Tolerável">Tolerável</SelectItem>
                  <SelectItem value="Moderado">Moderado</SelectItem>
                  <SelectItem value="Substancial">Substancial</SelectItem>
                  <SelectItem value="Intolerável">Intolerável</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={clearFilters}>
            Limpar Filtros
          </Button>
          <Button onClick={applyFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Aplicar Filtros
          </Button>
        </CardFooter>
      </Card>

      {/* Deviations Table */}
      <DesviosTable />
    </div>
  );
};

export default DesviosConsulta;
