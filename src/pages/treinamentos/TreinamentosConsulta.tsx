import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { ExecucaoTreinamento } from "@/types/treinamentos";
import { useNavigate } from "react-router-dom";
import ConfirmacaoExclusaoModal from "@/components/treinamentos/ConfirmacaoExclusaoModal";
import { toast } from "@/hooks/use-toast";
const TreinamentosConsulta = () => {
  const [execucoes, setExecucoes] = useState<ExecucaoTreinamento[]>([]);
  const [filteredExecucoes, setFilteredExecucoes] = useState<ExecucaoTreinamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMes, setFilterMes] = useState("todos");
  const [filterAno, setFilterAno] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);

  // Exclusion modal state
  const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    loadExecucoes();
  }, []);
  const loadExecucoes = async () => {
    try {
      setIsLoading(true);
      const data = await execucaoTreinamentoService.getAll();
      const execucoesProcessadas = data.map(item => ({
        ...item,
        id: item.id || crypto.randomUUID(),
        data: item.data,
        efetivo_mod: item.efetivo_mod || 0,
        efetivo_moi: item.efetivo_moi || 0,
        horas_totais: item.horas_totais || 0
      }));
      setExecucoes(execucoesProcessadas);
      setFilteredExecucoes(execucoesProcessadas);
    } catch (error) {
      console.error("Erro ao carregar execuções:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const filterExecucoes = () => {
    let results = execucoes.filter(execucao => {
      const term = searchTerm.toLowerCase();
      return execucao.treinamento_nome?.toLowerCase().includes(term) || execucao.cca?.toLowerCase().includes(term) || execucao.processo_treinamento?.toLowerCase().includes(term);
    });
    if (filterMes !== "todos") {
      results = results.filter(execucao => execucao.mes.toString() === filterMes);
    }
    if (filterAno !== "todos") {
      results = results.filter(execucao => execucao.ano.toString() === filterAno);
    }
    setFilteredExecucoes(results);
  };
  useEffect(() => {
    filterExecucoes();
  }, [searchTerm, filterMes, filterAno, execucoes]);
  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR");
  };

  // Opções de ação
  const handleView = (execucao: ExecucaoTreinamento) => {
    if (execucao.id) {
      navigate(`/treinamentos/execucao/visualizar/${execucao.id}`);
    }
  };
  const handleEdit = (execucao: ExecucaoTreinamento) => {
    if (execucao.id) {
      navigate(`/treinamentos/execucao/editar/${execucao.id}`);
    }
  };
  const handleDelete = (execucao: ExecucaoTreinamento) => {
    setIdParaExcluir(execucao.id || "");
    setModalAberto(true);
  };
  const confirmarExclusao = async () => {
    if (!idParaExcluir) return;
    try {
      await execucaoTreinamentoService.delete(idParaExcluir);
      toast({
        title: "Excluído!",
        description: "Execução excluída com sucesso.",
        variant: "default"
      });
      setModalAberto(false);
      loadExecucoes();
    } catch {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a execução.",
        variant: "destructive"
      });
    }
  };
  if (isLoading) {
    return <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando execuções...</div>
      </div>;
  }
  return <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consulta de Execuções de Treinamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="Buscar por treinamento, CCA ou processo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full" />
            </div>
            <Select value={filterMes} onValueChange={setFilterMes}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {Array.from({
                length: 12
              }, (_, i) => <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(2024, i).toLocaleDateString("pt-BR", {
                  month: "long"
                })}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterAno} onValueChange={setFilterAno}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Treinamento</TableHead>
                  <TableHead>CCA</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead>Efetivo</TableHead>
                  <TableHead>Horas Totais</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExecucoes.length === 0 ? <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhuma execução encontrada
                    </TableCell>
                  </TableRow> : filteredExecucoes.map(execucao => <TableRow key={execucao.id}>
                      <TableCell>{formatDate(execucao.data)}</TableCell>
                      <TableCell className="font-medium">
                        {execucao.treinamento_nome}
                      </TableCell>
                      <TableCell>{execucao.cca}</TableCell>
                      <TableCell>{execucao.processo_treinamento}</TableCell>
                      <TableCell>{execucao.tipo_treinamento}</TableCell>
                      <TableCell>{execucao.carga_horaria}h</TableCell>
                      <TableCell>
                        MOD: {execucao.efetivo_mod} / MOI: {execucao.efetivo_moi}
                      </TableCell>
                      <TableCell>{execucao.horas_totais}h</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleView(execucao)} title="Visualizar">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(execucao)} title="Editar">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(execucao)} title="Excluir" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <ConfirmacaoExclusaoModal open={modalAberto} onOpenChange={setModalAberto} onConfirm={confirmarExclusao} />
    </div>;
};
export default TreinamentosConsulta;

// O arquivo está ficando longo; considere pedir refatoração em breve.