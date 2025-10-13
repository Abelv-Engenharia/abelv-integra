import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, User, Calendar, DollarSign, FileText, CheckCircle, XCircle, AlertCircle, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useOS, type OS } from "@/contexts/OSContext";
import FinalizacaoOSModal from "@/components/FinalizacaoOSModal";

// Mock data - será substituído pela integração com Supabase
const mockOS = {
  id: 1,
  cca: 12345,
  cliente: "Brainfarma",
  disciplina: "Elétrica",
  familia: "Instalações",
  descricao: "Instalação de quadro elétrico geral para nova linha de produção. Incluindo dimensionamento de cabos, proteções e sistema de aterramento conforme normas técnicas.",
  status: "aguardando-aceite",
  valorOrcamento: 25000.00,
  valorVendaEstimado: 30000.00,
  hhPlanejado: 120,
  hhAdicional: 0,
  dataCompromissada: "2024-10-15",
  dataEntregaReal: null,
  valorFinal: null,
  competencia: "10/2024",
  responsavelObra: "João Silva",
  responsavelEM: "Maria Santos",
  slaStatus: "no-prazo",
  dataCriacao: "2024-09-15",
  dataRecebimento: "2024-09-15",
  valorHoraHH: 95.00,
  observacoesPlanejamento: "Necessário acesso à sala elétrica nos finais de semana. Coordenar com segurança do trabalho.",
  etapas: {
    abertura: {
      concluida: true,
      data: "2024-09-15 08:30",
      usuario: "João Silva"
    },
    recebimento: {
      concluida: true,
      data: "2024-09-15 09:15",
      usuario: "Maria Santos"
    },
    preenchimentoHH: {
      concluida: true,
      data: "2024-09-16 14:20",
      usuario: "Maria Santos",
      hhNecessario: 120,
      valorTotal: 11400.00 // 120 * 95
    }
  },
  historicoStatus: [
    { status: "Nova", data: "2024-09-15 08:30", usuario: "João Silva", observacao: "OS criada" },
    { status: "Recebida pela Eng. Matricial", data: "2024-09-15 09:15", usuario: "Maria Santos", observacao: "OS recebida para análise" },
    { status: "HH Preenchido", data: "2024-09-16 14:20", usuario: "Maria Santos", observacao: "120h necessárias - Valor total: R$ 11.400,00" },
    { status: "Aguardando aceite", data: "2024-09-16 14:20", usuario: "Maria Santos", observacao: "Planejamento enviado para aceite" }
  ]
};

const statusConfig = {
  "aberta": { label: "OS Aberta", color: "bg-blue-100 text-blue-800", variant: "secondary" as const },
  "em-planejamento": { label: "Em Planejamento", color: "bg-yellow-100 text-yellow-800", variant: "secondary" as const },
  "aguardando-aceite": { label: "Aguardando Aceite do Solicitante", color: "bg-orange-100 text-orange-800", variant: "secondary" as const },
  "em-execucao": { label: "Em Execução", color: "bg-green-100 text-green-800", variant: "secondary" as const },
  "replanejada": { label: "Replanejada", color: "bg-purple-100 text-purple-800", variant: "secondary" as const },
  "concluida": { label: "Concluída", color: "bg-emerald-100 text-emerald-800", variant: "secondary" as const },
  "fechada": { label: "Fechada", color: "bg-gray-100 text-gray-800", variant: "secondary" as const }
};

