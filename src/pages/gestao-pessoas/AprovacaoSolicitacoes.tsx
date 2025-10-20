import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { useSolicitacoes } from "@/contexts/gestao-pessoas/SolicitacoesContext";
import { useUsuarioAtivo } from "@/hooks/gestao-pessoas/useUsuarioAtivo";
import { AprovarSolicitacaoModal } from "@/components/gestao-pessoas/solicitacao/AprovarSolicitacaoModal";
import { format } from "date-fns";
import { 
  SolicitacaoServico, 
  StatusSolicitacao, 
  TipoServico, 
  PrioridadeSolicitacao 
} from "@/types/gestao-pessoas/solicitacao";

export default function AprovacaoSolicitacoes() {
  const { solicitacoes, updateSolicitacao } = useSolicitacoes();
  const usuarioAtivo = useUsuarioAtivo();
  
  const [pesquisa, setPesquisa] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>("todas");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<SolicitacaoServico | null>(null);

  // Filtrar apenas solicitações do usuário ativo
  const solicitacoesDoUsuario = useMemo(() => {
    return solicitacoes.filter(
      (sol) => sol.responsavelaprovacao === usuarioAtivo.nome
    );
  }, [solicitacoes, usuarioAtivo.nome]);

  // Aplicar filtros
  const solicitacoesFiltradas = useMemo(() => {
    return solicitacoesDoUsuario.filter((sol) => {
      const matchPesquisa = 
        sol.id.toLowerCase().includes(pesquisa.toLowerCase()) ||
        sol.solicitante.toLowerCase().includes(pesquisa.toLowerCase());
      
      const matchPrioridade = 
        filtroPrioridade === "todas" || sol.prioridade === filtroPrioridade;
      
      const matchTipo = 
        filtroTipo === "todos" || sol.tipoServico === filtroTipo;
      
      return matchPesquisa && matchPrioridade && matchTipo;
    });
  }, [solicitacoesDoUsuario, pesquisa, filtroPrioridade, filtroTipo]);

  // Separar por status
  const aguardandoAprovacao = solicitacoesFiltradas.filter(
    (sol) => sol.status === StatusSolicitacao.AGUARDANDO_APROVACAO
  );
  const aprovadas = solicitacoesFiltradas.filter(
    (sol) => sol.status === StatusSolicitacao.APROVADO
  );
  const reprovadas = solicitacoesFiltradas.filter(
    (sol) => sol.status === StatusSolicitacao.REJEITADO
  );

  const handleAbrirModal = (solicitacao: SolicitacaoServico) => {
    setSolicitacaoSelecionada(solicitacao);
    setModalAberto(true);
  };

  const handleAprovar = (justificativa?: string) => {
    if (solicitacaoSelecionada) {
      updateSolicitacao(solicitacaoSelecionada.id, {
        status: StatusSolicitacao.APROVADO,
        justificativaaprovacao: justificativa,
        dataaprovacao: new Date(),
        aprovadopor: usuarioAtivo.nome,
      });
      toast.success("Solicitação aprovada com sucesso!");
      setModalAberto(false);
      setSolicitacaoSelecionada(null);
    }
  };

  const handleReprovar = (justificativa: string) => {
    if (solicitacaoSelecionada) {
      updateSolicitacao(solicitacaoSelecionada.id, {
        status: StatusSolicitacao.REJEITADO,
        justificativareprovacao: justificativa,
        dataaprovacao: new Date(),
        aprovadopor: usuarioAtivo.nome,
      });
      toast.success("Solicitação reprovada");
      setModalAberto(false);
      setSolicitacaoSelecionada(null);
    }
  };

  const formatarTipoServico = (tipo: TipoServico): string => {
    const tipos = {
      [TipoServico.VOUCHER_UBER]: "Voucher Uber",
      [TipoServico.LOCACAO_VEICULO]: "Locação",
      [TipoServico.CARTAO_ABASTECIMENTO]: "Abastecimento",
      [TipoServico.VELOE_GO]: "Veloe Go",
      [TipoServico.PASSAGENS]: "Passagens",
      [TipoServico.HOSPEDAGEM]: "Hospedagem",
      [TipoServico.LOGISTICA]: "Logística",
      [TipoServico.CORREIOS_LOGGI]: "Correios/Loggi",
    };
    return tipos[tipo] || tipo;
  };

  const getBadgePrioridade = (prioridade: PrioridadeSolicitacao) => {
    const variants = {
      baixa: "secondary",
      media: "default",
      alta: "destructive",
    };
    return (
      <Badge variant={variants[prioridade] as any} className="text-xs">
        {prioridade.charAt(0).toUpperCase() + prioridade.slice(1)}
      </Badge>
    );
  };

  const renderCard = (solicitacao: SolicitacaoServico) => (
    <Card
      key={solicitacao.id}
      className="p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleAbrirModal(solicitacao)}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold">{solicitacao.id}</span>
              {getBadgePrioridade(solicitacao.prioridade)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatarTipoServico(solicitacao.tipoServico)}
            </p>
          </div>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-medium">Solicitante:</span>
            <span className="text-muted-foreground">{solicitacao.solicitante}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Data:</span>
            <span className="text-muted-foreground">
              {format(new Date(solicitacao.dataSolicitacao), "dd/MM/yyyy")}
            </span>
          </div>
          {solicitacao.estimativavalor && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Valor:</span>
              <span className="text-muted-foreground">
                R$ {solicitacao.estimativavalor.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aprovação de Solicitações</h1>
        <p className="text-muted-foreground mt-1">
          Solicitações aguardando sua aprovação
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aguardandoAprovacao.length}</div>
            <p className="text-xs text-muted-foreground">
              Pendentes de aprovação
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aprovadas.length}</div>
            <p className="text-xs text-muted-foreground">
              Solicitações aprovadas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reprovadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reprovadas.length}</div>
            <p className="text-xs text-muted-foreground">
              Solicitações reprovadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por ID ou solicitante..."
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as prioridades</SelectItem>
                <SelectItem value={PrioridadeSolicitacao.ALTA}>Alta</SelectItem>
                <SelectItem value={PrioridadeSolicitacao.MEDIA}>Média</SelectItem>
                <SelectItem value={PrioridadeSolicitacao.BAIXA}>Baixa</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value={TipoServico.VOUCHER_UBER}>Voucher Uber</SelectItem>
                <SelectItem value={TipoServico.LOCACAO_VEICULO}>Locação de Veículo</SelectItem>
                <SelectItem value={TipoServico.PASSAGENS}>Passagens</SelectItem>
                <SelectItem value={TipoServico.HOSPEDAGEM}>Hospedagem</SelectItem>
                <SelectItem value={TipoServico.LOGISTICA}>Logística</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Coluna: Aguardando Aprovação */}
        <div className="space-y-4">
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Aguardando Aprovação
                </CardTitle>
                <Badge variant="secondary">{aguardandoAprovacao.length}</Badge>
              </div>
            </CardHeader>
          </Card>
          <div className="space-y-3 min-h-[400px]">
            {aguardandoAprovacao.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                Nenhuma solicitação aguardando
              </div>
            ) : (
              aguardandoAprovacao.map(renderCard)
            )}
          </div>
        </div>

        {/* Coluna: Aprovadas */}
        <div className="space-y-4">
          <Card className="bg-green-500/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Aprovadas
                </CardTitle>
                <Badge variant="secondary">{aprovadas.length}</Badge>
              </div>
            </CardHeader>
          </Card>
          <div className="space-y-3 min-h-[400px]">
            {aprovadas.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                Nenhuma solicitação aprovada
              </div>
            ) : (
              aprovadas.map(renderCard)
            )}
          </div>
        </div>

        {/* Coluna: Reprovadas */}
        <div className="space-y-4">
          <Card className="bg-red-500/10">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-400">
                  Reprovadas
                </CardTitle>
                <Badge variant="secondary">{reprovadas.length}</Badge>
              </div>
            </CardHeader>
          </Card>
          <div className="space-y-3 min-h-[400px]">
            {reprovadas.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                Nenhuma solicitação reprovada
              </div>
            ) : (
              reprovadas.map(renderCard)
            )}
          </div>
        </div>
      </div>

      {/* Modal de Aprovação */}
      <AprovarSolicitacaoModal
        open={modalAberto}
        onOpenChange={setModalAberto}
        solicitacao={solicitacaoSelecionada}
        onAprovar={handleAprovar}
        onReprovar={handleReprovar}
      />
    </div>
  );
}
