import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Download, Eye, Settings, CheckCircle, RotateCcw, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useOS } from "@/contexts/OSContext";
import PlanejamentoOSModal from "@/components/PlanejamentoOSModal";
import ReplanejamentoOSModal from "@/components/ReplanejamentoOSModal";
import FinalizacaoOSModal from "@/components/FinalizacaoOSModal";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const statusConfig = {
  "aberta": { label: "OS Aberta", color: "bg-blue-100 text-blue-800", variant: "secondary" as const },
  "em-planejamento": { label: "Em Planejamento", color: "bg-yellow-100 text-yellow-800", variant: "secondary" as const },
  "aguardando-aceite": { label: "Aguardando Aceite do Solicitante", color: "bg-orange-100 text-orange-800", variant: "secondary" as const },
  "em-execucao": { label: "Em Execução", color: "bg-green-100 text-green-800", variant: "secondary" as const },
  "replanejada": { label: "Replanejada", color: "bg-purple-100 text-purple-800", variant: "secondary" as const },
  "cancelada": { label: "Cancelada", color: "bg-red-100 text-red-800", variant: "destructive" as const },
  "concluida": { label: "Concluída", color: "bg-emerald-100 text-emerald-800", variant: "secondary" as const },
  "fechada": { label: "Fechada", color: "bg-gray-100 text-gray-800", variant: "secondary" as const }
};

const slaConfig = {
  "no-prazo": { label: "No prazo", color: "bg-green-100 text-green-800" },
  "em-atraso": { label: "Em atraso", color: "bg-red-100 text-red-800" },
  "vencido": { label: "Vencido", color: "bg-red-200 text-red-900" }
};

