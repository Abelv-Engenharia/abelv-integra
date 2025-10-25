import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Building2, Shield, Clock, CheckCircle } from "lucide-react";
import { useFeriasParaAprovacaoRH, FeriasParaAprovacaoRH } from "@/hooks/gestao-pessoas/useFeriasParaAprovacaoRH";
import { AprovacaoFeriasRHModal } from "@/components/gestao-pessoas/ferias/AprovacaoFeriasRHModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AprovacaoFeriasRH() {
  const { data: feriasParaAprovacao = [], isLoading, refetch } = useFeriasParaAprovacaoRH();
  const [modalAberto, setModalAberto] = useState(false);
  const [feriasSelecionada, setFeriasSelecionada] = useState<FeriasParaAprovacaoRH | null>(null);

  const handleAbrirModal = (ferias: FeriasParaAprovacaoRH) => {
    setFeriasSelecionada(ferias);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setFeriasSelecionada(null);
  };

  const handleSucesso = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Aprovação de Férias RH</CardTitle>
            <CardDescription>Carregando solicitações...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Aprovação de Férias RH
          </CardTitle>
          <CardDescription>
            Solicitações de férias já aprovadas pelo gestor aguardando aprovação do RH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {feriasParaAprovacao.length} {feriasParaAprovacao.length === 1 ? 'solicitação' : 'solicitações'} pendente{feriasParaAprovacao.length !== 1 ? 's' : ''}
            </div>
          </div>
        </CardContent>
      </Card>

      {feriasParaAprovacao.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <Clock className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">Nenhuma solicitação pendente</p>
              <p className="text-sm text-muted-foreground">
                Não há solicitações de férias aguardando aprovação do RH no momento
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {feriasParaAprovacao.map((ferias) => (
            <Card key={ferias.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{ferias.nomeprestador}</p>
                        <p className="text-sm text-muted-foreground">{ferias.funcaocargo}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{ferias.empresa}</p>
                        <p className="text-sm text-muted-foreground">
                          {ferias.cca_codigo} - {ferias.cca_nome}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm">
                          Início: {format(new Date(ferias.datainicioferias), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {ferias.diasferias} {ferias.diasferias === 1 ? 'dia' : 'dias'} de férias
                        </p>
                      </div>
                    </div>

                    {ferias.observacoes && (
                      <div className="pt-2 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Observações do Solicitante</p>
                        <p className="text-sm">{ferias.observacoes}</p>
                      </div>
                    )}

                    {/* Informações da Aprovação do Gestor */}
                    <div className="pt-2 border-t bg-green-50 dark:bg-green-950/20 rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <p className="text-xs font-semibold text-green-900 dark:text-green-100">
                          Aprovado pelo Gestor
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Gestor:</span> {ferias.responsaveldireto}
                        </p>
                        {ferias.dataaprovacao_gestor && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Data:</span>{' '}
                            {format(new Date(ferias.dataaprovacao_gestor), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </p>
                        )}
                        {ferias.observacoes_aprovacao_gestor && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Obs:</span> {ferias.observacoes_aprovacao_gestor}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Solicitado em {format(new Date(ferias.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    <Badge variant="outline" className="w-fit border-yellow-500 text-yellow-700 dark:text-yellow-400">
                      Aguardando RH
                    </Badge>
                    <Button
                      onClick={() => handleAbrirModal(ferias)}
                      className="w-full md:w-auto"
                    >
                      Analisar Solicitação
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AprovacaoFeriasRHModal
        aberto={modalAberto}
        onFechar={handleFecharModal}
        ferias={feriasSelecionada}
        onSucesso={handleSucesso}
      />
    </div>
  );
}
