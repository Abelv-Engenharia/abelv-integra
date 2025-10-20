import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CardAprovacaoProps {
  titulo: string;
  cor: string;
  responsavel: string;
  children: React.ReactNode;
  status: 'pendente' | 'aguardando' | 'aprovado' | 'reprovado';
  onAprovar?: (comentario: string, emailProximo: string) => void;
  onReprovar?: (comentario: string) => void;
  onEnviarAlerta?: (email: string, titulo: string) => Promise<void>;
  mostrarPainelAprovacao?: boolean;
  readonly?: boolean;
}

const statusConfig = {
  pendente: {
    badge: 'Pendente',
    color: 'bg-orange-500',
    icon: Clock,
  },
  aguardando: {
    badge: 'Aguardando Validação',
    color: 'bg-yellow-500',
    icon: Clock,
  },
  aprovado: {
    badge: 'Aprovado',
    color: 'bg-green-500',
    icon: CheckCircle,
  },
  reprovado: {
    badge: 'Reprovado',
    color: 'bg-red-500',
    icon: XCircle,
  },
};

export function CardAprovacao({
  titulo,
  cor,
  responsavel,
  children,
  status,
  onAprovar,
  onReprovar,
  onEnviarAlerta,
  mostrarPainelAprovacao = true,
  readonly = false,
}: CardAprovacaoProps) {
  const { toast } = useToast();
  const [comentario, setComentario] = useState('');
  const [emailProximo, setEmailProximo] = useState('');
  const [mostrarPainel, setMostrarPainel] = useState(false);
  const [enviandoAlerta, setEnviandoAlerta] = useState(false);
  
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={`${cor} ${readonly ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon className="h-5 w-5" />
              {titulo}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Responsável: {responsavel}
            </p>
          </div>
          <Badge className={`${config.color} text-white`}>
            {config.badge}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={readonly ? 'pointer-events-none' : ''}>
          {children}
        </div>

        {mostrarPainelAprovacao && onAprovar && onReprovar && !readonly && (
          <div className="pt-4 border-t space-y-4">
            <div>
              <Label htmlFor="email-alerta">📧 Email Para Alerta</Label>
              <div className="flex gap-2">
                <Input
                  id="email-alerta"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={emailProximo}
                  onChange={(e) => setEmailProximo(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="outline"
                  disabled={!emailProximo || enviandoAlerta}
                  onClick={async () => {
                    if (!emailProximo) {
                      toast({
                        title: "Email Obrigatório",
                        description: "Informe um email para enviar o alerta",
                        variant: "destructive",
                      });
                      return;
                    }
                    
                    setEnviandoAlerta(true);
                    try {
                      if (onEnviarAlerta) {
                        await onEnviarAlerta(emailProximo, titulo);
                        toast({
                          title: "Alerta Enviado! ✅",
                          description: `Email enviado para ${emailProximo}`,
                        });
                      }
                    } catch (error: any) {
                      toast({
                        title: "Erro Ao Enviar",
                        description: error.message,
                        variant: "destructive",
                      });
                    } finally {
                      setEnviandoAlerta(false);
                    }
                  }}
                  className="shrink-0"
                  title="Enviar alerta para este email"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">💬 Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Adicione observações ou comentários..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => onAprovar(comentario, emailProximo)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprovar
              </Button>
              <Button
                onClick={() => onReprovar(comentario)}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reprovar
              </Button>
              <Button
                onClick={() => {
                  if (comentario) {
                    setComentario('');
                  }
                }}
                variant="outline"
                className="flex-1"
              >
                💬 Comentar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
