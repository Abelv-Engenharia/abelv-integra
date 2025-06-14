import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye, Edit, Trash2 } from "lucide-react";
import { execucaoTreinamentoService } from "@/services/treinamentos/execucaoTreinamentoService";
import { listaTreinamentosNormativosService } from "@/services/treinamentos/listaTreinamentosNormativosService";
import { fetchFuncionarios } from "@/utils/treinamentosUtils";
import { useNavigate } from "react-router-dom";
import ConfirmacaoExclusaoModal from "@/components/treinamentos/ConfirmacaoExclusaoModal";
import { toast } from "@/hooks/use-toast";
import { Tabs as ShadTabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ccaService } from "@/services/treinamentos/ccaService";
import { Funcionario } from "@/types/treinamentos";
import { FuncionarioPerfilCard } from "@/components/treinamentos/FuncionarioPerfilCard";
import { TabelaTreinamentosNormativos } from "@/components/treinamentos/TabelaTreinamentosNormativos";
import { TabelaHistoricoTreinamentos } from "@/components/treinamentos/TabelaHistoricoTreinamentos";
import { supabase } from "@/integrations/supabase/client";

// ---------------- Novo componente da aba 2 ----------------

function TreinamentosNormativosPorFuncionarioTab() {
  const [ccas, setCcas] = useState<{ id: number; codigo: string; nome: string }[]>([]);
  const [selectedCcaId, setSelectedCcaId] = useState<string | null>(null);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [selectedFuncionarioId, setSelectedFuncionarioId] = useState<string | null>(null);
  const [treinamentos, setTreinamentos] = useState<{ id: string; nome: string; validade_dias?: number }[]>([]);
  const [historicoFuncionario, setHistoricoFuncionario] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [perfilFuncionario, setPerfilFuncionario] = useState<any | null>(null);
  const [abaInterna, setAbaInterna] = useState("treinamentos");
  const [treinamentosAtual, setTreinamentosAtual] = useState<any[]>([]);
  const [historicoReciclados, setHistoricoReciclados] = useState<any[]>([]);

  useEffect(() => {
    const fetchCcas = async () => {
      const ccasData = await ccaService.getAll();
      setCcas(ccasData);
    };
    fetchCcas();
  }, []);

  useEffect(() => {
    const carregarFuncionarios = async () => {
      if (selectedCcaId) {
        setLoading(true);
        try {
          const todos = await fetchFuncionarios();
          setFuncionarios(
            todos.filter(f => f.cca_id && String(f.cca_id) === selectedCcaId)
          );
        } catch {
          toast({
            title: "Erro",
            description: "Erro ao carregar funcionários",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      } else {
        setFuncionarios([]);
      }
    };
    carregarFuncionarios();
    setSelectedFuncionarioId(null);
    setHistoricoFuncionario([]);
  }, [selectedCcaId]);

  // Pega todos os treinamentos normativos disponíveis (nome)
  useEffect(() => {
    const fetchTreinamentos = async () => {
      const tr = await listaTreinamentosNormativosService.getAll();
      setTreinamentos(tr);
    };
    fetchTreinamentos();
  }, []);

  // Quando seleciona funcionário, busca histórico desse funcionário na base (pelo id)
  useEffect(() => {
    const buscarHistoricoFuncionario = async () => {
      if (!selectedFuncionarioId) {
        setHistoricoFuncionario([]);
        return;
      }
      setLoading(true);
      try {
        // Supondo que há um service: fetch histórico de treinamentos normativos do funcionário
        // (aqui idealmente deveria ser um método próprio, mas usaremos utilitário fetchFuncionarios() p/ demo)
        // O fetchFuncionarios traz todos, então fazemos o filtro só do selecionado:
        // Este dado deveria idealmente vir da tabela histórica de execuções normativas. Aqui apenas exibe placeholder.
        // Você pode conectar ao endpoint real facilmente.
        // Vamos buscar e simular o array [{treinamento_nome, data_realizacao, data_validade, tipo, certificado_url}]
        // Suponha que há um endpoint/função: funcionario.normativosRealizados[]
        // Aqui mostramos um exemplo mock:
        setHistoricoFuncionario([
          // Exemplo
          {
            treinamento_nome: "NR 35",
            data_realizacao: "2024-05-01",
            data_validade: "2026-04-30",
            tipo: "Formação",
            certificado_url: null,
          },
        ]);
        // Para usar dados reais, substitua pelo endpoint correto.
      } catch {
        toast({
          title: "Erro",
          description: "Erro ao buscar histórico",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    buscarHistoricoFuncionario();
  }, [selectedFuncionarioId]);

  useEffect(() => {
    if (selectedFuncionarioId && funcionarios.length > 0) {
      const func = funcionarios.find(f => f.id === selectedFuncionarioId);
      setPerfilFuncionario(func || null);
    } else {
      setPerfilFuncionario(null);
    }
  }, [selectedFuncionarioId, funcionarios]);

  // Buscar treinamentos normativos por funcionário
  useEffect(() => {
    const buscarTreinamentosNormativosFuncionario = async () => {
      if (!selectedFuncionarioId) {
        setTreinamentosAtual([]);
        setHistoricoReciclados([]);
        return;
      }
      setLoading(true);
      try {
        // Busca todos os treinamentos normativos desse funcionário, ordenado por nome, data desc, só não arquivados!
        const { data, error } = await supabase
          .from('treinamentos_normativos')
          .select(`
            id, 
            treinamento_id, 
            tipo, 
            data_realizacao, 
            data_validade, 
            certificado_url, 
            status, 
            arquivado,
            lista_treinamentos_normativos (nome)
          `)
          .eq("funcionario_id", selectedFuncionarioId)
          .eq("arquivado", false)
          .order('lista_treinamentos_normativos.nome', { ascending: true })
          .order('data_realizacao', { ascending: false });

        console.log("[Treinamentos] Query params funcionario_id:", selectedFuncionarioId);
        console.log("[Treinamentos] Normativos recebidos do Supabase:", data, "Erro?:", error);

        if (error) {
          toast({
            title: "Erro",
            description: "Erro ao buscar treinamentos normativos",
            variant: "destructive",
          });
          setTreinamentosAtual([]);
          setHistoricoReciclados([]);
          return;
        }

        // Fallback: se o campo arquivado vier null, mostrar tudo (debug)
        if ((data || []).length === 0) {
          // Tenta buscar sem filtrar arquivado:
          const debugRes = await supabase
            .from('treinamentos_normativos')
            .select(`
              id, 
              treinamento_id, 
              tipo, 
              data_realizacao, 
              data_validade, 
              certificado_url, 
              status, 
              arquivado,
              lista_treinamentos_normativos (nome)
            `)
            .eq("funcionario_id", selectedFuncionarioId)
            .order('lista_treinamentos_normativos.nome', { ascending: true })
            .order('data_realizacao', { ascending: false });
          console.log("[Treinamentos][DEBUG sem arquivado] Normativos recebidos:", debugRes.data, "Erro:", debugRes.error);
        }

        const normativos: any[] = (data || []).map(row => ({
          id: row.id,
          treinamento_nome: row.lista_treinamentos_normativos?.nome || "-",
          tipo: row.tipo,
          data_realizacao: row.data_realizacao,
          data_validade: row.data_validade,
          certificado_url: row.certificado_url,
          status: row.status,
          arquivado: row.arquivado,
        }));

        // Agrupar por treinamento_nome e filtrar o mais atual para "Treinamentos" e antigos para "Histórico"
        const agrupados: { [nome: string]: any[] } = {};
        normativos.forEach(t => {
          if (!agrupados[t.treinamento_nome]) agrupados[t.treinamento_nome] = [];
          agrupados[t.treinamento_nome].push(t);
        });
        const atuais: any[] = [];
        const reciclados: any[] = [];
        Object.values(agrupados).forEach(arr => {
          // Os dados já estão ordenados por data desc, logo o primeiro é o mais novo
          if (arr.length > 0) {
            atuais.push(arr[0]);
            reciclados.push(...arr.slice(1));
          }
        });
        setTreinamentosAtual(atuais);
        setHistoricoReciclados(reciclados);
      } catch (err) {
        toast({
          title: "Erro",
          description: "Erro ao buscar treinamentos",
          variant: "destructive",
        });
        setTreinamentosAtual([]);
        setHistoricoReciclados([]);
      } finally {
        setLoading(false);
      }
    };
    buscarTreinamentosNormativosFuncionario();
  }, [selectedFuncionarioId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta de Treinamentos Normativos por Funcionário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Select value={selectedCcaId ?? ""} onValueChange={setSelectedCcaId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o CCA" />
              </SelectTrigger>
              <SelectContent>
                {ccas.map((cca) => (
                  <SelectItem key={cca.id} value={String(cca.id)}>
                    {cca.codigo} - {cca.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select 
              value={selectedFuncionarioId ?? ""} 
              onValueChange={setSelectedFuncionarioId} 
              disabled={!selectedCcaId || funcionarios.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={selectedCcaId ? "Selecione o funcionário" : "Selecione o CCA"} />
              </SelectTrigger>
              <SelectContent>
                {funcionarios.length === 0 && (
                  <div className="text-xs text-muted-foreground px-2 py-2">Nenhum funcionário encontrado</div>
                )}
                {funcionarios.map(func => (
                  <SelectItem key={func.id} value={func.id}>
                    {func.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {perfilFuncionario && (
          <FuncionarioPerfilCard funcionario={perfilFuncionario} />
        )}

        {selectedFuncionarioId && (
          <div className="mt-4">
            <ShadTabs value={abaInterna} onValueChange={setAbaInterna}>
              <TabsList>
                <TabsTrigger value="treinamentos">Treinamentos</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>
              <TabsContent value="treinamentos">
                {loading ? (
                  <div className="py-8 text-center">Carregando treinamentos...</div>
                ) : treinamentosAtual.length === 0 ? (
                  <div>
                    <TabelaTreinamentosNormativos treinamentos={treinamentosAtual} />
                    <div className="mt-4">
                      <div className="text-xs text-muted-foreground">
                        <strong>Depuração:</strong> Nenhum treinamento encontrado.<br />
                        <span>Caso espere registros, veja o console do navegador para logs detalhados e confirme se existem registros no banco para este funcionário com <code>arquivado=false</code>. 
                        Caso não tenha certeza, envie para o suporte um print do log <strong>[Treinamentos] Normativos recebidos do Supabase</strong> que aparece no console do navegador.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <TabelaTreinamentosNormativos treinamentos={treinamentosAtual} />
                )}
              </TabsContent>
              <TabsContent value="historico">
                {loading ? (
                  <div className="py-8 text-center">Carregando histórico...</div>
                ) : (
                  <TabelaHistoricoTreinamentos historico={historicoReciclados} />
                )}
              </TabsContent>
            </ShadTabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ------------------- ABA ORIGINAL -----------------------

const TreinamentosConsulta = () => {
  const [tab, setTab] = useState("realizados"); // <--- Nova aba
  const [execucoes, setExecucoes] = useState<any[]>([]);
  const [filteredExecucoes, setFilteredExecucoes] = useState<any[]>([]);
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
  const handleView = (execucao: any) => {
    if (execucao.id) {
      navigate(`/treinamentos/execucao/visualizar/${execucao.id}`);
    }
  };
  const handleEdit = (execucao: any) => {
    if (execucao.id) {
      navigate(`/treinamentos/execucao/editar/${execucao.id}`);
    }
  };
  const handleDelete = (execucao: any) => {
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

  return (
    <div className="container mx-auto py-8">
      <ShadTabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="realizados">Consulta de Treinamentos Realizados</TabsTrigger>
          <TabsTrigger value="normativo-funcionario">Consulta de Treinamentos Normativos por Funcionário</TabsTrigger>
        </TabsList>

        <TabsContent value="realizados">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-lg">Carregando execuções...</div>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Consulta de Treinamentos Realizados
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
                        <TableHead className="text-center">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExecucoes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            Nenhuma execução encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredExecucoes.map(execucao => (
                          <TableRow key={execucao.id}>
                            <TableCell>{formatDate(execucao.data)}</TableCell>
                            <TableCell className="font-medium">{execucao.treinamento_nome}</TableCell>
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
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(execucao)}
                                  title="Excluir"
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
          <ConfirmacaoExclusaoModal open={modalAberto} onOpenChange={setModalAberto} onConfirm={confirmarExclusao} />
        </TabsContent>

        <TabsContent value="normativo-funcionario">
          <TreinamentosNormativosPorFuncionarioTab />
        </TabsContent>
      </ShadTabs>
    </div>
  );
};

export default TreinamentosConsulta;

// O arquivo está ficando longo; considere pedir refatoração em breve.
