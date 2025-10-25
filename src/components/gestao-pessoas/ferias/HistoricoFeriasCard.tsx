import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFeriasUsuario } from "@/hooks/gestao-pessoas/useFeriasUsuario";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    solicitado: { label: "Solicitado", variant: "secondary" },
    aguardando_aprovacao: { label: "Aguardando Aprovação", variant: "outline" },
    aprovado: { label: "Aprovado", variant: "default" },
    em_ferias: { label: "Em Férias", variant: "default" },
    concluido: { label: "Concluído", variant: "outline" },
    reprovado: { label: "Reprovado", variant: "destructive" }
  };

  const statusInfo = statusMap[status] || { label: status, variant: "outline" };
  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
};

export function HistoricoFeriasCard() {
  const { data: historico = [], isLoading } = useFeriasUsuario();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico de Solicitações
        </CardTitle>
        <CardDescription>
          Suas solicitações de férias registradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : historico.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma solicitação de férias registrada</p>
        ) : (
          <div className="space-y-4">
            {historico.map((ferias) => (
              <div
                key={ferias.id}
                className="border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{ferias.empresa}</p>
                      {getStatusBadge(ferias.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {ferias.cca_codigo} - {ferias.cca_nome}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Início: {format(new Date(ferias.datainicioferias), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dias:</span> {ferias.diasferias}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Responsável:</span> {ferias.responsaveldireto}
                  </div>
                </div>

                {ferias.observacoes && (
                  <p className="text-sm text-muted-foreground pt-2 border-t">
                    <span className="font-medium">Observações:</span> {ferias.observacoes}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Solicitado em: {format(new Date(ferias.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
