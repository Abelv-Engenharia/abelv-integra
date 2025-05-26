
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { TreinamentoNormativo, ExecucaoTreinamento, Funcionario, Treinamento } from "@/types/treinamentos";
import { fetchTreinamentosNormativos } from "@/services/treinamentos/treinamentosNormativosService";
import { fetchExecucaoTreinamentos } from "@/services/treinamentos/execucaoTreinamentoService";
import { fetchFuncionarios } from "@/services/treinamentos/funcionariosService";
import { fetchTreinamentos } from "@/services/treinamentos/treinamentosService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const TreinamentosConsulta = () => {
  const [activeTab, setActiveTab] = useState("normativos");
  const [searchTerm, setSearchTerm] = useState("");
  const [normativosData, setNormativosData] = useState<TreinamentoNormativo[]>([]);
  const [execucaoData, setExecucaoData] = useState<ExecucaoTreinamento[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [treinamentos, setTreinamentos] = useState<Treinamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [normativosResult, execucaoResult, funcionariosResult, treinamentosResult] = await Promise.all([
          fetchTreinamentosNormativos(),
          fetchExecucaoTreinamentos(),
          fetchFuncionarios(),
          fetchTreinamentos()
        ]);
        
        // Process and enrich normativo data
        const processedNormativos = normativosResult.map(normativo => {
          const funcionario = funcionariosResult.find(f => f.id === normativo.funcionario_id);
          const treinamento = treinamentosResult.find(t => t.id === normativo.treinamento_id);
          
          return {
            ...normativo,
            funcionarioNome: funcionario?.nome || "Desconhecido",
            treinamentoNome: treinamento?.nome || "Desconhecido"
          };
        });
        
        setNormativosData(processedNormativos);
        setExecucaoData(execucaoResult);
        setFuncionarios(funcionariosResult);
        setTreinamentos(treinamentosResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter data based on search term
  const filteredNormativos = normativosData.filter(item => 
    item.funcionarioNome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.treinamentoNome?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredExecucao = execucaoData.filter(item => 
    item.treinamento_nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.cca.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.tipo_treinamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date to readable string
  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Get status color class
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Válido":
        return "bg-green-100 text-green-800";
      case "Próximo ao vencimento":
        return "bg-amber-100 text-amber-800";
      case "Vencido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Consulta de Treinamentos</h1>
        <p className="text-muted-foreground">
          Consulte os registros de treinamentos normativos e execuções de treinamentos
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar treinamentos..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="normativos" onValueChange={setActiveTab} value={activeTab}>
        <TabsList>
          <TabsTrigger value="normativos">Treinamentos Normativos</TabsTrigger>
          <TabsTrigger value="execucao">Execução de Treinamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="normativos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Treinamentos Normativos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-6">
                  <p>Carregando treinamentos normativos...</p>
                </div>
              ) : filteredNormativos.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Funcionário</TableHead>
                        <TableHead>Treinamento</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Data Realização</TableHead>
                        <TableHead>Data Validade</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNormativos.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.funcionarioNome}</TableCell>
                          <TableCell>{item.treinamentoNome}</TableCell>
                          <TableCell>{item.tipo}</TableCell>
                          <TableCell>{formatDate(item.data_realizacao)}</TableCell>
                          <TableCell>{formatDate(item.data_validade)}</TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex justify-center p-6">
                  <p className="text-muted-foreground">
                    Nenhum treinamento normativo encontrado.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="execucao" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Execução de Treinamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-6">
                  <p>Carregando execução de treinamentos...</p>
                </div>
              ) : filteredExecucao.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Treinamento</TableHead>
                        <TableHead>Processo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Carga Horária</TableHead>
                        <TableHead>CCA</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExecucao.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.treinamento_nome || "N/A"}</TableCell>
                          <TableCell>{item.processo_treinamento}</TableCell>
                          <TableCell>{item.tipo_treinamento}</TableCell>
                          <TableCell>{item.carga_horaria} horas</TableCell>
                          <TableCell>{item.cca}</TableCell>
                          <TableCell>{formatDate(item.data)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex justify-center p-6">
                  <p className="text-muted-foreground">
                    Nenhuma execução de treinamento encontrada.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TreinamentosConsulta;
