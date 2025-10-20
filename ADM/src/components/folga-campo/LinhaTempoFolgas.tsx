import React from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle, Plane, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LinhaTempoFolgasProps {
  colaborador: any;
  folgas?: any[];
}

const mockHistoricoFolgas = [
  {
    id: 1,
    periodo: "15/01/2025 - 17/01/2025",
    status: "Em Andamento",
    eventos: [
      { data: "01/12/2024", evento: "D-45 enviado", tipo: "alerta", concluido: true },
      { data: "16/12/2024", evento: "Supervisor aprovado", tipo: "aprovacao", concluido: true },
      { data: "20/12/2024", evento: "Engenheiro aprovado", tipo: "aprovacao", concluido: true },
      { data: "21/12/2024", evento: "D-30 enviado", tipo: "alerta", concluido: true },
      { data: "28/12/2024", evento: "Formulário assinado", tipo: "documento", concluido: true },
      { data: "05/01/2025", evento: "Compra passagem", tipo: "passagem", concluido: false },
      { data: "10/01/2025", evento: "Envio voucher", tipo: "documento", concluido: false }
    ]
  },
  {
    id: 2,
    periodo: "20/10/2024 - 22/10/2024",
    status: "Concluída",
    eventos: [
      { data: "05/09/2024", evento: "D-45 enviado", tipo: "alerta", concluido: true },
      { data: "15/09/2024", evento: "Supervisor aprovado", tipo: "aprovacao", concluido: true },
      { data: "18/09/2024", evento: "Engenheiro aprovado", tipo: "aprovacao", concluido: true },
      { data: "20/09/2024", evento: "D-30 enviado", tipo: "alerta", concluido: true },
      { data: "25/09/2024", evento: "Formulário assinado", tipo: "documento", concluido: true },
      { data: "01/10/2024", evento: "Passagem comprada", tipo: "passagem", concluido: true },
      { data: "15/10/2024", evento: "Voucher enviado", tipo: "documento", concluido: true },
      { data: "22/10/2024", evento: "Folga concluída", tipo: "conclusao", concluido: true }
    ]
  }
];

const LinhaTempoFolgas: React.FC<LinhaTempoFolgasProps> = ({
  colaborador,
  folgas = mockHistoricoFolgas
}) => {
  
  const getIconeEvento = (tipo: string) => {
    switch (tipo) {
      case 'alerta': return <Clock className="h-4 w-4" />;
      case 'aprovacao': return <CheckCircle className="h-4 w-4" />;
      case 'documento': return <FileText className="h-4 w-4" />;
      case 'passagem': return <Plane className="h-4 w-4" />;
      case 'conclusao': return <CheckCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getCorEvento = (tipo: string, concluido: boolean) => {
    if (!concluido) return 'text-muted-foreground border-muted-foreground';
    
    switch (tipo) {
      case 'alerta': return 'text-yellow-600 border-yellow-600 bg-yellow-50';
      case 'aprovacao': return 'text-green-600 border-green-600 bg-green-50';
      case 'documento': return 'text-blue-600 border-blue-600 bg-blue-50';
      case 'passagem': return 'text-purple-600 border-purple-600 bg-purple-50';
      case 'conclusao': return 'text-green-700 border-green-700 bg-green-100';
      default: return 'text-gray-600 border-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Linha do Tempo de Folgas - {colaborador?.nome}
          </CardTitle>
          <CardDescription>
            Histórico completo de folgas passadas e futuras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {folgas.map((folga, index) => (
              <div key={folga.id} className="relative">
                {/* Header da Folga */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{folga.periodo}</h3>
                    <Badge variant={folga.status === "Concluída" ? "default" : "secondary"}>
                      {folga.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>

                {/* Timeline dos Eventos */}
                <div className="relative pl-6">
                  {/* Linha vertical */}
                  {index < folgas.length - 1 && (
                    <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-border" />
                  )}
                  
                  <div className="space-y-4">
                    {folga.eventos.map((evento, eventIndex) => (
                      <div key={eventIndex} className="relative flex items-start gap-4">
                        {/* Ícone do evento */}
                        <div className={`
                          relative flex items-center justify-center w-8 h-8 rounded-full border-2 
                          ${getCorEvento(evento.tipo, evento.concluido)}
                          ${!evento.concluido ? 'border-dashed' : ''}
                        `}>
                          {getIconeEvento(evento.tipo)}
                        </div>

                        {/* Detalhes do evento */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              evento.concluido ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {evento.evento}
                            </p>
                            <time className={`text-xs ${
                              evento.concluido ? 'text-muted-foreground' : 'text-muted-foreground/70'
                            }`}>
                              {new Date(evento.data).toLocaleDateString()}
                            </time>
                          </div>
                          
                          {!evento.concluido && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Pendente
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Separador entre folgas */}
                {index < folgas.length - 1 && (
                  <div className="mt-6 pt-6 border-t border-dashed" />
                )}
              </div>
            ))}
          </div>

          {/* Resumo de Saldo */}
          <div className="mt-8 pt-6 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">2</p>
                <p className="text-sm text-muted-foreground">Concluídas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">1</p>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">45</p>
                <p className="text-sm text-muted-foreground">Política (dias)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinhaTempoFolgas;