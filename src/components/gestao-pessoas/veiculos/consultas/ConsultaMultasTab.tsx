import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Edit, FileSpreadsheet, FileText } from "lucide-react";
import { format } from "date-fns";
import { VisualizarMultaModal } from "@/components/gestao-pessoas/veiculos/VisualizarMultaModal";
import { NovaMultaModal } from "@/components/gestao-pessoas/veiculos/NovaMultaModal";
import { useMultas } from "@/hooks/gestao-pessoas/useMultas";
import { useQueryClient } from "@tanstack/react-query";
import { useMigracaoLocalStorage } from "@/hooks/gestao-pessoas/useMigracaoLocalStorage";

export function ConsultaMultasTab() {
  // Migração automática
  useMigracaoLocalStorage({
    localStorageKey: "multas",
    supabaseTable: "veiculos_multas",
    migrationFlagKey: "migration_completed_multas",
    mapFunction: (multa) => ({
      numero_auto_infracao: multa.numeroAutoInfracao || multa.numero_auto_infracao,
      data_multa: multa.dataMulta || multa.data_multa,
      horario: multa.horario,
      ocorrencia: multa.ocorrencia,
      pontos: multa.pontos,
      condutor_infrator_nome: multa.condutorInfrator || multa.condutor_infrator_nome,
      placa: multa.placa?.toUpperCase(),
      data_notificacao: multa.dataNotificacao || multa.data_notificacao,
      responsavel: multa.responsavel,
      veiculo_modelo: multa.veiculo || multa.veiculo_modelo,
      locadora_nome: multa.locadora || multa.locadora_nome,
      valor: multa.valor,
      local_completo: multa.localCompleto || multa.local_completo,
      email_condutor: multa.emailCondutor || multa.email_condutor,
      numero_fatura: multa.numeroFatura || multa.numero_fatura,
      titulo_sienge: multa.tituloSienge || multa.titulo_sienge,
      indicado_orgao: multa.indicadoOrgao || multa.indicado_orgao || 'Pendente',
      status_multa: multa.statusMulta || multa.status_multa || 'Registrada',
      ativo: true,
    }),
    enabled: true,
  });
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [multaVisualizarOpen, setMultaVisualizarOpen] = useState(false);
  const [multaEditarOpen, setMultaEditarOpen] = useState(false);
  const [multaSelecionada, setMultaSelecionada] = useState<any | null>(null);
  
  const { data: multasData = [], isLoading } = useMultas();
  const queryClient = useQueryClient();
  const multasFiltradas = multasData.filter(multa => {
    const matchBusca = busca === "" || 
      multa.placa?.toLowerCase().includes(busca.toLowerCase()) || 
      multa.numero_auto_infracao?.toLowerCase().includes(busca.toLowerCase()) || 
      multa.condutor_infrator_nome?.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || multa.status_multa === filtroStatus;
    return matchBusca && matchStatus;
  });
  
  const visualizarMulta = (multa: any) => {
    setMultaSelecionada(multa);
    setMultaVisualizarOpen(true);
  };
  
  const editarMulta = (multa: any) => {
    setMultaSelecionada(multa);
    setMultaEditarOpen(true);
  };
  
  const atualizarMulta = () => {
    queryClient.invalidateQueries({ queryKey: ['multas'] });
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
              Multas Cadastradas
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
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando multas...</p>
            </div>
          ) : multasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {busca || filtroStatus !== "todos" 
                  ? "Nenhuma multa encontrada com os filtros aplicados." 
                  : "Nenhuma multa cadastrada ainda."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                      <TableCell>{multa.numero_auto_infracao}</TableCell>
                      <TableCell>{format(new Date(multa.data_multa), "dd/MM/yyyy")}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{multa.ocorrencia}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{multa.pontos} pts</Badge>
                      </TableCell>
                      <TableCell>
                        {multa.valor ? `R$ ${multa.valor.toFixed(2)}` : "-"}
                      </TableCell>
                      <TableCell>{multa.condutor_infrator_nome}</TableCell>
                      <TableCell>
                        <Badge variant={multa.indicado_orgao === "Sim" ? "default" : multa.indicado_orgao === "Não" ? "destructive" : "secondary"}>
                          {multa.indicado_orgao}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={multa.status_multa === "Registrada" ? "secondary" : "default"}>
                          {multa.status_multa}
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
            </div>
          )}
        </CardContent>
      </Card>

      <VisualizarMultaModal open={multaVisualizarOpen} onOpenChange={setMultaVisualizarOpen} multa={multaSelecionada} />

      <NovaMultaModal open={multaEditarOpen} onOpenChange={setMultaEditarOpen} multaParaEdicao={multaSelecionada} onUpdate={atualizarMulta} />
    </div>;
}