const OrdemServicoList = () => {
  const { osList, aprovarPlanejamento, cancelarOS, concluirOS, finalizarOS } = useOS();
  const { toast } = useToast();
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroCliente, setFiltroCliente] = useState<string>("todos");
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("todos");
  const [filtroEngenheiro, setFiltroEngenheiro] = useState<string>("todos");
  const [buscaTexto, setBuscaTexto] = useState("");
  const [planejamentoModalOpen, setPlanejamentoModalOpen] = useState(false);
  const [replanejamentoModalOpen, setReplanejamentoModalOpen] = useState(false);
  const [finalizacaoModalOpen, setFinalizacaoModalOpen] = useState(false);
  const [selectedOSId, setSelectedOSId] = useState<number | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [osToCancelId, setOsToCancelId] = useState<number | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getSuprimentosColor = (valorSuprimentos: number, valorSAO: number) => {
    if (valorSuprimentos < valorSAO) return "text-green-600 font-medium"; // Melhor (economia)
    if (valorSuprimentos > valorSAO) return "text-red-600 font-medium";   // Pior (perda)
    return "text-foreground font-medium"; // Igual
  };

  const calcularHHTotal = (hhPlanejado: number, hhAdicional: number) => {
    return hhPlanejado + hhAdicional;
  };

  const calcularPercentualAdicional = (hhPlanejado: number, hhAdicional: number) => {
    if (hhPlanejado === 0) return 0;
    return ((hhAdicional / hhPlanejado) * 100).toFixed(1);
  };

  const calcularValorTotalHH = (hhPlanejado: number, hhAdicional: number, valorHora: number = 95.00) => {
    return (hhPlanejado + hhAdicional) * valorHora;
  };

  const isDataAtrasada = (dataInicioPrevista: string | null, dataCompromissada: string) => {
    if (!dataInicioPrevista) return false;
    return new Date(dataInicioPrevista) > new Date(dataCompromissada);
  };

  const calcularDiasCorreidos = (dataFimPrevista: string | null, dataCompromissada: string) => {
    if (!dataFimPrevista) return null;
    const dataCompromissadaDate = new Date(dataCompromissada);
    const dataFimPrevistaDate = new Date(dataFimPrevista);
    const diffTime = dataFimPrevistaDate.getTime() - dataCompromissadaDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filtrar OS baseado nos filtros ativos
  const osFiltradas = osList.filter(os => {
    // Filtro por status
    if (filtroStatus !== "todos" && os.status !== filtroStatus) return false;
    
    // Filtro por cliente
    if (filtroCliente !== "todos" && os.cliente.toLowerCase() !== filtroCliente) return false;
    
    // Filtro por disciplina
    if (filtroDisciplina !== "todos" && os.disciplina.toLowerCase() !== filtroDisciplina) return false;
    
    // Filtro por engenheiro
    if (filtroEngenheiro !== "todos") {
      const nomeEngenheiro = filtroEngenheiro === "elton-anthony" ? "Elton Anthony" : "Ricardo Cunha";
      if (os.responsavelEM !== nomeEngenheiro) return false;
    }
    
    // Filtro de busca por texto
    if (buscaTexto) {
      const texto = buscaTexto.toLowerCase();
      return os.cca.toString().includes(texto) || 
             os.descricao.toLowerCase().includes(texto) ||
             os.cliente.toLowerCase().includes(texto);
    }
    
    return true;
  });

  const handlePlanejamento = (osId: number) => {
    setSelectedOSId(osId);
    setPlanejamentoModalOpen(true);
  };

  const closePlanejamentoModal = () => {
    setPlanejamentoModalOpen(false);
    setSelectedOSId(null);
  };

  const handleAprovarPlanejamento = (osId: number) => {
    aprovarPlanejamento(osId);
    const os = osList.find(o => o.id === osId);
    const isReplanejamento = os && (os.hhAdicional || 0) > 0;
    
    toast({
      title: isReplanejamento ? "Replanejamento aprovado" : "Planejamento aprovado",
      description: "OS movida para execução.",
    });
  };

  const handleReplanejamento = (osId: number) => {
    setSelectedOSId(osId);
    setReplanejamentoModalOpen(true);
  };

  const closeReplanejamentoModal = () => {
    setReplanejamentoModalOpen(false);
    setSelectedOSId(null);
  };

  const handleCancelarOS = (osId: number) => {
    setOsToCancelId(osId);
    setCancelDialogOpen(true);
  };

  const confirmCancelarOS = () => {
    if (osToCancelId) {
      cancelarOS(osToCancelId, "OS cancelada pelo usuário");
      toast({
        title: "OS cancelada",
        description: "A OS foi cancelada com sucesso.",
        variant: "destructive",
      });
      setCancelDialogOpen(false);
      setOsToCancelId(null);
    }
  };

  const handleConcluirOS = (osId: number) => {
    setSelectedOSId(osId);
    setFinalizacaoModalOpen(true);
  };

  const closeFinalizacaoModal = () => {
    setFinalizacaoModalOpen(false);
    setSelectedOSId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
          <p className="text-muted-foreground">Gerencie as OS da Engenharia Matricial</p>
        </div>
        <Link to="/os/nova">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova OS
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="CCA, descrição..."
                  value={buscaTexto}
                  onChange={(e) => setBuscaTexto(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Status</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filtroStatus === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("todos")}
                >
                  Todos
                </Button>
                <Button
                  variant={filtroStatus === "aberta" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("aberta")}
                >
                  OS Aberta
                </Button>
                <Button
                  variant={filtroStatus === "em-planejamento" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("em-planejamento")}
                >
                  Em Planejamento
                </Button>
                <Button
                  variant={filtroStatus === "aguardando-aceite" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("aguardando-aceite")}
                >
                  Aguardando Aceite
                </Button>
                <Button
                  variant={filtroStatus === "em-execucao" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("em-execucao")}
                >
                  Em Execução
                </Button>
                <Button
                  variant={filtroStatus === "replanejada" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("replanejada")}
                >
                  Replanejada
                </Button>
                <Button
                  variant={filtroStatus === "cancelada" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("cancelada")}
                >
                  Cancelada
                </Button>
                <Button
                  variant={filtroStatus === "concluida" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("concluida")}
                >
                  Concluída
                </Button>
              </div>
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <Select value={filtroCliente} onValueChange={setFiltroCliente}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os clientes</SelectItem>
                  <SelectItem value="brainfarma">Brainfarma</SelectItem>
                  <SelectItem value="libbs">Libbs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Disciplina */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Disciplina</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filtroDisciplina === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroDisciplina("todos")}
                >
                  Todas
                </Button>
                <Button
                  variant={filtroDisciplina === "eletrica" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroDisciplina("eletrica")}
                >
                  Elétrica
                </Button>
                <Button
                  variant={filtroDisciplina === "mecanica" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroDisciplina("mecanica")}
                >
                  Mecânica
                </Button>
              </div>
            </div>

            {/* Engenheiros */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Engenheiro</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filtroEngenheiro === "todos" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroEngenheiro("todos")}
                >
                  Todos
                </Button>
                <Button
                  variant={filtroEngenheiro === "elton-anthony" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroEngenheiro("elton-anthony")}
                >
                  Elton Anthony
                </Button>
                <Button
                  variant={filtroEngenheiro === "ricardo-cunha" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroEngenheiro("ricardo-cunha")}
                >
                  Ricardo Cunha
                </Button>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de OS */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Ordens de Serviço</CardTitle>
          <CardDescription>
            {osFiltradas.length} OS encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OS</TableHead>
                  <TableHead>CCA</TableHead>
                  <TableHead>Data abertura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Família</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Fase da OS</TableHead>
                  <TableHead>R$ SAO</TableHead>
                  <TableHead>R$ Engenharia</TableHead>
                  <TableHead>R$ Suprimentos</TableHead>
                  <TableHead>HH planejado</TableHead>
                  <TableHead>HH adicional</TableHead>
                  <TableHead>HH total</TableHead>
                  <TableHead>Valor total HH</TableHead>
                  <TableHead>% adicional</TableHead>
                  <TableHead>Data compromissada</TableHead>
                  <TableHead>Período previsto</TableHead>
                  <TableHead>Dias corridos</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {osFiltradas.map((os) => (
                  <TableRow key={os.id}>
                    <TableCell className="font-medium">#{os.id}</TableCell>
                    <TableCell>{os.cca}</TableCell>
                    <TableCell>{formatDate(os.dataAbertura)}</TableCell>
                    <TableCell>{os.cliente}</TableCell>
                    <TableCell>{os.disciplina}</TableCell>
                    <TableCell>{os.familiaSAO}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={os.descricao}>
                      {os.descricao}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[os.status as keyof typeof statusConfig]?.variant}>
                        {statusConfig[os.status as keyof typeof statusConfig]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(os.valorOrcamento)}</TableCell>
                    <TableCell>
                      {os.status === "concluida" && os.valorEngenharia ? 
                        <span className="font-medium">{formatCurrency(os.valorEngenharia)}</span>
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {os.status === "concluida" && os.valorSuprimentos ? 
                        <span className={getSuprimentosColor(os.valorSuprimentos, os.valorOrcamento)}>
                          {formatCurrency(os.valorSuprimentos)}
                        </span>
                        : '-'
                      }
                    </TableCell>
                    <TableCell>{os.hhPlanejado}h</TableCell>
                    <TableCell>{os.hhAdicional > 0 ? `${os.hhAdicional}h` : '-'}</TableCell>
                    <TableCell>{calcularHHTotal(os.hhPlanejado, os.hhAdicional)}h</TableCell>
                    <TableCell className="font-medium text-primary">
                      {formatCurrency(calcularValorTotalHH(os.hhPlanejado, os.hhAdicional, os.valorHoraHH))}
                    </TableCell>
                    <TableCell>
                      {os.hhAdicional > 0 ? `${calcularPercentualAdicional(os.hhPlanejado, os.hhAdicional)}%` : '-'}
                    </TableCell>
                    <TableCell>{formatDate(os.dataCompromissada)}</TableCell>
                    <TableCell className={os.dataInicioPrevista && isDataAtrasada(os.dataInicioPrevista, os.dataCompromissada) ? "text-destructive font-medium" : ""}>
                      {os.dataInicioPrevista && os.dataFimPrevista ? 
                        `${formatDate(os.dataInicioPrevista)} - ${formatDate(os.dataFimPrevista)}` : 
                        '-'
                      }
                    </TableCell>
                    <TableCell className={
                      os.dataFimPrevista && calcularDiasCorreidos(os.dataFimPrevista, os.dataCompromissada) !== null
                        ? calcularDiasCorreidos(os.dataFimPrevista, os.dataCompromissada)! > 0 
                          ? "text-destructive font-medium" 
                          : calcularDiasCorreidos(os.dataFimPrevista, os.dataCompromissada)! < 0
                            ? "text-green-600 font-medium"
                            : ""
                        : ""
                    }>
                      {os.dataFimPrevista && calcularDiasCorreidos(os.dataFimPrevista, os.dataCompromissada) !== null
                        ? `${calcularDiasCorreidos(os.dataFimPrevista, os.dataCompromissada)} dias`
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={slaConfig[os.slaStatus as keyof typeof slaConfig]?.color}>
                        {slaConfig[os.slaStatus as keyof typeof slaConfig]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Link to={`/os/${os.id}`}>
                          <Button variant="ghost" size="sm" title="Visualizar OS">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {os.status === "aberta" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handlePlanejamento(os.id)}
                            title="Planejar OS"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                        {(os.status === "aguardando-aceite" || os.status === "replanejada") && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleAprovarPlanejamento(os.id)}
                            title="Aprovar planejamento"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {(os.status === "em-execucao" || os.status === "aguardando-aceite" || os.status === "em-planejamento" || os.status === "replanejada") && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleReplanejamento(os.id)}
                            title="Replanejar OS"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        {os.status === "em-execucao" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleConcluirOS(os.id)}
                            title="Concluir OS"
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {os.status !== "fechada" && os.status !== "cancelada" && os.status !== "concluida" && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCancelarOS(os.id)}
                            title="Cancelar OS"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Planejamento */}
      {selectedOSId && (
        <PlanejamentoOSModal
          osId={selectedOSId}
          isOpen={planejamentoModalOpen}
          onClose={closePlanejamentoModal}
        />
      )}

      {/* Modal de Replanejamento */}
      {selectedOSId && (
        <ReplanejamentoOSModal
          osId={selectedOSId}
          isOpen={replanejamentoModalOpen}
          onClose={closeReplanejamentoModal}
        />
      )}

      {/* Modal de Finalização */}
      {selectedOSId && (
        <FinalizacaoOSModal
          osId={selectedOSId}
          isOpen={finalizacaoModalOpen}
          onClose={closeFinalizacaoModal}
        />
      )}

      {/* Dialog de Confirmação de Cancelamento */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar OS</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta OS? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelarOS} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim, cancelar OS
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrdemServicoList;