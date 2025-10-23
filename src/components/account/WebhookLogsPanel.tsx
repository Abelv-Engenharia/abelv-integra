import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WebhookLog {
  id: string;
  configuracao_id: string;
  webhook_url: string;
  payload: any;
  status_code: number | null;
  response_body: string | null;
  sucesso: boolean;
  erro_mensagem: string | null;
  enviado_em: string;
}

const WebhookLogsPanel = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['webhook-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('enviado_em', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as WebhookLog[];
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  const truncateUrl = (url: string) => {
    if (url.length <= 50) return url;
    return url.substring(0, 47) + '...';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Logs de Webhook N8N
        </CardTitle>
        <CardDescription>
          Últimos 20 envios para o N8N (atualização automática a cada 30s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 animate-spin" />
            Carregando logs...
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhum envio registrado ainda.
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {logs.map((log) => (
                <Card key={log.id} className="border-l-4" style={{
                  borderLeftColor: log.sucesso ? '#10b981' : '#ef4444'
                }}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {log.sucesso ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-medium">
                          {log.sucesso ? 'Sucesso' : 'Erro'}
                        </span>
                        {log.status_code && (
                          <Badge variant="outline">
                            HTTP {log.status_code}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.enviado_em), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="font-medium">URL: </span>
                        <span className="text-muted-foreground" title={log.webhook_url}>
                          {truncateUrl(log.webhook_url)}
                        </span>
                      </div>

                      {log.payload && (
                        <>
                          <div>
                            <span className="font-medium">Assunto: </span>
                            <span className="text-muted-foreground">
                              {log.payload.assunto}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Destinatários: </span>
                            <span className="text-muted-foreground">
                              {log.payload.destinatarios?.join(', ')}
                            </span>
                          </div>
                        </>
                      )}

                      {log.erro_mensagem && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-red-800 text-xs">
                          <span className="font-medium">Erro: </span>
                          {log.erro_mensagem}
                        </div>
                      )}

                      {log.sucesso && log.response_body && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                            Ver resposta do N8N
                          </summary>
                          <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-32">
                            {log.response_body}
                          </pre>
                        </details>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default WebhookLogsPanel;
