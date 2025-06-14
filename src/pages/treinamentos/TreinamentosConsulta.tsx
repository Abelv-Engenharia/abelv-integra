import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download } from "lucide-react";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { ExecucaoTreinamento } from "@/types/treinamentos";

const TreinamentosConsulta = () => {
  const [execucoes, setExecucoes] = useState<ExecucaoTreinamento[]>([]);
  const [filteredExecucoes, setFilteredExecucoes] = useState<ExecucaoTreinamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMes, setFilterMes] = useState("todos");
  const [filterAno, setFilterAno] = useState("todos");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExecucoes();
  }, []);

  const loadExecucoes = async () => {
    try {
      setIsLoading(true);
      const data = await execucaoTreinamentoService.getAll();
      // Process data to ensure all required fields are present and properly typed
      const execucoesProcessadas = data.map(item => ({
        ...item,
        id: item.id || crypto.randomUUID(),
        data: item.data, // Keep as string since it comes from the database as string
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
    let results = execucoes.filter((execucao) => {
      const term = searchTerm.toLowerCase();
      return (
        execucao.treinamento_nome?.toLowerCase().includes(term) ||
        execucao.cca?.toLowerCase().includes(term) ||
        execucao.processo_treinamento?.toLowerCase().includes(term)
      );
    });

    if (filterMes !== "todos") {
      results = results.filter((execucao) => execucao.mes.toString() === filterMes);
    }

    if (filterAno !== "todos") {
      results = results.filter((execucao) => execucao.ano.toString() === filterAno);
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

  const getStatusBadge = (execucao: ExecucaoTreinamento) => {
    if (execucao.lista_presenca_url) {
      return <Badge variant="default">Concluído</Badge>;
    }
    return <Badge variant="secondary">Pendente</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Carregando execuções...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consulta de Execuções de Treinamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por treinamento, CCA ou processo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterMes} onValueChange={setFilterMes}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(2024, i).toLocaleDateString("pt-BR", { month: "long" })}
                  </SelectItem>
                ))}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExecucoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhuma execução encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExecucoes.map((execucao) => (
                    <TableRow key={execucao.id}>
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreinamentosConsulta;
