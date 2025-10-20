import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Edit, FileSpreadsheet, FileText } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface Veiculo {
  id: string;
  status: string;
  locadora: string;
  tipo: string;
  placa: string;
  modelo: string;
  franquiaKm: string;
  condutorPrincipal: string;
  dataRetirada: Date;
  dataDevolucao: Date;
}

export function ConsultaVeiculosTab() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  useEffect(() => {
    const dadosLocalStorage = localStorage.getItem("veiculos");
    if (dadosLocalStorage) {
      setVeiculos(JSON.parse(dadosLocalStorage));
    }
  }, []);

  const veiculosFiltrados = veiculos.filter(veiculo => {
    const matchBusca = busca === "" || 
      veiculo.placa.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.condutorPrincipal.toLowerCase().includes(busca.toLowerCase());
    
    const matchStatus = filtroStatus === "todos" || veiculo.status.toLowerCase() === filtroStatus;
    const matchTipo = filtroTipo === "todos" || veiculo.tipo.toLowerCase() === filtroTipo;

    return matchBusca && matchStatus && matchTipo;
  });

  const exportarExcel = () => {
    toast({
      title: "Exportando para Excel",
      description: "O arquivo será baixado em instantes...",
    });
  };

  const exportarPDF = () => {
    toast({
      title: "Exportando para PDF",
      description: "O arquivo será baixado em instantes...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros de Busca</CardTitle>
            <Button onClick={() => navigate("/cadastro-veiculo")}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Veículo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por placa, modelo ou condutor..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="encerrado">Encerrado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="esporadico">Esporádico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Veículos Cadastrados ({veiculosFiltrados.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportarExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={exportarPDF}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {veiculosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {busca || filtroStatus !== "todos" || filtroTipo !== "todos"
                  ? "Nenhum veículo encontrado com os filtros aplicados."
                  : "Nenhum veículo cadastrado ainda."}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/cadastro-veiculo")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Veículo
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Locadora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Placa</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Franquia Km</TableHead>
                    <TableHead>Condutor Principal</TableHead>
                    <TableHead>Data Retirada</TableHead>
                    <TableHead>Data Devolução</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {veiculosFiltrados.map((veiculo) => (
                    <TableRow key={veiculo.id}>
                      <TableCell>
                        <Badge variant={veiculo.status === "ativo" ? "default" : "secondary"}>
                          {veiculo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{veiculo.locadora}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {veiculo.tipo === "mensal" ? "Mensal" : "Esporádico"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{veiculo.placa}</TableCell>
                      <TableCell>{veiculo.modelo}</TableCell>
                      <TableCell>{veiculo.franquiaKm}</TableCell>
                      <TableCell>{veiculo.condutorPrincipal}</TableCell>
                      <TableCell>{format(new Date(veiculo.dataRetirada), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{format(new Date(veiculo.dataDevolucao), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}