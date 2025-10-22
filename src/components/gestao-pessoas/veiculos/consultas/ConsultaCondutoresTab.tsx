import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, FileText, FileCheck, Eye, Edit, Search } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useCondutores } from "@/hooks/gestao-pessoas/useCondutores";
import { useMultas } from "@/hooks/gestao-pessoas/useMultas";
import { VisualizarCondutorModal } from "@/components/gestao-pessoas/veiculos/VisualizarCondutorModal";
import { CondutorFormModal } from "@/components/gestao-pessoas/veiculos/CondutorFormModal";
import { ExcluirDialog } from "@/components/gestao-pessoas/veiculos/ExcluirDialog";
import { useExcluirEntidade } from "@/hooks/gestao-pessoas/useExcluirEntidade";
import { Trash2 } from "lucide-react";

export function ConsultaCondutoresTab() {
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [condutorSelecionado, setCondutorSelecionado] = useState<any>(null);
  const [visualizarOpen, setVisualizarOpen] = useState(false);
  const [editarOpen, setEditarOpen] = useState(false);
  const [excluirOpen, setExcluirOpen] = useState(false);

  const excluirMutation = useExcluirEntidade({ tabela: 'veiculos_condutores', queryKey: ['condutores'], onSuccess: () => setExcluirOpen(false) });
  
  const { data: condutores = [], isLoading: loadingCondutores } = useCondutores();
  const { data: multasData = [], isLoading: loadingMultas } = useMultas();
  const condutoresFiltrados = condutores.filter(condutor => {
    const nomeCondutor = condutor.nome_condutor || "";
    const matchBusca = busca === "" || 
      nomeCondutor.toLowerCase().includes(busca.toLowerCase()) || 
      condutor.cpf?.replace(/\D/g, "").includes(busca.replace(/\D/g, ""));
    const matchCategoria = filtroCategoria === "todos" || condutor.categoria_cnh === filtroCategoria;
    const matchStatus = filtroStatus === "todos" || condutor.status_cnh?.toLowerCase() === filtroStatus;
    return matchBusca && matchCategoria && matchStatus;
  });
  
  const calcularPontuacaoCondutor = (nomeCondutor: string): number => {
    return multasData.filter(multa => multa.condutor_infrator_nome === nomeCondutor)
      .reduce((total, multa) => total + (multa.pontos || 0), 0);
  };
  const getStatusCnhBadge = (validadeCnh: Date) => {
    const diasRestantes = differenceInDays(new Date(validadeCnh), new Date());
    if (diasRestantes < 0) {
      return <Badge variant="destructive">Vencida</Badge>;
    } else if (diasRestantes <= 30) {
      return <Badge className="bg-yellow-500">Vencendo em {diasRestantes} dias</Badge>;
    } else {
      return <Badge variant="default">Válida</Badge>;
    }
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nome ou CPF..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-10" />
            </div>
            
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria CNH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Categorias</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
                <SelectItem value="AB">AB</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status CNH" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="válida">Válida</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
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
              Condutores Cadastrados ({condutoresFiltrados.length})
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
          {loadingCondutores || loadingMultas ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando condutores...</p>
            </div>
          ) : condutoresFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {busca || filtroCategoria !== "todos" || filtroStatus !== "todos" 
                  ? "Nenhum condutor encontrado com os filtros aplicados." 
                  : "Nenhum condutor cadastrado ainda."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Categoria CNH</TableHead>
                    <TableHead>Validade CNH</TableHead>
                    <TableHead>Pontuação</TableHead>
                    <TableHead>Status CNH</TableHead>
                    <TableHead>Termo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {condutoresFiltrados.map(condutor => <TableRow key={condutor.id}>
                      <TableCell className="font-medium">{condutor.nome_condutor || "-"}</TableCell>
                      <TableCell className="font-mono">{condutor.cpf}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{condutor.categoria_cnh}</Badge>
                      </TableCell>
                      <TableCell>{format(new Date(condutor.validade_cnh), "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        {(() => {
                    const pontuacaoTotal = calcularPontuacaoCondutor(condutor.nome_condutor || "");
                    return <Badge variant={pontuacaoTotal >= 20 ? "destructive" : pontuacaoTotal >= 10 ? "default" : "secondary"}>
                              {pontuacaoTotal} pts
                            </Badge>;
                  })()}
                      </TableCell>
                      <TableCell>
                        {getStatusCnhBadge(new Date(condutor.validade_cnh))}
                      </TableCell>
                      <TableCell>
                        {condutor.termo_anexado_nome ? <Badge variant="default" className="gap-1">
                            <FileCheck className="h-3 w-3" />
                            Sim
                          </Badge> : <Badge variant="secondary">Não</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" title="Visualizar" onClick={() => { setCondutorSelecionado(condutor); setVisualizarOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Editar" onClick={() => { setCondutorSelecionado(condutor); setEditarOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Excluir" onClick={() => { setCondutorSelecionado(condutor); setExcluirOpen(true); }}>
                            <Trash2 className="h-4 w-4" />
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

      <VisualizarCondutorModal condutor={condutorSelecionado} open={visualizarOpen} onOpenChange={setVisualizarOpen} onEditar={() => { setVisualizarOpen(false); setEditarOpen(true); }} />
      <CondutorFormModal open={editarOpen} onOpenChange={setEditarOpen} itemParaEdicao={condutorSelecionado} />
      <ExcluirDialog open={excluirOpen} onOpenChange={setExcluirOpen} titulo="Excluir Condutor" descricao={`Tem certeza que deseja excluir o condutor ${condutorSelecionado?.nome_condutor}?`} onConfirmar={() => excluirMutation.mutate(condutorSelecionado?.id)} isLoading={excluirMutation.isPending} />
    </div>;
}