import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Building2, CheckCircle2, Clock } from "lucide-react";
import { useFeriasParaAprovacao, FeriasParaAprovacao } from "@/hooks/gestao-pessoas/useFeriasParaAprovacao";
import { AprovacaoFeriasModal } from "@/components/gestao-pessoas/ferias/AprovacaoFeriasModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AprovacaoFerias() {
  const { data: feriasParaAprovacao = [], isLoading, refetch } = useFeriasParaAprovacao();
  const [modalAberto, setModalAberto] = useState(false);
  const [feriasSelecionada, setFeriasSelecionada] = useState<FeriasParaAprovacao | null>(null);

  const handleAbrirModal = (ferias: FeriasParaAprovacao) => {
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
            <CardTitle>Aprovação de Férias</CardTitle>
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
            <CheckCircle2 className="h-6 w-6" />
            Aprovação de Férias Gestor
          </CardTitle>
          <CardDescription>
            Solicitações de férias aguardando sua aprovação
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
                Não há solicitações de férias aguardando sua aprovação no momento
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
                        <p className="text-xs font-medium text-muted-foreground mb-1">Observações</p>
                        <p className="text-sm">{ferias.observacoes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Solicitado em {format(new Date(ferias.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    <Badge variant="secondary" className="w-fit">
                      Aguardando Aprovação
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

      <AprovacaoFeriasModal
        aberto={modalAberto}
        onFechar={handleFecharModal}
        ferias={feriasSelecionada}
        onSucesso={handleSucesso}
      />
    </div>
  );
}