const DetalhesOrdemServico = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { getOSById, updateOSStatus, concluirOS, finalizarOS } = useOS();
  
  // Buscar a OS atual do contexto em vez de usar mock data
  const osAtual = getOSById(parseInt(id || "0")) || mockOS;
  
  // Estados para ações da Engenharia Matricial
  const [hhPlanejado, setHhPlanejado] = useState("");
  const [dataCompromissada, setDataCompromissada] = useState("");
  const [observacoesPlanejamento, setObservacoesPlanejamento] = useState("");
  
  // Estados para HH Adicional
  const [hhAdicional, setHhAdicional] = useState("");
  const [justificativaHH, setJustificativaHH] = useState("");
  
  // Estados para entrega
  const [valorFinal, setValorFinal] = useState("");
  
  // Estados para modais
  const [finalizacaoModalOpen, setFinalizacaoModalOpen] = useState(false);
  
  // Estados para aceite/ajuste
  const [comentarioAjuste, setComentarioAjuste] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calcularValorTotalHH = (hh: number, valorHora: number = 95.00) => {
    return hh * valorHora;
  };

  const handleEnviarPlanejamento = () => {
    if (!hhPlanejado || !dataCompromissada) {
      toast({
        title: "Campos obrigatórios",
        description: "HH planejado e data compromissada são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    updateOSStatus(parseInt(id || "0"), "aguardando-aceite", "Planejamento concluído - Enviado para aceite do solicitante");
    toast({
      title: "Planejamento enviado!",
      description: "O planejamento foi enviado para aceite da obra.",
    });
  };

  const handleAceitarPlanejamento = () => {
    updateOSStatus(parseInt(id || "0"), "em-execucao", "Planejamento aceito pelo solicitante - OS em execução");
    toast({
      title: "Planejamento aceito!",
      description: "A OS está agora em execução.",
    });
  };

  const handleSolicitarAjuste = () => {
    if (!comentarioAjuste) {
      toast({
        title: "Comentário obrigatório",
        description: "Por favor, informe o motivo do ajuste solicitado.",
        variant: "destructive"
      });
      return;
    }

    updateOSStatus(parseInt(id || "0"), "replanejada", `Ajuste solicitado: ${comentarioAjuste}`);
    toast({
      title: "Ajuste solicitado!",
      description: "A solicitação foi enviada para a Engenharia Matricial.",
    });
  };

  const handleSolicitarHHAdicional = () => {
    if (!hhAdicional || !justificativaHH) {
      toast({
        title: "Campos obrigatórios",
        description: "HH adicional e justificativa são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "HH adicional solicitado!",
      description: "A solicitação foi enviada para aprovação.",
    });
  };

  const handleEntregarOS = () => {
    if (!valorFinal) {
      toast({
        title: "Valor final obrigatório",
        description: "Por favor, informe o valor final do resultado.",
        variant: "destructive",
      });
      return;
    }

    updateOSStatus(parseInt(id || "0"), "fechada", "OS entregue com valor final definido");
    toast({
      title: "OS entregue!",
      description: "A OS foi marcada como entregue.",
    });
  };

  const handleConcluirOS = () => {
    concluirOS(parseInt(id || "0"));
    toast({
      title: "OS concluída!",
      description: "A OS foi marcada como concluída com sucesso.",
    });
  };

  const handleFinalizarOS = () => {
    console.log("Abrindo modal de finalização...");
    setFinalizacaoModalOpen(true);
  };

  const closeFinalizacaoModal = () => {
    setFinalizacaoModalOpen(false);
  };

  const handleIniciarPlanejamento = () => {
    updateOSStatus(parseInt(id || "0"), "em-planejamento", "OS enviada para planejamento");
    toast({
      title: "Planejamento iniciado!",
      description: "A OS foi enviada para a Engenharia Matricial para planejamento.",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Link to="/os">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">OS Nº {(osAtual as any).numero || osAtual.id} - CCA {osAtual.cca}</h1>
            <Badge variant={statusConfig[osAtual.status as keyof typeof statusConfig]?.variant}>
              {statusConfig[osAtual.status as keyof typeof statusConfig]?.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">{osAtual.cliente} - {osAtual.disciplina}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Etapas da OS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Etapas da OS
              </CardTitle>
              <CardDescription>
                Acompanhe o progresso da ordem de serviço
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Abertura */}
                <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800">1. Abertura de OS</h4>
                    <p className="text-sm text-green-600">
                      Concluída em {formatDate((osAtual as OS).dataAbertura || (osAtual as any).dataCriacao)} por {(osAtual as OS).nomeSolicitante || (osAtual as any).responsavelObra}
                    </p>
                  </div>
                </div>

                {/* Recebimento */}
                <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800">2. Recebimento pela Eng. Matricial</h4>
                    <p className="text-sm text-green-600">
                      Recebida em {formatDate((osAtual as OS).dataAbertura || (osAtual as any).dataCriacao)} por {osAtual.responsavelEM}
                    </p>
                  </div>
                </div>

                {/* Preenchimento HH */}
                <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800">3. Preenchimento de HH Necessário</h4>
                    <p className="text-sm text-green-600">
                      {osAtual.hhPlanejado > 0 ? 
                        `Preenchido com ${osAtual.hhPlanejado}h por ${osAtual.responsavelEM}` :
                        'Aguardando preenchimento'
                      }
                    </p>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>HH necessário:</span>
                        <span className="font-medium">{osAtual.hhPlanejado}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor da hora:</span>
                        <span className="font-medium">{formatCurrency(osAtual.valorHoraHH)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="font-medium">Valor total a ser cobrado:</span>
                        <span className="font-bold text-green-700">
                          {formatCurrency(osAtual.hhPlanejado * osAtual.valorHoraHH)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Histórico de Replanejamentos como Etapas */}
                {(osAtual as OS).historicoReplanejamentos && (osAtual as OS).historicoReplanejamentos.length > 0 && (osAtual as OS).historicoReplanejamentos.map((replan, index) => (
                  <div key={`replan-${index}`} className="flex items-start gap-4 p-4 border rounded-lg bg-orange-50 border-orange-200">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-800">
                        {3 + index + 1}. Replanejamento #{index + 1}
                      </h4>
                      <p className="text-sm text-orange-600 mb-2">
                        Realizado em {new Date(replan.data).toLocaleDateString("pt-BR")} por {replan.usuario}
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Hh adicional solicitado:</span>
                          <span className="font-medium text-orange-700">+{replan.hhAdicional}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Novo período:</span>
                          <span className="font-medium text-orange-700">
                            {formatDate(replan.novaDataInicio)} - {formatDate(replan.novaDataFim)}
                          </span>
                        </div>
                        <div className="mt-2 p-2 bg-orange-100 rounded">
                          <span className="text-xs text-orange-600 font-medium">Motivo:</span>
                          <p className="text-xs text-orange-700 mt-1">{replan.motivo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Aceite após replanejamento */}
                {(osAtual.status === "em-execucao" && (osAtual as OS).historicoReplanejamentos && (osAtual as OS).historicoReplanejamentos.length > 0) && (
                  <div className="flex items-start gap-4 p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800">
                        {3 + ((osAtual as OS).historicoReplanejamentos?.length || 0) + 1}. Replanejamento aceito
                      </h4>
                      <p className="text-sm text-green-600">
                        Aceito pelo solicitante - Os retornou para execução
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações da OS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cliente</Label>
                  <p className="font-medium">{osAtual.cliente}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Disciplina</Label>
                  <p className="font-medium">{osAtual.disciplina}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Família/Pacote</Label>
                  <p className="font-medium">{(osAtual as any).familiaSAO || (osAtual as any).familia}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Data criação</Label>
                  <p className="font-medium">{formatDate((osAtual as any).dataAbertura || (osAtual as any).dataCriacao)}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <p className="mt-1">{osAtual.descricao}</p>
              </div>
            </CardContent>
          </Card>

          {/* Ações por Status */}
          {osAtual.status === "aberta" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Iniciar Planejamento
                </CardTitle>
                <CardDescription>
                  A OS foi aberta e está aguardando aceite para iniciar o planejamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    Esta OS foi recém-criada e precisa ser aceita pelo engenheiro responsável para iniciar o planejamento.
                  </p>
                </div>
                <Button onClick={handleIniciarPlanejamento} className="gap-2">
                  <Play className="h-4 w-4" />
                  Aceitar e Iniciar Planejamento
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Planejamento (Engenharia Matricial) */}
          {osAtual.status === "em-planejamento" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Planejamento (Engenharia Matricial)
                </CardTitle>
                <CardDescription>
                  Defina o HH necessário e a data de entrega
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hhPlanejado">HH Planejado *</Label>
                    <Input
                      id="hhPlanejado"
                      type="number"
                      placeholder="120"
                      value={hhPlanejado}
                      onChange={(e) => setHhPlanejado(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataCompromissada">Data compromissada *</Label>
                    <Input
                      id="dataCompromissada"
                      type="date"
                      value={dataCompromissada}
                      onChange={(e) => setDataCompromissada(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observacoesPlanejamento">Observações do planejamento</Label>
                  <Textarea
                    id="observacoesPlanejamento"
                    placeholder="Observações importantes sobre o planejamento..."
                    value={observacoesPlanejamento}
                    onChange={(e) => setObservacoesPlanejamento(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleEnviarPlanejamento} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Enviar para aceite da obra
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Aceite da Obra */}
          {osAtual.status === "aguardando-aceite" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Aceite da Obra
                </CardTitle>
                <CardDescription>
                  Analise o planejamento da Engenharia Matricial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label className="text-muted-foreground">HH Planejado</Label>
                    <p className="font-medium">{osAtual.hhPlanejado}h</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Data compromissada</Label>
                    <p className="font-medium">{formatDate(osAtual.dataCompromissada)}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="space-y-2">
                    <Label className="text-blue-800 font-semibold">Resumo financeiro</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-blue-600">Valor por hora</p>
                        <p className="font-medium text-blue-800">{formatCurrency(osAtual.valorHoraHH)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">Valor total estimado</p>
                        <p className="font-bold text-blue-800 text-lg">
                          {formatCurrency(osAtual.hhPlanejado * osAtual.valorHoraHH)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {((osAtual as any).observacoesPlanejamento) && (
                  <div>
                    <Label className="text-muted-foreground">Observações</Label>
                    <p className="mt-1">{(osAtual as any).observacoesPlanejamento}</p>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <Button onClick={handleAceitarPlanejamento} className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Aceitar planejamento
                  </Button>
                  
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Motivo do ajuste solicitado..."
                      value={comentarioAjuste}
                      onChange={(e) => setComentarioAjuste(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleSolicitarAjuste} className="gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Solicitar ajuste
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* HH Adicional */}
          {(osAtual.status === "em-execucao" || osAtual.status === "fechada") && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Solicitar HH Adicional
                </CardTitle>
                <CardDescription>
                  Solicite HH adicional com justificativa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hhAdicional">HH Adicional *</Label>
                    <Input
                      id="hhAdicional"
                      type="number"
                      placeholder="24"
                      value={hhAdicional}
                      onChange={(e) => setHhAdicional(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="justificativaHH">Justificativa *</Label>
                  <Textarea
                    id="justificativaHH"
                    placeholder="Explique a necessidade do HH adicional..."
                    value={justificativaHH}
                    onChange={(e) => setJustificativaHH(e.target.value)}
                  />
                </div>
                
                <Button onClick={handleSolicitarHHAdicional} className="gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Solicitar HH adicional
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Finalização e Conclusão */}
          {osAtual.status === "em-execucao" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Ações de finalização
                </CardTitle>
                <CardDescription>
                  Escolha como finalizar esta OS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={handleFinalizarOS} 
                    className="gap-2 flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Finalizar OS
                  </Button>
                  <Button 
                    onClick={handleConcluirOS} 
                    variant="secondary" 
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Concluir simples
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                  <p><strong>Finalizar OS:</strong> Registra valores finais, data de conclusão e competência</p>
                  <p><strong>Concluir simples:</strong> Marca como concluída sem detalhamento financeiro</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">R$ SAO:</span>
                <span className="font-medium">{formatCurrency(osAtual.valorOrcamento)}</span>
              </div>
              
              {(osAtual as OS).valorEngenharia && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">R$ Engenharia:</span>
                  <span className="font-medium">{formatCurrency((osAtual as OS).valorEngenharia!)}</span>
                </div>
              )}
              
              {(osAtual as OS).valorSuprimentos && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">R$ Suprimentos:</span>
                    <span className="font-medium">{formatCurrency((osAtual as OS).valorSuprimentos!)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">% Saving:</span>
                    <span className={`font-bold ${
                      (osAtual as OS).valorSuprimentos! < osAtual.valorOrcamento 
                        ? 'text-green-600' 
                        : (osAtual as OS).valorSuprimentos! > osAtual.valorOrcamento 
                          ? 'text-red-600' 
                          : 'text-foreground'
                    }`}>
                      {(osAtual as OS).valorSuprimentos! === osAtual.valorOrcamento 
                        ? '0%' 
                        : `${((osAtual.valorOrcamento - (osAtual as OS).valorSuprimentos!) / osAtual.valorOrcamento * 100).toFixed(1)}%`
                      }
                    </span>
                  </div>
                </>
              )}
              
              <Separator />
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Competência:</span>
                <span className="font-medium">{osAtual.competencia || "A definir no fechamento"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Controle de HH e Replanejamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Controle de HH e Replanejamentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* HH Inicial */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">Planejamento inicial</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">HH inicialmente planejado:</span>
                    <span className="font-medium">{osAtual.hhPlanejado}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">Data compromissada:</span>
                    <span className="font-medium">{formatDate(osAtual.dataCompromissada)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">Período previsto:</span>
                    <span className="font-medium">
                      {(osAtual as OS).dataInicioPrevista && (osAtual as OS).dataFimPrevista ? 
                        `${formatDate((osAtual as OS).dataInicioPrevista!)} - ${formatDate((osAtual as OS).dataFimPrevista!)}` : 
                        'Não definido'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600">Data de aceite:</span>
                    <span className="font-medium">
                      {osAtual.status !== 'aberta' ? formatDate((osAtual as OS).dataAbertura || (osAtual as any).dataCriacao) : 'Aguardando aceite'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Histórico de Replanejamentos */}
              {(osAtual as OS).historicoReplanejamentos && (osAtual as OS).historicoReplanejamentos!.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">Histórico de replanejamentos</h4>
                  {(osAtual as OS).historicoReplanejamentos!.map((replan, index) => (
                    <div key={index} className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-orange-800">
                          Replanejamento #{index + 1}
                        </h5>
                        <span className="text-sm text-orange-600">
                          {new Date(replan.data).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                        <div>
                          <span className="text-orange-600">HH adicional:</span>
                          <span className="font-medium ml-2">+{replan.hhAdicional}h</span>
                        </div>
                        <div>
                          <span className="text-orange-600">Novo período:</span>
                          <span className="font-medium ml-2">
                            {formatDate(replan.novaDataInicio)} - {formatDate(replan.novaDataFim)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-orange-600">Motivo:</span>
                        <p className="text-orange-700 mt-1">{replan.motivo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Totais Atualizados */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-3">Totais atualizados</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-600">HH planejado inicial:</span>
                    <span className="font-medium">{osAtual.hhPlanejado}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">HH adicional total:</span>
                    <span className="font-medium">+{osAtual.hhAdicional}h</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-green-600 font-medium">HH total:</span>
                    <span className="font-bold text-green-800">
                      {osAtual.hhPlanejado + osAtual.hhAdicional}h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Valor da hora:</span>
                    <span className="font-medium">{formatCurrency(osAtual.valorHoraHH)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600 font-medium">Valor total:</span>
                    <span className="font-bold text-green-800 text-lg">
                      {formatCurrency(calcularValorTotalHH(osAtual.hhPlanejado + osAtual.hhAdicional))}
                    </span>
                  </div>
                  {osAtual.hhAdicional > 0 && (
                    <div className="flex justify-between pt-1 border-t border-green-300">
                      <span className="text-green-600">% adicional:</span>
                      <span className="font-medium text-green-700">
                        {((osAtual.hhAdicional / osAtual.hhPlanejado) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsáveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Responsáveis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Solicitante:</Label>
                <p className="font-medium">{(osAtual as OS).nomeSolicitante || (osAtual as any).responsavelObra}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Eng. Matricial:</Label>
                <p className="font-medium">{osAtual.responsavelEM}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Responsável Obra:</Label>
                <p className="font-medium">{osAtual.responsavelObra}</p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Histórico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="space-y-1">
                    <p className="font-medium">OS Criada</p>
                    <p className="text-muted-foreground">{formatDate((osAtual as OS).dataAbertura || (osAtual as any).dataCriacao)}</p>
                    <p className="text-muted-foreground">por {(osAtual as OS).nomeSolicitante || (osAtual as any).responsavelObra}</p>
                    <p className="text-xs text-muted-foreground italic">OS Nº {(osAtual as any).numero || osAtual.id} aberta para {osAtual.cliente}</p>
                  </div>
                </div>

                {osAtual.status !== 'aberta' && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="space-y-1">
                      <p className="font-medium">Aceita pela Engenharia Matricial</p>
                      <p className="text-muted-foreground">{formatDate((osAtual as OS).dataAbertura || (osAtual as any).dataCriacao)}</p>
                      <p className="text-muted-foreground">por {osAtual.responsavelEM}</p>
                      <p className="text-xs text-muted-foreground italic">OS aceita para planejamento</p>
                    </div>
                  </div>
                )}

                {osAtual.hhPlanejado > 0 && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="space-y-1">
                      <p className="font-medium">HH Planejado</p>
                      <p className="text-muted-foreground">{formatDate((osAtual as OS).dataAbertura || (osAtual as any).dataCriacao)}</p>
                      <p className="text-muted-foreground">por {osAtual.responsavelEM}</p>
                      <p className="text-xs text-muted-foreground italic">
                        {osAtual.hhPlanejado}h planejadas - {formatCurrency(osAtual.hhPlanejado * osAtual.valorHoraHH)}
                      </p>
                    </div>
                  </div>
                )}

                {(osAtual.status === 'aguardando-aceite' || osAtual.status === 'em-execucao' || osAtual.status === 'replanejada') && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="space-y-1">
                      <p className="font-medium">Aguardando Aceite</p>
                      <p className="text-muted-foreground">{formatDate((osAtual as OS).dataAbertura || (osAtual as any).dataCriacao)}</p>
                      <p className="text-muted-foreground">Enviado para {(osAtual as OS).nomeSolicitante || (osAtual as any).responsavelObra}</p>
                      <p className="text-xs text-muted-foreground italic">Planejamento enviado para aprovação</p>
                    </div>
                  </div>
                )}

                {osAtual.status === 'em-execucao' && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="space-y-1">
                      <p className="font-medium">Em Execução</p>
                      <p className="text-muted-foreground">{formatDate((osAtual as OS).dataAbertura || (osAtual as any).dataCriacao)}</p>
                      <p className="text-muted-foreground">Aprovado por {(osAtual as OS).nomeSolicitante || (osAtual as any).responsavelObra}</p>
                      <p className="text-xs text-muted-foreground italic">OS aprovada e em execução</p>
                    </div>
                  </div>
                )}

                {/* Histórico de Replanejamentos */}
                {(osAtual as OS).historicoReplanejamentos && (osAtual as OS).historicoReplanejamentos!.map((replan, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="space-y-1">
                      <p className="font-medium">Replanejamento #{index + 1}</p>
                      <p className="text-muted-foreground">{formatDate(replan.data)}</p>
                      <p className="text-muted-foreground">por {replan.usuario}</p>
                      <p className="text-xs text-muted-foreground italic">
                        +{replan.hhAdicional}h adicionais - {replan.motivo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Finalização */}
      {finalizacaoModalOpen && (
        <FinalizacaoOSModal
          osId={parseInt(id || "0")}
          isOpen={finalizacaoModalOpen}
          onClose={closeFinalizacaoModal}
        />
      )}
    </div>
  );
};

export default DetalhesOrdemServico;