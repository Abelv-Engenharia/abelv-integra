import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, FileText, DollarSign, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useOSById } from "@/hooks/engenharia-matricial/useOSEngenhariaMatricial";

const statusConfig = {
  aberta: { label: "Os aberta", color: "bg-blue-100 text-blue-800", variant: "secondary" as const },
  "em-planejamento": {
    label: "Em planejamento",
    color: "bg-yellow-100 text-yellow-800",
    variant: "secondary" as const,
  },
  "aguardando-aceite": {
    label: "Aguardando aceite do solicitante",
    color: "bg-orange-100 text-orange-800",
    variant: "secondary" as const,
  },
  "em-execucao": { label: "Em execução", color: "bg-green-100 text-green-800", variant: "secondary" as const },
  "aguardando-aceite-fechamento": {
    label: "Aguardando aceite fechamento",
    color: "bg-purple-100 text-purple-800",
    variant: "secondary" as const,
  },
  cancelada: { label: "Cancelada", color: "bg-red-100 text-red-800", variant: "destructive" as const },
  concluida: { label: "Concluída", color: "bg-emerald-100 text-emerald-800", variant: "secondary" as const },
  rejeitada: { label: "Rejeitada", color: "bg-red-200 text-red-900", variant: "destructive" as const },
};

const DetalhesOrdemServico = () => {
  const { id } = useParams();
  const { data: os, isLoading } = useOSById(id);

  const formatCurrency = (value: number | null) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const calcularHHTotal = (hhPlanejado: number | null, hhAdicional: number | null) => {
    return (hhPlanejado || 0) + (hhAdicional || 0);
  };

  const calcularPercentualAdicional = (hhPlanejado: number | null, hhAdicional: number | null) => {
    if (!hhPlanejado || hhPlanejado === 0) return "0.0";
    return (((hhAdicional || 0) / hhPlanejado) * 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!os) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/engenharia-matricial/ordens-servico">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Ordem de serviço não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Link to="/engenharia-matricial/ordens-servico">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">
              Os #{os.numero} - Cca {os.cca?.codigo || "-"}
            </h1>
            <Badge variant={statusConfig[os.status as keyof typeof statusConfig]?.variant}>
              {statusConfig[os.status as keyof typeof statusConfig]?.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {os.cca?.nome || "-"} - {os.disciplina || "-"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações da os
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cca</label>
                  <p className="font-medium">{os.cca?.codigo || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="font-medium">{os.cca?.nome || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Disciplina</label>
                  <p className="font-medium">{os.disciplina || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data abertura</label>
                  <p className="font-medium">{formatDate(os.data_abertura)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Solicitante</label>
                  <p className="font-medium">{os.solicitante_nome || "-"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Responsável em</label>
                  <p className="font-medium">{os.responsavel_em?.nome || "-"}</p>
                </div>
              </div>

              <Separator />

              <div>
                <label className="text-sm font-medium text-muted-foreground">Família/Pacote</label>
                <p className="mt-1">{os.familia_sao || "-"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Valores e HH */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Valores e hh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor orçamento</label>
                  <p className="font-medium">{formatCurrency(os.valor_orcamento)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor final</label>
                  <p className="font-medium">{formatCurrency(os.valor_final)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hh planejado</label>
                  <p className="font-medium">{os.hh_planejado || 0}h</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hh adicional</label>
                  <p className="font-medium">{os.hh_adicional || 0}h</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hh total</label>
                  <p className="font-medium">{calcularHHTotal(os.hh_planejado, os.hh_adicional)}h</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">% adicional</label>
                  <p className="font-medium">
                    {calcularPercentualAdicional(os.hh_planejado, os.hh_adicional)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Datas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data abertura</label>
                  <p className="font-medium">{formatDate(os.data_abertura)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data compromissada</label>
                  <p className="font-medium">{formatDate(os.data_compromissada)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data início prevista</label>
                  <p className="font-medium">{formatDate(os.data_inicio_prevista)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data fim prevista</label>
                  <p className="font-medium">{formatDate(os.data_fim_prevista)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data entrega real</label>
                  <p className="font-medium">{formatDate(os.data_entrega_real)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data conclusão</label>
                  <p className="font-medium">{formatDate(os.data_conclusao)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Lateral - Informações Resumidas */}
        <div className="space-y-6">
          {/* Card de Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <Badge
                    variant={statusConfig[os.status as keyof typeof statusConfig]?.variant}
                    className="text-base px-4 py-2"
                  >
                    {statusConfig[os.status as keyof typeof statusConfig]?.label}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Criado em:</span>
                    <span className="font-medium">{formatDate(os.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Atualizado em:</span>
                    <span className="font-medium">{formatDate(os.updated_at)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Valores Resumo */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Orçamento:</span>
                  <span className="text-sm font-medium">{formatCurrency(os.valor_orcamento)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor final:</span>
                  <span className="text-sm font-medium">{formatCurrency(os.valor_final)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total hh:</span>
                  <span className="text-sm font-bold">
                    {calcularHHTotal(os.hh_planejado, os.hh_adicional)}h
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetalhesOrdemServico;
