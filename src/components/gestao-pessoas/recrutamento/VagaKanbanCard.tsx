import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, AlertCircle } from "lucide-react";
import { Vaga, PrioridadeVaga } from "@/types/vaga";
import { IndicadorPrazoVaga } from "./IndicadorPrazoVaga";
import { format } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface VagaKanbanCardProps {
  vaga: Vaga;
  onViewDetails: (vaga: Vaga) => void;
}

export function VagaKanbanCard({ vaga, onViewDetails }: VagaKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: vaga.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPrioridadeColor = (prioridade: PrioridadeVaga) => {
    switch (prioridade) {
      case PrioridadeVaga.ALTA:
        return "bg-red-100 text-red-800 border-red-300";
      case PrioridadeVaga.MEDIA:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case PrioridadeVaga.BAIXA:
        return "bg-green-100 text-green-800 border-green-300";
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="mb-3 cursor-move hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-semibold line-clamp-2">
              {vaga.cargo}
            </CardTitle>
            {vaga.prioridade === PrioridadeVaga.ALTA && (
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              #{vaga.numeroVaga}
            </Badge>
            <Badge className={getPrioridadeColor(vaga.prioridade)}>
              {vaga.prioridade}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">{vaga.localTrabalho}</p>
            <p className="mt-1">Criada: {format(new Date(vaga.dataCriacao), "dd/MM/yyyy")}</p>
          </div>

          {vaga.diasRestantes !== undefined && vaga.atrasado !== undefined && (
            <IndicadorPrazoVaga 
              diasRestantes={vaga.diasRestantes} 
              atrasado={vaga.atrasado}
            />
          )}

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(vaga);
            }}
          >
            <Eye className="h-3 w-3 mr-2" />
            Ver Detalhes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
