import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, Lock } from "lucide-react";
import { useState } from "react";

interface BlocoAprovacaoProps {
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
  status: 'pendente' | 'aguardando' | 'aprovado' | 'reprovado' | 'bloqueado';
  responsavel?: string;
  podeAprovar?: boolean;
  onAprovar?: (comentario: string) => void;
  onReprovar?: (comentario: string) => void;
  readonly?: boolean;
}

const statusConfig = {
  pendente: {
    badge: 'Pendente',
    color: 'bg-gray-500',
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
  bloqueado: {
    badge: 'Bloqueado',
    color: 'bg-gray-400',
    icon: Lock,
  },
};

export function BlocoAprovacao({
  titulo,
  descricao,
  children,
  status,
  responsavel,
  podeAprovar = false,
  onAprovar,
  onReprovar,
  readonly = false,
}: BlocoAprovacaoProps) {
  const [comentario, setComentario] = useState('');
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={`${readonly ? 'opacity-75' : ''}`}>
      <CardHeader className={`${config.color} text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <StatusIcon className="h-5 w-5" />
              {titulo}
            </CardTitle>
            {descricao && <CardDescription className="text-white/90">{descricao}</CardDescription>}
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {config.badge}
          </Badge>
        </div>
        {responsavel && (
          <p className="text-sm text-white/80 mt-2">
            Responsável: {responsavel}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <div className={readonly ? 'pointer-events-none' : ''}>
          {children}
        </div>

        {podeAprovar && status === 'aguardando' && onAprovar && onReprovar && (
          <div className="mt-6 space-y-4 pt-6 border-t">
            <div>
              <Label htmlFor="comentario">Comentário</Label>
              <Textarea
                id="comentario"
                placeholder="Adicione um comentário (opcional)"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => onAprovar(comentario)}
                className="flex-1 bg-green-600 hover:bg-green-700"
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
