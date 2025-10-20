import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/gestao-pessoas/solicitacao/CategoryCard";
import { SimpleDynamicForm } from "@/components/gestao-pessoas/solicitacao/SimpleDynamicForm";
import { MultipleServiceForm } from "@/components/gestao-pessoas/solicitacao/MultipleServiceForm";
import { TipoServico, SolicitacaoServico, StatusSolicitacao } from "@/types/gestao-pessoas/solicitacao";
import { categoriesInfo, responsavelAtendimento } from "@/data/gestao-pessoas/mockSolicitacoes";
import { Search, Plus, Layers, Clock, CheckCircle2, AlertCircle, CheckSquare, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSolicitacoes } from "@/contexts/gestao-pessoas/SolicitacoesContext";
import { useUsuarioAtivo } from "@/hooks/useUsuarioAtivo";
import { SolicitacaoKanbanColumn } from "@/components/gestao-pessoas/solicitacao/SolicitacaoKanbanColumn";
import { VisualizarSolicitacaoModal } from "@/components/gestao-pessoas/solicitacao/VisualizarSolicitacaoModal";
export default function SolicitacaoServicos() {
  const [selectedCategory, setSelectedCategory] = useState<TipoServico | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showMultipleForm, setShowMultipleForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<SolicitacaoServico | null>(null);
  const {
    toast
  } = useToast();
  const {
    solicitacoes,
    addSolicitacao,
    verificarEAtualizarStatusAutomatico
  } = useSolicitacoes();
  const usuarioAtivo = useUsuarioAtivo();

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
  const handleCategorySelect = (category: TipoServico) => {
    setSelectedCategory(category);
    setShowForm(true);
  };
  const handleFormSubmit = (data: any) => {
    // Adicionar o nome do usuário logado à solicitação
    const solicitacaoComUsuario = {
      ...data,
      solicitante: usuarioAtivo.nome
    };
    addSolicitacao(solicitacaoComUsuario);
    toast({
      title: "Solicitação Enviada!",
      description: "Sua solicitação foi enviada com sucesso e será analisada pela equipe responsável."
    });
    setShowForm(false);
    setShowMultipleForm(false);
    setSelectedCategory(null);
  };
  const handleCancel = () => {
    setShowForm(false);
    setShowMultipleForm(false);
    setSelectedCategory(null);
  };
  const handleMultipleServiceRequest = () => {
    setShowMultipleForm(true);
  };

  // Filtrar apenas solicitações do usuário logado
  const minhasSolicitacoes = solicitacoes.filter(solicitacao => solicitacao.solicitante === usuarioAtivo.nome);
  const filteredSolicitacoes = minhasSolicitacoes.filter(solicitacao => solicitacao.id.toLowerCase().includes(searchTerm.toLowerCase()) || solicitacao.centroCusto.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAbrirModal = (solicitacao: SolicitacaoServico) => {
    setSolicitacaoSelecionada(solicitacao);
    setModalAberto(true);
  };
  const getSolicitacoesByStatus = (status: StatusSolicitacao) => {
    return filteredSolicitacoes.filter(s => s.status === status);
  };
  const columns = [{
    status: StatusSolicitacao.EM_ANDAMENTO,
    title: 'Solicitação realizada',
    icon: AlertCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  }, {
    status: StatusSolicitacao.PENDENTE,
    title: 'Pendente',
    icon: Clock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  }, {
    status: StatusSolicitacao.AGUARDANDO_APROVACAO,
    title: 'Aguardando Aprovação',
    icon: Clock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  }, {
    status: StatusSolicitacao.APROVADO,
    title: 'Aprovado',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }, {
    status: StatusSolicitacao.REJEITADO,
    title: 'Rejeitado',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }, {
    status: StatusSolicitacao.CONCLUIDO,
    title: 'Emitida',
    icon: CheckSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }];
  if (showMultipleForm) {
    return <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <Button variant="outline" onClick={handleCancel} className="mb-4">
            ← Voltar às Categorias
          </Button>
        </div>
        
        <MultipleServiceForm onSubmit={handleFormSubmit} onCancel={handleCancel} solicitante={usuarioAtivo.nome} />
      </div>;
  }
  if (showForm && selectedCategory) {
    return <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <Button variant="outline" onClick={handleCancel} className="mb-4">
            ← Voltar às Categorias
          </Button>
        </div>
        
        <SimpleDynamicForm tipoServico={selectedCategory} onSubmit={handleFormSubmit} onCancel={handleCancel} solicitante={usuarioAtivo.nome} />
      </div>;
  }
  return <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Cabeçalho */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">
          Formulário de Solicitações
        </h1>
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <span>Responsável pelo atendimento:</span>
          <Badge variant="outline" className="text-primary">
            {responsavelAtendimento}
          </Badge>
        </div>
      </div>

      {/* Área de Categorias */}
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-card-foreground mb-2">
              Selecione o Tipo de Serviço
            </h2>
            <p className="text-muted-foreground">
              Clique em uma categoria abaixo para abrir o formulário específico
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleMultipleServiceRequest} className="gap-2">
              <Layers className="h-4 w-4" />
              Solicitação Combinada
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesInfo.map(category => <CategoryCard key={category.id} category={category} onClick={() => handleCategorySelect(category.id)} />)}
        </div>
      </div>

      {/* Kanban de Minhas Solicitações */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-card-foreground">
            Minhas Solicitações Recentes
          </h2>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Pesquisar por ID ou centro de custo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        {/* Board Kanban */}
        {minhasSolicitacoes.length === 0 ? <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma solicitação encontrada</p>
              <p className="text-sm">Faça sua primeira solicitação selecionando uma categoria acima</p>
            </div>
          </Card> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
            {columns.map(column => <SolicitacaoKanbanColumn key={column.status} status={column.status} titulo={column.title} icon={column.icon} color={column.color} bgColor={column.bgColor} solicitacoes={getSolicitacoesByStatus(column.status)} onViewDetails={handleAbrirModal} />)}
          </div>}
      </div>

      {/* Modal de Visualização */}
      <VisualizarSolicitacaoModal open={modalAberto} onOpenChange={setModalAberto} solicitacao={solicitacaoSelecionada} onSave={() => {}} onSaveAndApprove={() => {}} onConcluir={() => {}} modoVisualizacao={true} />

      {/* Botão de Nova Solicitação Flutuante */}
      <div className="fixed bottom-6 right-6">
        
      </div>
    </div>;
}