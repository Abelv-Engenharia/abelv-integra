
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  MOCK_EXECUCAO_TREINAMENTOS, 
  MOCK_TREINAMENTOS, 
  MOCK_TREINAMENTOS_NORMATIVOS,
  MOCK_FUNCIONARIOS
} from "@/types/treinamentos";
import { formatarData, getStatusColor, getNomeTreinamento, calcularStatusTreinamento } from "@/utils/treinamentosUtils";

const TreinamentosConsulta = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string | undefined>();
  
  // Filter trainings based on search and type filter
  const filteredExecucoes = MOCK_EXECUCAO_TREINAMENTOS.filter(execucao => {
    const treinamento = MOCK_TREINAMENTOS.find(t => t.id === execucao.treinamentoId);
    const treinamentoNome = treinamento?.nome || execucao.treinamentoNome || "";
    
    const matchesSearch = treinamentoNome.toLowerCase().includes(searchValue.toLowerCase()) ||
                         execucao.cca.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesTipo = !filtroTipo || execucao.tipoTreinamento === filtroTipo;
    
    return matchesSearch && matchesTipo;
  });
  
  // Filter normative trainings based on search
  const filteredNormativos = MOCK_TREINAMENTOS_NORMATIVOS.filter(normativo => {
    const treinamento = MOCK_TREINAMENTOS.find(t => t.id === normativo.treinamentoId);
    const funcionario = MOCK_FUNCIONARIOS.find(f => f.id === normativo.funcionarioId);
    
    const matchesSearch = 
      (treinamento?.nome || "").toLowerCase().includes(searchValue.toLowerCase()) ||
      (funcionario?.nome || "").toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesTipo = !filtroTipo || normativo.tipo === filtroTipo;
    
    return matchesSearch && matchesTipo;
  }).map(normativo => ({
    ...normativo,
    status: calcularStatusTreinamento(normativo.dataValidade),
    treinamentoNome: MOCK_TREINAMENTOS.find(t => t.id === normativo.treinamentoId)?.nome || "",
    funcionarioNome: MOCK_FUNCIONARIOS.find(f => f.id === normativo.funcionarioId)?.nome || ""
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link to="/treinamentos/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Consulta de Treinamentos</h1>
      </div>

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Input
            placeholder="Pesquisar por nome do treinamento, funcionário ou CCA..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtro por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Interno">Interno</SelectItem>
            <SelectItem value="Externo">Externo</SelectItem>
            <SelectItem value="EAD">EAD</SelectItem>
            <SelectItem value="Híbrido">Híbrido</SelectItem>
            <SelectItem value="Formação">Formação</SelectItem>
            <SelectItem value="Reciclagem">Reciclagem</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-1" onClick={() => {
          setSearchValue("");
          setFiltroTipo(undefined);
        }}>
          <Search className="h-4 w-4" />
          Limpar filtros
        </Button>
      </div>

      <Tabs defaultValue="execucao" className="space-y-4">
        <TabsList>
          <TabsTrigger value="execucao">Registros de Execução</TabsTrigger>
          <TabsTrigger value="normativos">Treinamentos Normativos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="execucao">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Execução de Treinamentos</CardTitle>
              <CardDescription>
                Consulte os registros de execução de treinamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>CCA</TableHead>
                    <TableHead>Treinamento</TableHead>
                    <TableHead>Processo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Carga Horária</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExecucoes.map((execucao) => (
                    <TableRow key={execucao.id}>
                      <TableCell>{formatarData(execucao.data)}</TableCell>
                      <TableCell>{execucao.cca}</TableCell>
                      <TableCell>
                        {MOCK_TREINAMENTOS.find(t => t.id === execucao.treinamentoId)?.nome || 
                         execucao.treinamentoNome || "Treinamento não especificado"}
                      </TableCell>
                      <TableCell>{execucao.processoTreinamento}</TableCell>
                      <TableCell>{execucao.tipoTreinamento}</TableCell>
                      <TableCell className="text-right">{execucao.cargaHoraria}h</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredExecucoes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhum registro encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="normativos">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Treinamentos Normativos</CardTitle>
              <CardDescription>
                Consulte os registros de treinamentos normativos por funcionário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Funcionário</TableHead>
                    <TableHead>Treinamento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data Realização</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNormativos.map((normativo) => (
                    <TableRow key={normativo.id}>
                      <TableCell>{normativo.funcionarioNome}</TableCell>
                      <TableCell>{normativo.treinamentoNome}</TableCell>
                      <TableCell>{normativo.tipo}</TableCell>
                      <TableCell>{formatarData(normativo.dataRealizacao)}</TableCell>
                      <TableCell>{formatarData(normativo.dataValidade)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            normativo.status === "Válido"
                              ? "outline"
                              : normativo.status === "Próximo ao vencimento"
                              ? "secondary"
                              : "destructive"
                          }
                          className={getStatusColor(normativo.status)}
                        >
                          {normativo.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredNormativos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhum registro encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/treinamentos/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TreinamentosConsulta;
