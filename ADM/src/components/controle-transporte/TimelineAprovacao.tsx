import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, FileCheck } from 'lucide-react';

interface EtapaTimeline {
  etapa: string;
  status: 'concluido' | 'pendente' | 'reprovado';
  usuario?: string;
  data?: string;
  comentario?: string;
}

interface TimelineAprovacaoProps {
  etapas: EtapaTimeline[];
}

export default function TimelineAprovacao({ etapas }: TimelineAprovacaoProps) {
  const getIconByStatus = (status: string) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pendente':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'reprovado':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileCheck className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluido':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'reprovado':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Reprovado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {etapas.map((etapa, index) => (
        <Card key={index} className={etapa.status === 'concluido' ? 'border-green-200' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="mt-1">{getIconByStatus(etapa.status)}</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{etapa.etapa}</h4>
                  {getStatusBadge(etapa.status)}
                </div>
                {etapa.usuario && (
                  <p className="text-sm text-muted-foreground">
                    Por: {etapa.usuario}
                  </p>
                )}
                {etapa.data && (
                  <p className="text-sm text-muted-foreground">
                    Em: {etapa.data}
                  </p>
                )}
                {etapa.comentario && (
                  <p className="text-sm bg-muted/30 p-2 rounded">
                    {etapa.comentario}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
