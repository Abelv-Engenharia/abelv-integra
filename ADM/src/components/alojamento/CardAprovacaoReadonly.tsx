import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CardAprovacaoReadonlyProps {
  titulo: string;
  icone: React.ReactNode;
  cor: string;
  responsavel: string;
  status: 'pendente' | 'aguardando' | 'aprovado' | 'reprovado';
  emailAlerta: string;
  onEmailChange: (email: string) => void;
  children: React.ReactNode;
  onAprovar?: (comentario: string) => void;
  onReprovar?: (comentario: string) => void;
  onComentar?: (comentario: string) => void;
  aprovadoPor?: string;
  aprovadoEm?: string;
  observacao?: string;
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

export function CardAprovacaoReadonly({
  titulo,
  icone,
  cor,
  responsavel,
  status,
  emailAlerta,
  onEmailChange,
  children,
  onAprovar,
  onReprovar,
  onComentar,
  aprovadoPor,
  aprovadoEm,
  observacao,
  readonly = false,
}: CardAprovacaoReadonlyProps) {
  const [comentario, setComentario] = useState('');
  
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const podeInteragir = status === 'aguardando' && !readonly && (onAprovar || onReprovar);

  return (
    <Card className={`${cor} ${readonly ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {icone}
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
        {/* Dados para validação (readonly) */}
        <div className="p-4 bg-background/50 rounded-lg border">
          <h3 className="font-semibold mb-3">📊 Dados Para Validação</h3>
          <div className="space-y-2">
            {children}
          </div>
        </div>

        <Separator />

        {/* Email para alerta */}
        <div>
          <Label htmlFor={`email-${titulo}`}>📧 Email Para Alerta</Label>
          <Input
            id={`email-${titulo}`}
            type="email"
            placeholder="email@exemplo.com"
            value={emailAlerta}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={readonly || status !== 'aguardando'}
          />
        </div>

        {/* Seção de aprovação */}
        {podeInteragir && (
          <>
            <Separator />
            <div className="space-y-4">
              <div>
                <Label htmlFor={`obs-${titulo}`}>💬 Observações (Opcional)</Label>
                <Textarea
                  id={`obs-${titulo}`}
                  placeholder="Adicione observações ou comentários..."
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                {onAprovar && (
                  <Button
                    onClick={() => onAprovar(comentario)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprovar
                  </Button>
                )}
                {onReprovar && (
                  <Button
                    onClick={() => onReprovar(comentario)}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reprovar
                  </Button>
                )}
                {onComentar && (
                  <Button
                    onClick={() => onComentar(comentario)}
                    variant="outline"
                    className="flex-1"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Comentar
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Status da aprovação */}
        {(status === 'aprovado' || status === 'reprovado') && aprovadoPor && aprovadoEm && (
          <div className={`p-3 rounded-lg ${status === 'aprovado' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className="text-sm font-medium">
              {status === 'aprovado' ? '✅' : '❌'} {status === 'aprovado' ? 'Aprovado' : 'Reprovado'} por {aprovadoPor}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(aprovadoEm).toLocaleString('pt-BR')}
            </p>
            {observacao && (
              <p className="text-sm mt-2">
                <strong>Observação:</strong> {observacao}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
