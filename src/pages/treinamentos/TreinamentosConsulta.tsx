
import React, { useState, useEffect } from "react";
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
  ExecucaoTreinamento, 
  TreinamentoNormativo,
  Funcionario,
  Treinamento
} from "@/types/treinamentos";
import { formatarData, getStatusColor } from "@/utils/treinamentosUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const TreinamentosConsulta = () => {
  const [searchValue, setSearchValue] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string | undefined>();
  const [execucoes, setExecucoes] = useState<ExecucaoTreinamento[]>([]);
  const [normativos, setNormativos] = useState<TreinamentoNormativo[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch execucao treinamentos
        const { data: execucoesData, error: execucoesError } = await supabase
          .from('execucao_treinamentos')
          .select('*')
          .order('data', { ascending: false });
          
        if (execucoesError) throw execucoesError;
        
        // Fetch normativos
        const { data: normativosData, error: normativosError } = await supabase
          .from('treinamentos_normativos')
          .select('*')
          .eq('arquivado', false)
          .order('data_validade');
          
        if (normativosError) throw normativosError;
        
        // Fetch funcionarios
        const { data: funcionariosData, error: funcionariosError } = await supabase
          .from('funcionarios')
          .select('*')
          .eq('ativo', true);
          
        if (funcionariosError) throw funcionariosError;
        
        // Fetch treinamentos
        const { data: treinamentosData, error: treinamentosError } = await supabase
          .from('treinamentos')
          .select('*');
          
        if (treinamentosError) throw treinamentosError;
        
        // Process data
        const execucoesProcessadas = execucoesData.map(e => ({
          ...e,
          id: e.id,
          data: new Date(e.data),
          mes: e.mes,
          ano: e.ano,
          cca: e.cca,
          cca_id: e.cca_id,
          processoTreinamento: e.processo_treinamento,
          tipoTreinamento: e.tipo_treinamento,
          treinamentoId: e.treinamento_id,
          treinamentoNome: e.treinamento_nome || treinamentosData.find(t => t.id === e.treinamento_id)?.nome || "",
          cargaHoraria: e.carga_horaria,
          observacoes: e.observacoes,
          listaPresencaUrl: e.lista_presenca_url
        }));
        
        const normativosProcessados = normativosData.map(n => {
          const treinamentoInfo = treinamentosData.find(t => t.id === n.treinamento_id);
          const funcionarioInfo = funcionariosData.find(f => f.id === n.funcionario_id);
          
          return {
            id: n.id,
            funcionario_id: n.funcionario_id,
            treinamento_id: n.treinamento_id,
            tipo: n.tipo as 'Formação' | 'Reciclagem',
            data_realizacao: new Date(n.data_realizacao),
            data_validade: new Date(n.data_validade),
            certificado_url: n.certificado_url,
            status: n.status as 'Válido' | 'Próximo ao vencimento' | 'Vencido',
            arquivado: n.arquivado,
            treinamentoNome: treinamentoInfo?.nome || "Treinamento não encontrado",
            funcionarioNome: funcionarioInfo?.nome || "Funcionário não encontrado"
          };
        });
        
        // Set state
        setExecucoes(execucoesProcessadas);
        setNormativos(normativosProcessados);
        setFuncionarios(funcionariosData);
        setTreinamentos(treinamentosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados de treinamentos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter trainings based on search and type filter
  const filteredExecucoes = execucoes.filter(execucao => {
    const matchesSearch = 
      execucao.treinamentoNome.toLowerCase().includes(searchValue.toLowerCase()) ||
      execucao.cca.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesTipo = !filtroTipo || execucao.tipoTreinamento === filtroTipo;
    
    return matchesSearch && matchesTipo;
  });
  
  // Filter normative trainings based on search
  const filteredNormativos = normativos.filter(normativo => {
    const matchesSearch = 
      normativo.treinamentoNome.toLowerCase().includes(searchValue.toLowerCase()) ||
      normativo.funcionarioNome.toLowerCase().includes(searchValue.toLowerCase());
    
    const matchesTipo = !filtroTipo || normativo.tipo === filtroTipo;
    
    return matchesSearch && matchesTipo;
  });

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

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <p>Carregando dados...</p>
        </div>
      ) : (
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
                        <TableCell>{execucao.treinamentoNome}</TableCell>
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
                        <TableCell>{formatarData(normativo.data_realizacao)}</TableCell>
                        <TableCell>{formatarData(normativo.data_validade)}</TableCell>
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
      )}

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
