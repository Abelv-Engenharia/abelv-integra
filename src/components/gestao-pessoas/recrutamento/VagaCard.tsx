import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, User, Eye } from "lucide-react";
import { Vaga, PrioridadeVaga, StatusVaga } from "@/types/vaga";
import { StatusBadge } from "./StatusBadge";

interface VagaCardProps {
  vaga: Vaga;
  onViewDetails: (vagaId: string) => void;
  showGestor?: boolean;
}

export function VagaCard({ vaga, onViewDetails, showGestor = true }: VagaCardProps) {
  const getPrioridadeColor = (prioridade: PrioridadeVaga) => {
    switch (prioridade) {
      case PrioridadeVaga.ALTA:
        return "bg-blue-600 hover:bg-blue-700";
      case PrioridadeVaga.MEDIA:
        return "bg-blue-500 hover:bg-blue-600";
      case PrioridadeVaga.BAIXA:
        return "bg-blue-400 hover:bg-blue-500";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-card-foreground">
              {vaga.cargo}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {vaga.numeroVaga}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge 
              variant="secondary" 
              className={`${getPrioridadeColor(vaga.prioridade)} text-white`}
            >
              {vaga.prioridade.charAt(0).toUpperCase() + vaga.prioridade.slice(1)}
            </Badge>
            <StatusBadge status={vaga.status} type="vaga" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{vaga.localTrabalho}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Mobilização: {formatDate(vaga.prazoMobilizacao)}</span>
        </div>
        
        {showGestor && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Gestor: {vaga.gestor}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Candidatos: </span>
            <span className="font-medium text-foreground">
              {vaga.candidatos.length}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(vaga.id)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}