import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusSolicitacao, PrioridadeSolicitacao, TipoServico, SolicitacaoServico } from "@/types/solicitacao";
import { useSolicitacoes } from "@/context/SolicitacoesContext";
import { Search, Download, Clock, BarChart3, FileText, CheckCircle2, AlertCircle, CheckSquare, MoreVertical, Eye, Edit, XCircle, XSquare } from "lucide-react";
import { VisualizarSolicitacaoModal } from "@/components/solicitacao/VisualizarSolicitacaoModal";
import { toast } from "sonner";

const columns = [
  { 
    status: StatusSolicitacao.EM_ANDAMENTO, 
    title: 'Solicitação realizada',
    icon: AlertCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  { 
    status: StatusSolicitacao.PENDENTE, 
    title: 'Pendente',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  { 
    status: StatusSolicitacao.AGUARDANDO_APROVACAO, 
    title: 'Aguardando Aprovação',
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  },
  { 
    status: StatusSolicitacao.APROVADO, 
    title: 'Aprovado',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  { 
    status: StatusSolicitacao.REJEITADO, 
    title: 'Rejeitado',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  { 
    status: StatusSolicitacao.CONCLUIDO, 
    title: 'Emitida',
    icon: CheckSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
];

const priorityConfig = {
  [PrioridadeSolicitacao.ALTA]: { color: "bg-red-500", label: "Alta" },
  [PrioridadeSolicitacao.MEDIA]: { color: "bg-yellow-500", label: "Média" },
  [PrioridadeSolicitacao.BAIXA]: { color: "bg-green-500", label: "Baixa" }
};

const formatTipoServico = (tipo: TipoServico) => {
  const labels: Record<TipoServico, string> = {
    [TipoServico.VOUCHER_UBER]: "Voucher Uber",
    [TipoServico.LOCACAO_VEICULO]: "Locação de Veículo",
    [TipoServico.CARTAO_ABASTECIMENTO]: "Cartão Abastecimento",
    [TipoServico.VELOE_GO]: "Veloe Go",
    [TipoServico.PASSAGENS]: "Passagens",
    [TipoServico.HOSPEDAGEM]: "Hospedagem",
    [TipoServico.LOGISTICA]: "Logística",
    [TipoServico.CORREIOS_LOGGI]: "Correios/Loggi"
  };
  return labels[tipo] || tipo;
};

export default function ControleSolicitacoes() {
  const { solicitacoes, updateSolicitacao, verificarEAtualizarStatusAutomatico } = useSolicitacoes();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [modalaberto, setModalAberto] = useState(false);
  const [solicitacaoselecionada, setSolicitacaoSelecionada] = useState<SolicitacaoServico | null>(null);

  // Verificar status automaticamente ao carregar a página
  useEffect(() => {
    verificarEAtualizarStatusAutomatico();
  }, []);

  // Verificar status periodicamente (a cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      verificarEAtualizarStatusAutomatico();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredSolicitacoes = solicitacoes.filter(solicitacao => {
    const matchesSearch = solicitacao.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solicitacao.centroCusto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || solicitacao.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || solicitacao.prioridade === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusCount = (status: StatusSolicitacao) => {
    return solicitacoes.filter(s => s.status === status).length;
  };

  const getSolicitacoesByStatus = (status: StatusSolicitacao) => {
    return filteredSolicitacoes.filter(s => s.status === status);
  };

  const handleAbrirModal = (solicitacao: SolicitacaoServico) => {
    setSolicitacaoSelecionada(solicitacao);
    setModalAberto(true);
  };

  const handleSalvar = (updates: Partial<SolicitacaoServico>) => {
    if (solicitacaoselecionada) {
      updateSolicitacao(solicitacaoselecionada.id, updates);
      toast.success("Solicitação atualizada com sucesso!");
      setModalAberto(false);
    }
  };

  const handleSalvarEAprovar = (updates: Partial<SolicitacaoServico>) => {
    if (solicitacaoselecionada) {
      updateSolicitacao(solicitacaoselecionada.id, {
        ...updates,
        status: StatusSolicitacao.AGUARDANDO_APROVACAO
      });
      toast.success("Solicitação enviada para aprovação!");
      setModalAberto(false);
    }
  };

  const handleConcluir = (id: string, dadosConclusao?: {
    observacoesconclusao: string;
    comprovanteconclusao: string;
    concluidopor: string;
  }) => {
    updateSolicitacao(id, {
      status: StatusSolicitacao.CONCLUIDO,
      dataconclusao: new Date(),
      ...dadosConclusao
    });
    toast.success("Solicitação concluída!");
    setModalAberto(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Controle de Solicitações</h1>
          <p className="text-muted-foreground">Gerencie todas as solicitações de serviços</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Solicitação realizada</p>
                <p className="text-2xl font-bold">{getStatusCount(StatusSolicitacao.EM_ANDAMENTO)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{getStatusCount(StatusSolicitacao.PENDENTE)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aguardando Aprovação</p>
                <p className="text-2xl font-bold">{getStatusCount(StatusSolicitacao.AGUARDANDO_APROVACAO)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aprovadas</p>
                <p className="text-2xl font-bold">{getStatusCount(StatusSolicitacao.APROVADO)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejeitadas</p>
                <p className="text-2xl font-bold">{getStatusCount(StatusSolicitacao.REJEITADO)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emitidas</p>
                <p className="text-2xl font-bold">{getStatusCount(StatusSolicitacao.CONCLUIDO)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Pesquisar por solicitante ou centro de custo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value={StatusSolicitacao.PENDENTE}>Pendente</SelectItem>
                <SelectItem value={StatusSolicitacao.APROVADO}>Aprovado</SelectItem>
                <SelectItem value={StatusSolicitacao.EM_ANDAMENTO}>Em Andamento</SelectItem>
                <SelectItem value={StatusSolicitacao.AGUARDANDO_APROVACAO}>Aguardando Aprovação</SelectItem>
                <SelectItem value={StatusSolicitacao.CONCLUIDO}>Concluído</SelectItem>
                <SelectItem value={StatusSolicitacao.REJEITADO}>Rejeitado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value={PrioridadeSolicitacao.ALTA}>Alta</SelectItem>
                <SelectItem value={PrioridadeSolicitacao.MEDIA}>Média</SelectItem>
                <SelectItem value={PrioridadeSolicitacao.BAIXA}>Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
        {columns.map((column) => {
          const solicitacoes = getSolicitacoesByStatus(column.status);
          const ColumnIcon = column.icon;
          
          return (
            <div key={column.status}>
              <Card className="h-full">
                <CardHeader className="pb-3 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${column.bgColor}`}>
                        <ColumnIcon className={`h-4 w-4 ${column.color}`} />
                      </div>
                      <CardTitle className="text-sm font-semibold">{column.title}</CardTitle>
                    </div>
                    <Badge variant="secondary">{solicitacoes.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto space-y-3">
                  {solicitacoes.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      Nenhuma solicitação nesta etapa
                    </div>
                  ) : (
                    solicitacoes.map((solicitacao) => (
                      <Card 
                        key={solicitacao.id} 
                        className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleAbrirModal(solicitacao)}
                      >
                        <div className="space-y-2">
                          {/* Header do Card */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${priorityConfig[solicitacao.prioridade].color}`} />
                              <span className="text-xs font-semibold text-muted-foreground">
                                #{solicitacao.id}
                              </span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleAbrirModal(solicitacao);
                                }}>
                                  <Eye className="h-3 w-3 mr-2" />
                                  Ver Detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle2 className="h-3 w-3 mr-2" />
                                  Aprovar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-3 w-3 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="h-3 w-3 mr-2" />
                                  Rejeitar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Tipo de Serviço */}
                          <h4 className="font-semibold text-sm">
                            {formatTipoServico(solicitacao.tipoServico)}
                          </h4>

                          {/* Descrição/Observações */}
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {solicitacao.observacoes || "Sem observações"}
                          </p>

                          {/* Footer do Card */}
                          <div className="pt-2 border-t space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span className="font-medium">Solicitante:</span>
                              <span className="truncate">{solicitacao.solicitante}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{solicitacao.dataSolicitacao.toLocaleDateString('pt-BR')}</span>
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {solicitacao.centroCusto}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      <VisualizarSolicitacaoModal
        open={modalaberto}
        onOpenChange={setModalAberto}
        solicitacao={solicitacaoselecionada}
        onSave={handleSalvar}
        onSaveAndApprove={handleSalvarEAprovar}
        onConcluir={handleConcluir}
      />
    </div>
  );
}