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
interface Pedagio {
  id: string;
  placa: string;
  condutor: string;
  data: Date;
  local: string;
  horario: string;
  valor: number;
  tipoServico: string;
  cca: string;
  finalidade: string;
}
export function ConsultaPedagiosTab() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [pedagogios, setPedagogios] = useState<Pedagio[]>([]);
  useEffect(() => {
    const dadosLocalStorage = localStorage.getItem("semparar");
    if (dadosLocalStorage) {
      setPedagogios(JSON.parse(dadosLocalStorage));
    }
  }, []);
  const pedagogiosFiltrados = pedagogios.filter(pedagio => {
    const matchBusca = busca === "" || pedagio.placa?.toLowerCase().includes(busca.toLowerCase()) || pedagio.condutor?.toLowerCase().includes(busca.toLowerCase()) || pedagio.local?.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === "todos" || pedagio.tipoServico?.toLowerCase() === filtroTipo;
    return matchBusca && matchTipo;
  });
  return <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros de Busca</CardTitle>
            
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por placa, condutor ou local..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-10" />
            </div>
            
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="pedágio">Pedágio</SelectItem>
                <SelectItem value="estacionamento">Estacionamento</SelectItem>
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
              Transações Cadastradas ({pedagogiosFiltrados.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pedagogiosFiltrados.length === 0 ? <div className="text-center py-12">
              <p className="text-muted-foreground">
                {busca || filtroTipo !== "todos" ? "Nenhuma transação encontrada com os filtros aplicados." : "Nenhuma transação cadastrada ainda."}
              </p>
              
            </div> : <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Condutor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>CCA</TableHead>
                    <TableHead>Finalidade</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedagogiosFiltrados.map(pedagio => <TableRow key={pedagio.id}>
                      <TableCell className="font-mono">{pedagio.placa}</TableCell>
                      <TableCell>{pedagio.condutor}</TableCell>
                      <TableCell>{format(new Date(pedagio.data), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{pedagio.horario}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{pedagio.local}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {pedagio.tipoServico === "pedágio" ? "Pedágio" : "Estacionamento"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        R$ {pedagio.valor?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  })}
                      </TableCell>
                      <TableCell>{pedagio.cca}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{pedagio.finalidade}</TableCell>
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
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>}
        </CardContent>
      </Card>
    </div>;
}