import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vaga, EtapaProcesso } from "@/types/gestao-pessoas/vaga";
import { VagaKanbanCard } from "./VagaKanbanCard";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface KanbanColumnProps {
  etapa: EtapaProcesso;
  titulo: string;
  vagas: Vaga[];
  onViewDetails: (vaga: Vaga) => void;
}

export function KanbanColumn({ etapa, titulo, vagas, onViewDetails }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: etapa,
  });

  const vagasIds = vagas.map(v => v.id);

  return (
    <div className="flex-shrink-0 w-80">
      <Card className="h-full">
        <CardHeader className="pb-3 bg-muted/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">{titulo}</CardTitle>
            <Badge variant="secondary">{vagas.length}</Badge>
          </div>
        </CardHeader>
        <CardContent 
          ref={setNodeRef}
          className="pt-4 min-h-[500px] max-h-[calc(100vh-300px)] overflow-y-auto"
        >
          <SortableContext items={vagasIds} strategy={verticalListSortingStrategy}>
            {vagas.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                Nenhuma vaga nesta etapa
              </div>
            ) : (
              vagas.map((vaga) => (
                <VagaKanbanCard
                  key={vaga.id}
                  vaga={vaga}
                  onViewDetails={onViewDetails}
                />
              ))
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
