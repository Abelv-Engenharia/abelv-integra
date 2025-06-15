
import { useState } from "react";
import { ArrowLeft, Download, Filter, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import MedidasDisciplinaresTable from "@/components/medidas-disciplinares/MedidasDisciplinaresTable";
import { useCcas } from "@/hooks/useMedidasDisciplinares";

const currentYear = new Date().getFullYear();

const MedidasDisciplinaresConsulta = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    year: currentYear.toString(),
    month: "",
    cca: "",
    tipo_medida: "",
    funcionario: ""
  });

  const { data: ccas = [], isLoading: ccasLoading } = useCcas();

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
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
      tipo_medida: "",
      funcionario: ""
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
          onClick={() => navigate("/medidas-disciplinares/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Dashboard
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Consulta de Medidas Disciplinares</h1>
        <p className="text-muted-foreground">
          Visualize, filtre e gerencie todas as medidas disciplinares registradas.
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar medida disciplinar..."
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
            Refine sua busca por medidas disciplinares utilizando vários critérios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Ano */}
            <div className="grid gap-1.5">
              <label htmlFor="filter-year" className="text-sm font-medium">
                Ano
              </label>
              <Select
                value={filters.year}
                onValueChange={value => handleFilterChange("year", value)}
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
            {/* Mês */}
            <div className="grid gap-1.5">
              <label htmlFor="filter-month" className="text-sm font-medium">
                Mês
              </label>
              <Select
                value={filters.month}
                onValueChange={value => handleFilterChange("month", value)}
              >
                <SelectTrigger id="filter-month">
                  <SelectValue placeholder="Todos os meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
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
            {/* CCA */}
            <div className="grid gap-1.5">
              <label htmlFor="filter-cca" className="text-sm font-medium">
                CCA
              </label>
              <Select
                value={filters.cca}
                onValueChange={value => handleFilterChange("cca", value)}
              >
                <SelectTrigger id="filter-cca">
                  <SelectValue placeholder="Todos os CCAs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {ccas.map((cca: any) => (
                    <SelectItem value={String(cca.id)} key={cca.id}>{cca.codigo} - {cca.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Tipo de medida */}
            <div className="grid gap-1.5">
              <label htmlFor="filter-tipo-medida" className="text-sm font-medium">
                Tipo de Medida
              </label>
              <Select
                value={filters.tipo_medida}
                onValueChange={value => handleFilterChange("tipo_medida", value)}
              >
                <SelectTrigger id="filter-tipo-medida">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Advertência Verbal">Advertência Verbal</SelectItem>
                  <SelectItem value="Advertência Escrita">Advertência Escrita</SelectItem>
                  <SelectItem value="Suspensão">Suspensão</SelectItem>
                  <SelectItem value="Demissão">Demissão</SelectItem>
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
      {/* Table */}
      <MedidasDisciplinaresTable
        searchTerm={searchTerm}
        filters={filters}
      />
    </div>
  );
};

export default MedidasDisciplinaresConsulta;
