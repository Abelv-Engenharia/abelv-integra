
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle, Clock, Send } from "lucide-react";

const EmailTestPanel = () => {
  const [testEmail, setTestEmail] = useState("");
  const [testSubject, setTestSubject] = useState("Teste de Email");
  const [testMessage, setTestMessage] = useState("Este é um email de teste.");
  const [loading, setLoading] = useState(false);
  const [processingManual, setProcessingManual] = useState(false);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email de destino",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Inserir email diretamente na tabela emails_pendentes
      const { error } = await supabase
        .from("emails_pendentes")
        .insert([{
          destinatario: testEmail,
          assunto: testSubject,
          corpo: testMessage,
          anexos: [],
          enviado: false,
          tentativas: 0
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Email de teste adicionado à fila de envio",
      });

      setTestEmail("");
    } catch (error) {
      console.error("Erro ao adicionar email de teste:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o email à fila",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManualProcessing = async () => {
    setProcessingManual(true);
    try {
      // Primeiro, executar a função RPC para processar configurações
      const { error: rpcError } = await supabase.rpc('processar_configuracoes_emails');
      
      if (rpcError) {
        console.error("Erro na função RPC:", rpcError);
        // Continuar mesmo com erro na RPC, pois pode ser que já existam emails pendentes
      }

      // Depois, chamar a edge function para processar a fila
      const { data, error } = await supabase.functions.invoke('process-email-queue');

      if (error) {
        console.error("Erro na edge function:", error);
        throw error;
      }

      console.log("Resultado do processamento:", data);

      toast({
        title: "Sucesso",
        description: data?.message || "Processamento manual executado com sucesso",
      });
    } catch (error) {
      console.error("Erro no processamento manual:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível executar o processamento manual",
        variant: "destructive",
      });
    } finally {
      setProcessingManual(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Teste de Email
          </CardTitle>
          <CardDescription>
            Envie um email de teste para verificar se o sistema está funcionando
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testEmail">Email de Destino</Label>
            <Input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="teste@exemplo.com"
            />
          </div>
          
          <div>
            <Label htmlFor="testSubject">Assunto</Label>
            <Input
              id="testSubject"
              value={testSubject}
              onChange={(e) => setTestSubject(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="testMessage">Mensagem</Label>
            <Textarea
              id="testMessage"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleTestEmail} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Enviando..." : "Enviar Teste"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Processamento Manual
          </CardTitle>
          <CardDescription>
            Execute o processamento de emails manualmente para testes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Este botão processa configurações ativas e envia emails pendentes
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              Verifica configurações e cria emails pendentes, depois os envia
            </div>
          </div>
          
          <Button 
            onClick={handleManualProcessing} 
            disabled={processingManual}
            variant="outline"
            className="w-full"
          >
            {processingManual ? "Processando..." : "Executar Processamento Completo"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTestPanel;
