
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Send, Clock, CheckCircle, XCircle } from "lucide-react";

const EmailQueueStatus = () => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  // Buscar status da fila de emails
  const { data: emailsStatus, refetch, isLoading } = useQuery({
    queryKey: ['emails-queue-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emails_pendentes')
        .select('enviado, tentativas')

      if (error) throw error;

      const total = data.length;
      const enviados = data.filter(email => email.enviado).length;
      const pendentes = data.filter(email => !email.enviado && email.tentativas < 3).length;
      const falhados = data.filter(email => !email.enviado && email.tentativas >= 3).length;

      return { total, enviados, pendentes, falhados };
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  const handleProcessQueue = async () => {
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-email-queue');

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: data.message || "Fila de emails processada com sucesso",
      });

      // Atualizar dados
      refetch();
    } catch (error) {
      console.error("Erro ao processar fila:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar a fila de emails",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Status da Fila de Emails
        </CardTitle>
        <CardDescription>
          Monitore o status dos emails pendentes e force o processamento se necessário
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Carregando status...
          </div>
        ) : emailsStatus ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{emailsStatus.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                <CheckCircle className="h-5 w-5" />
                {emailsStatus.enviados}
              </div>
              <div className="text-sm text-muted-foreground">Enviados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                <Clock className="h-5 w-5" />
                {emailsStatus.pendentes}
              </div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 flex items-center justify-center gap-1">
                <XCircle className="h-5 w-5" />
                {emailsStatus.falhados}
              </div>
              <div className="text-sm text-muted-foreground">Falhados</div>
            </div>
          </div>
        ) : null}

        <div className="flex gap-2">
          <Button 
            onClick={handleProcessQueue} 
            disabled={processing}
            className="flex-1"
          >
            {processing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Processar Fila Agora
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {emailsStatus && emailsStatus.pendentes > 0 && (
          <div className="text-sm text-muted-foreground">
            💡 Dica: A fila é processada automaticamente a cada 5 minutos. 
            Use o botão "Processar Fila Agora" para forçar o processamento imediato.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailQueueStatus;
