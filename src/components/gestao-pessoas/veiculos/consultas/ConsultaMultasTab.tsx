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
import type { MultaCompleta } from "@/types/gestao-pessoas/multa";
import { VisualizarMultaModal } from "@/components/gestao-pessoas/veiculos/VisualizarMultaModal";
import { NovaMultaModal } from "@/components/gestao-pessoas/veiculos/NovaMultaModal";
export function ConsultaMultasTab() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [multasData, setMultasData] = useState<MultaCompleta[]>([]);
  const [multaVisualizarOpen, setMultaVisualizarOpen] = useState(false);
  const [multaEditarOpen, setMultaEditarOpen] = useState(false);
  const [multaSelecionada, setMultaSelecionada] = useState<MultaCompleta | null>(null);
  useEffect(() => {
    carregarMultas();
  }, []);
  const carregarMultas = () => {
    const dadosLocalStorage = localStorage.getItem("multas");
    if (dadosLocalStorage) {
      setMultasData(JSON.parse(dadosLocalStorage));
    }
  };
  const multasFiltradas = multasData.filter(multa => {
    const matchBusca = busca === "" || multa.placa?.toLowerCase().includes(busca.toLowerCase()) || multa.numeroAutoInfracao?.toLowerCase().includes(busca.toLowerCase()) || multa.condutorInfrator?.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || multa.statusMulta === filtroStatus;
    return matchBusca && matchStatus;
  });
  const visualizarMulta = (multa: MultaCompleta) => {
    setMultaSelecionada(multa);
    setMultaVisualizarOpen(true);
  };
  const editarMulta = (multa: MultaCompleta) => {
    setMultaSelecionada(multa);
    setMultaEditarOpen(true);
  };
  const atualizarMulta = (multaId: string, dadosAtualizados: Partial<MultaCompleta>) => {
    setMultasData(prev => prev.map(multa => multa.id === multaId ? {
      ...multa,
      ...dadosAtualizados
    } : multa));
  };
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
              <Input placeholder="Buscar por placa, auto de infração ou condutor..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-10" />
            </div>
            
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Registrada">Registrada</SelectItem>
                <SelectItem value="Notificada">Notificada</SelectItem>
                <SelectItem value="Paga">Paga</SelectItem>
                <SelectItem value="Em Análise">Em Análise</SelectItem>
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
              Multas Cadastradas ({multasFiltradas.length})
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
          {multasFiltradas.length === 0 ? <div className="text-center py-12">
              <p className="text-muted-foreground">
                {busca || filtroStatus !== "todos" ? "Nenhuma multa encontrada com os filtros aplicados." : "Nenhuma multa cadastrada ainda."}
              </p>
              
            </div> : <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Auto Infração</TableHead>
                    <TableHead>Data Multa</TableHead>
                    <TableHead>Ocorrência</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Condutor</TableHead>
                    <TableHead>Indicado ao Órgão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {multasFiltradas.map(multa => <TableRow key={multa.id}>
                      <TableCell className="font-mono">{multa.placa}</TableCell>
                      <TableCell>{multa.numeroAutoInfracao}</TableCell>
                      <TableCell>{format(new Date(multa.dataMulta), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{multa.ocorrencia}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{multa.pontos} pts</Badge>
                      </TableCell>
                      <TableCell>
                        {multa.valor ? `R$ ${multa.valor.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell>{multa.condutorInfrator}</TableCell>
                      <TableCell>
                        <Badge variant={multa.indicadoOrgao === "Sim" ? "default" : multa.indicadoOrgao === "Não" ? "destructive" : "secondary"}>
                          {multa.indicadoOrgao}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={multa.statusMulta === "Registrada" ? "secondary" : "default"}>
                          {multa.statusMulta}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => visualizarMulta(multa)} title="Visualizar">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => editarMulta(multa)} title="Editar">
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

      <VisualizarMultaModal open={multaVisualizarOpen} onOpenChange={setMultaVisualizarOpen} multa={multaSelecionada} />

      <NovaMultaModal open={multaEditarOpen} onOpenChange={setMultaEditarOpen} multaParaEdicao={multaSelecionada} onUpdate={atualizarMulta} />
    </div>;
}